#!/usr/bin/env python3
"""Source-backed repair for approved A11yJobs description-quality fields.

Dry-run is the default. ``--apply`` writes only validated, changed rows inside
one optimistic-locking transaction and verifies exact row accounting before
commit. A before/after artifact is always written to ``scripts/output``.
"""

import argparse
import json
import os
import re
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple

import requests

from run_a11yjobs_daily import (
    HEADERS,
    OUTPUT_DIR,
    _plain_markdown,
    description_is_clean,
    is_placeholder_section,
    load_database_url,
    normalize_text,
    parse_job_detail,
    psql_query,
    sql_literal,
    validate_salary,
    write_json,
)


REPAIR_FIELDS = [
    "company_website",
    "work_arrangement",
    "country",
    "city",
    "specific_location",
    "location",
    "description",
    "key_responsibilities",
    "requirements",
    "nice_to_have",
    "salary_min",
    "salary_max",
    "currency",
    "salary_type",
    "salary_range",
    "years_experience",
    "education_level",
    "required_certifications",
    "preferred_certifications",
    "required_skills",
    "preferred_skills",
    "wcag_level",
    "accessibility_focus",
    "assistive_tech_experience",
    "benefits",
    "professional_development",
    "health_insurance",
    "retirement",
]

BOOLEAN_FIELDS = {"professional_development", "health_insurance", "retirement"}
JSON_ARRAY_FIELDS = {
    "required_certifications",
    "preferred_certifications",
    "required_skills",
    "preferred_skills",
    "accessibility_focus",
    "assistive_tech_experience",
    "benefits",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--apply", action="store_true", help="Apply the validated repair transaction")
    parser.add_argument("--days", type=int, help="Only inspect jobs created within this many days")
    parser.add_argument("--limit", type=int, help="Limit rows for a focused rehearsal")
    parser.add_argument("--workers", type=int, default=6, help="Concurrent source fetches (default: 6)")
    return parser.parse_args()


def fetch_rows(db_url: str, days: Optional[int], limit: Optional[int]) -> List[Dict[str, Any]]:
    pairs = ["'id', id", "'title', title", "'company', company", "'source_url', source_url", "'updated_at', updated_at"]
    pairs.extend(f"'{field}', {field}" for field in REPAIR_FIELDS)
    where = "status = 'approved' AND job_source = 'a11yjobs' AND source_url IS NOT NULL"
    if days is not None:
        where += f" AND created_at >= now() - interval {sql_literal(str(days) + ' days')}"
    limit_sql = f" LIMIT {int(limit)}" if limit else ""
    sql = f"SELECT json_build_object({', '.join(pairs)})::text FROM jobs WHERE {where} ORDER BY created_at DESC, id{limit_sql};"
    code, out, err = psql_query(db_url, sql)
    if code != 0:
        raise RuntimeError(err or "Failed to read repair rows")
    return [json.loads(line) for line in out.splitlines() if line.strip()]


def target_values(parsed: Dict[str, Any]) -> Dict[str, Any]:
    target = {field: parsed.get(field) for field in REPAIR_FIELDS}
    for field in BOOLEAN_FIELDS:
        target[field] = bool(target.get(field))
    return target


def validate_target(current: Dict[str, Any], parsed: Dict[str, Any], target: Dict[str, Any]) -> List[str]:
    errors: List[str] = []
    if normalize_text(parsed.get("title") or "") != normalize_text(current.get("title") or ""):
        errors.append("source title no longer matches row")
    if len(_plain_markdown(target.get("description") or "")) < 100:
        errors.append("description shorter than 100 characters")
    if not target.get("key_responsibilities") or not target.get("requirements"):
        errors.append("DB-required sibling section missing")
    if target.get("work_arrangement") not in {"remote", "hybrid", "onsite"}:
        errors.append("invalid work arrangement")
    if not target.get("country") or not target.get("specific_location"):
        errors.append("structured location is incomplete")
    if target.get("description") and not description_is_clean(target["description"]):
        errors.append("description contains page chrome or junk text")

    for field in ["key_responsibilities", "requirements"]:
        value = target.get(field) or ""
        if is_placeholder_section(value):
            continue
        if re.match(r"^(?:[,;:]|to apply\b|and\s+|or\s+)", _plain_markdown(value), re.I):
            errors.append(f"{field} starts mid-sentence")

    salary_error = validate_salary(target.get("salary_min"), target.get("salary_max"), target.get("salary_type"))
    if salary_error:
        errors.append(salary_error)

    for field in JSON_ARRAY_FIELDS:
        raw = target.get(field)
        if not raw:
            continue
        try:
            value = json.loads(raw) if isinstance(raw, str) else raw
        except (TypeError, json.JSONDecodeError):
            errors.append(f"{field} is not valid JSON")
            continue
        if not isinstance(value, list) or any(not isinstance(item, str) for item in value):
            errors.append(f"{field} is not a string array")
        if field in {"required_skills", "preferred_skills"} and any(len(item) > 80 for item in value):
            errors.append(f"{field} contains sentence-sized item")
    return errors


def inspect_row(row: Dict[str, Any]) -> Dict[str, Any]:
    session = requests.Session()
    session.headers.update(HEADERS)
    parsed = parse_job_detail(session, row["source_url"])
    if not parsed:
        return {"id": row["id"], "source_url": row["source_url"], "status": "unrecoverable"}

    target = target_values(parsed)
    errors = validate_target(row, parsed, target)
    if errors:
        return {
            "id": row["id"],
            "source_url": row["source_url"],
            "status": "validation_failed",
            "errors": errors,
        }

    changes: Dict[str, Dict[str, Any]] = {}
    for field in REPAIR_FIELDS:
        before = row.get(field)
        after = target.get(field)
        if before != after:
            changes[field] = {"before": before, "after": after}

    return {
        "id": row["id"],
        "title": row["title"],
        "company": row["company"],
        "source_url": row["source_url"],
        "old_updated_at": row["updated_at"],
        "status": "changed" if changes else "unchanged",
        "changes": changes,
        "target": target,
    }


def total_job_count(db_url: str) -> int:
    code, out, err = psql_query(db_url, "SELECT COUNT(*) FROM jobs;")
    if code != 0:
        raise RuntimeError(err or "Failed to count jobs")
    return int(out)


def run_transaction(db_url: str, changed: List[Dict[str, Any]], repair_id: str) -> None:
    marker = f"quality_repair_id={repair_id}"
    statements = ["BEGIN;", "SET LOCAL statement_timeout = '180s';"]

    for item in changed:
        assignments = [f"{field} = {sql_literal(item['target'].get(field))}" for field in REPAIR_FIELDS]
        assignments.extend(
            [
                "updated_at = NOW()",
                (
                    "additional_notes = CASE "
                    f"WHEN COALESCE(additional_notes, '') LIKE {sql_literal('%' + marker + '%')} THEN additional_notes "
                    f"WHEN COALESCE(additional_notes, '') = '' THEN {sql_literal(marker)} "
                    f"ELSE additional_notes || '; ' || {sql_literal(marker)} END"
                ),
            ]
        )
        statements.append(
            f"UPDATE jobs SET {', '.join(assignments)} "
            f"WHERE id = {sql_literal(item['id'])}::uuid "
            f"AND updated_at = {sql_literal(item['old_updated_at'])}::timestamp;"
        )

    statements.append(
        "DO $quality$ DECLARE repaired integer; BEGIN "
        f"SELECT COUNT(*) INTO repaired FROM jobs WHERE additional_notes LIKE {sql_literal('%' + marker + '%')}; "
        f"IF repaired <> {len(changed)} THEN RAISE EXCEPTION 'repair accounting mismatch: expected {len(changed)}, got %', repaired; END IF; "
        "END $quality$;"
    )
    statements.append("COMMIT;")
    sql = "\n".join(statements)

    result = subprocess.run(
        ["psql", "-d", db_url, "-v", "ON_ERROR_STOP=1", "-f", "-"],
        input=sql,
        capture_output=True,
        text=True,
        env={**os.environ, "PGCONNECT_TIMEOUT": "15"},
    )
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or "Repair transaction failed")


def post_verify(db_url: str, repair_id: str, expected: int, total_before: int) -> Dict[str, Any]:
    marker = f"quality_repair_id={repair_id}"
    total_after = total_job_count(db_url)
    sql = (
        "SELECT json_build_object("
        "'repaired', COUNT(*), "
        "'missing_required', COUNT(*) FILTER (WHERE description IS NULL OR key_responsibilities IS NULL OR requirements IS NULL), "
        "'missing_location', COUNT(*) FILTER (WHERE country IS NULL OR specific_location IS NULL), "
        "'invalid_work_arrangement', COUNT(*) FILTER (WHERE work_arrangement NOT IN ('remote', 'hybrid', 'onsite')), "
        "'short_description', COUNT(*) FILTER (WHERE length(trim(description)) < 100), "
        "'suspicious_annual_salary', COUNT(*) FILTER (WHERE salary_type = 'annual' AND salary_max < 10000), "
        "'sentence_sized_skills', COUNT(*) FILTER (WHERE required_skills IS NOT NULL AND EXISTS (SELECT 1 FROM jsonb_array_elements_text(required_skills::jsonb) skill WHERE length(skill) > 80))"
        f")::text FROM jobs WHERE additional_notes LIKE {sql_literal('%' + marker + '%')};"
    )
    code, out, err = psql_query(db_url, sql)
    if code != 0:
        raise RuntimeError(err or "Post-repair verification failed")
    quality = json.loads(out)
    quality["total_before"] = total_before
    quality["total_after"] = total_after
    quality["row_count_unchanged"] = total_before == total_after
    quality["expected_repaired"] = expected
    quality["passed"] = (
        quality["repaired"] == expected
        and quality["missing_required"] == 0
        and quality["missing_location"] == 0
        and quality["invalid_work_arrangement"] == 0
        and quality["short_description"] == 0
        and quality["suspicious_annual_salary"] == 0
        and quality["sentence_sized_skills"] == 0
        and quality["row_count_unchanged"]
    )
    return quality


def main() -> int:
    args = parse_args()
    db_url = load_database_url()
    repair_id = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    artifact_path = os.path.join(OUTPUT_DIR, f"a11yjobs_quality_repair_{repair_id}.json")

    rows = fetch_rows(db_url, args.days, args.limit)
    total_before = total_job_count(db_url)
    print(f"selected_rows: {len(rows)}")
    print(f"database_total_before: {total_before}")

    results: List[Dict[str, Any]] = []
    completed = 0
    with ThreadPoolExecutor(max_workers=max(1, args.workers)) as executor:
        futures = [executor.submit(inspect_row, row) for row in rows]
        for future in as_completed(futures):
            results.append(future.result())
            completed += 1
            if completed % 25 == 0 or completed == len(rows):
                print(f"inspected: {completed}/{len(rows)}")

    by_id = {row["id"]: index for index, row in enumerate(rows)}
    results.sort(key=lambda item: by_id[item["id"]])
    changed = [item for item in results if item["status"] == "changed"]
    unchanged = [item for item in results if item["status"] == "unchanged"]
    failed = [item for item in results if item["status"] not in {"changed", "unchanged"}]

    artifact: Dict[str, Any] = {
        "repair_id": repair_id,
        "mode": "apply" if args.apply else "dry-run",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "selected_rows": len(rows),
        "validated_changed": len(changed),
        "validated_unchanged": len(unchanged),
        "unrecoverable_or_failed": len(failed),
        "database_total_before": total_before,
        "results": results,
    }
    write_json(artifact_path, artifact)

    print(f"validated_changed: {len(changed)}")
    print(f"validated_unchanged: {len(unchanged)}")
    print(f"unrecoverable_or_failed: {len(failed)}")
    print(f"artifact: {artifact_path}")

    if not args.apply:
        print("apply_performed: no (dry-run)")
        return 0
    if not changed:
        print("apply_performed: no (nothing changed)")
        return 0

    run_transaction(db_url, changed, repair_id)
    verification = post_verify(db_url, repair_id, len(changed), total_before)
    artifact["verification"] = verification
    artifact["completed_at"] = datetime.now(timezone.utc).isoformat()
    write_json(artifact_path, artifact)

    print(f"applied_updates: {len(changed)}")
    print(f"database_total_after: {verification['total_after']}")
    print(f"post_repair_tests: {'PASS' if verification['passed'] else 'FAIL'}")
    if not verification["passed"]:
        return 1
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except KeyboardInterrupt:
        raise SystemExit(130)
    except Exception as exc:
        print(f"repair_failed: {exc}", file=sys.stderr)
        raise SystemExit(1)

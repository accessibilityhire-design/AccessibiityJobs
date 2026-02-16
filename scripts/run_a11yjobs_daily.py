#!/usr/bin/env python3
"""
Fetch new jobs from a11yjobs.com, validate strictly, and insert into DB.
Outputs candidate/insert-ready datasets and a detailed insert report.
"""

import csv
import json
import os
import re
import sys
import time
from datetime import datetime, date
from typing import Any, Dict, List, Optional, Tuple
from urllib.parse import urljoin, urlparse

import psycopg2
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

BASE_URL = "https://www.a11yjobs.com"
LIST_URL = f"{BASE_URL}/"

OUTPUT_DIR = "/Users/khushwantparihar/AccessibiityJobs/scripts/output"
CANDIDATES_JSON = os.path.join(OUTPUT_DIR, "a11yjobs_jobs_candidates_with_nan.json")
CANDIDATES_CSV = os.path.join(OUTPUT_DIR, "a11yjobs_jobs_candidates_table.csv")
INSERT_READY_JSON = os.path.join(OUTPUT_DIR, "a11yjobs_jobs_insert_ready.json")
INSERT_REPORT_JSON = os.path.join(OUTPUT_DIR, "a11yjobs_jobs_insert_report.json")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

EMPLOYMENT_TYPES = {"full-time", "part-time", "contract", "freelance", "internship"}
WORK_ARRANGEMENTS = {"remote", "hybrid", "onsite"}
JOB_LEVELS = {"entry", "mid", "senior", "lead", "principal", "director", "vp", "c-level"}
EXPERIENCE_LEVELS = {"0-1", "1-3", "3-5", "5-7", "7-10", "10+"}
EDUCATION_LEVELS = {"none-required", "high-school", "associate", "bachelor", "master", "phd"}
WCAG_LEVELS = {"wcag-2.0", "wcag-2.1", "wcag-2.2", "wcag-3.0"}
CURRENCIES = {"USD", "EUR", "GBP", "CAD", "AUD", "INR", "JPY", "CNY"}
SALARY_TYPES = {"annual", "hourly", "daily", "project"}
TRAVEL_REQUIREMENTS = {"none", "occasional", "regular", "frequent"}

REQUIRED_FIELDS = [
    "title",
    "company",
    "employment_type",
    "work_arrangement",
    "description",
    "key_responsibilities",
    "requirements",
    "contact_email",
]

JUNK_TEXT_PATTERNS = [
    r"page has loaded",
    r"\[object Object\]",
    r"skip to main content",
    r"navigation",
    r"footer",
    r"back to top",
]


def load_database_url() -> str:
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_dir = os.path.dirname(script_dir)
    env_local = os.path.join(project_dir, ".env.local")
    env_default = os.path.join(project_dir, ".env")

    if os.path.exists(env_local):
        load_dotenv(env_local, override=True)
    elif os.path.exists(env_default):
        load_dotenv(env_default, override=True)

    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("❌ DATABASE_URL not found in .env.local or .env")
        sys.exit(1)
    return db_url


def mask_db_url(db_url: str) -> str:
    parsed = urlparse(db_url)
    user = "****" if parsed.username else ""
    password = "****" if parsed.password else ""
    netloc = parsed.hostname or ""
    if parsed.port:
        netloc = f"{netloc}:{parsed.port}"
    if user or password:
        netloc = f"{user}:{password}@{netloc}"
    return parsed._replace(netloc=netloc).geturl()


def connect_db(db_url: str):
    return psycopg2.connect(db_url)


def fetch_cutoff_date(cursor) -> date:
    cursor.execute("SELECT MAX(created_at)::date FROM jobs;")
    result = cursor.fetchone()
    if result and result[0]:
        return result[0]
    return date(1970, 1, 1)


def fetch_page(session: requests.Session, url: str, retries: int = 3) -> Optional[BeautifulSoup]:
    for attempt in range(retries):
        try:
            response = session.get(url, timeout=15)
            response.raise_for_status()
            return BeautifulSoup(response.content, "html.parser")
        except Exception:
            if attempt < retries - 1:
                time.sleep(2 ** attempt)
            else:
                return None
    return None


def normalize_text(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", value.lower()).strip()


def normalize_employment_type(text: str) -> str:
    lower = text.lower()
    if "part" in lower:
        return "part-time"
    if "contract" in lower:
        return "contract"
    if "freelance" in lower:
        return "freelance"
    if "intern" in lower:
        return "internship"
    return "full-time"


def normalize_work_arrangement(text: str) -> str:
    lower = text.lower()
    if "remote" in lower:
        return "remote"
    if "hybrid" in lower or "telecommute" in lower:
        return "hybrid"
    return "onsite"


def determine_job_level(title: str, description: str) -> Optional[str]:
    title_lower = title.lower()
    desc_lower = description.lower() if description else ""

    if any(kw in title_lower for kw in ["c-level", "chief", "vp", "vice president"]):
        return "c-level"
    if any(kw in title_lower for kw in ["director"]):
        return "director"
    if any(kw in title_lower for kw in ["principal"]):
        return "principal"
    if any(kw in title_lower for kw in ["lead"]):
        return "lead"
    if any(kw in title_lower for kw in ["senior", "sr.", "staff"]):
        return "senior"
    if any(kw in title_lower for kw in ["mid", "intermediate"]):
        return "mid"
    if any(kw in title_lower for kw in ["junior", "jr.", "entry", "associate", "intern"]):
        return "entry"

    if "senior" in desc_lower or "lead" in desc_lower:
        return "senior"
    if "junior" in desc_lower or "entry" in desc_lower:
        return "entry"
    return None


def parse_date_text(text: str) -> Optional[date]:
    if not text:
        return None
    text = text.strip()

    patterns = [
        "%Y-%m-%d",
        "%b %d, %Y",
        "%B %d, %Y",
        "%d %b %Y",
        "%d %B %Y",
    ]
    for fmt in patterns:
        try:
            return datetime.strptime(text, fmt).date()
        except ValueError:
            continue

    match = re.search(r"(\d{4}-\d{2}-\d{2})", text)
    if match:
        try:
            return datetime.strptime(match.group(1), "%Y-%m-%d").date()
        except ValueError:
            return None

    return None


def extract_job_links(soup: BeautifulSoup) -> List[str]:
    links: List[str] = []
    for a in soup.find_all("a", href=True):
        href = a.get("href", "")
        if "/jobs/" in href:
            full_url = urljoin(BASE_URL, href)
            if full_url.startswith(BASE_URL):
                links.append(full_url)
    return sorted(set(links))


def extract_label_value(soup: BeautifulSoup, label_regex: str) -> Optional[str]:
    label = soup.find(string=re.compile(label_regex, re.I))
    if not label:
        return None
    parent = label.parent
    if not parent:
        return None
    # Try sibling next element
    next_el = parent.find_next_sibling()
    if next_el:
        text = next_el.get_text(" ", strip=True)
        if text:
            return text
    # Try within same parent
    text = parent.get_text(" ", strip=True)
    return text if text else None


def clean_text(text: str) -> str:
    if not text:
        return ""
    text = re.sub(r"\s+", " ", text).strip()
    return text


def split_description(description: str, title: str, company: str) -> Tuple[str, str, str]:
    description = clean_text(description)
    if not description:
        base = f"{title} at {company}."
        return (
            base,
            "Key responsibilities include ensuring digital accessibility standards.",
            "Experience with accessibility required.",
        )

    desc_length = len(description)
    overview_end = min(500, desc_length // 3)
    responsibilities_end = min(1000, 2 * desc_length // 3)

    job_description = description[:overview_end] if desc_length > 0 else ""
    key_responsibilities = description[overview_end:responsibilities_end] if desc_length > 0 else ""
    requirements = description[responsibilities_end:] if desc_length > 0 else ""

    if len(job_description) < 50:
        job_description = f"{title} at {company}. {job_description}".strip()
    if len(key_responsibilities) < 50:
        key_responsibilities = f"Key responsibilities include: {key_responsibilities}".strip()
    if len(requirements) < 50:
        requirements = f"Required qualifications: {requirements}".strip()

    return job_description.strip(), key_responsibilities.strip(), requirements.strip()


def parse_salary(salary_text: Optional[str]) -> Tuple[Optional[int], Optional[int], Optional[str], Optional[str]]:
    if not salary_text:
        return None, None, None, None

    text = salary_text.replace(",", "").strip()
    currency = None
    if "£" in text:
        currency = "GBP"
    elif "€" in text:
        currency = "EUR"
    elif "₹" in text:
        currency = "INR"
    elif "$" in text:
        currency = "USD"

    salary_type = None
    if "/hr" in text or "per hour" in text or "hour" in text:
        salary_type = "hourly"
    elif "per day" in text or "/day" in text:
        salary_type = "daily"
    elif "per month" in text or "/month" in text:
        salary_type = "annual"
    elif "per year" in text or "/yr" in text or "/year" in text:
        salary_type = "annual"
    elif "project" in text:
        salary_type = "project"

    matches = re.findall(r"\d+(?:\.\d+)?", text)
    numbers = [int(float(m)) for m in matches] if matches else []

    if not numbers:
        return None, None, currency, salary_type

    if len(numbers) == 1:
        return numbers[0], numbers[0], currency, salary_type

    return min(numbers[0], numbers[1]), max(numbers[0], numbers[1]), currency, salary_type


def valid_email(email: str) -> bool:
    return bool(re.match(r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$", email))


def url_is_valid(url: str) -> bool:
    try:
        parsed = urlparse(url)
        return parsed.scheme in {"http", "https"} and bool(parsed.netloc)
    except Exception:
        return False


def description_is_clean(text: str) -> bool:
    if not text:
        return False
    lowered = text.lower()
    for pattern in JUNK_TEXT_PATTERNS:
        if re.search(pattern, lowered):
            return False
    return True


def validate_salary(min_val: Optional[int], max_val: Optional[int], salary_type: Optional[str]) -> Optional[str]:
    if min_val is None and max_val is None:
        return None
    if min_val is None or max_val is None:
        return "Salary min/max incomplete"
    if min_val < 0 or max_val < 0:
        return "Salary cannot be negative"
    if max_val < min_val:
        return "Salary max below min"

    if salary_type == "hourly":
        if max_val > 1000:
            return "Hourly salary exceeds 1000"
    elif salary_type == "daily":
        if max_val > 5000:
            return "Daily salary exceeds 5000"
    else:
        if max_val > 2000000:
            return "Annual salary exceeds 2,000,000"
    return None


def build_candidate_record(raw: Dict[str, Any]) -> Dict[str, Any]:
    record: Dict[str, Any] = {}
    for key, value in raw.items():
        if value is None or value == "":
            record[key] = "NaN"
        else:
            record[key] = value
    return record


def convert_nan_to_insert_ready(record: Dict[str, Any]) -> Dict[str, Any]:
    boolean_fields = {
        "relocation_assistance",
        "equity_offered",
        "professional_development",
        "health_insurance",
        "retirement",
        "visa_sponsorship",
        "security_clearance",
    }
    cleaned: Dict[str, Any] = {}
    for key, value in record.items():
        if value == "NaN":
            if key in boolean_fields:
                cleaned[key] = False
            else:
                cleaned[key] = None
        else:
            cleaned[key] = value
    return cleaned


def check_duplicate(cursor, source_url: str, title: str, company: str) -> Tuple[bool, str]:
    cursor.execute("SELECT id FROM jobs WHERE source_url = %s LIMIT 1;", (source_url,))
    if cursor.fetchone():
        return True, "source_url"

    norm_title = normalize_text(title)
    norm_company = normalize_text(company)
    cursor.execute(
        """
        SELECT id FROM jobs
        WHERE lower(regexp_replace(title, '[^a-z0-9]+', '', 'g')) = %s
          AND lower(regexp_replace(company, '[^a-z0-9]+', '', 'g')) = %s
        LIMIT 1;
        """,
        (norm_title, norm_company),
    )
    if cursor.fetchone():
        return True, "title_company"

    return False, ""


def parse_job_detail(session: requests.Session, url: str) -> Optional[Dict[str, Any]]:
    soup = fetch_page(session, url)
    if not soup:
        return None

    title_elem = soup.find("h1") or soup.find("h2") or soup.find("title")
    title = title_elem.get_text(strip=True) if title_elem else ""
    title = re.sub(r"\s*-\s*a11yjobs\.com.*$", "", title, flags=re.I)

    company = (
        extract_label_value(soup, r"company")
        or extract_label_value(soup, r"organization")
        or ""
    )

    location_text = extract_label_value(soup, r"location") or ""
    work_arrangement = normalize_work_arrangement(location_text)

    employment_raw = extract_label_value(soup, r"job type") or ""
    employment_type = normalize_employment_type(employment_raw) if employment_raw else "full-time"

    date_text = extract_label_value(soup, r"date posted") or extract_label_value(soup, r"posted")
    date_posted = parse_date_text(date_text) if date_text else None

    salary_text = extract_label_value(soup, r"salary")

    apply_url = None
    apply_link = soup.find("a", string=re.compile(r"apply", re.I))
    if apply_link and apply_link.get("href"):
        apply_url = urljoin(BASE_URL, apply_link["href"])

    description = ""
    description_elem = soup.find("div", class_=re.compile(r"description|content|body|job", re.I))
    if description_elem:
        description = description_elem.get_text(" ", strip=True)
    else:
        main = soup.find("main") or soup.find("article")
        if main:
            description = main.get_text(" ", strip=True)
    description = clean_text(description)

    job_description, key_responsibilities, requirements = split_description(description, title, company)

    job_level = determine_job_level(title, description)

    city = None
    country = None
    specific_location = None
    if location_text:
        specific_location = location_text
        parts = re.split(r"[,|]", location_text)
        if parts:
            city = parts[0].strip() if parts[0].strip() else None
        if len(parts) >= 2:
            country = parts[-1].strip() if parts[-1].strip() else None

    contact_email = ""
    email_match = re.findall(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b", description)
    if email_match:
        contact_email = email_match[0]

    salary_min, salary_max, currency, salary_type = parse_salary(salary_text)

    job_data = {
        "title": title[:255] if title else None,
        "company": company[:255] if company else None,
        "company_website": None,
        "company_size": None,
        "industry": None,
        "job_level": job_level,
        "employment_type": employment_type,
        "department": None,
        "work_arrangement": work_arrangement,
        "timezone": None,
        "country": country[:100] if country else None,
        "city": city[:100] if city else None,
        "specific_location": specific_location[:255] if specific_location else None,
        "relocation_assistance": None,
        "salary_min": salary_min,
        "salary_max": salary_max,
        "currency": currency,
        "salary_type": salary_type,
        "equity_offered": None,
        "bonus_structure": None,
        "years_experience": None,
        "education_level": None,
        "required_certifications": None,
        "preferred_certifications": None,
        "required_skills": None,
        "preferred_skills": None,
        "wcag_level": None,
        "accessibility_focus": None,
        "assistive_tech_experience": None,
        "description": job_description,
        "key_responsibilities": key_responsibilities,
        "requirements": requirements,
        "nice_to_have": None,
        "benefits": None,
        "professional_development": None,
        "health_insurance": None,
        "retirement": None,
        "pto_details": None,
        "contact_email": contact_email or None,
        "application_deadline": None,
        "expected_start_date": None,
        "visa_sponsorship": None,
        "security_clearance": None,
        "travel_required": None,
        "additional_notes": None,
        "location": location_text[:255] if location_text else None,
        "type": employment_type,
        "salary_range": salary_text,
        "job_source": "a11yjobs",
        "source_url": url,
        "status": "pending",
        "created_at": datetime.combine(date_posted, datetime.min.time()) if date_posted else None,
        "updated_at": datetime.utcnow(),
        "date_posted": date_posted.isoformat() if date_posted else None,
        "apply_url": apply_url,
    }

    return job_data


def validate_record(record: Dict[str, Any]) -> List[str]:
    errors: List[str] = []

    for field in REQUIRED_FIELDS:
        value = record.get(field)
        if not value:
            errors.append(f"Missing required field: {field}")

    if record.get("title") and len(record["title"]) < 5:
        errors.append("Title too short")
    if record.get("company") and len(record["company"]) < 2:
        errors.append("Company too short")

    if record.get("employment_type") not in EMPLOYMENT_TYPES:
        errors.append("Invalid employment_type")
    if record.get("work_arrangement") not in WORK_ARRANGEMENTS:
        errors.append("Invalid work_arrangement")

    if record.get("job_level") and record.get("job_level") not in JOB_LEVELS:
        errors.append("Invalid job_level")
    if record.get("years_experience") and record.get("years_experience") not in EXPERIENCE_LEVELS:
        errors.append("Invalid years_experience")
    if record.get("education_level") and record.get("education_level") not in EDUCATION_LEVELS:
        errors.append("Invalid education_level")
    if record.get("wcag_level") and record.get("wcag_level") not in WCAG_LEVELS:
        errors.append("Invalid wcag_level")
    if record.get("currency") and record.get("currency") not in CURRENCIES:
        errors.append("Invalid currency")
    if record.get("salary_type") and record.get("salary_type") not in SALARY_TYPES:
        errors.append("Invalid salary_type")
    if record.get("travel_required") and record.get("travel_required") not in TRAVEL_REQUIREMENTS:
        errors.append("Invalid travel_required")

    description = record.get("description") or ""
    key_resp = record.get("key_responsibilities") or ""
    requirements = record.get("requirements") or ""

    if len(re.sub(r"<[^>]*>", "", description).strip()) < 100:
        errors.append("Description too short")
    if len(re.sub(r"<[^>]*>", "", key_resp).strip()) < 50:
        errors.append("Key responsibilities too short")
    if len(re.sub(r"<[^>]*>", "", requirements).strip()) < 50:
        errors.append("Requirements too short")

    if description and not description_is_clean(description):
        errors.append("Description contains junk text")

    if record.get("contact_email") and not valid_email(record["contact_email"]):
        errors.append("Invalid contact_email")

    salary_error = validate_salary(record.get("salary_min"), record.get("salary_max"), record.get("salary_type"))
    if salary_error:
        errors.append(salary_error)

    if record.get("source_url") and not url_is_valid(record["source_url"]):
        errors.append("Invalid source_url")
    if record.get("apply_url") and not url_is_valid(record["apply_url"]):
        errors.append("Invalid apply_url")

    return errors


def write_json(path: str, payload: Any) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=True, indent=2, default=str)


def write_csv(path: str, rows: List[Dict[str, Any]], headers: List[str]) -> None:
    with open(path, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()
        for row in rows:
            writer.writerow({h: row.get(h, "") for h in headers})


def main() -> int:
    db_url = load_database_url()
    print(f"🔐 Using DATABASE_URL: {mask_db_url(db_url)}")

    session = requests.Session()
    session.headers.update(HEADERS)

    conn = None
    cursor = None
    cutoff_date = None

    try:
        conn = connect_db(db_url)
        cursor = conn.cursor()
        cutoff_date = fetch_cutoff_date(cursor)
        print(f"📅 cutoff_date: {cutoff_date.isoformat()}")

        soup = fetch_page(session, LIST_URL)
        if not soup:
            raise RuntimeError("Failed to fetch a11yjobs listing page")

        job_links = extract_job_links(soup)

        # Attempt pagination by following rel=next links (up to 5 pages)
        next_link = soup.find("a", attrs={"rel": "next"})
        page_count = 1
        while next_link and page_count < 5:
            next_url = urljoin(BASE_URL, next_link.get("href", ""))
            next_soup = fetch_page(session, next_url)
            if not next_soup:
                break
            job_links.extend(extract_job_links(next_soup))
            next_link = next_soup.find("a", attrs={"rel": "next"})
            page_count += 1

        job_links = sorted(set(job_links))

        raw_jobs: List[Dict[str, Any]] = []
        for idx, link in enumerate(job_links, 1):
            job = parse_job_detail(session, link)
            if job:
                raw_jobs.append(job)
            time.sleep(1)

        latest_a11yjobs_date = None
        for job in raw_jobs:
            if job.get("date_posted"):
                dp = parse_date_text(job["date_posted"])
                if dp and (latest_a11yjobs_date is None or dp > latest_a11yjobs_date):
                    latest_a11yjobs_date = dp

        if latest_a11yjobs_date:
            print(f"📌 latest_a11yjobs_date: {latest_a11yjobs_date.isoformat()}")
        else:
            print("📌 latest_a11yjobs_date: NaN")

        new_jobs = [
            job for job in raw_jobs
            if job.get("date_posted") and parse_date_text(job["date_posted"]) and parse_date_text(job["date_posted"]) > cutoff_date
        ]

        candidates_with_nan: List[Dict[str, Any]] = []
        insert_ready: List[Dict[str, Any]] = []
        failures: List[Dict[str, Any]] = []
        duplicates: List[Dict[str, Any]] = []

        for job in new_jobs:
            candidate = build_candidate_record(job)
            candidates_with_nan.append(candidate)

            insert_candidate = convert_nan_to_insert_ready(candidate)

            validation_errors = validate_record(insert_candidate)
            if insert_candidate.get("source_url"):
                is_dup, dup_reason = check_duplicate(cursor, insert_candidate["source_url"], insert_candidate.get("title") or "", insert_candidate.get("company") or "")
                if is_dup:
                    duplicates.append({
                        "source_url": insert_candidate.get("source_url"),
                        "title": insert_candidate.get("title"),
                        "company": insert_candidate.get("company"),
                        "reason": dup_reason,
                    })
                    validation_errors.append(f"Duplicate detected ({dup_reason})")

            if validation_errors:
                failures.append({
                    "source_url": insert_candidate.get("source_url"),
                    "title": insert_candidate.get("title"),
                    "company": insert_candidate.get("company"),
                    "errors": validation_errors,
                })
            else:
                insert_ready.append(insert_candidate)

        os.makedirs(OUTPUT_DIR, exist_ok=True)

        write_json(CANDIDATES_JSON, {
            "cutoff_date": cutoff_date.isoformat(),
            "latest_a11yjobs_date": latest_a11yjobs_date.isoformat() if latest_a11yjobs_date else None,
            "jobs": candidates_with_nan,
        })

        csv_headers = [
            "date_posted",
            "title",
            "company",
            "employment_type",
            "work_arrangement",
            "city",
            "country",
            "salary_min",
            "salary_max",
            "currency",
            "salary_type",
            "job_level",
            "education_level",
            "industry",
            "source_url",
        ]
        write_csv(CANDIDATES_CSV, candidates_with_nan, csv_headers)

        write_json(INSERT_READY_JSON, {
            "cutoff_date": cutoff_date.isoformat(),
            "latest_a11yjobs_date": latest_a11yjobs_date.isoformat() if latest_a11yjobs_date else None,
            "jobs": insert_ready,
        })

        insert_report = {
            "cutoff_date": cutoff_date.isoformat(),
            "incoming_new_jobs_count": len(new_jobs),
            "duplicates_found": len(duplicates),
            "insert_candidates_count": len(insert_ready),
            "inserted_count": 0,
            "failed_count": len(failures),
            "failures": failures,
            "duplicates": duplicates,
        }

        inserted_count = 0
        failed_count = len(failures)

        if failures:
            write_json(INSERT_REPORT_JSON, insert_report)
            print("\n❌ Checkpoint failures detected. No insert performed.")
        else:
            try:
                with conn:
                    with conn.cursor() as tx_cursor:
                        for job in insert_ready:
                            columns = [
                                "title",
                                "company",
                                "company_website",
                                "company_size",
                                "industry",
                                "job_level",
                                "employment_type",
                                "department",
                                "work_arrangement",
                                "timezone",
                                "country",
                                "city",
                                "specific_location",
                                "relocation_assistance",
                                "salary_min",
                                "salary_max",
                                "currency",
                                "salary_type",
                                "equity_offered",
                                "bonus_structure",
                                "years_experience",
                                "education_level",
                                "required_certifications",
                                "preferred_certifications",
                                "required_skills",
                                "preferred_skills",
                                "wcag_level",
                                "accessibility_focus",
                                "assistive_tech_experience",
                                "description",
                                "key_responsibilities",
                                "requirements",
                                "nice_to_have",
                                "benefits",
                                "professional_development",
                                "health_insurance",
                                "retirement",
                                "pto_details",
                                "contact_email",
                                "application_deadline",
                                "expected_start_date",
                                "visa_sponsorship",
                                "security_clearance",
                                "travel_required",
                                "additional_notes",
                                "location",
                                "type",
                                "salary_range",
                                "job_source",
                                "source_url",
                                "status",
                                "created_at",
                                "updated_at",
                            ]
                            values = [job.get(col) for col in columns]
                            placeholders = ", ".join(["%s"] * len(columns))
                            insert_sql = f"INSERT INTO jobs ({', '.join(columns)}) VALUES ({placeholders});"
                            tx_cursor.execute(insert_sql, values)
                            inserted_count += 1
            except Exception as exc:
                conn.rollback()
                failed_count = len(insert_ready)
                insert_report["failed_count"] = failed_count
                insert_report["inserted_count"] = 0
                insert_report["fatal_error"] = str(exc)
                write_json(INSERT_REPORT_JSON, insert_report)
                print("\n❌ Fatal insert error. Transaction rolled back.")
                raise

            insert_report["inserted_count"] = inserted_count
            insert_report["failed_count"] = 0
            write_json(INSERT_REPORT_JSON, insert_report)

        print("\nFinal Report")
        print(f"cutoff_date: {insert_report['cutoff_date']}")
        print(f"incoming_new_jobs_count: {insert_report['incoming_new_jobs_count']}")
        print(f"duplicates_found: {insert_report['duplicates_found']}")
        print(f"insert_candidates_count: {insert_report['insert_candidates_count']}")
        print(f"inserted_count: {insert_report['inserted_count']}")
        print(f"failed_count: {insert_report['failed_count']}")
        if failures:
            print("Per-row failures:")
            for failure in failures:
                print(json.dumps(failure, default=str))

        return 0

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


if __name__ == "__main__":
    sys.exit(main())

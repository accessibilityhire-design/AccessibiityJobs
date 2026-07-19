#!/usr/bin/env python3
"""Fetch, reconcile, validate, and insert new accessibility jobs.

The pipeline combines the curated A11yJobs feed with JobSpy-backed searches
across Indeed, LinkedIn, Glassdoor, Google Jobs, and ZipRecruiter. Direct
employer or ATS pages are preferred when available, while aggregator-only
records require corroboration from another source before insertion.
"""

import csv
import html
import json
import os
import re
import sys
import time
import subprocess
from collections import Counter
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, date, timedelta, timezone
from typing import Any, Dict, List, Optional, Tuple
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

BASE_URL = "https://www.a11yjobs.com"
LIST_URL = f"{BASE_URL}/"

OUTPUT_DIR = "/Users/khushwantparihar/AccessibiityJobs/scripts/output"
CANDIDATES_JSON = os.path.join(OUTPUT_DIR, "multisource_jobs_candidates_final_with_nan.json")
CANDIDATES_CSV = os.path.join(OUTPUT_DIR, "multisource_jobs_candidates_final_table.csv")
INSERT_READY_JSON = os.path.join(OUTPUT_DIR, "multisource_jobs_insert_ready_final.json")

JOBSPY_SOURCES = ["indeed", "linkedin"]
SUPPORTED_JOBSPY_SOURCES = ["indeed", "linkedin", "glassdoor", "google", "zip_recruiter"]
JOBSPY_SEARCH_TERMS = [
    "digital accessibility",
    "accessibility engineer",
    "accessibility specialist",
    "accessibility consultant",
]
JOBSPY_MARKETS = [
    ("United States", "USA"),
    ("United Kingdom", "UK"),
    ("India", "India"),
    ("Canada", "Canada"),
]
SOURCE_PRIORITY = {
    "direct": 0,
    "a11yjobs": 1,
    "indeed": 2,
    "linkedin": 3,
    "glassdoor": 4,
    "google": 5,
    "zip_recruiter": 6,
}
JOB_BOARD_HOSTS = {
    "a11yjobs.com",
    "indeed.com",
    "linkedin.com",
    "glassdoor.com",
    "google.com",
    "ziprecruiter.com",
}

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
SALARY_TYPES = {"annual", "monthly", "weekly", "hourly", "daily", "project"}
TRAVEL_REQUIREMENTS = {"none", "occasional", "regular", "frequent"}
US_STATE_CODES = {
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL",
    "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT",
    "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI",
    "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC",
}
CANADIAN_PROVINCE_CODES = {
    "AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT",
}
COUNTRY_CODE_ALIASES = {
    "us": "US", "usa": "US", "u.s.": "US", "u.s.a.": "US",
    "united states": "US", "united states of america": "US",
    "ca": "CA", "canada": "CA",
    "uk": "GB", "gb": "GB", "united kingdom": "GB", "england": "GB",
    "in": "IN", "india": "IN",
    "ec": "EC", "ecuador": "EC",
    "ph": "PH", "philippines": "PH",
    "se": "SE", "sweden": "SE",
}

REQUIRED_FIELDS = [
    "title",
    "company",
    "employment_type",
    "work_arrangement",
    "description",
    "key_responsibilities",
    "requirements",
    "status",
]

VARCHAR_LIMITS: Dict[str, int] = {
    "title": 255,
    "company": 255,
    "company_website": 500,
    "company_size": 50,
    "industry": 100,
    "job_level": 50,
    "employment_type": 50,
    "department": 100,
    "work_arrangement": 50,
    "timezone": 100,
    "country": 100,
    "city": 100,
    "specific_location": 255,
    "currency": 10,
    "salary_type": 50,
    "bonus_structure": 255,
    "years_experience": 50,
    "education_level": 100,
    "wcag_level": 50,
    "pto_details": 255,
    "contact_email": 255,
    "expected_start_date": 100,
    "travel_required": 50,
    "location": 255,
    "type": 50,
    "salary_range": 100,
    "job_source": 50,
    "source_url": 500,
    "status": 20,
}

JUNK_TEXT_PATTERNS = [
    r"page has loaded",
    r"\[object Object\]",
    r"skip to main content",
    r"(?:^|\n)\s*navigation\s*(?:\n|$)",
    r"(?:^|\n)\s*footer\s*(?:\n|$)",
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


def psql_query(db_url: str, sql: str) -> Tuple[int, str, str]:
    transient_markers = [
        "operation timed out",
        "could not receive data from server",
        "connection to server",
        "server closed the connection unexpectedly",
        "terminating connection due to administrator command",
    ]

    for attempt in range(4):
        result = subprocess.run(
            ["psql", "-d", db_url, "-At", "-v", "ON_ERROR_STOP=1", "-c", sql],
            capture_output=True,
            text=True,
            env={**os.environ, "PGCONNECT_TIMEOUT": "10"},
        )
        code = result.returncode
        out = result.stdout.strip()
        err = result.stderr.strip()

        if code == 0:
            return code, out, err

        err_lower = err.lower()
        is_transient = any(marker in err_lower for marker in transient_markers)
        if is_transient and attempt < 3:
            time.sleep(2 ** attempt)
            continue
        return code, out, err

    return 1, "", "psql retry exhaustion"


def psql_scalar(db_url: str, sql: str) -> Optional[str]:
    code, out, err = psql_query(db_url, sql)
    if code != 0:
        raise RuntimeError(err or "psql error")
    return out.splitlines()[0] if out else None


def fetch_cutoff_date(db_url: str) -> date:
    out = psql_scalar(db_url, "SELECT MAX(created_at)::date AS latest_date FROM jobs;")
    if out:
        return datetime.strptime(out, "%Y-%m-%d").date()
    return date(1970, 1, 1)


def fetch_total_count(db_url: str) -> int:
    out = psql_scalar(db_url, "SELECT COUNT(*) FROM jobs;")
    return int(out) if out else 0


def fetch_page(session: requests.Session, url: str, retries: int = 3) -> Optional[BeautifulSoup]:
    for attempt in range(retries):
        try:
            response = session.get(url, timeout=10)
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
    lower = text.lower() if text else ""
    if "part" in lower:
        return "part-time"
    if "contract" in lower:
        return "contract"
    if "freelance" in lower:
        return "freelance"
    if "intern" in lower:
        return "internship"
    return "full-time"


def normalize_work_arrangement(
    location: str,
    title: str = "",
    description: str = "",
    job_location_type: str = "",
) -> str:
    primary = f"{location} {title}".lower()
    description_lower = description.lower() if description else ""
    if "hybrid" in primary:
        return "hybrid"
    if str(job_location_type).upper() == "TELECOMMUTE" or "remote" in primary:
        return "remote"
    if re.search(r"\b(?:100%|fully|entirely)\s+remote\b|\bremote\s+(?:position|role)\b", description_lower):
        return "remote"
    if re.search(
        r"\bhybrid\s+(?:position|role|schedule|work)\b|"
        r"\(\s*hybrid\s*\)|\blocation\b.{0,80}\bhybrid\b",
        description_lower,
        re.S,
    ):
        return "hybrid"
    return "onsite"


def normalize_country_code(value: Optional[str]) -> Optional[str]:
    if not value:
        return None
    normalized = re.sub(r"\s+", " ", str(value)).strip()
    return COUNTRY_CODE_ALIASES.get(normalized.lower(), normalized)


def parse_location_fields(
    location_text: str,
    jsonld_city: Optional[str] = None,
    jsonld_region: Optional[str] = None,
    jsonld_country: Optional[str] = None,
) -> Tuple[Optional[str], Optional[str]]:
    city = str(jsonld_city).strip() if jsonld_city else None
    if city and "," in city:
        # Some sources place a complete ``city, region`` label in
        # addressLocality. Store only the locality; the region remains in the
        # full location string and is emitted separately in JobPosting schema.
        city = city.split(",", 1)[0].strip() or None
    structured_country = str(jsonld_country).strip().upper() if jsonld_country else ""
    if structured_country in US_STATE_CODES and structured_country not in {"CA", "IN"}:
        # Some ATS feeds put addressRegion in addressCountry. Preserve the
        # deterministic country while never storing the subdivision as one.
        country = "US"
    elif structured_country in CANADIAN_PROVINCE_CODES:
        country = "CA"
    else:
        country = normalize_country_code(jsonld_country)
    parts = [part.strip() for part in re.split(r"[,|]", location_text or "") if part.strip()]

    if not city and parts and parts[0].lower() != "remote":
        city = parts[0]

    if not country and parts:
        final = parts[-1]
        upper = final.upper()
        if upper in US_STATE_CODES:
            # Prefer explicit country aliases for well-known international
            # localities that also collide with US state abbreviations.
            if upper == "IN" and city and city.lower() in {"bangalore", "bengaluru", "mumbai", "delhi", "pune", "hyderabad", "chennai"}:
                country = "IN"
            elif upper == "CA" and city and city.lower() in {"toronto", "vancouver", "montreal", "ottawa", "calgary"}:
                country = "CA"
            else:
                country = "US"
        else:
            country = normalize_country_code(final)

    # A structured region can safely resolve the country when the source did
    # not provide addressCountry.
    region = str(jsonld_region).strip().upper() if jsonld_region else ""
    if not country and region in US_STATE_CODES:
        country = "US"

    return city, country


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
        "%Y-%m-%dT%H:%M:%SZ",
        "%Y-%m-%dT%H:%M:%S.%fZ",
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


def parse_relative_posted_date(text: str, today_utc: date) -> Optional[date]:
    if not text:
        return None

    cleaned = clean_text(text)
    lowered = cleaned.lower()
    posted_match = re.search(r"posted\s+(.+)", lowered)
    candidate = posted_match.group(1).strip() if posted_match else lowered

    if "today" in candidate:
        return today_utc
    if "yesterday" in candidate:
        return today_utc - timedelta(days=1)

    hour_match = re.search(r"(\d+)\s+hours?", candidate)
    if hour_match:
        return today_utc

    day_match = re.search(r"(\d+)\s+days?", candidate)
    if day_match:
        return today_utc - timedelta(days=int(day_match.group(1)))

    week_match = re.search(r"(\d+)\s+weeks?", candidate)
    if week_match:
        return today_utc - timedelta(days=7 * int(week_match.group(1)))

    month_match = re.search(r"(\d+)\s+months?", candidate)
    if month_match:
        return today_utc - timedelta(days=30 * int(month_match.group(1)))

    year_match = re.search(r"(\d+)\s+years?", candidate)
    if year_match:
        return today_utc - timedelta(days=365 * int(year_match.group(1)))

    absolute_match = re.search(r"([A-Za-z]{3,9}\s+\d{1,2},\s+\d{4}|\d{4}-\d{2}-\d{2})", cleaned)
    if absolute_match:
        return parse_date_text(absolute_match.group(1))

    return None


def extract_job_link_hints(soup: BeautifulSoup, today_utc: date) -> Dict[str, Optional[date]]:
    links: Dict[str, Optional[date]] = {}
    for a in soup.find_all("a", href=True):
        href = a.get("href", "")
        if "/jobs/" in href:
            full_url = urljoin(BASE_URL, href)
            if not full_url.startswith(BASE_URL):
                continue
            if re.search(r"/jobs/create/?$", full_url):
                continue

            hint_date: Optional[date] = None
            node = a
            for _ in range(6):
                node = node.parent if node else None
                if not node:
                    break
                context_text = node.get_text(" ", strip=True)
                if "posted" in context_text.lower():
                    hint_date = parse_relative_posted_date(context_text, today_utc)
                    break

            if full_url not in links or (links[full_url] is None and hint_date is not None):
                links[full_url] = hint_date
    return links


def extract_label_value(soup: BeautifulSoup, label_regex: str) -> Optional[str]:
    label = soup.find(string=re.compile(label_regex, re.I))
    if not label:
        return None
    parent = label.parent
    if not parent:
        return None
    next_el = parent.find_next_sibling()
    if next_el:
        text = next_el.get_text(" ", strip=True)
        if text:
            return text
    text = parent.get_text(" ", strip=True)
    return text if text else None


def clean_text(text: str) -> str:
    if not text:
        return ""
    text = re.sub(r"\s+", " ", text).strip()
    return text


def strip_html(text: str) -> str:
    if not text:
        return ""
    soup = BeautifulSoup(text, "html.parser")
    for tag in soup(["script", "style", "noscript"]):
        tag.decompose()
    return soup.get_text("\n")


RESPONSIBILITIES_FALLBACK = "See the full role overview above for day-to-day responsibilities."
REQUIREMENTS_FALLBACK = "See the full role overview above for required qualifications."


_SECTION_PATTERNS = [
    (
        "overview",
        re.compile(
            r"^(?:about (?:the )?role|job summary|position summary|role summary|overview|"
            r"company description|your role|the role|we are looking for)$",
            re.I,
        ),
    ),
    (
        "responsibilities",
        re.compile(
            r"^(?:(?:key|core|primary|role) responsibilities|responsibilities|duties|"
            r"duties and responsibilities|essential functions|job role and responsibilit(?:y|ies)|"
            r"what you['’]?ll do|what you will do|what you['’]?ll own|your impact)$",
            re.I,
        ),
    ),
    (
        "requirements",
        re.compile(
            r"^(?:requirements?|qualifications?|required qualifications?|must[- ]have qualifications?|"
            r"minimum qualifications?|required experience(?:\s*/\s*clearance)?|experience required|"
            r"required technical skills?(?:\s*&\s*qualifications?)?|required skills?(?: sets?)?|"
            r"core skills?(?:\s*&\s*knowledge)?|knowledge,? skills?(?:\s*(?:and|&)\s*abilities)?|"
            r"specific skills? required|required education and experience|competencies|"
            r"tools?\s*&\s*technologies|your education|what you['’]?ll need|what you will need|"
            r"what you['’]?ll bring|what you will bring|what you bring|"
            r"who you are|what we['’]?re looking for)$",
            re.I,
        ),
    ),
    (
        "preferred",
        re.compile(
            r"^(?:preferred qualifications?|preferred experience|preferred skills?|desired experience|"
            r"nice[- ]to[- ]have qualifications?|nice to have|bonus points?|a plus)$",
            re.I,
        ),
    ),
    (
        "ignore",
        re.compile(
            r"^(?:benefits?|why join us|what we offer|compensation|salary|pay range|location|"
            r"travel expectations?|hiring journey|hiring process|application process|posting end date|"
            r"company snapshot|our core principles|use of ai in hiring|seniority level|employment type|"
            r"job function|industries|we value equal opportunity|applicants with disabilities|"
            r"drug and alcohol policy|equal opportunity employer|eeo statement)$",
            re.I,
        ),
    ),
]

_IGNORE_PROSE_START = re.compile(
    r"^(?:the )?(?:salary|compensation|base pay|pay) (?:range|band|provided)|"
    r"^actual compensation\b|^in addition to base salary\b",
    re.I,
)


def _plain_markdown(value: str) -> str:
    value = html.unescape(value or "")
    value = re.sub(r"!\[[^\]]*\]\([^)]*\)", " ", value)
    value = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", value)
    value = re.sub(r"^[#>]+\s*", "", value.strip())
    value = re.sub(r"[*_`]+", "", value)
    return clean_text(value).strip(" :.;-–—")


def _section_category(value: str) -> Optional[str]:
    label = _plain_markdown(value)
    if not label or len(label) > 100:
        return None
    for category, pattern in _SECTION_PATTERNS:
        if pattern.fullmatch(label):
            return category
    return None


def _split_glued_heading(value: str) -> List[str]:
    """Split ``**Heading**content`` only when Heading is a known section.

    This repairs a common LinkedIn-derived artifact without guessing that
    every bold phrase is a section boundary.
    """
    match = re.match(r"^(\s*(?:#{1,6}\s*)?\*{2,}(.{2,100}?)\*{2,})(\S.*)$", value)
    if not match or not _section_category(match.group(2)):
        return [value]
    remainder = match.group(3).strip()
    if len(_plain_markdown(remainder)) < 2:
        return [match.group(1)]
    return [match.group(1), remainder]


def normalize_description_text(text: str) -> str:
    """Normalize source text while preserving paragraphs, headings and lists.

    ``clean_text`` is intentionally unsuitable here because collapsing every
    newline destroys the only reliable section and bullet evidence supplied by
    A11yJobs JSON-LD.
    """
    if not text:
        return ""

    text = html.unescape(text).replace("\r\n", "\n").replace("\r", "\n")
    text = re.sub(r"\s*—\s*", " - ", text)
    text = re.sub(r"[\u200b\u200c\u200d\ufeff]", "", text)
    output: List[str] = []
    prose_buffer: List[str] = []
    pending_bullet_index: Optional[int] = None

    def flush_prose() -> None:
        if prose_buffer:
            output.append(clean_text(" ".join(prose_buffer)))
            prose_buffer.clear()

    def add_break() -> None:
        nonlocal pending_bullet_index
        if output and output[-1] != "":
            output.append("")
        pending_bullet_index = None

    for raw_line in text.split("\n"):
        if not raw_line.strip():
            flush_prose()
            add_break()
            continue

        for split_line in _split_glued_heading(raw_line):
            stripped = re.sub(r"\s+", " ", split_line.strip())
            category = _section_category(stripped)
            if category:
                flush_prose()
                add_break()
                output.append(f"**{_plain_markdown(stripped)}**")
                add_break()
                continue

            bold_bullet_match = re.match(r"^\s*\*{2,}[•-]\s*(.+?)\*{2,}\s*$", split_line)
            bullet_match = re.match(r"^\s*(?:[-*•]|\d+[.)])\s+(.+)$", split_line)
            was_indented = bool(re.match(r"^\s{2,}\S", split_line))
            if bold_bullet_match or bullet_match or was_indented:
                flush_prose()
                content = (
                    bold_bullet_match.group(1)
                    if bold_bullet_match
                    else bullet_match.group(1)
                    if bullet_match
                    else split_line.strip()
                )
                content = re.sub(r"\s+", " ", content).strip()
                pending_text = output[pending_bullet_index] if pending_bullet_index is not None else ""
                pending_plain = _plain_markdown(pending_text).lower()
                if (
                    was_indented
                    and pending_bullet_index is not None
                    and len(_plain_markdown(pending_text)) < 80
                    and not re.search(r"[.!?;:]\s*$", pending_text.strip())
                    and (
                        re.search(r"(?:\bat least|\bof|\bwith|\bin|\bincluding|\bsuch as|\band|\bor|\bthe|\ba|\ban|\bto|\bfor)\s*$", pending_plain)
                        or re.match(r"^(?:of|with|in|including|and|or|to|for)\b", _plain_markdown(content), re.I)
                    )
                ):
                    output[pending_bullet_index] = f"{pending_text} {content}"
                    continue
                if content:
                    output.append(f"- {content}")
                    pending_bullet_index = len(output) - 1
                continue

            if pending_bullet_index is not None:
                output[pending_bullet_index] = f"{output[pending_bullet_index]} {stripped}"
            else:
                prose_buffer.append(stripped)

    flush_prose()
    normalized = "\n".join(output)
    normalized = re.sub(r"\n{3,}", "\n\n", normalized).strip()
    normalized = re.sub(r"(?m)(^-\s+[^\n]+)\n\n(?=-\s+)", r"\1\n", normalized)
    normalized = re.sub(r"(?<=[A-Za-z0-9):])\*\*(?=[A-Za-z0-9])", "** ", normalized)
    return normalized


def is_placeholder_section(value: Optional[str]) -> bool:
    if not value:
        return True
    lowered = _plain_markdown(value).lower()
    return lowered in {
        _plain_markdown(RESPONSIBILITIES_FALLBACK).lower(),
        _plain_markdown(REQUIREMENTS_FALLBACK).lower(),
    }


def parse_description_sections(description: str) -> Dict[str, Optional[str]]:
    """Classify only real, line-level job section headings.

    A word such as ``requirements`` inside prose is never a boundary. When a
    source has no substantial overview, the full normalized posting remains in
    the description and the two required DB columns receive hidden sentinels;
    the UI omits those sentinels instead of showing duplicate "see above" cards.
    """
    normalized = normalize_description_text(description)
    if len(_plain_markdown(normalized)) < 40:
        return {
            "description": None,
            "key_responsibilities": None,
            "requirements": None,
            "nice_to_have": None,
        }

    buckets: Dict[str, List[str]] = {
        "overview": [],
        "responsibilities": [],
        "requirements": [],
        "preferred": [],
    }
    active = "overview"

    for line in normalized.splitlines():
        if _IGNORE_PROSE_START.match(_plain_markdown(line)):
            active = "ignore"
            continue
        category = _section_category(line)
        if category:
            if category == "ignore":
                active = "ignore"
                continue
            if category == "overview":
                # Preamble before an explicit role overview is usually the
                # duplicate title/location card or generic company marketing.
                # Prefer the role-specific overview that follows the header.
                buckets["overview"] = []
                active = "overview"
                continue
            # Keep secondary same-category headers because labels such as
            # "Tools & Technologies" make a long requirements section easier
            # to scan. The first outer heading is already represented by UI.
            if active == category and buckets[category]:
                buckets[category].extend(["", f"**{_plain_markdown(line)}**", ""])
            active = category
            continue
        if active != "ignore":
            buckets[active].append(line)

    def cleaned(name: str) -> str:
        value = "\n".join(buckets[name])
        value = re.sub(r"^\s+|\s+$", "", value)
        return re.sub(r"\n{3,}", "\n\n", value)

    overview = cleaned("overview")
    responsibilities = cleaned("responsibilities")
    requirements = cleaned("requirements")
    preferred = cleaned("preferred")

    # A title or one-line fragment is not an honest standalone role overview.
    # In that case render the complete source text once and hide the redundant
    # DB-required sibling sections.
    if len(_plain_markdown(overview)) < 100:
        return {
            "description": normalized,
            "key_responsibilities": RESPONSIBILITIES_FALLBACK,
            "requirements": REQUIREMENTS_FALLBACK,
            "nice_to_have": None,
        }

    return {
        "description": overview,
        "key_responsibilities": responsibilities if len(_plain_markdown(responsibilities)) >= 20 else RESPONSIBILITIES_FALLBACK,
        "requirements": requirements if len(_plain_markdown(requirements)) >= 20 else REQUIREMENTS_FALLBACK,
        "nice_to_have": preferred if len(_plain_markdown(preferred)) >= 20 else None,
    }


def split_description(description: str, title: str, company: str) -> Tuple[Optional[str], Optional[str], Optional[str]]:
    """Backward-compatible three-field wrapper for older callers."""
    sections = parse_description_sections(description)
    return sections["description"], sections["key_responsibilities"], sections["requirements"]


def parse_salary(text: Optional[str]) -> Tuple[Optional[int], Optional[int], Optional[str], Optional[str]]:
    """Parse only amounts tied to explicit currency and pay context.

    The old implementation grabbed the first two numbers from any line that
    happened to contain the word "salary". On real postings that turned
    "7+ years" and "Section 508" into a $7-$508 annual salary when the salary
    paragraph contained no amount at all.
    """
    if not text:
        return None, None, None, None

    text = html.unescape(strip_html(text)).strip()
    lower = text.lower()
    context_matches = list(re.finditer(r"\b(?:base salary|salary|compensation|pay range|base pay)\b", lower))
    has_pay_unit = bool(re.search(r"(?:/|per\s+)(?:hour|hr|day|month|year|yr)\b|\bhourly\b|\bannual(?:ly)?\b", lower))
    if not context_matches and not has_pay_unit:
        return None, None, None, None

    # Look close to a pay marker rather than scanning the whole job body. The
    # shortest valid window wins, which also avoids unrelated dates and years.
    windows: List[str] = []
    for match in context_matches:
        windows.append(text[max(0, match.start() - 80): min(len(text), match.end() + 260)])
    if not windows:
        windows.append(text[:400])

    currency_pattern = re.compile(r"[$£€₹]|\b(?:USD|CAD|EUR|GBP|AUD|INR|JPY|CNY)\b", re.I)
    amount_pattern = re.compile(r"(?<![\w.])(\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?)([kK]?)(?![\w.])")

    chosen_window = ""
    chosen_numbers: List[int] = []
    for window in windows:
        if not currency_pattern.search(window):
            continue
        numbers: List[int] = []
        currency_match = currency_pattern.search(window)
        amount_region = window[max(0, currency_match.start() - 20):] if currency_match else window
        amount_matches = list(amount_pattern.finditer(amount_region))
        for index, amount_match in enumerate(amount_matches):
            if index > 0:
                previous = amount_matches[index - 1]
                separator = amount_region[previous.end():amount_match.start()]
                if not re.search(r"(?:-|–|—|\bto\b)", separator, re.I):
                    break
            raw, suffix = amount_match.group(1), amount_match.group(2)
            value = float(raw.replace(",", ""))
            if suffix:
                value *= 1000
            numbers.append(int(round(value)))
            if len(numbers) == 2:
                break
        if numbers:
            chosen_window = window
            chosen_numbers = numbers
            break

    if not chosen_numbers:
        return None, None, None, None

    window_lower = chosen_window.lower()
    currency = None
    first_currency = currency_pattern.search(chosen_window)
    currency_token = first_currency.group(0).upper() if first_currency else ""
    if currency_token in {"£", "GBP"}:
        currency = "GBP"
    elif currency_token in {"€", "EUR"}:
        currency = "EUR"
    elif currency_token in {"₹", "INR"}:
        currency = "INR"
    elif currency_token == "CAD":
        currency = "CAD"
    elif currency_token == "AUD":
        currency = "AUD"
    elif currency_token == "JPY":
        currency = "JPY"
    elif currency_token == "CNY":
        currency = "CNY"
    elif currency_token == "USD":
        currency = "USD"

    salary_type = None
    if re.search(r"/\s*(?:hr|hour)\b|per\s+hour\b|\bhourly\b", window_lower):
        salary_type = "hourly"
    elif re.search(r"/\s*day\b|per\s+day\b", window_lower):
        salary_type = "daily"
    elif re.search(r"/\s*month\b|per\s+month\b|\bmonthly\b", window_lower):
        salary_type = "monthly"
    elif re.search(r"/\s*(?:yr|year)\b|per\s+year\b|\bannual(?:ly)?\b|per-year", window_lower):
        salary_type = "annual"
    elif "project" in window_lower:
        salary_type = "project"
    elif min(chosen_numbers) >= 10000:
        salary_type = "annual"

    # Small values without an explicit unit are not safely distinguishable
    # from years, dates or benefit figures, so omit them instead of guessing.
    if not salary_type:
        return None, None, None, None

    if len(chosen_numbers) == 1:
        return chosen_numbers[0], chosen_numbers[0], currency, salary_type

    return min(chosen_numbers[0], chosen_numbers[1]), max(chosen_numbers[0], chosen_numbers[1]), currency, salary_type


def parse_jsonld_salary(jsonld: Dict[str, Any]) -> Tuple[Optional[int], Optional[int], Optional[str], Optional[str]]:
    base_salary = jsonld.get("baseSalary")
    if not isinstance(base_salary, dict):
        return None, None, None, None

    currency = str(base_salary.get("currency") or "").upper() or None
    value = base_salary.get("value")
    if isinstance(value, (int, float, str)):
        try:
            amount = int(round(float(value)))
        except (TypeError, ValueError):
            return None, None, None, None
        return amount, amount, currency, "annual"
    if not isinstance(value, dict):
        return None, None, None, None

    raw_min = value.get("minValue", value.get("value"))
    raw_max = value.get("maxValue", value.get("value"))
    try:
        minimum = int(round(float(raw_min))) if raw_min is not None else None
        maximum = int(round(float(raw_max))) if raw_max is not None else None
    except (TypeError, ValueError):
        return None, None, None, None
    if minimum is None and maximum is None:
        return None, None, None, None
    if minimum is None:
        minimum = maximum
    if maximum is None:
        maximum = minimum

    unit = str(value.get("unitText") or base_salary.get("unitText") or "YEAR").upper()
    salary_type = {
        "HOUR": "hourly",
        "DAY": "daily",
        "MONTH": "monthly",
        "YEAR": "annual",
    }.get(unit, "annual")
    return minimum, maximum, currency, salary_type


def format_salary_evidence(
    minimum: Optional[int],
    maximum: Optional[int],
    currency: Optional[str],
    salary_type: Optional[str],
) -> Optional[str]:
    if minimum is None and maximum is None:
        return None
    minimum = minimum if minimum is not None else maximum
    maximum = maximum if maximum is not None else minimum
    if minimum is None or maximum is None:
        return None
    unit = {
        "annual": "year",
        "monthly": "month",
        "weekly": "week",
        "hourly": "hour",
        "daily": "day",
        "project": "project",
    }.get(salary_type or "", salary_type or "")
    amount = f"{minimum:,}" if minimum == maximum else f"{minimum:,} - {maximum:,}"
    prefix = currency or ""
    suffix = f" / {unit}" if unit else ""
    return f"{prefix} {amount}{suffix}".strip()


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
    if not salary_type:
        return "Salary type missing"

    if salary_type == "hourly":
        if min_val <= 0 or max_val > 1000:
            return "Hourly salary outside plausible range"
    elif salary_type == "daily":
        if min_val <= 0 or max_val > 5000:
            return "Daily salary outside plausible range"
    elif salary_type == "monthly":
        if min_val < 100 or max_val > 200000:
            return "Monthly salary outside plausible range"
    elif salary_type == "weekly":
        if min_val < 100 or max_val > 50000:
            return "Weekly salary outside plausible range"
    elif salary_type == "annual":
        if min_val < 10000 or max_val > 2000000:
            return "Annual salary outside plausible range"
    return None


def sql_literal(value: Any) -> str:
    if value is None:
        return "NULL"
    if isinstance(value, bool):
        return "TRUE" if value else "FALSE"
    if isinstance(value, (int, float)):
        return str(value)
    if isinstance(value, (datetime, date)):
        return "'" + value.isoformat() + "'"
    text = str(value)
    # PostgreSQL runs with standard_conforming_strings=on, so backslashes are
    # ordinary data. Escaping them doubled JSON/markdown backslashes in stored
    # content; only single quotes need SQL-literal escaping here.
    text = text.replace("'", "''")
    return "'" + text + "'"


def check_duplicate_db(db_url: str, source_url: str, title: str, company: str) -> Tuple[bool, str]:
    if source_url:
        sql = f"SELECT id FROM jobs WHERE source_url = {sql_literal(source_url)} LIMIT 1;"
        out = psql_scalar(db_url, sql)
        if out:
            return True, "source_url"

    norm_title = normalize_text(title)
    norm_company = normalize_text(company)
    sql = (
        "SELECT id FROM jobs "
        "WHERE lower(regexp_replace(title, '[^a-z0-9]+', '', 'g')) = "
        f"{sql_literal(norm_title)} "
        "AND lower(regexp_replace(company, '[^a-z0-9]+', '', 'g')) = "
        f"{sql_literal(norm_company)} "
        "LIMIT 1;"
    )
    out = psql_scalar(db_url, sql)
    if out:
        return True, "title_company"

    return False, ""


def extract_jsonld_jobposting(soup: BeautifulSoup) -> Optional[Dict[str, Any]]:
    def unwrap_candidates(value: Any) -> List[Dict[str, Any]]:
        items: List[Dict[str, Any]] = []
        if isinstance(value, dict):
            if value.get("@type") == "JobPosting":
                items.append(value)
            graph = value.get("@graph")
            if isinstance(graph, list):
                for graph_item in graph:
                    items.extend(unwrap_candidates(graph_item))
        elif isinstance(value, list):
            for entry in value:
                items.extend(unwrap_candidates(entry))
        return items

    scripts = soup.find_all("script", type=re.compile("ld\+json", re.I))
    for script in scripts:
        try:
            data = json.loads(script.string or script.get_text("", strip=True))
        except Exception:
            continue
        for item in unwrap_candidates(data):
            return item
    return None


def extract_contact_email(text: str) -> Optional[str]:
    if not text:
        return None
    matches = re.findall(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b", text)
    for email in matches:
        local_part = email.split("@", 1)[0].lower()
        if any(marker in local_part for marker in ("accommodation", "no-reply", "noreply")):
            continue
        return email
    return None


# Word-bounded, not a bare substring check: "ADA" as a plain substring
# matches inside "readability", "ADA" as lowercase would also match nothing
# meaningful, but short acronyms need boundaries to avoid exactly this kind
# of accidental mid-word collision.
_SKILL_KEYWORDS = [
    "WCAG", "ARIA", "screen reader", "JAWS", "NVDA", "VoiceOver",
    "accessibility testing", "inclusive design", "a11y", "HTML", "CSS",
    "JavaScript", "assistive technology", "usability", "disability",
    "remediation", "audit", "manual testing", "automated testing",
    "mobile accessibility", "web accessibility", "Section 508", "ADA",
    "VPAT", "ACR", "accessibility conformance", "TalkBack", "Axe DevTools",
    "WAVE", "Lighthouse", "ARC Toolkit", "ZoomText", "Dragon", "Selenium",
    "Playwright", "Figma", "USWDS", "Angular", "React", "TypeScript",
    "Node.js", "PostgreSQL", "JIRA", "Drupal", "keyboard accessibility",
    "PDF accessibility", "document accessibility", "AODA",
]
_SKILL_PATTERNS = [
    (skill, re.compile(r"\b" + re.escape(skill) + r"\b", re.I))
    for skill in _SKILL_KEYWORDS
]


def extract_skills(text: str) -> List[str]:
    if not text:
        return []
    analysis_text = _plain_markdown(text)
    found: List[str] = []
    for skill, pattern in _SKILL_PATTERNS:
        if pattern.search(analysis_text) and skill not in found:
            found.append(skill)
    return found


# Case-sensitive and word-bounded on purpose: "WAS" and "ADS" are real
# accessibility certification acronyms, but a bare lowercase substring check
# also matches the common English word "was" ("...which was established...")
# and "ads" (inside "leads", "downloads", etc.), silently tagging unrelated
# jobs as requiring a WAS certification. Certifications are always written
# in caps in real postings, so exact-case, word-bounded matching is safe.
_CERTIFICATION_PATTERNS = [
    (cert, re.compile(r"\b" + re.escape(cert) + r"\b"))
    for cert in ["CPACC", "WAS", "CPWA", "IAAP", "DHS Trusted Tester", "Section 508 Trusted Tester", "ADS", "CPABE"]
]


def extract_certifications(text: str) -> List[str]:
    if not text:
        return []
    found = [cert for cert, pattern in _CERTIFICATION_PATTERNS if pattern.search(text)]
    return list(sorted(set(found)))


_BENEFIT_KEYWORDS = [
    ("Health coverage", re.compile(r"health (?:insurance|coverage|benefits)|medical (?:insurance|coverage)|HMO coverage", re.I), "health_insurance"),
    ("Dental insurance", re.compile(r"dental (?:insurance|coverage|benefits)", re.I), None),
    ("Vision insurance", re.compile(r"vision (?:insurance|coverage|benefits)", re.I), None),
    ("Retirement plan", re.compile(r"401\(?k\)?|retirement plan", re.I), "retirement"),
    ("Paid time off", re.compile(r"paid time off|\bPTO\b|paid vacation", re.I), None),
    ("Parental leave", re.compile(r"parental leave|family leave", re.I), None),
    ("Stock/equity", re.compile(r"stock (grant|purchase|option)|equity compensation", re.I), None),
    ("Tuition assistance", re.compile(r"tuition (assistance|reimbursement)|college coaching", re.I), "professional_development"),
    ("Wellness programs", re.compile(r"wellness program|mental health support", re.I), None),
    ("Disability insurance", re.compile(r"disability insurance", re.I), None),
    ("Life insurance", re.compile(r"life insurance", re.I), None),
]


def extract_benefits(text: str) -> Tuple[List[str], Dict[str, bool]]:
    """Returns (benefit list, boolean flags) and mirrors the JS repair library."""
    if not text:
        return [], {}
    found: List[str] = []
    flags: Dict[str, bool] = {}
    analysis_text = _plain_markdown(text)
    for label, pattern, flag in _BENEFIT_KEYWORDS:
        if pattern.search(analysis_text):
            found.append(label)
            if flag:
                flags[flag] = True
    return found, flags


_WORD_NUMBERS = {
    "one": 1, "two": 2, "three": 3, "four": 4, "five": 5,
    "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10,
}
_EXPERIENCE_RE = re.compile(
    r"\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten)"
    r"(?:\s*[-–—]\s*\d+)?\+?\s*(?:\(\d+\)\s*)?years?\s+"
    r"(?:of\s+)?(?:[A-Za-z][A-Za-z/&-]*\s+){0,4}experience\b",
    re.I,
)


def extract_experience(text: str) -> Optional[str]:
    if not text:
        return None
    # Require "experience" to follow within a few words. A bare "N years"
    # matches unrelated things like "six years of creditable service" for
    # veteran status, which has nothing to do with the job's experience bar.
    match = _EXPERIENCE_RE.search(_plain_markdown(text))
    if not match:
        return None
    raw = match.group(1).lower()
    years = int(raw) if raw.isdigit() else _WORD_NUMBERS.get(raw)
    if years is None:
        return None
    if years <= 1:
        return "0-1"
    if years <= 3:
        return "1-3"
    if years <= 5:
        return "3-5"
    if years <= 7:
        return "5-7"
    if years <= 10:
        return "7-10"
    return "10+"


def extract_education(text: str) -> Optional[str]:
    if not text:
        return None
    lower = _plain_markdown(text).lower()
    if "phd" in lower or "doctorate" in lower:
        return "phd"
    if re.search(r"(?:master'?s?\s+degree|master\s+of\s+)", lower):
        return "master"
    if re.search(r"bachelor'?s?\b", lower):
        return "bachelor"
    if re.search(r"associate'?s?\s+degree", lower):
        return "associate"
    if "high school" in lower:
        return "high-school"
    return None


_ASSISTIVE_TECH_NAMES = ["JAWS", "NVDA", "VoiceOver", "TalkBack", "ZoomText", "Dragon"]
_ACCESSIBILITY_FOCUS_PATTERNS = [
    ("web", re.compile(r"\bweb(?:site| application| content| accessibility)?\b", re.I)),
    ("mobile", re.compile(r"\bmobile\b|\biOS\b|\bAndroid\b", re.I)),
    ("documents", re.compile(r"\bdocuments?\b|\bPDFs?\b|\bWord\b|\bPowerPoint\b", re.I)),
    ("design", re.compile(r"inclusive design|accessible design|\bUX\b|\bUI\b", re.I)),
    ("testing", re.compile(r"accessibility testing|manual testing|automated testing", re.I)),
]


def extract_wcag_level(text: str) -> Optional[str]:
    analysis_text = _plain_markdown(text)
    for version in ["3.0", "2.2", "2.1", "2.0"]:
        if re.search(rf"\bWCAG\s*{re.escape(version)}\b", analysis_text, re.I):
            return f"wcag-{version}"
    return None


def extract_assistive_tech(text: str) -> List[str]:
    analysis_text = _plain_markdown(text)
    return [name for name in _ASSISTIVE_TECH_NAMES if re.search(r"\b" + re.escape(name) + r"\b", analysis_text, re.I)]


def extract_accessibility_focus(text: str) -> List[str]:
    analysis_text = _plain_markdown(text)
    return [label for label, pattern in _ACCESSIBILITY_FOCUS_PATTERNS if pattern.search(analysis_text)]


def extract_structured_fields(full_text: str, sections: Dict[str, Optional[str]]) -> Dict[str, Any]:
    responsibilities = sections.get("key_responsibilities") or ""
    requirements = sections.get("requirements") or ""
    preferred_text = sections.get("nice_to_have") or ""

    if is_placeholder_section(requirements):
        required_context = full_text
    else:
        required_context = f"{requirements}\n{responsibilities}"

    required_skills = extract_skills(required_context)
    preferred_skills = [skill for skill in extract_skills(preferred_text) if skill not in required_skills]
    benefits, benefit_flags = extract_benefits(full_text)

    return {
        "required_skills": required_skills,
        "preferred_skills": preferred_skills,
        "required_certifications": extract_certifications(full_text),
        "years_experience": extract_experience(full_text),
        "education_level": extract_education(full_text),
        "benefits": benefits,
        "benefit_flags": benefit_flags,
        "wcag_level": extract_wcag_level(full_text),
        "accessibility_focus": extract_accessibility_focus(full_text),
        "assistive_tech_experience": extract_assistive_tech(full_text),
    }


# --- Tagged (Required)/(Preferred) items in a corporate JD template -------

_TAG_RE = re.compile(r"\((Required|Preferred)\)", re.I)
_LEADING_SECTION_HEADER_RE = re.compile(
    r"^(knowledge,?\s*skills?\s*(and|&)?\s*abilities|education\s*(and|&)?\s*(work\s*)?experience|"
    r"licenses?\s*(and|&)?\s*certifications?|requirements?|qualifications?)\s*:?\s*",
    re.I,
)
_PLACEHOLDER_PATTERNS = [
    re.compile(r"please refer to the original job posting", re.I),
    re.compile(r"see the full role overview above", re.I),
    re.compile(r"full description (was|is) not available", re.I),
    re.compile(r"to be discussed", re.I),
]


def _is_real_content(value: str) -> bool:
    return not any(p.search(value) for p in _PLACEHOLDER_PATTERNS)


def extract_tagged_items(text: str) -> Tuple[List[str], List[str]]:
    """Splits text on (Required)/(Preferred) tags; common in corporate JDs
    where every qualification/skill line ends with an explicit tag."""
    if not text:
        return [], []
    required: List[str] = []
    preferred: List[str] = []
    last_end = 0
    for match in _TAG_RE.finditer(text):
        chunk = text[last_end:match.start()].strip()
        last_end = match.end()
        if len(chunk) < 3 or len(chunk) > 300:
            continue
        clean = re.sub(r"^[.\s;:,\-]+", "", chunk)
        clean = _LEADING_SECTION_HEADER_RE.sub("", clean).strip()
        if not clean or not _is_real_content(clean):
            continue
        if match.group(1).lower() == "preferred":
            preferred.append(clean)
        else:
            required.append(clean)
    return required, preferred


def extract_bullet_items(text: str) -> List[str]:
    """Extracts "* " / "- " / "•" prefixed lines from government/university JD
    template. Splits on newlines and bullet-marker lookaheads so an item
    never bleeds across a field boundary."""
    if not text:
        return []
    parts = re.split(r"(?=\s[*•]\s)|\n", text)
    items = []
    for part in parts:
        part = part.strip()
        if not re.match(r"^[*•\-]\s+", part):
            continue
        clean = re.sub(r"^[*•\-]\s+", "", part).strip()
        if 10 <= len(clean) <= 300 and _is_real_content(clean):
            items.append(clean)
    return items


_LEGAL_BOILERPLATE_MARKERS = [
    re.compile(r"\bEEO Statement\b", re.I),
    re.compile(r"\bEqual Employment Opportunity Employer\b", re.I),
    re.compile(r"\bis an [Ee]qual [Oo]pportunity [Ee]mployer\b"),
    re.compile(r"\bADA Accommodations\b", re.I),
    re.compile(r"\bSupplemental Contact Information\b", re.I),
    re.compile(r"\bVeterans[’']? and National Guard Preference\b", re.I),
    re.compile(r"\bApplication Process\b\s*\*\*", re.I),
]


def trim_legal_boilerplate(text: str) -> str:
    """Cuts everything from the first universal legal/EEO/procedural
    boilerplate marker onward. It is near-identical across every US employer and
    government posting, and adds nothing a job seeker needs to decide
    whether to apply. Only cuts if enough real content remains before it."""
    if not text:
        return text
    earliest = -1
    for pattern in _LEGAL_BOILERPLATE_MARKERS:
        match = pattern.search(text)
        if match and (earliest == -1 or match.start() < earliest):
            earliest = match.start()
    if earliest > 300:
        return text[:earliest].strip()
    return text


def normalize_external_content(text: str) -> str:
    if not text:
        return ""

    if re.search(r"<html|<body|<div|<main|<section|<!doctype", text[:2000], re.I):
        soup = BeautifulSoup(text, "html.parser")
        for tag in soup(["script", "style", "noscript"]):
            tag.decompose()
        visible_text = normalize_description_text(soup.get_text("\n", strip=True))
        if len(visible_text) >= 200:
            text = visible_text
        else:
            meta_parts: List[str] = []
            title_tag = soup.find("title")
            if title_tag:
                meta_parts.append(clean_text(title_tag.get_text(" ", strip=True)))
            for attrs in [
                {"name": "description"},
                {"property": "og:description"},
                {"name": "twitter:description"},
                {"property": "twitter:description"},
            ]:
                meta_tag = soup.find("meta", attrs=attrs)
                if meta_tag and meta_tag.get("content"):
                    meta_parts.append(clean_text(meta_tag["content"]))
            text = normalize_description_text("\n\n".join(part for part in meta_parts if part))

    return normalize_description_text(strip_html(text))


def fetch_external_text(session: requests.Session, url: str) -> Tuple[Optional[str], str, Optional[str]]:
    if not url or not url_is_valid(url):
        return None, "invalid", None

    def try_fetch(fetch_url: str) -> Tuple[Optional[str], Optional[str]]:
        try:
            response = session.get(fetch_url, timeout=5)
            if response.status_code >= 400:
                return None, None
            text = response.text
            if not text or len(text) < 200:
                return None, None
            return text, response.url
        except Exception:
            return None, None

    text, resolved_url = try_fetch(url)
    blocked_markers = [
        "enable javascript",
        "access denied",
        "captcha",
        "forbidden",
        "cloudflare",
        "currently unavailable",
        "service interruption",
        "check back later",
    ]
    visible_text = normalize_external_content(text) if text else ""
    is_blocked = any(marker in visible_text.lower() for marker in blocked_markers)

    # A11yJobs renders an intermediate confirmation page at /apply and exposes
    # the employer or ATS redirect at /apply/go. Follow that source-backed link
    # so evidence classification uses the final destination rather than the
    # aggregator confirmation page.
    if text and not is_blocked and hostname_without_www(resolved_url or url) == "a11yjobs.com":
        soup = BeautifulSoup(text, "html.parser")
        go_link = next(
            (
                urljoin(resolved_url or url, anchor.get("href", ""))
                for anchor in soup.find_all("a", href=True)
                if re.search(r"/apply/go(?:[/?#]|$)", anchor.get("href", ""))
            ),
            None,
        )
        if go_link:
            external_text, external_url = try_fetch(go_link)
            external_visible = normalize_external_content(external_text) if external_text else ""
            external_blocked = any(marker in external_visible.lower() for marker in blocked_markers)
            if external_text and not external_blocked:
                return external_text, "direct", external_url

    if text and not is_blocked:
        return text, "direct", resolved_url

    jina_url = f"https://r.jina.ai/http://{url.replace('https://', '').replace('http://', '')}"
    text, _ = try_fetch(jina_url)
    if text:
        return text, "jina", url

    return None, "failed", None


def search_alternate_urls(session: requests.Session, title: str, company: str) -> List[str]:
    query = f"{title} {company} job posting"
    search_url = "https://duckduckgo.com/html/"
    try:
        response = session.get(search_url, params={"q": query}, timeout=5)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        links = []
        for a in soup.select("a.result__a"):
            href = a.get("href")
            if href and "duckduckgo.com" not in href:
                links.append(href)
        return links[:1]
    except Exception:
        return []


def extract_apply_url(soup: BeautifulSoup, page_url: str, jsonld: Dict[str, Any]) -> Optional[str]:
    candidates: List[str] = []

    jsonld_url = jsonld.get("url")
    if isinstance(jsonld_url, str):
        candidates.append(jsonld_url)

    for a in soup.find_all("a", href=True):
        href = urljoin(BASE_URL, a.get("href", ""))
        link_text = clean_text(a.get_text(" ", strip=True)).lower()
        if "apply" in link_text:
            candidates.append(href)

    for candidate in candidates:
        if not url_is_valid(candidate):
            continue
        if candidate.rstrip("/") == page_url.rstrip("/"):
            continue
        return candidate
    return None


def extract_company_website(soup: BeautifulSoup, hiring_org: Any) -> Optional[str]:
    source_host = (urlparse(BASE_URL).hostname or "").lower().removeprefix("www.")

    def is_employer_url(value: Any) -> bool:
        if not isinstance(value, str) or not url_is_valid(value):
            return False
        hostname = (urlparse(value).hostname or "").lower().removeprefix("www.")
        return bool(hostname and hostname != source_host and not hostname.endswith("." + source_host))

    company_website = None
    if isinstance(hiring_org, dict):
        company_website = hiring_org.get("sameAs") or hiring_org.get("url")
    if isinstance(company_website, list):
        company_website = company_website[0] if company_website else None
    if is_employer_url(company_website):
        return company_website

    for a in soup.find_all("a", href=True):
        href = urljoin(BASE_URL, a.get("href", ""))
        link_text = clean_text(a.get_text(" ", strip=True)).lower()
        if not is_employer_url(href):
            continue
        if "apply" in link_text:
            continue
        if "website" in link_text or "company" in link_text:
            return href

    return None


def extract_salary_text(soup: BeautifulSoup) -> Optional[str]:
    main = soup.find("main") or soup.find("article") or soup
    candidates: List[str] = []

    for line in main.get_text("\n", strip=True).splitlines():
        cleaned = clean_text(line)
        if not cleaned:
            continue
        if not re.search(r"salary|compensation|pay range", cleaned, re.I):
            continue
        # A pay word plus arbitrary digits is not evidence: descriptions often
        # mention years of experience, WCAG 2.2 or Section 508 near a generic
        # compensation paragraph. Require an explicit currency marker.
        if not re.search(r"[$£€₹]|\b(?:USD|CAD|EUR|GBP|AUD|INR|JPY|CNY)\b", cleaned, re.I):
            continue
        if not re.search(r"\d", cleaned):
            continue
        candidates.append(cleaned)

    if candidates:
        candidates.sort(key=len)
        return candidates[0]

    return extract_label_value(soup, r"salary")


# Boilerplate that shows up around the real description in a11yjobs.com's
# <main>/<article> containers include breadcrumbs, the duplicate title/company/
# location/salary header, and the "Other Recent Jobs" sidebar widget. All of
# this lives in the same container as the real text, so a naive
# `.get_text()` scoops it up as if it were part of the job description.
_LEADING_CHROME = re.compile(
    r"^.*?\bJob Description\b\s*", re.I | re.S
)
_LEADING_BACKTO_PHRASE = re.compile(
    r"^\s*(?:←\s*)?Back to( all)? Jobs\b\s*", re.I
)
_TRAILING_CHROME = re.compile(
    r"\b(Report\s+)?Other Recent Jobs\b.*$|"
    r"\bView Company Profile\b.*$|"
    r"\bJob Tags\b.*$|"
    r"\bApply for Job\b.*?\bBack to all jobs\b.*$|"
    r"\bSponsors\b\s*$",
    re.I | re.S,
)


def _strip_page_chrome(text: str) -> str:
    # The literal breadcrumb phrase is pure navigation chrome with zero
    # informational value, so it is always safe to drop regardless of what follows.
    text = _LEADING_BACKTO_PHRASE.sub("", text, count=1).strip()
    text = _TRAILING_CHROME.sub("", text).strip()
    with_header_stripped = _LEADING_CHROME.sub("", text, count=1).strip()
    # Only trust the "after Job Description" cut if it left a substantial
    # amount of text; otherwise the header text itself was most of the page.
    if len(with_header_stripped) >= 200:
        text = with_header_stripped
    return text.strip()


def extract_best_description(soup: BeautifulSoup, jsonld: Dict[str, Any]) -> str:
    jsonld_description = normalize_description_text(strip_html(str(jsonld.get("description") or "")))

    # Structured JSON-LD description is authored by the source site to
    # describe just the job. Trust it over a raw container scrape whenever
    # it's substantial, instead of preferring whichever text is *longer*.
    if len(jsonld_description) >= 200:
        return jsonld_description

    page_description = ""
    content_nodes = [
        soup.find("main"),
        soup.find("article"),
        soup.find("div", class_=re.compile(r"description|content|body|job", re.I)),
    ]
    for node in content_nodes:
        if not node:
            continue
        candidate = _strip_page_chrome(normalize_description_text(node.get_text("\n", strip=True)))
        if len(candidate) > len(page_description):
            page_description = candidate

    if len(page_description) >= max(300, len(jsonld_description) + 150):
        return page_description
    if jsonld_description:
        return jsonld_description
    return page_description


def parse_job_detail(session: requests.Session, url: str, listing_hint_date: Optional[date] = None) -> Optional[Dict[str, Any]]:
    soup = fetch_page(session, url)
    if not soup:
        return None

    jsonld = extract_jsonld_jobposting(soup) or {}

    title_elem = soup.find("h1") or soup.find("h2") or soup.find("title")
    title = jsonld.get("title") or (title_elem.get_text(strip=True) if title_elem else "")
    title = re.sub(r"\s*-\s*a11yjobs\.com.*$", "", title, flags=re.I)
    # Some sources double-escape JSON-LD text (e.g. "&amp;" instead of "&").
    # unescape so entities never render literally to job seekers.
    title = re.sub(r"\s*—\s*", " - ", html.unescape(title)).strip()

    company = ""
    hiring_org = jsonld.get("hiringOrganization")
    if isinstance(hiring_org, dict):
        company = hiring_org.get("name") or ""
    if not company:
        company = extract_label_value(soup, r"company") or extract_label_value(soup, r"organization") or ""
    company = html.unescape(company).strip()

    location_text = extract_label_value(soup, r"location") or ""
    jsonld_city = None
    jsonld_region = None
    jsonld_country = None
    job_location = jsonld.get("jobLocation")
    location_candidates = job_location if isinstance(job_location, list) else [job_location]
    for candidate in location_candidates:
        if isinstance(candidate, dict):
            loc = candidate.get("address", {})
            if isinstance(loc, dict):
                jsonld_city = loc.get("addressLocality")
                jsonld_region = loc.get("addressRegion")
                jsonld_country = loc.get("addressCountry")
                if isinstance(jsonld_country, dict):
                    jsonld_country = jsonld_country.get("name")
                location_parts = [loc.get("addressLocality"), loc.get("addressRegion"), jsonld_country]
                parsed_location = ", ".join([str(p) for p in location_parts if isinstance(p, str) and p])
                if parsed_location:
                    location_text = parsed_location
                    break

    employment_raw = jsonld.get("employmentType") or extract_label_value(soup, r"job type") or ""
    if isinstance(employment_raw, list):
        employment_raw = " ".join(employment_raw)
    employment_type = normalize_employment_type(str(employment_raw)) if employment_raw else "full-time"

    date_text = jsonld.get("datePosted") or extract_label_value(soup, r"date posted") or extract_label_value(soup, r"posted")
    date_posted = parse_date_text(str(date_text)) if date_text else None
    if not date_posted and listing_hint_date:
        date_posted = listing_hint_date

    valid_through_text = (
        jsonld.get("validThrough")
        or extract_label_value(soup, r"valid through")
        or extract_label_value(soup, r"application deadline")
        or extract_label_value(soup, r"closing date")
    )
    valid_through = parse_date_text(str(valid_through_text)) if valid_through_text else None

    salary_text = extract_salary_text(soup)

    apply_url = extract_apply_url(soup, url, jsonld)
    description = extract_best_description(soup, jsonld)
    work_arrangement = normalize_work_arrangement(
        location_text,
        title,
        description,
        str(jsonld.get("jobLocationType") or ""),
    )

    # The visible description/responsibilities/requirements DO drop the
    # universal trailing EEO/legal boilerplate because it carries no decision
    # value for someone browsing the board.
    display_description = trim_legal_boilerplate(description)

    sections = parse_description_sections(display_description)
    job_description = sections["description"]
    key_responsibilities = sections["key_responsibilities"]
    requirements = sections["requirements"]
    nice_to_have = sections["nice_to_have"]
    if not job_description:
        # No real description could be recovered. Skip rather than publish
        # fabricated filler text under this job's title/company.
        return None

    job_level = determine_job_level(title, description)

    city, country = parse_location_fields(
        location_text,
        str(jsonld_city) if jsonld_city else None,
        str(jsonld_region) if jsonld_region else None,
        str(jsonld_country) if jsonld_country else None,
    )
    specific_location = None
    if location_text:
        specific_location = location_text

    contact_email = extract_contact_email(description) or None

    salary_min, salary_max, currency, salary_type = parse_jsonld_salary(jsonld)
    if validate_salary(salary_min, salary_max, salary_type):
        salary_min, salary_max, currency, salary_type = None, None, None, None
    if salary_min is None and salary_max is None:
        salary_min, salary_max, currency, salary_type = parse_salary(salary_text)
    if salary_min is None and salary_max is None:
        salary_text = None
    else:
        salary_text = format_salary_evidence(salary_min, salary_max, currency, salary_type)

    structured = extract_structured_fields(description, sections)
    benefits_list = structured["benefits"]
    benefit_flags = structured["benefit_flags"]
    required_skills_list = structured["required_skills"]
    preferred_skills_list = structured["preferred_skills"]
    required_certifications_list = structured["required_certifications"]

    company_website = extract_company_website(soup, hiring_org)

    created_at = f"{date_posted.isoformat()}T00:00:00Z" if date_posted else None
    updated_at = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    job_data = {
        "title": title[:255] if title else None,
        "company": company[:255] if company else None,
        "company_website": company_website,
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
        "years_experience": structured["years_experience"],
        "education_level": structured["education_level"],
        "required_certifications": json.dumps(required_certifications_list, ensure_ascii=False) if required_certifications_list else None,
        "preferred_certifications": None,
        "required_skills": json.dumps(required_skills_list[:15], ensure_ascii=False) if required_skills_list else None,
        "preferred_skills": json.dumps(preferred_skills_list[:15], ensure_ascii=False) if preferred_skills_list else None,
        "wcag_level": structured["wcag_level"],
        "accessibility_focus": json.dumps(structured["accessibility_focus"], ensure_ascii=False) if structured["accessibility_focus"] else None,
        "assistive_tech_experience": json.dumps(structured["assistive_tech_experience"], ensure_ascii=False) if structured["assistive_tech_experience"] else None,
        "description": job_description,
        "key_responsibilities": key_responsibilities,
        "requirements": requirements,
        "nice_to_have": nice_to_have,
        "benefits": json.dumps(benefits_list, ensure_ascii=False) if benefits_list else None,
        "professional_development": benefit_flags.get("professional_development"),
        "health_insurance": benefit_flags.get("health_insurance"),
        "retirement": benefit_flags.get("retirement"),
        "pto_details": None,
        "contact_email": contact_email,
        "application_deadline": f"{valid_through.isoformat()}T00:00:00Z" if valid_through else None,
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
        "status": "approved",
        "created_at": created_at,
        "updated_at": updated_at,
        "date_posted": date_posted.isoformat() if date_posted else None,
        "apply_url": apply_url,
        "valid_through": valid_through.isoformat() if valid_through else None,
    }

    return job_data


def is_missing_value(value: Any) -> bool:
    if value is None:
        return True
    if isinstance(value, str):
        return not value.strip() or value.strip().lower() in {"nan", "none", "null", "nat"}
    try:
        return bool(value != value)
    except Exception:
        return False


def clean_optional_text(value: Any) -> Optional[str]:
    if is_missing_value(value):
        return None
    return html.unescape(str(value)).strip()


def safe_number(value: Any) -> Optional[int]:
    if is_missing_value(value):
        return None
    try:
        return int(round(float(value)))
    except (TypeError, ValueError, OverflowError):
        return None


def hostname_without_www(url: Optional[str]) -> str:
    if not url or not url_is_valid(url):
        return ""
    return (urlparse(url).hostname or "").lower().removeprefix("www.")


def is_job_board_url(url: Optional[str]) -> bool:
    hostname = hostname_without_www(url)
    return any(hostname == host or hostname.endswith("." + host) for host in JOB_BOARD_HOSTS)


def is_direct_job_url(url: Optional[str]) -> bool:
    return bool(url and url_is_valid(url) and not is_job_board_url(url))


def accessibility_relevance_score(title: str, description: str) -> int:
    title_lower = title.lower()
    description_lower = description.lower()
    title_markers = [
        "accessibility", "a11y", "wcag", "section 508", "inclusive design",
        "assistive technology", "digital inclusion",
    ]
    description_markers = [
        "accessibility", "a11y", "wcag", "aria", "section 508",
        "screen reader", "assistive technology", "inclusive design",
        "accessibility testing", "accessibility audit", "accessibility remediation",
    ]
    title_hits = sum(1 for marker in title_markers if marker in title_lower)
    description_hits = sum(1 for marker in description_markers if marker in description_lower)
    return title_hits * 5 + min(description_hits, 8)


def is_accessibility_focused_job(title: str, description: str) -> bool:
    title_lower = title.lower()
    strong_title = bool(re.search(
        r"\b(?:accessibility|a11y|wcag|section\s*508|inclusive\s+design|assistive\s+technology|digital\s+inclusion)\b",
        title_lower,
    ))
    return strong_title or accessibility_relevance_score(title, description) >= 4


def jobspy_record_to_job(raw: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    title = clean_optional_text(raw.get("title")) or ""
    company = clean_optional_text(raw.get("company")) or ""
    description = normalize_description_text(clean_optional_text(raw.get("description")) or "")
    description = trim_legal_boilerplate(description)
    if not title or not company or len(_plain_markdown(description)) < 100:
        return None
    if not is_accessibility_focused_job(title, description):
        return None

    source = (clean_optional_text(raw.get("site")) or "jobspy").lower().replace("ziprecruiter", "zip_recruiter")
    discovery_url = clean_optional_text(raw.get("job_url"))
    direct_url = clean_optional_text(raw.get("job_url_direct"))
    if not is_direct_job_url(direct_url):
        direct_url = None
    source_url = direct_url or discovery_url
    if not source_url or not url_is_valid(source_url):
        return None

    location_text = clean_optional_text(raw.get("location")) or ""
    city, country = parse_location_fields(location_text)
    is_remote = bool(raw.get("is_remote")) if not is_missing_value(raw.get("is_remote")) else False
    work_arrangement = normalize_work_arrangement(
        location_text,
        title,
        description,
        "TELECOMMUTE" if is_remote else "",
    )

    job_type = (clean_optional_text(raw.get("job_type")) or "").lower()
    employment_map = {
        "fulltime": "full-time",
        "full-time": "full-time",
        "parttime": "part-time",
        "part-time": "part-time",
        "contract": "contract",
        "temporary": "freelance",
        "internship": "internship",
    }
    employment_type = employment_map.get(job_type, normalize_employment_type(job_type))

    date_text = clean_optional_text(raw.get("date_posted"))
    date_posted = parse_date_text(date_text) if date_text else None
    if not date_posted:
        return None

    salary_min = safe_number(raw.get("min_amount"))
    salary_max = safe_number(raw.get("max_amount"))
    salary_type = {
        "yearly": "annual",
        "annual": "annual",
        "monthly": "monthly",
        "weekly": "weekly",
        "daily": "daily",
        "hourly": "hourly",
    }.get((clean_optional_text(raw.get("interval")) or "").lower())
    currency = (clean_optional_text(raw.get("currency")) or "").upper() or None
    if validate_salary(salary_min, salary_max, salary_type):
        salary_min, salary_max, currency, salary_type = None, None, None, None

    sections = parse_description_sections(description)
    if not sections.get("description"):
        return None
    structured = extract_structured_fields(description, sections)
    benefit_flags = structured["benefit_flags"]

    company_website = clean_optional_text(raw.get("company_url_direct"))
    if not is_direct_job_url(company_website):
        candidate_company_url = clean_optional_text(raw.get("company_url"))
        company_website = candidate_company_url if is_direct_job_url(candidate_company_url) else None

    email_value = raw.get("emails")
    if isinstance(email_value, (list, tuple)):
        contact_email = next((clean_optional_text(item) for item in email_value if clean_optional_text(item)), None)
    else:
        contact_email = clean_optional_text(email_value)
    if not contact_email:
        contact_email = extract_contact_email(description)
    if contact_email and not valid_email(contact_email):
        contact_email = None

    salary_range = format_salary_evidence(salary_min, salary_max, currency, salary_type)
    created_at = f"{date_posted.isoformat()}T00:00:00Z"
    updated_at = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    return {
        "title": title[:255],
        "company": company[:255],
        "company_website": company_website,
        "company_size": clean_optional_text(raw.get("company_num_employees")),
        "industry": clean_optional_text(raw.get("company_industry")),
        "job_level": determine_job_level(title, description),
        "employment_type": employment_type,
        "department": clean_optional_text(raw.get("job_function")),
        "work_arrangement": work_arrangement,
        "timezone": None,
        "country": country,
        "city": city,
        "specific_location": location_text or None,
        "relocation_assistance": None,
        "salary_min": salary_min,
        "salary_max": salary_max,
        "currency": currency,
        "salary_type": salary_type,
        "equity_offered": None,
        "bonus_structure": None,
        "years_experience": structured["years_experience"],
        "education_level": structured["education_level"],
        "required_certifications": json.dumps(structured["required_certifications"], ensure_ascii=False) if structured["required_certifications"] else None,
        "preferred_certifications": None,
        "required_skills": json.dumps(structured["required_skills"][:15], ensure_ascii=False) if structured["required_skills"] else None,
        "preferred_skills": json.dumps(structured["preferred_skills"][:15], ensure_ascii=False) if structured["preferred_skills"] else None,
        "wcag_level": structured["wcag_level"],
        "accessibility_focus": json.dumps(structured["accessibility_focus"], ensure_ascii=False) if structured["accessibility_focus"] else None,
        "assistive_tech_experience": json.dumps(structured["assistive_tech_experience"], ensure_ascii=False) if structured["assistive_tech_experience"] else None,
        "description": sections["description"],
        "key_responsibilities": sections["key_responsibilities"],
        "requirements": sections["requirements"],
        "nice_to_have": sections["nice_to_have"],
        "benefits": json.dumps(structured["benefits"], ensure_ascii=False) if structured["benefits"] else None,
        "professional_development": benefit_flags.get("professional_development"),
        "health_insurance": benefit_flags.get("health_insurance"),
        "retirement": benefit_flags.get("retirement"),
        "pto_details": None,
        "contact_email": contact_email,
        "application_deadline": None,
        "expected_start_date": None,
        "visa_sponsorship": None,
        "security_clearance": None,
        "travel_required": None,
        "additional_notes": f"discovered_via={source}",
        "location": location_text or None,
        "type": work_arrangement,
        "salary_range": salary_range,
        "job_source": source,
        "source_url": source_url,
        "status": "approved",
        "created_at": created_at,
        "updated_at": updated_at,
        "date_posted": date_posted.isoformat(),
        "apply_url": direct_url,
        "valid_through": None,
        "_discovery_url": discovery_url,
        "_market": clean_optional_text(raw.get("_market")),
        "relevance_score": accessibility_relevance_score(title, description),
    }


def scrape_jobspy_jobs(cutoff_date: date) -> Tuple[List[Dict[str, Any]], Dict[str, Any]]:
    try:
        from jobspy import scrape_jobs
    except ImportError as exc:
        return [], {"status": "unavailable", "error": f"python-jobspy is not installed: {exc}"}

    results_per_source = max(1, int(os.getenv("MULTISOURCE_RESULTS_PER_SOURCE", "6")))
    requested_sources = [
        source.strip() for source in os.getenv("MULTISOURCE_SOURCES", ",".join(JOBSPY_SOURCES)).split(",")
        if source.strip() in SUPPORTED_JOBSPY_SOURCES
    ]
    requested_terms = [
        term.strip() for term in os.getenv("MULTISOURCE_SEARCH_TERMS", "|".join(JOBSPY_SEARCH_TERMS)).split("|")
        if term.strip()
    ]
    requested_market_names = {
        market.strip().lower() for market in os.getenv(
            "MULTISOURCE_MARKETS",
            "|".join(location for location, _ in JOBSPY_MARKETS),
        ).split("|") if market.strip()
    }
    requested_markets = [
        market for market in JOBSPY_MARKETS if market[0].lower() in requested_market_names
    ]
    if not requested_sources or not requested_terms or not requested_markets:
        return [], {"status": "failed", "error": "Multi-source configuration selected no sources, terms, or markets"}
    today_utc = datetime.now(timezone.utc).date()
    hours_old = min(720, max(48, ((today_utc - cutoff_date).days + 2) * 24))
    raw_rows: List[Dict[str, Any]] = []
    errors: List[str] = []

    for location, indeed_country in requested_markets:
        for search_term in requested_terms:
            try:
                frame = scrape_jobs(
                    site_name=requested_sources,
                    search_term=search_term,
                    google_search_term=f"{search_term} jobs in {location} since {cutoff_date.isoformat()}",
                    location=location,
                    results_wanted=results_per_source,
                    hours_old=hours_old,
                    country_indeed=indeed_country,
                    description_format="markdown",
                    linkedin_fetch_description=True,
                    verbose=0,
                )
            except Exception as exc:
                errors.append(f"{location} | {search_term} | {type(exc).__name__}: {exc}")
                continue
            if frame is None or frame.empty:
                continue
            for row in frame.to_dict("records"):
                row["_market"] = location
                raw_rows.append(row)

    seen_urls = set()
    mapped_jobs: List[Dict[str, Any]] = []
    rejected_irrelevant = 0
    raw_source_counts = dict(sorted(Counter(
        (clean_optional_text(row.get("site")) or "unknown").lower().replace("ziprecruiter", "zip_recruiter")
        for row in raw_rows
    ).items()))
    for row in raw_rows:
        row_url = clean_optional_text(row.get("job_url_direct")) or clean_optional_text(row.get("job_url"))
        if row_url and row_url in seen_urls:
            continue
        if row_url:
            seen_urls.add(row_url)
        mapped = jobspy_record_to_job(row)
        if mapped:
            mapped_jobs.append(mapped)
        else:
            rejected_irrelevant += 1

    source_counts = dict(sorted(Counter(job.get("job_source") or "unknown" for job in mapped_jobs).items()))
    source_health = {
        source: "returned_rows" if raw_source_counts.get(source, 0) else "no_results_or_blocked"
        for source in requested_sources
    }
    return mapped_jobs, {
        "status": "completed" if mapped_jobs or not errors else "failed",
        "raw_rows": len(raw_rows),
        "mapped_accessibility_jobs": len(mapped_jobs),
        "rejected_or_invalid": rejected_irrelevant,
        "raw_source_counts": raw_source_counts,
        "sources_requested": requested_sources,
        "markets_requested": [location for location, _ in requested_markets],
        "search_terms": requested_terms,
        "source_counts": source_counts,
        "source_health": source_health,
        "errors": errors[:20],
    }


def candidate_quality_score(job: Dict[str, Any]) -> int:
    score = 100 - SOURCE_PRIORITY.get(str(job.get("job_source") or ""), 20)
    if is_direct_job_url(job.get("source_url")):
        score += 100
    if job.get("company_website"):
        score += 15
    if job.get("salary_min") is not None and job.get("salary_max") is not None:
        score += 10
    if job.get("specific_location") and job.get("country"):
        score += 10
    score += min(30, len(_plain_markdown(job.get("description") or "")) // 250)
    score += int(job.get("relevance_score") or 0)
    return score


def consolidate_source_candidates(jobs: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
    groups: Dict[str, List[Dict[str, Any]]] = {}
    for job in jobs:
        key = f"{normalize_text(job.get('title') or '')}::{normalize_text(job.get('company') or '')}"
        groups.setdefault(key, []).append(job)

    consolidated: List[Dict[str, Any]] = []
    duplicates: List[Dict[str, Any]] = []
    for group in groups.values():
        ranked = sorted(group, key=candidate_quality_score, reverse=True)
        winner = dict(ranked[0])
        evidence: List[Dict[str, str]] = []
        seen_evidence = set()
        for item in ranked:
            source = str(item.get("job_source") or "unknown")
            url = str(item.get("_discovery_url") or item.get("source_url") or "")
            evidence_key = (source, url)
            if evidence_key not in seen_evidence:
                seen_evidence.add(evidence_key)
                evidence.append({"source": source, "url": url})
        unique_sources = sorted({item["source"] for item in evidence})
        winner["source_evidence"] = evidence
        winner["evidence_source_count"] = len(unique_sources)
        evidence_note = "source_evidence=" + json.dumps(evidence, ensure_ascii=True, separators=(",", ":"))
        existing_note = winner.get("additional_notes")
        winner["additional_notes"] = f"{existing_note}; {evidence_note}" if existing_note else evidence_note
        winner.pop("_market", None)
        winner.pop("_discovery_url", None)
        consolidated.append(winner)

        for duplicate in ranked[1:]:
            duplicates.append({
                "source_url": duplicate.get("source_url") or "",
                "title": duplicate.get("title") or "",
                "company": duplicate.get("company") or "",
                "reason": "cross_source_title_company",
                "kept_source": winner.get("job_source") or "",
                "duplicate_source": duplicate.get("job_source") or "",
            })

    consolidated.sort(key=candidate_quality_score, reverse=True)
    return consolidated, duplicates


def external_content_matches_job(content: str, job: Dict[str, Any]) -> bool:
    plain = _plain_markdown(content).lower()
    title_tokens = [
        token for token in re.findall(r"[a-z0-9]+", (job.get("title") or "").lower())
        if len(token) >= 4 and token not in {"with", "from", "that", "this", "senior", "junior"}
    ]
    title_matches = sum(1 for token in set(title_tokens) if token in plain)
    required_title_matches = 1 if len(set(title_tokens)) <= 2 else 2
    company_tokens = [
        token for token in re.findall(r"[a-z0-9]+", (job.get("company") or "").lower())
        if len(token) >= 3 and token not in {"the", "and", "inc", "llc", "ltd"}
    ]
    company_matches = not company_tokens or any(token in plain for token in set(company_tokens))
    return title_matches >= required_title_matches and company_matches


def extract_external_jobposting(content: str) -> Optional[Dict[str, Any]]:
    """Return direct-page JobPosting data without trusting visible page chrome."""
    if not content or not re.search(r"<script|@type", content, re.I):
        return None
    return extract_jsonld_jobposting(BeautifulSoup(content, "html.parser"))


def external_content_has_job_detail(
    content: str,
    jsonld: Optional[Dict[str, Any]] = None,
) -> bool:
    """Distinguish a job description from a login/application form shell."""
    structured_description = ""
    if jsonld:
        structured_description = normalize_description_text(
            strip_html(html.unescape(str(jsonld.get("description") or "")))
        )
    if len(_plain_markdown(structured_description)) >= 100:
        return True

    visible = normalize_external_content(content)
    lowered = visible.lower()
    shell_markers = (
        "begin application",
        "new applicants:",
        "existing applicants:",
        "email address:",
        "forgot password",
        "sign in to apply",
    )
    detail_markers = (
        "responsibilities",
        "qualifications",
        "requirements",
        "job summary",
        "position overview",
        "what you'll do",
        "what you’ll do",
        "experience required",
        "wcag",
        "section 508",
    )
    detail_count = sum(1 for marker in detail_markers if marker in lowered)
    if any(marker in lowered for marker in shell_markers) and detail_count < 2:
        return False
    return len(_plain_markdown(visible)) >= 300 and detail_count >= 2


def reconcile_external_jobposting(job: Dict[str, Any], jsonld: Dict[str, Any]) -> List[str]:
    """Prefer explicit employer/ATS JobPosting facts and report disagreements."""
    conflicts: List[str] = []
    external_title = clean_text(html.unescape(str(jsonld.get("title") or "")))
    current_title = clean_text(str(job.get("title") or ""))
    employment_raw = jsonld.get("employmentType")
    if isinstance(employment_raw, list):
        employment_raw = " ".join(str(value) for value in employment_raw)
    employment_text = clean_text(str(employment_raw or ""))

    if external_title and current_title:
        current_norm = normalize_text(current_title)
        external_norm = normalize_text(external_title)
        if current_norm not in external_norm and external_norm not in current_norm:
            current_tokens = set(re.findall(r"[a-z0-9]+", current_title.lower()))
            external_tokens = set(re.findall(r"[a-z0-9]+", external_title.lower()))
            overlap = len(current_tokens & external_tokens) / max(1, len(current_tokens | external_tokens))
            if overlap < 0.5:
                conflicts.append(
                    f"Direct title disagrees with source title: {external_title}"
                )

    if re.search(r"\b(?:p\s*/\s*t|part[ -]?time|1099)\b", external_title, re.I) and re.search(
        r"\bfull[ -]?time\b", employment_text, re.I
    ):
        conflicts.append("Direct title says part-time/1099 but structured employmentType says full-time")

    if conflicts:
        return conflicts

    description = normalize_description_text(
        strip_html(html.unescape(str(jsonld.get("description") or "")))
    )
    if employment_text:
        job["employment_type"] = normalize_employment_type(employment_text)
        job["type"] = job["employment_type"]

    job["work_arrangement"] = normalize_work_arrangement(
        str(job.get("location") or ""),
        external_title or current_title,
        description,
        str(jsonld.get("jobLocationType") or ""),
    )

    job_location = jsonld.get("jobLocation")
    locations = job_location if isinstance(job_location, list) else [job_location]
    for location in locations:
        if not isinstance(location, dict):
            continue
        address = location.get("address")
        if not isinstance(address, dict):
            continue
        locality = clean_optional_text(address.get("addressLocality"))
        region = clean_optional_text(address.get("addressRegion"))
        country_value = address.get("addressCountry")
        if isinstance(country_value, dict):
            country_value = country_value.get("name")
        country_text = clean_optional_text(country_value)
        parts = [part for part in (locality, region, country_text) if part]
        if parts:
            location_text = ", ".join(parts)
            city, country = parse_location_fields(location_text, locality, region, country_text)
            job["location"] = location_text
            job["specific_location"] = location_text
            job["city"] = city
            job["country"] = country
        break

    salary_min, salary_max, currency, salary_type = parse_jsonld_salary(jsonld)
    if not validate_salary(salary_min, salary_max, salary_type) and currency in CURRENCIES:
        # Do not replace a complete range with a single structured amount.
        if salary_min != salary_max or not (job.get("salary_min") or job.get("salary_max")):
            job["salary_min"] = salary_min
            job["salary_max"] = salary_max
            job["currency"] = currency
            job["salary_type"] = salary_type
            job["salary_range"] = format_salary_evidence(
                salary_min, salary_max, currency, salary_type
            )

    posted = parse_date_text(str(jsonld.get("datePosted") or ""))
    if posted:
        job["date_posted"] = posted.isoformat()
        job["created_at"] = f"{posted.isoformat()}T00:00:00Z"

    valid_through = parse_date_text(str(jsonld.get("validThrough") or ""))
    if valid_through:
        job["valid_through"] = valid_through.isoformat()
        job["application_deadline"] = f"{valid_through.isoformat()}T00:00:00Z"

    return conflicts


def enrich_job(session: requests.Session, job: Dict[str, Any]) -> Dict[str, Any]:
    apply_url = job.get("apply_url")
    content = ""
    source_used = "none"

    if apply_url:
        text, source_used, resolved_url = fetch_external_text(session, apply_url)
        if text and external_content_matches_job(text, job):
            content = text
            evidence_url = resolved_url or apply_url
            job["apply_url"] = evidence_url
            job["direct_evidence_verified"] = is_direct_job_url(evidence_url)
        elif text:
            source_used = "mismatch"

    if not content:
        links = search_alternate_urls(session, job.get("title") or "", job.get("company") or "")
        for link in links:
            text, source_used, resolved_url = fetch_external_text(session, link)
            if text and external_content_matches_job(text, job):
                content = text
                evidence_url = resolved_url or link
                if not apply_url:
                    job["apply_url"] = evidence_url
                job["direct_evidence_verified"] = is_direct_job_url(evidence_url)
                break
            if text:
                source_used = "mismatch"

    if content:
        external_jsonld = extract_external_jobposting(content)
        conflicts = reconcile_external_jobposting(job, external_jsonld) if external_jsonld else []
        if conflicts:
            job["evidence_conflicts"] = conflicts
            job["direct_evidence_verified"] = False

        has_job_detail = external_content_has_job_detail(content, external_jsonld)
        structured_description = ""
        if external_jsonld:
            structured_description = normalize_description_text(
                strip_html(html.unescape(str(external_jsonld.get("description") or "")))
            )
        content = structured_description if len(_plain_markdown(structured_description)) >= 100 else normalize_external_content(content)
        external_sections = parse_description_sections(content)
        if has_job_detail and (
            not job.get("description")
            or len(job.get("description") or "") < 100
            or len(job.get("key_responsibilities") or "") < 50
            or len(job.get("requirements") or "") < 50
            or is_placeholder_section(job.get("key_responsibilities"))
            or is_placeholder_section(job.get("requirements"))
        ):
            if external_sections.get("description"):
                job["description"] = external_sections["description"]
                job["key_responsibilities"] = external_sections["key_responsibilities"]
                job["requirements"] = external_sections["requirements"]
                job["nice_to_have"] = external_sections["nice_to_have"]
        if not job.get("contact_email"):
            job["contact_email"] = extract_contact_email(content)
        if not job.get("salary_range"):
            salary_min, salary_max, currency, salary_type = parse_salary(content)
            if salary_min or salary_max:
                job["salary_min"] = salary_min
                job["salary_max"] = salary_max
                job["currency"] = currency
                job["salary_type"] = salary_type
        structured = extract_structured_fields(content, external_sections)
        if not job.get("benefits"):
            benefits_list = structured["benefits"]
            benefit_flags = structured["benefit_flags"]
            job["benefits"] = json.dumps(benefits_list, ensure_ascii=False) if benefits_list else None
            if benefit_flags.get("health_insurance") and not job.get("health_insurance"):
                job["health_insurance"] = True
            if benefit_flags.get("retirement") and not job.get("retirement"):
                job["retirement"] = True
            if benefit_flags.get("professional_development") and not job.get("professional_development"):
                job["professional_development"] = True
        if not job.get("required_skills"):
            items = structured["required_skills"]
            preferred_items = structured["preferred_skills"]
            job["required_skills"] = json.dumps(items[:15], ensure_ascii=False) if items else None
            if preferred_items:
                job["preferred_skills"] = json.dumps(preferred_items[:15], ensure_ascii=False)
        if not job.get("required_certifications"):
            certs = structured["required_certifications"]
            job["required_certifications"] = json.dumps(certs, ensure_ascii=False) if certs else None
        if not job.get("years_experience"):
            job["years_experience"] = structured["years_experience"]
        if not job.get("education_level"):
            job["education_level"] = structured["education_level"]
        if not job.get("wcag_level"):
            job["wcag_level"] = structured["wcag_level"]
        if not job.get("accessibility_focus") and structured["accessibility_focus"]:
            job["accessibility_focus"] = json.dumps(structured["accessibility_focus"], ensure_ascii=False)
        if not job.get("assistive_tech_experience") and structured["assistive_tech_experience"]:
            job["assistive_tech_experience"] = json.dumps(structured["assistive_tech_experience"], ensure_ascii=False)

    if "direct_evidence_verified" not in job:
        job["direct_evidence_verified"] = False
    if source_used != "none":
        enrichment_note = f"enrichment_source={source_used}"
        existing_note = job.get("additional_notes")
        job["additional_notes"] = f"{existing_note}; {enrichment_note}" if existing_note else enrichment_note
    return job


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


def enforce_varchar_limits(record: Dict[str, Any]) -> Dict[str, Any]:
    constrained: Dict[str, Any] = {}
    for key, value in record.items():
        limit = VARCHAR_LIMITS.get(key)
        if limit and isinstance(value, str) and len(value) > limit:
            constrained[key] = value[:limit]
        else:
            constrained[key] = value
    return constrained


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

    if len(_plain_markdown(description)) < 100:
        errors.append("Description too short")
    if len(_plain_markdown(key_resp)) < 50:
        errors.append("Key responsibilities too short")
    if len(_plain_markdown(requirements)) < 50:
        errors.append("Requirements too short")

    for field_name, value in [("key_responsibilities", key_resp), ("requirements", requirements)]:
        if is_placeholder_section(value):
            errors.append(f"{field_name} is placeholder text")
            continue
        plain_value = _plain_markdown(value)
        if re.match(r"^(?:[,;:]|to apply\b|and\s+|or\s+)", plain_value, re.I):
            errors.append(f"{field_name} starts mid-sentence")

    for field_name in [
        "required_skills", "preferred_skills", "required_certifications",
        "preferred_certifications", "accessibility_focus", "assistive_tech_experience", "benefits",
    ]:
        raw_value = record.get(field_name)
        if not raw_value:
            continue
        try:
            parsed_value = json.loads(raw_value) if isinstance(raw_value, str) else raw_value
        except (TypeError, json.JSONDecodeError):
            errors.append(f"{field_name} is not valid JSON")
            continue
        if not isinstance(parsed_value, list) or any(not isinstance(item, str) for item in parsed_value):
            errors.append(f"{field_name} must be a JSON string array")
            continue
        if field_name in {"required_skills", "preferred_skills"} and any(len(item) > 80 for item in parsed_value):
            errors.append(f"{field_name} contains sentence-sized item")

    if description and not description_is_clean(description):
        errors.append("Description contains junk text")

    if record.get("contact_email") and not valid_email(record["contact_email"]):
        errors.append("Invalid contact_email")

    if not record.get("source_url") and not record.get("contact_email"):
        errors.append("Missing application route")

    if "source_evidence" in record:
        evidence_count = int(record.get("evidence_source_count") or 0)
        if not record.get("direct_evidence_verified") and evidence_count < 2:
            errors.append("Job lacks verified direct employer evidence or two independent sources")

    for conflict in record.get("evidence_conflicts") or []:
        errors.append(f"Source evidence conflict: {conflict}")

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


def write_csv(path: str, rows: List[Dict[str, Any]], headers: List[str]) -> int:
    with open(path, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()
        for row in rows:
            writer.writerow({h: row.get(h, "") for h in headers})
    return len(rows)


def process_candidate_job(job: Dict[str, Any]) -> Tuple[Dict[str, Any], Optional[Dict[str, Any]], Optional[Dict[str, Any]]]:
    local_session = requests.Session()
    local_session.headers.update(HEADERS)

    job = enrich_job(local_session, dict(job))

    candidate = build_candidate_record(job)
    insert_candidate = convert_nan_to_insert_ready(candidate)
    validation_errors = validate_record(insert_candidate)

    if validation_errors:
        failure = {
            "source_url": insert_candidate.get("source_url") or "",
            "title": insert_candidate.get("title") or "",
            "company": insert_candidate.get("company") or "",
            "errors": validation_errors,
        }
        return candidate, None, failure

    return candidate, insert_candidate, None


def main() -> int:
    db_url = load_database_url()
    print(f"🔐 Using DATABASE_URL: {mask_db_url(db_url)}")

    session = requests.Session()
    session.headers.update(HEADERS)

    cutoff_date = fetch_cutoff_date(db_url)
    cutoff_override = os.getenv("A11YJOBS_CUTOFF_OVERRIDE")
    if cutoff_override:
        parsed_override = parse_date_text(cutoff_override)
        if parsed_override:
            cutoff_date = parsed_override
            print(f"📅 cutoff_date_override_applied: {cutoff_date.isoformat()}")
        else:
            print(f"⚠️ Ignoring invalid A11YJOBS_CUTOFF_OVERRIDE: {cutoff_override}")
    print(f"📅 cutoff_date: {cutoff_date.isoformat()}")

    today_utc = datetime.now(timezone.utc).date()
    source_errors: List[str] = []
    soup = fetch_page(session, LIST_URL)
    job_link_hints: Dict[str, Optional[date]] = {}
    if soup:
        job_link_hints = extract_job_link_hints(soup, today_utc)

        next_link = soup.find("a", attrs={"rel": "next"})
        page_count = 1
        while next_link and page_count < 5:
            next_url = urljoin(BASE_URL, next_link.get("href", ""))
            next_soup = fetch_page(session, next_url)
            if not next_soup:
                source_errors.append(f"a11yjobs page {page_count + 1} could not be fetched")
                break
            next_hints = extract_job_link_hints(next_soup, today_utc)
            for link, hint_date in next_hints.items():
                if link not in job_link_hints or (job_link_hints[link] is None and hint_date is not None):
                    job_link_hints[link] = hint_date
            next_link = next_soup.find("a", attrs={"rel": "next"})
            page_count += 1
    else:
        source_errors.append("a11yjobs listing page could not be fetched")

    job_links = sorted(job_link_hints.keys())
    links_after_listing_prefilter = [
        link for link in job_links
        if job_link_hints.get(link) is None or job_link_hints[link] > cutoff_date
    ]

    a11yjobs_jobs: List[Dict[str, Any]] = []
    for link in links_after_listing_prefilter:
        job = parse_job_detail(session, link, listing_hint_date=job_link_hints.get(link))
        if job:
            a11yjobs_jobs.append(job)
        time.sleep(0.2)

    print("🔎 Collecting additional job boards with JobSpy")
    jobspy_jobs, jobspy_report = scrape_jobspy_jobs(cutoff_date)
    source_errors.extend(jobspy_report.get("errors") or [])
    if not soup and jobspy_report.get("status") in {"failed", "unavailable"}:
        raise RuntimeError("All source families failed before candidate generation")

    raw_jobs = a11yjobs_jobs + jobspy_jobs
    source_counts_found = dict(sorted(Counter(job.get("job_source") or "unknown" for job in raw_jobs).items()))

    latest_source_date = None
    for job in raw_jobs:
        if job.get("date_posted"):
            dp = parse_date_text(job["date_posted"])
            if dp and (latest_source_date is None or dp > latest_source_date):
                latest_source_date = dp

    if latest_source_date:
        print(f"📌 latest_source_date: {latest_source_date.isoformat()}")
    else:
        print("📌 latest_source_date: NaN")

    newer_source_jobs = [
        job for job in raw_jobs
        if job.get("date_posted") and parse_date_text(job["date_posted"]) and parse_date_text(job["date_posted"]) > cutoff_date
    ]
    source_counts_newer = dict(sorted(Counter(job.get("job_source") or "unknown" for job in newer_source_jobs).items()))
    new_jobs, cross_source_duplicates = consolidate_source_candidates(newer_source_jobs)

    os.makedirs(OUTPUT_DIR, exist_ok=True)

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

    if not new_jobs:
        write_json(CANDIDATES_JSON, {
            "cutoff_date": cutoff_date.isoformat(),
            "latest_source_date": latest_source_date.isoformat() if latest_source_date else None,
            "source_counts_found": source_counts_found,
            "source_counts_newer": source_counts_newer,
            "jobspy_report": jobspy_report,
            "source_errors": source_errors,
            "jobs": [],
        })
        write_json(INSERT_READY_JSON, {
            "cutoff_date": cutoff_date.isoformat(),
            "latest_source_date": latest_source_date.isoformat() if latest_source_date else None,
            "source_counts_found": source_counts_found,
            "source_counts_newer": source_counts_newer,
            "jobs": [],
        })
        write_csv(CANDIDATES_CSV, [], csv_headers)

        total_after = fetch_total_count(db_url)
        print("\nFinal Report")
        print(f"cutoff_date: {cutoff_date.isoformat()}")
        print(f"a11yjobs_links_found: {len(job_links)}")
        print(f"a11yjobs_links_after_listing_prefilter: {len(links_after_listing_prefilter)}")
        print(f"source_counts_found: {json.dumps(source_counts_found, sort_keys=True)}")
        print(f"source_counts_newer: {json.dumps(source_counts_newer, sort_keys=True)}")
        print(f"jobspy_report: {json.dumps(jobspy_report, sort_keys=True)}")
        print(f"source_errors: {len(source_errors)}")
        print(f"filtered_newer_jobs: 0")
        print("deduped_candidates: 0")
        print("duplicates_removed: 0")
        print("validation_failures: 0")
        print("pre_insert_tests: PASS")
        print("inserted: 0")
        print("skipped_duplicates: 0")
        print("errors: 0")
        print(f"db_total_after: {total_after}")
        print("post_insert_tests: PASS")
        print("output_files:")
        print(f"- {CANDIDATES_JSON}")
        print(f"- {INSERT_READY_JSON}")
        print(f"- {CANDIDATES_CSV}")
        print("✅ No new jobs after cutoff. Exiting.")
        return 0

    candidates_with_nan: List[Dict[str, Any]] = []
    insert_ready: List[Dict[str, Any]] = []
    failures: List[Dict[str, Any]] = []
    duplicates: List[Dict[str, Any]] = list(cross_source_duplicates)

    seen_source_urls = set()

    jobs_for_enrichment: List[Dict[str, Any]] = []

    for job in new_jobs:
        source_url = job.get("source_url") or ""
        title = job.get("title") or ""
        company = job.get("company") or ""
        if source_url in seen_source_urls:
            duplicates.append({
                "source_url": source_url,
                "title": title,
                "company": company,
                "reason": "batch_source_url",
            })
            continue

        try:
            is_dup, dup_reason = check_duplicate_db(db_url, source_url, title, company)
        except Exception as exc:
            failures.append({
                "source_url": source_url,
                "title": title,
                "company": company,
                "errors": [f"Duplicate check DB error: {exc}"],
            })
            continue
        if is_dup:
            duplicates.append({
                "source_url": source_url,
                "title": title,
                "company": company,
                "reason": dup_reason,
            })
            continue

        seen_source_urls.add(source_url)
        jobs_for_enrichment.append(job)

    if jobs_for_enrichment:
        max_workers = min(8, len(jobs_for_enrichment))
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_map = {executor.submit(process_candidate_job, job): job for job in jobs_for_enrichment}
            for future in as_completed(future_map):
                candidate, insert_candidate, failure = future.result()
                candidates_with_nan.append(candidate)
                if failure:
                    failures.append(failure)
                elif insert_candidate:
                    insert_ready.append(insert_candidate)

    write_json(CANDIDATES_JSON, {
        "cutoff_date": cutoff_date.isoformat(),
        "latest_source_date": latest_source_date.isoformat() if latest_source_date else None,
        "source_counts_found": source_counts_found,
        "source_counts_newer": source_counts_newer,
        "jobspy_report": jobspy_report,
        "source_errors": source_errors,
        "duplicates": duplicates,
        "validation_failures": failures,
        "jobs": candidates_with_nan,
    })
    csv_row_count = write_csv(CANDIDATES_CSV, candidates_with_nan, csv_headers)

    write_json(INSERT_READY_JSON, {
        "cutoff_date": cutoff_date.isoformat(),
        "latest_source_date": latest_source_date.isoformat() if latest_source_date else None,
        "source_counts_found": source_counts_found,
        "source_counts_newer": source_counts_newer,
        "source_counts_insert_ready": dict(sorted(Counter(row.get("job_source") or "unknown" for row in insert_ready).items())),
        "jobs": insert_ready,
    })

    # Pre-insert tests
    preflight_errors = []
    if any(not row.get(field) for row in insert_ready for field in REQUIRED_FIELDS):
        preflight_errors.append("Missing required fields in insert_ready")

    if any(parse_date_text(row.get("date_posted") or "") and parse_date_text(row.get("date_posted")) <= cutoff_date for row in insert_ready):
        preflight_errors.append("Found datePosted <= cutoff_date")

    if len({row.get("source_url") for row in insert_ready}) != len(insert_ready):
        preflight_errors.append("Duplicate source_url in insert_ready batch")

    if len({f"{normalize_text(row.get('title') or '')}::{normalize_text(row.get('company') or '')}" for row in insert_ready}) != len(insert_ready):
        preflight_errors.append("Duplicate (title, company) in insert_ready batch")

    if len(candidates_with_nan) != csv_row_count:
        preflight_errors.append("Candidate JSON count != CSV row count")

    if preflight_errors:
        print("\n❌ Pre-insert tests failed. No insert performed.")
        for err in preflight_errors:
            print(f"- {err}")
        return 1

    run_id = datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")

    inserted = 0
    skipped_duplicates = 0
    errors = 0
    insert_error_report: List[Dict[str, str]] = []

    total_before = fetch_total_count(db_url)

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

    for job in insert_ready:
        job = enforce_varchar_limits(job)
        source_url = job.get("source_url") or ""
        title = job.get("title") or ""
        company = job.get("company") or ""
        try:
            is_dup, _ = check_duplicate_db(db_url, source_url, title, company)
        except Exception as exc:
            errors += 1
            insert_error_report.append({
                "source_url": source_url,
                "title": title,
                "company": company,
                "error": f"duplicate check failed: {exc}",
            })
            continue
        if is_dup:
            skipped_duplicates += 1
            continue

        notes = job.get("additional_notes")
        if notes:
            notes = f"{notes}; run_id={run_id}"
        else:
            notes = f"run_id={run_id}"
        job["additional_notes"] = notes

        values = [job.get(col) for col in columns]
        values_sql = ", ".join([sql_literal(v) for v in values])
        insert_sql = f"INSERT INTO jobs ({', '.join(columns)}) VALUES ({values_sql});"

        code, _, err = psql_query(db_url, insert_sql)
        if code == 0:
            inserted += 1
        else:
            errors += 1
            insert_error_report.append({
                "source_url": source_url,
                "title": title,
                "company": company,
                "error": err or "unknown insert error",
            })
            print(f"❌ Insert error for {source_url}: {err}")

    total_after = fetch_total_count(db_url)

    # Post-insert tests
    post_errors = []
    if inserted + skipped_duplicates + errors != len(insert_ready):
        post_errors.append("inserted + skipped + errors != candidate_count")

    if total_after - total_before != inserted:
        post_errors.append("DB total row count mismatch")

    run_id_count = psql_scalar(db_url, f"SELECT COUNT(*) FROM jobs WHERE additional_notes LIKE '%run_id={run_id}%';")
    if run_id_count is None or int(run_id_count) != inserted:
        post_errors.append("Run_id count mismatch")

    sample_count = min(10, inserted)
    if sample_count > 0:
        sample_sql = (
            "SELECT COUNT(*) FROM jobs "
            f"WHERE additional_notes LIKE '%run_id={run_id}%' "
            "AND title IS NOT NULL AND company IS NOT NULL "
            "AND employment_type IS NOT NULL AND work_arrangement IS NOT NULL "
            "AND description IS NOT NULL AND key_responsibilities IS NOT NULL "
            "AND requirements IS NOT NULL "
            "AND (source_url IS NOT NULL OR contact_email IS NOT NULL) "
            f"LIMIT {sample_count};"
        )
        sample_ok = psql_scalar(db_url, sample_sql)
        if sample_ok is None or int(sample_ok) < sample_count:
            post_errors.append("Sample inserted rows missing required fields")

    print("\nFinal Report")
    print(f"cutoff_date: {cutoff_date.isoformat()}")
    print(f"latest_source_date: {latest_source_date.isoformat() if latest_source_date else 'NaN'}")
    print(f"a11yjobs_links_found: {len(job_links)}")
    print(f"a11yjobs_links_after_listing_prefilter: {len(links_after_listing_prefilter)}")
    print(f"source_counts_found: {json.dumps(source_counts_found, sort_keys=True)}")
    print(f"source_counts_newer: {json.dumps(source_counts_newer, sort_keys=True)}")
    print(f"source_counts_insert_ready: {json.dumps(dict(sorted(Counter(row.get('job_source') or 'unknown' for row in insert_ready).items())), sort_keys=True)}")
    print(f"source_errors: {len(source_errors)}")
    print(f"filtered_newer_jobs: {len(newer_source_jobs)}")
    print(f"consolidated_candidates: {len(new_jobs)}")
    print(f"deduped_candidates: {len(insert_ready)}")
    print(f"duplicates_removed: {len(duplicates)}")
    print(f"validation_failures: {len(failures)}")
    print("pre_insert_tests: PASS")
    print(f"inserted: {inserted}")
    print(f"skipped_duplicates: {skipped_duplicates}")
    print(f"errors: {errors}")
    if insert_error_report:
        print("insert_error_report:")
        for row in insert_error_report[:20]:
            print(f"- {row['source_url']} | {row['error']}")
        if len(insert_error_report) > 20:
            print(f"- ... {len(insert_error_report) - 20} more errors omitted")
    print(f"db_total_after: {total_after}")
    print(f"post_insert_tests: {'PASS' if not post_errors else 'FAIL'}")
    if post_errors:
        for err in post_errors:
            print(f"- {err}")
    print("output_files:")
    print(f"- {CANDIDATES_JSON}")
    print(f"- {INSERT_READY_JSON}")
    print(f"- {CANDIDATES_CSV}")

    return 0 if not post_errors else 1


if __name__ == "__main__":
    sys.exit(main())

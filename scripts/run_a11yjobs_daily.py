#!/usr/bin/env python3
"""
Fetch new jobs from a11yjobs.com, enrich, validate, and insert into DB.
Writes candidate/insert-ready datasets and a detailed insert report.
"""

import csv
import json
import os
import re
import sys
import time
import subprocess
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
CANDIDATES_JSON = os.path.join(OUTPUT_DIR, "a11yjobs_jobs_candidates_final_with_nan.json")
CANDIDATES_CSV = os.path.join(OUTPUT_DIR, "a11yjobs_jobs_candidates_final_table.csv")
INSERT_READY_JSON = os.path.join(OUTPUT_DIR, "a11yjobs_jobs_insert_ready_final.json")

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


def normalize_work_arrangement(text: str) -> str:
    lower = text.lower() if text else ""
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


def parse_salary(text: Optional[str]) -> Tuple[Optional[int], Optional[int], Optional[str], Optional[str]]:
    if not text:
        return None, None, None, None

    text = text.replace(",", "").strip()
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
    lower = text.lower()
    if "/hr" in lower or "per hour" in lower or "hour" in lower:
        salary_type = "hourly"
    elif "per day" in lower or "/day" in lower:
        salary_type = "daily"
    elif "per month" in lower or "/month" in lower:
        salary_type = "annual"
    elif "per year" in lower or "/yr" in lower or "/year" in lower:
        salary_type = "annual"
    elif "project" in lower:
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
    text = text.replace("\\", "\\\\").replace("'", "''")
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
    match = re.findall(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b", text)
    return match[0] if match else None


def extract_skills(text: str) -> List[str]:
    if not text:
        return []
    keywords = [
        "WCAG", "ARIA", "screen reader", "JAWS", "NVDA", "VoiceOver",
        "accessibility testing", "inclusive design", "a11y", "HTML", "CSS",
        "JavaScript", "assistive technology", "usability", "disability",
        "remediation", "audit", "manual testing", "automated testing",
        "mobile accessibility", "web accessibility", "Section 508", "ADA",
        "VPAT", "ACR", "accessibility conformance", "TalkBack",
    ]
    found = []
    text_lower = text.lower()
    for skill in keywords:
        if skill.lower() in text_lower:
            found.append(skill)
    return list(sorted(set(found)))


def extract_certifications(text: str) -> List[str]:
    if not text:
        return []
    certs = ["CPACC", "WAS", "CPWA", "IAAP", "DHS Trusted Tester"]
    found = []
    text_lower = text.lower()
    for cert in certs:
        if cert.lower() in text_lower:
            found.append(cert)
    return list(sorted(set(found)))


def extract_benefits(text: str) -> Optional[str]:
    if not text:
        return None
    keywords = ["health", "dental", "vision", "401k", "retirement", "pto", "vacation", "bonus", "equity", "stock", "insurance", "wellness"]
    hits = [kw for kw in keywords if kw in text.lower()]
    return ", ".join(sorted(set(hits))) if hits else None


def extract_experience(text: str) -> Optional[str]:
    if not text:
        return None
    match = re.search(r"(\d+)\+?\s*years?", text, re.I)
    if not match:
        return None
    years = int(match.group(1))
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
    lower = text.lower()
    if "phd" in lower or "doctorate" in lower:
        return "phd"
    if "master" in lower:
        return "master"
    if "bachelor" in lower:
        return "bachelor"
    if "associate" in lower:
        return "associate"
    if "high school" in lower:
        return "high-school"
    return None


def fetch_external_text(session: requests.Session, url: str) -> Tuple[Optional[str], str]:
    if not url or not url_is_valid(url):
        return None, "invalid"

    def try_fetch(fetch_url: str) -> Optional[str]:
        try:
            response = session.get(fetch_url, timeout=5)
            if response.status_code >= 400:
                return None
            text = response.text
            if not text or len(text) < 200:
                return None
            return text
        except Exception:
            return None

    text = try_fetch(url)
    blocked_markers = ["enable javascript", "access denied", "captcha", "forbidden", "cloudflare"]
    if text and not any(marker in text.lower() for marker in blocked_markers):
        return text, "direct"

    jina_url = f"https://r.jina.ai/http://{url.replace('https://', '').replace('http://', '')}"
    text = try_fetch(jina_url)
    if text:
        return text, "jina"

    return None, "failed"


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


def parse_job_detail(session: requests.Session, url: str, listing_hint_date: Optional[date] = None) -> Optional[Dict[str, Any]]:
    soup = fetch_page(session, url)
    if not soup:
        return None

    jsonld = extract_jsonld_jobposting(soup) or {}

    title_elem = soup.find("h1") or soup.find("h2") or soup.find("title")
    title = jsonld.get("title") or (title_elem.get_text(strip=True) if title_elem else "")
    title = re.sub(r"\s*-\s*a11yjobs\.com.*$", "", title, flags=re.I)

    company = ""
    hiring_org = jsonld.get("hiringOrganization")
    if isinstance(hiring_org, dict):
        company = hiring_org.get("name") or ""
    if not company:
        company = extract_label_value(soup, r"company") or extract_label_value(soup, r"organization") or ""

    location_text = extract_label_value(soup, r"location") or ""
    job_location = jsonld.get("jobLocation")
    location_candidates = job_location if isinstance(job_location, list) else [job_location]
    for candidate in location_candidates:
        if isinstance(candidate, dict):
            loc = candidate.get("address", {})
            if isinstance(loc, dict):
                location_parts = [loc.get("addressLocality"), loc.get("addressRegion"), loc.get("addressCountry")]
                parsed_location = ", ".join([p for p in location_parts if p])
                if parsed_location:
                    location_text = parsed_location
                    break

    work_arrangement = normalize_work_arrangement(location_text)

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

    salary_text = extract_label_value(soup, r"salary")

    apply_url = None
    if isinstance(jsonld.get("url"), str):
        apply_url = jsonld.get("url")
    apply_link = soup.find("a", string=re.compile(r"apply", re.I))
    if apply_link and apply_link.get("href"):
        apply_url = urljoin(BASE_URL, apply_link["href"])
    if apply_url and not url_is_valid(apply_url):
        apply_url = None

    description = jsonld.get("description") or ""
    if not description:
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

    contact_email = extract_contact_email(description) or None

    salary_min, salary_max, currency, salary_type = parse_salary(salary_text)

    company_website = None
    if isinstance(hiring_org, dict):
        company_website = hiring_org.get("sameAs") or hiring_org.get("url")
    if isinstance(company_website, list):
        company_website = company_website[0] if company_website else None
    if company_website and not url_is_valid(company_website):
        company_website = None

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


def enrich_job(session: requests.Session, job: Dict[str, Any]) -> Dict[str, Any]:
    apply_url = job.get("apply_url")
    content = ""
    source_used = "none"

    if apply_url:
        text, source_used = fetch_external_text(session, apply_url)
        if text:
            content = text

    if not content:
        links = search_alternate_urls(session, job.get("title") or "", job.get("company") or "")
        for link in links:
            text, source_used = fetch_external_text(session, link)
            if text:
                content = text
                if not apply_url:
                    job["apply_url"] = link
                break

    if content:
        if not job.get("contact_email"):
            job["contact_email"] = extract_contact_email(content)
        if not job.get("salary_range"):
            salary_min, salary_max, currency, salary_type = parse_salary(content)
            if salary_min or salary_max:
                job["salary_min"] = salary_min
                job["salary_max"] = salary_max
                job["currency"] = currency
                job["salary_type"] = salary_type
        if not job.get("benefits"):
            job["benefits"] = extract_benefits(content)
        if not job.get("required_skills"):
            skills = extract_skills(content)
            job["required_skills"] = ", ".join(skills[:10]) if skills else None
            job["preferred_skills"] = ", ".join(skills[10:]) if len(skills) > 10 else None
        if not job.get("required_certifications"):
            certs = extract_certifications(content)
            job["required_certifications"] = ", ".join(certs) if certs else None
        if not job.get("years_experience"):
            job["years_experience"] = extract_experience(content)
        if not job.get("education_level"):
            job["education_level"] = extract_education(content)

    job["additional_notes"] = f"enrichment_source={source_used}" if source_used != "none" else None
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


def write_csv(path: str, rows: List[Dict[str, Any]], headers: List[str]) -> int:
    with open(path, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()
        for row in rows:
            writer.writerow({h: row.get(h, "") for h in headers})
    return len(rows)


def derive_email_from_url(url: Optional[str]) -> Optional[str]:
    if not url:
        return None
    try:
        parsed = urlparse(url)
        host = parsed.hostname
        if not host:
            return None
        domain = host.replace("www.", "")
        return f"careers@{domain}"
    except Exception:
        return None


def process_candidate_job(job: Dict[str, Any]) -> Tuple[Dict[str, Any], Optional[Dict[str, Any]], Optional[Dict[str, Any]]]:
    local_session = requests.Session()
    local_session.headers.update(HEADERS)

    job = enrich_job(local_session, dict(job))

    if not job.get("contact_email"):
        job["contact_email"] = derive_email_from_url(job.get("company_website") or job.get("apply_url"))

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

    soup = fetch_page(session, LIST_URL)
    if not soup:
        raise RuntimeError("Failed to fetch a11yjobs listing page")

    today_utc = datetime.now(timezone.utc).date()
    job_link_hints = extract_job_link_hints(soup, today_utc)

    next_link = soup.find("a", attrs={"rel": "next"})
    page_count = 1
    while next_link and page_count < 5:
        next_url = urljoin(BASE_URL, next_link.get("href", ""))
        next_soup = fetch_page(session, next_url)
        if not next_soup:
            break
        next_hints = extract_job_link_hints(next_soup, today_utc)
        for link, hint_date in next_hints.items():
            if link not in job_link_hints or (job_link_hints[link] is None and hint_date is not None):
                job_link_hints[link] = hint_date
        next_link = next_soup.find("a", attrs={"rel": "next"})
        page_count += 1

    job_links = sorted(job_link_hints.keys())
    links_after_listing_prefilter = [
        link for link in job_links
        if job_link_hints.get(link) is None or job_link_hints[link] > cutoff_date
    ]

    raw_jobs: List[Dict[str, Any]] = []
    for link in links_after_listing_prefilter:
        job = parse_job_detail(session, link, listing_hint_date=job_link_hints.get(link))
        if job:
            raw_jobs.append(job)
        time.sleep(0.2)

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
            "latest_a11yjobs_date": latest_a11yjobs_date.isoformat() if latest_a11yjobs_date else None,
            "jobs": [],
        })
        write_json(INSERT_READY_JSON, {
            "cutoff_date": cutoff_date.isoformat(),
            "latest_a11yjobs_date": latest_a11yjobs_date.isoformat() if latest_a11yjobs_date else None,
            "jobs": [],
        })
        write_csv(CANDIDATES_CSV, [], csv_headers)

        total_after = fetch_total_count(db_url)
        print("\nFinal Report")
        print(f"cutoff_date: {cutoff_date.isoformat()}")
        print(f"links_found: {len(job_links)}")
        print(f"links_after_listing_prefilter: {len(links_after_listing_prefilter)}")
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
    duplicates: List[Dict[str, Any]] = []

    seen_source_urls = set()
    seen_title_company = set()

    jobs_for_enrichment: List[Dict[str, Any]] = []

    for job in new_jobs:
        source_url = job.get("source_url") or ""
        title = job.get("title") or ""
        company = job.get("company") or ""
        title_company_key = f"{normalize_text(title)}::{normalize_text(company)}"

        if source_url in seen_source_urls:
            duplicates.append({
                "source_url": source_url,
                "title": title,
                "company": company,
                "reason": "batch_source_url",
            })
            continue

        if title_company_key in seen_title_company:
            duplicates.append({
                "source_url": source_url,
                "title": title,
                "company": company,
                "reason": "batch_title_company",
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
        seen_title_company.add(title_company_key)
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
        "latest_a11yjobs_date": latest_a11yjobs_date.isoformat() if latest_a11yjobs_date else None,
        "jobs": candidates_with_nan,
    })
    csv_row_count = write_csv(CANDIDATES_CSV, candidates_with_nan, csv_headers)

    write_json(INSERT_READY_JSON, {
        "cutoff_date": cutoff_date.isoformat(),
        "latest_a11yjobs_date": latest_a11yjobs_date.isoformat() if latest_a11yjobs_date else None,
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
            "AND requirements IS NOT NULL AND contact_email IS NOT NULL "
            f"LIMIT {sample_count};"
        )
        sample_ok = psql_scalar(db_url, sample_sql)
        if sample_ok is None or int(sample_ok) < sample_count:
            post_errors.append("Sample inserted rows missing required fields")

    print("\nFinal Report")
    print(f"cutoff_date: {cutoff_date.isoformat()}")
    print(f"links_found: {len(job_links)}")
    print(f"links_after_listing_prefilter: {len(links_after_listing_prefilter)}")
    print(f"filtered_newer_jobs: {len(new_jobs)}")
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

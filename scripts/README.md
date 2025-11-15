# Job Seeding Script Documentation

## Overview

The `seed_jobs.py` script automatically populates your AccessibilityJobs database with real accessibility job postings from multiple job boards.

**Powered by**: [JobSpy](https://github.com/speedyapply/JobSpy) - A Python library that scrapes jobs from LinkedIn, Indeed, ZipRecruiter, Glassdoor, and more.

---

## Features

### 🎯 Intelligent Job Scraping
- **Multi-board scraping**: LinkedIn, Indeed, ZipRecruiter
- **10 accessibility-specific search terms**:
  - "accessibility engineer"
  - "accessibility specialist"
  - "WCAG specialist"
  - "digital accessibility"
  - "accessibility consultant"
  - "a11y engineer"
  - "inclusive design"
  - "accessibility tester"
  - "accessibility analyst"
  - "508 compliance"

### 🔄 Smart Data Mapping
- **Auto-detects job type**: Remote, Hybrid, or Onsite
- **Extracts location**: Country, state, city
- **Parses salary**: Min/max amounts, currency, interval
- **Identifies job level**: Entry, Mid, Senior, Lead, Manager, Director
- **Extracts skills**: WCAG, ARIA, screen readers, testing tools
- **Finds certifications**: CPACC, WAS, CPWA, IAAP
- **Parses descriptions**: Splits into overview, responsibilities, qualifications

### ✅ Quality Assurance
- **Deduplication**: Removes duplicate jobs by title + company
- **Auto-approval**: Inserts with "approved" status
- **Email extraction**: Finds contact emails in descriptions
- **Validation**: Ensures required fields meet minimum length

---

## Requirements

### System Requirements
- **Python**: 3.10 or higher
- **PostgreSQL**: Database with `jobs` table created
- **Environment**: `.env.local` with valid `DATABASE_URL`

### Python Dependencies
```
python-jobspy>=1.1.79
psycopg2-binary>=2.9.9
python-dotenv>=1.0.0
```

---

## Installation

### Option 1: System Python (if 3.10+)

```bash
cd scripts
pip3 install -r requirements.txt
```

### Option 2: Virtual Environment (Recommended)

```bash
cd scripts

# Create virtual environment with Python 3.10+
python3.10 -m venv venv

# Activate (macOS/Linux)
source venv/bin/activate

# Activate (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

---

## Usage

### Basic Usage

```bash
# Make sure you're in the scripts directory
cd scripts

# Run the script
python3 seed_jobs.py

# Or if using venv (already activated)
python seed_jobs.py
```

### Configuration

Edit `seed_jobs.py` to adjust settings:

```python
# Line ~469: Adjust results per search term
seeder.seed_jobs(results_per_term=20)  # Default: 20

# Line ~20-30: Customize search terms
SEARCH_TERMS = [
    "accessibility engineer",
    "your custom search term here",
    # Add more...
]
```

---

## How It Works

### 1. **Scraping Phase**
```
🔍 Searching: accessibility engineer
   ✅ Found 23 jobs
🔍 Searching: WCAG specialist  
   ✅ Found 18 jobs
...
```

The script queries each job board (LinkedIn, Indeed, ZipRecruiter) for each search term, collecting job postings from the last 30 days.

### 2. **Deduplication Phase**
```
📊 Unique jobs after deduplication: 127
```

Removes duplicates based on `title-company` combination.

### 3. **Mapping Phase**

Each job is mapped from JobSpy format to your database schema:

```python
JobSpy Field          →  Your Database Field
─────────────────────────────────────────────
title                →  title
company              →  company
company_url          →  company_website
is_remote            →  type (remote/hybrid/onsite)
location.city        →  city
location.state       →  state (stored in location string)
location.country     →  country
compensation.*       →  salary_min, salary_max, currency, salary_type
description          →  job_overview, key_responsibilities, required_qualifications
job_type             →  employment_type (Full-time, Part-time, etc.)
job_level            →  job_level (Entry, Mid, Senior, etc.)
emails               →  contact_email
```

### 4. **Extraction Phase**

The script intelligently extracts:
- **Skills**: Searches for WCAG, ARIA, JAWS, NVDA, Axe, etc.
- **Certifications**: Finds CPACC, WAS, IAAP mentions
- **Email**: Uses regex to find contact emails
- **Salary**: Normalizes to integers with currency

### 5. **Insertion Phase**
```
💾 Inserting jobs into database...
   ✅ [1/127] Senior Accessibility Engineer at Microsoft
   ✅ [2/127] WCAG Compliance Specialist at Amazon
   ...
```

Each job is inserted with status="approved" and proper timestamps.

---

## Output Example

### Console Output
```
============================================================
🚀 AccessibilityJobs Database Seeder
============================================================

✅ Connected to database

🔍 Scraping accessibility jobs from job boards...
Search terms: accessibility engineer, accessibility specialist, WCAG specialist...

🔎 Searching: accessibility engineer
   ✅ Found 23 jobs

🔎 Searching: WCAG specialist
   ✅ Found 18 jobs

✅ Total jobs scraped: 127

📊 Unique jobs after deduplication: 89

💾 Inserting jobs into database...
   ✅ [1/89] Senior Accessibility Engineer at Microsoft
   ✅ [2/89] Digital Accessibility Specialist at Google
   ✅ [3/89] WCAG Consultant at Apple
   ...

============================================================
✅ Seeding complete!
   Total scraped: 127
   Unique jobs: 89
   Successfully inserted: 87
   Failed: 2
============================================================
```

### Database Result

Jobs will appear in your database with:
- ✅ **status**: "approved" (immediately visible on site)
- ✅ **created_at**: Current timestamp
- ✅ **updated_at**: Current timestamp
- ✅ All required fields populated
- ✅ Skills and certifications as JSON arrays
- ✅ Descriptions formatted in markdown

---

## Troubleshooting

### Error: Python version < 3.10

```
ERROR: Could not find a version that satisfies the requirement python-jobspy
```

**Solution**: Use a virtual environment with Python 3.10+:
```bash
python3.10 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Error: DATABASE_URL not found

```
❌ DATABASE_URL not found in environment variables
```

**Solution**: Ensure `.env.local` exists in the project root with:
```env
DATABASE_URL=postgresql://user:pass@host:port/database
```

### Error: psycopg2 installation fails

```
Error: pg_config executable not found
```

**Solution**: Install PostgreSQL development headers:
```bash
# macOS
brew install postgresql

# Ubuntu/Debian
sudo apt-get install libpq-dev python3-dev

# Then retry
pip install psycopg2-binary
```

### Error: Connection refused

```
❌ Database connection error: connection refused
```

**Solution**: 
1. Check if your database is running
2. Verify `DATABASE_URL` is correct
3. Test connection: `psql $DATABASE_URL`

### Warning: Rate limiting

If you see `429` errors or few results:
- LinkedIn rate limits aggressively
- Wait 5-10 minutes between runs
- Reduce `results_per_term` to a smaller number
- Consider using proxies (advanced)

---

## Advanced Configuration

### Custom Search Terms

Edit the `SEARCH_TERMS` list in `seed_jobs.py`:

```python
SEARCH_TERMS = [
    "accessibility developer",
    "UX accessibility designer",
    "accessibility QA engineer",
    # Add your custom terms
]
```

### Adjust Results

Change the number of jobs per search term:

```python
# Get more jobs (may hit rate limits)
seeder.seed_jobs(results_per_term=50)

# Get fewer jobs (faster, less rate limiting)
seeder.seed_jobs(results_per_term=10)
```

### Filter by Location

Edit the `scrape_accessibility_jobs` method:

```python
jobs = scrape_jobs(
    site_name=["linkedin", "indeed", "zip_recruiter"],
    search_term=search_term,
    location="San Francisco, CA",  # Change location
    is_remote=True,  # Only remote jobs
    hours_old=168,  # Last 7 days only
    # ... other params
)
```

### Add More Job Boards

JobSpy supports additional boards:

```python
site_name=["linkedin", "indeed", "zip_recruiter", "glassdoor", "google"]
```

**Note**: Some boards have stricter rate limits.

---

## Best Practices

### 1. Start Small
```bash
# First run: test with few results
# Edit seed_jobs.py line 469:
seeder.seed_jobs(results_per_term=5)
```

### 2. Run Periodically
```bash
# Add to cron (daily at 2 AM)
0 2 * * * cd /path/to/scripts && python3 seed_jobs.py >> seed.log 2>&1
```

### 3. Monitor Database
```bash
# Check job count
npm run db:studio
# Or use psql
psql $DATABASE_URL -c "SELECT COUNT(*) FROM jobs WHERE status='approved';"
```

### 4. Clear Old Jobs
```sql
-- Remove jobs older than 60 days
DELETE FROM jobs 
WHERE created_at < NOW() - INTERVAL '60 days' 
AND status = 'approved';
```

---

## FAQ

**Q: How many jobs will I get?**  
A: With 10 search terms × 20 results = up to 200 jobs, but after deduplication usually 80-120 unique jobs.

**Q: Are jobs automatically approved?**  
A: Yes, seeded jobs have `status='approved'` and appear immediately on the site.

**Q: Can I run this multiple times?**  
A: Yes, but be aware of rate limits. Wait 10+ minutes between runs.

**Q: What if a field is missing?**  
A: The script provides sensible defaults (e.g., placeholder emails, job level guessing).

**Q: Can I customize the mapping?**  
A: Yes! Edit the `map_job_to_schema` method in `seed_jobs.py`.

**Q: How do I update existing jobs?**  
A: Currently, the script only inserts new jobs. To update, you'd need to modify it to check for existing jobs by `title+company` and UPDATE instead of INSERT.

---

## Data Quality

### What Gets Extracted
- ✅ **Title**: Direct from job board
- ✅ **Company**: Direct from job board  
- ✅ **Location**: Parsed city, state, country
- ✅ **Job Type**: Detected from description keywords
- ✅ **Salary**: Normalized to integers
- ✅ **Skills**: Extracted via keyword matching
- ✅ **Certifications**: Extracted via keyword matching
- ✅ **Description**: Split into 3 sections heuristically

### What Might Need Manual Review
- ⚠️ **Contact Email**: May be placeholder if not found
- ⚠️ **Job Level**: Guessed from title/description
- ⚠️ **Description Sections**: Basic split, not AI-parsed
- ⚠️ **Skills/Certs**: Keyword-based, may miss variations

---

## Contributing

Found a bug or want to improve the scraper? Contributions welcome!

1. Fork the repository
2. Modify `scripts/seed_jobs.py`
3. Test thoroughly
4. Submit a pull request

---

## References

- [JobSpy GitHub](https://github.com/speedyapply/JobSpy) - Job scraping library
- [PostgreSQL psycopg2](https://www.psycopg.org/) - Python PostgreSQL adapter
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/) - Accessibility guidelines

---

**Need help?** Open an issue on GitHub or contact the maintainers.


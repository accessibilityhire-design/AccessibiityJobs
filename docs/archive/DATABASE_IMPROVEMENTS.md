# Database & Job Display Improvements

## Summary of Issues Found

### 1. Company Name Issues
| Issue | Count | Root Cause |
|-------|-------|------------|
| "Unknown Company" | 47 jobs | Scrapers default to "Unknown Company" when extraction fails |
| "NaN" company | 5 jobs | Pandas NaN values stringified to "NaN" |

### 2. Job Description Formatting Issues
| Issue | Count | Root Cause |
|-------|-------|------------|
| Markdown bold (`**`) | 141 jobs | JobSpy returns markdown, frontend expects HTML |
| Escaped dashes (`\-`) | 348 jobs | JobSpy escapes special characters |
| Raw markdown not rendered | 488 jobs | No markdown-to-HTML conversion |

---

## Solutions Implemented

### Frontend Improvements

#### 1. New Job Formatter Library (`lib/job-formatter.ts`)
- **`formatJobDescription()`** - Converts markdown to clean HTML
  - Handles escaped characters (`\-`, `\*`, `\_`)
  - Converts `**bold**` to `<strong>bold</strong>`
  - Converts `## headers` to `<h3>` tags
  - Converts bullet lists to `<ul><li>` elements
  - Wraps text in paragraphs properly

- **`extractPlainText()`** - Strips markdown/HTML for previews
  - Used in JobCard and JobListItem components
  - Removes formatting for clean text display

- **`formatCompanyName()`** - Handles invalid company values
  - Detects "Unknown", "NaN", "null", "undefined"
  - Returns "Company Not Available" for invalid values

- **`extractCompanyFromDescription()`** - Extracts company from text
  - Pattern matching for common formats like "Company is seeking..."

#### 2. Redesigned Job Detail Page (`app/jobs/[id]/page.tsx`)
**NEW PROFESSIONAL DESIGN:**
- **Hero Section** with gradient background and company branding
- **Company Logo Fallback** - Shows first letter in branded circle
- **Tag System** - Work arrangement, employment type, job level
- **Skills Display** - Required and preferred skills as tags
- **Benefits Card** - Health insurance, retirement, PTO details
- **Job Details Card** - Experience, education, WCAG level, certifications
- **Accessibility Focus & Assistive Tech** - Visual tags for specializations
- **Responsive Design** - Mobile-first with sticky sidebar on desktop

#### 3. CSS Improvements (`app/globals.css`)
- Added `.job-description` class with proper styling
- Lists, headers, paragraphs render correctly
- Proper spacing and typography

### Backend Scraper Improvements

#### 1. Enhanced Base Scraper (`scraper-server/app/scrapers/base.py`)
New methods added:
- **`clean_markdown()`** - Unescapes characters before storage
- **`extract_company_from_description()`** - Pattern matching to find company names
- **`is_valid_company_name()`** - Validates company name isn't invalid
- **`validate_and_fix_company()`** - Main method to fix company names

#### 2. Updated JobSpy Scraper (`scraper-server/app/scrapers/jobspy_scraper.py`)
- Handles pandas NaN values properly
- Uses `validate_and_fix_company()` to extract from description
- Cleans markdown in descriptions

#### 3. Updated A11yJobs Scraper (`scraper-server/app/scrapers/a11yjobs_scraper.py`)
- Uses `validate_and_fix_company()` method
- Descriptions cleaned during processing

### AI Enhancer Improvements (`scraper-server/app/ai_enhancer.py`)

**Complete rewrite focused on EXTRACTION over creative writing:**

1. **New System Prompt** - Prioritizes data extraction:
   - Company name extraction from description
   - Location parsing (city, state, country)
   - Salary extraction (only if mentioned)
   - Skills and certifications identification
   - WCAG level and accessibility focus detection

2. **Lower Temperature (0.1)** - More consistent, deterministic results

3. **Better JSON Parsing** - Handles markdown code blocks, extracts JSON from mixed content

4. **Smart Merging Logic**:
   - Only replaces company if original is invalid
   - Only updates descriptions if they have excessive markdown
   - Preserves original content when AI can't improve it

5. **Validation Methods**:
   - `_is_valid_company()` - Validates extracted company names
   - `_has_excessive_markdown()` - Detects content needing cleanup
   - `_clean_text_for_db()` - Removes markdown before storage

### Database Cleanup Script

Created `scripts/cleanup-jobs.js` to fix existing data:

```bash
# Run the cleanup script
node scripts/cleanup-jobs.js
```

**What it does:**
1. Finds all jobs with "Unknown Company", "NaN", or empty company
2. Attempts to extract company name from description
3. If extraction fails, sets to "Company Information Pending"
4. Cleans escaped markdown characters from all text fields

---

## How to Apply These Fixes

### Step 1: Run the Cleanup Script
```bash
cd /Users/khushwantparihar/AccessibiityJobs
node scripts/cleanup-jobs.js
```

### Step 2: Verify the Frontend
```bash
npm run dev
```
Open http://localhost:3000/jobs/[any-job-id] and check:
- Professional hero section with company branding
- Skills displayed as tags
- Clean, formatted descriptions
- Benefits and job details in sidebar

### Step 3: Test New Scrapes
The scraper improvements will apply to all new jobs scraped going forward.

---

## Files Modified

### Frontend
- `lib/job-formatter.ts` (NEW)
- `app/jobs/[id]/page.tsx` (REDESIGNED)
- `components/JobCard.tsx`
- `components/JobListItem.tsx`
- `app/globals.css`

### Scraper Server
- `scraper-server/app/scrapers/base.py`
- `scraper-server/app/scrapers/jobspy_scraper.py`
- `scraper-server/app/scrapers/a11yjobs_scraper.py`
- `scraper-server/app/ai_enhancer.py` (REWRITTEN)

### Scripts
- `scripts/cleanup-jobs.js` (NEW)

---

## Job Page Design Features

### Hero Section
- Gradient background (slate → white → blue)
- Company initial logo with gradient
- Industry tag below company name
- Employment type, work arrangement, and job level tags
- Location, salary, and posted date quick info

### Main Content
- Colored accent bars for each section (blue, emerald, amber, purple, cyan)
- Clean prose formatting for descriptions
- Skills section with required/preferred differentiation
- Checkmark icons for required skills

### Sidebar
- **Apply Card** - Prominent CTA with shadow
- **Job Details Card** - Experience, education, WCAG, country
- **Certifications** - CPACC, WAS, etc. as tags
- **Accessibility Focus** - Web, mobile, document tags
- **Assistive Tech** - JAWS, NVDA, VoiceOver tags
- **Benefits Card** - Health, retirement, PTO details
- Posted date at bottom

---

## Smart Contact Extraction System

### The Problem
Previously, jobs without contact emails would show:
- Generated emails like `careers@companyname.com` (which may not exist)
- "NaN" or placeholder values
- No way to actually apply

### The Solution
A professional, multi-tier contact extraction system:

### Contact Extractor (`scraper-server/app/contact_extractor.py`)

**Strategy 1: Extract from Job Description**
- Scans job description for email patterns
- Prioritizes career-related emails (careers@, recruiting@, hr@)

**Strategy 2: Scrape Company Careers Page**
- Tries common paths: `/careers`, `/jobs`, `/join-us`, `/work-with-us`
- Extracts email from page content
- Returns careers page URL for "Apply on Website" button

**Strategy 3: Check Contact Page**
- Tries: `/contact`, `/contact-us`, `/about/contact`
- Extracts professional contact emails

**Strategy 4: Infer from Company Domain**
- Uses company website domain to generate likely email
- Follows common patterns: `careers@domain.com`

**Strategy 5: Generate from Company Name**
- Last resort: generates domain from company name
- `"Acme Corp Inc" → careers@acmecorp.com`

### Frontend Smart Apply UI

The job detail page now shows different apply options:

| Scenario | UI Displayed |
|----------|-------------|
| **Real Email Found** | "Apply via Email" button + email displayed |
| **Company Website Only** | "Apply on Company Website" button + redirect notice |
| **Neither Available** | Warning message + "Search Company Careers" button |

This ensures users always have a professional way to apply, even when we don't have direct contact info.

---

## Future Recommendations

1. **AI Enhancement** - Already optimized for extraction; monitor API usage
2. **Data Validation** - Add validation at database insert time to reject invalid company names
3. **Manual Review Queue** - Jobs with "Company Information Pending" should be flagged for manual review
4. **Scraper Improvements** - Consider using AI to extract structured data from messy job postings
5. **Caching** - Add Redis caching for frequently accessed jobs
6. **Contact Data Quality** - Run periodic jobs to re-scrape company websites for updated contact info


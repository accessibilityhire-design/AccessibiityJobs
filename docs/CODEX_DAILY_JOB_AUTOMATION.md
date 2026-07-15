# Daily Codex Job Ingestion Automation

## Purpose

This automation runs the production multi-source ingestion workflow every day, reviews each new source posting, creates structured job data, writes only validated records to Supabase, and verifies that approved jobs can appear on AccessibilityJobs.

The default discovery layer covers A11yJobs, Indeed, and LinkedIn across the United States, United Kingdom, India, and Canada, then verifies direct employer or applicant tracking system pages whenever they are available. Optional Glassdoor, Google Jobs, and ZipRecruiter adapters remain available through `MULTISOURCE_SOURCES`, but they are not enabled by default because live source-health testing found unreliable responses from the current network.

The automation is intentionally strict. A failed cutoff query, missing source evidence, failed validation, or uncertain database state stops the write path. It never invents a cutoff or fills unknown job facts with guesses.

## Installed schedule

- Name: `Daily Multi-source Accessibility Job ingestion`
- Cadence: Every day at 9:00 AM in the computer's Asia/Kolkata timezone
- Project: `/Users/khushwantparihar/AccessibiityJobs`
- Execution: Local project checkout
- Agent: Latest frontier Codex model with maximum reasoning
- Result location: The Codex Scheduled view

Local execution is required because the workflow needs the repository, the local environment file, `psql`, network access to the configured job sources and Supabase, and permission to refresh the standard artifacts.

## Required setup

Keep these requirements true for every scheduled run:

1. The computer is powered on and the Codex desktop app is running.
2. The project remains at `/Users/khushwantparihar/AccessibiityJobs`.
3. `.env.local` or `.env` contains a working `DATABASE_URL`.
4. `scripts/venv/bin/python` uses Python 3.10 or newer with `scripts/requirements.txt` installed, and `psql` is available.
5. Codex background tasks have local file and network permissions.
6. No second ingestion process is running against the same source and database.

Secrets must never be printed. The runner masks the database URL, and the agent must preserve that behavior.

The automation keeps a small operational memory at `$CODEX_HOME/automations/daily-a11yjobs-supabase-ingestion/memory.md`. Read it at the start of each run and update it at the end with the timestamp, cutoff, source counts, insert totals, database total, verification result, blocker if any, and useful next-run context. Never store credentials or source-page content in this file.

## Daily workflow

### 1. Start with the database cutoff

The first go or no-go check is:

```sql
SELECT MAX(created_at)::date AS latest_date FROM jobs;
```

Only source postings whose `datePosted` is strictly later than `latest_date` may continue. If this query fails, the automation stops before scraping, artifacts, or database writes. It must not invent a fallback date and must not reuse old artifact rows.

### 2. Collect and reconcile multiple sources

The default collector searches A11yJobs, Indeed, and LinkedIn, then follows and verifies direct employer or applicant tracking system pages. Search results are not trusted merely because they match a query. The relevance gate rejects general jobs that only mention accessibility in legal or workplace boilerplate.

Glassdoor, Google Jobs, and ZipRecruiter are supported as optional adapters. Enable them only through `MULTISOURCE_SOURCES` after checking their current source health. The July 15 rehearsal returned no usable Google Jobs rows, Glassdoor location and API errors, and ZipRecruiter HTTP 403 responses, so a scheduled run must not mistake those disabled sources for successful coverage.

Listings with the same normalized title and company are combined into one candidate. The best evidence is selected in this order:

1. A verified direct employer or applicant tracking system page
2. A curated A11yJobs listing with a verified direct application page
3. A corroborated listing found on two or more independent job sources

An aggregator-only listing found on one source is excluded from insertion. Every retained candidate stores its source evidence in the review artifact and operational notes.

### 3. Review every new source posting

The agent opens or fetches every candidate source page that is newer than the cutoff and reviews the source-backed facts individually. It checks:

- Identity: title, company, source URL, application URL, and posting date
- Role content: overview, responsibilities, requirements, and useful preferred qualifications
- Work classification: employment type, seniority, remote, hybrid, or onsite arrangement
- Location: display location, city, country, and remote eligibility
- Compensation: minimum, maximum, currency, and pay interval only when the source states them
- Accessibility data: WCAG level, accessibility focus, assistive technology, skills, and certifications
- Employer data: employer website, industry, and contact details only when supported
- Presentation quality: readable sections, concise skill chips, no page chrome, placeholders, duplicate cards, broken sentence fragments, or Unicode em dash characters

Unknown facts remain empty. The agent must never infer salary, country, remote eligibility, employer website, certification requirements, or contact details from weak context.

### 4. Run quality tests and the canonical ingestion runner

From the repository root:

```bash
scripts/venv/bin/python scripts/test_a11yjobs_quality.py
scripts/venv/bin/python scripts/run_multisource_daily.py
```

The canonical runner performs cutoff filtering, source enrichment, batch and database deduplication, record validation, artifact generation, guarded Supabase inserts, run ID tagging, database delta checks, and post-insert tests.

The standard artifacts are:

- `scripts/output/multisource_jobs_candidates_final_with_nan.json`
- `scripts/output/multisource_jobs_insert_ready_final.json`
- `scripts/output/multisource_jobs_candidates_final_table.csv`

Both JSON files contain a top-level object. Counts must use the `jobs` array inside that object.

### 5. Reconcile the generated structured data

The agent reads every row in the review and insert-ready artifacts and compares it with the source review. It confirms that:

- all required fields are present
- `date_posted` is later than the recorded cutoff
- source URLs and title plus company pairs are unique
- each job has either verified direct employer evidence or at least two independent sources
- the selected primary URL is the direct employer application page when one is verified
- descriptions are source-backed, clean, and complete
- responsibilities and requirements do not begin mid-sentence
- JSON array fields contain concise strings, not paragraphs
- salary values are plausible and use the correct interval
- work arrangement, country, city, and employer website match the source
- validation failures are excluded from the insert-ready artifact and explained

If the review artifact contains more rows than the insert-ready artifact, that is valid only when every excluded row has a recorded validation reason.

If a durable parser defect is found, the agent may make a narrow source-backed repair. It must keep validation strict, run the focused Python tests, run `npm run lint`, `npm run audit:seo`, and `npm run build`, then commit and push only the tested fix. It must not weaken validation just to increase insertion count.

### 6. Verify Supabase and the public site

For a successful write, the agent verifies:

- `inserted + skipped_duplicates + errors` equals the insert-ready count
- the database total changed by exactly the inserted count
- the run ID query returns exactly the inserted rows
- all inserted rows have `status = 'approved'`
- required job fields are populated
- inserted row details match the reviewed source data

The public homepage refreshes frequently and job detail pages are cached for several minutes. The agent checks the production site after insertion, allowing for the documented cache window. It confirms that at least one newly inserted job is listed, its canonical detail page loads, and its rendered page contains valid `JobPosting` structured data. A temporary production cache delay must be reported separately from a database failure.

### 7. Report exact results

Each scheduled run reports:

- cutoff date and newest source date
- per-source discovery counts, newer counts, insert-ready counts, and source errors
- newer jobs, review rows, insert-ready rows, duplicates, and validation failures
- inserted, skipped, errors, database total, run ID count, and post-insert result
- one line per inserted job with title, company, posting date, work arrangement, location, and source URL
- every rejected or failed job with its exact reason
- artifact paths
- production visibility result
- any code change, test result, commit, and push made during recovery

After reporting, the same summary is appended to the automation memory so a later run can distinguish a clean no-op, a completed insertion, and a blocked attempt.

A run with zero newer jobs is a successful no-op when the cutoff, source fetch, artifact refresh, database count, and post-insert checks all pass.

## Failure and recovery rules

- Cutoff or DNS failure: stop before scrape and writes, report the failing host or query, and do not reuse stale artifacts.
- Source fetch failure: retry briefly, then stop or exclude only the affected row with a clear reason. Do not fabricate missing content.
- Single-source aggregator result: keep it out of Supabase unless a direct employer page can be verified.
- Cross-source disagreement: prefer the verified employer page, record the disagreement, and exclude the row if identity or role facts remain uncertain.
- Validation failure: exclude the row and report every failed rule.
- Duplicate: skip safely and report whether it matched the source URL or normalized title and company.
- Database pooler stall after cutoff: preserve duplicate guards, use one persistent `psql` session to finish prepared inserts, and do not restart the scrape.
- Accounting mismatch: query inserted rows and run IDs before declaring failure. Do not start an overlapping runner.
- Production cache delay: confirm the approved Supabase row first, wait through the cache window, then recheck the canonical page.

## Manual verification

Use this when testing a prompt update before changing the schedule:

```bash
cd /Users/khushwantparihar/AccessibiityJobs
scripts/venv/bin/python scripts/test_a11yjobs_quality.py
scripts/venv/bin/python scripts/run_multisource_daily.py
npm run audit:seo
```

Review the first few scheduled runs in Codex Scheduled. Update the prompt if source markup changes or a repeated failure exposes a missing check.

## Exact scheduled agent prompt

```text
Run the production daily multi-source accessibility job ingestion for /Users/khushwantparihar/AccessibiityJobs. Work autonomously and continue until the run is either fully verified or stopped by a real safety blocker. Read docs/CODEX_DAILY_JOB_AUTOMATION.md and $CODEX_HOME/automations/daily-a11yjobs-supabase-ingestion/memory.md before acting. Follow the guide as the operating contract and use memory only as prior-run context, never as a replacement for live cutoff or source checks.

Use the repository's canonical workflow. Do not start if another scripts/run_multisource_daily.py or scripts/run_a11yjobs_daily.py process is active. Load DATABASE_URL from .env.local first, then .env, and never print any credential.

The mandatory first gate is SELECT MAX(created_at)::date AS latest_date FROM jobs;. Record the result. Only process source postings with datePosted strictly later than latest_date. If the cutoff query fails, stop immediately. Do not invent a cutoff, reuse stale artifact rows, scrape candidates, or write to Supabase.

Collect from the default active sources, A11yJobs, Indeed, and LinkedIn, in the configured markets, and verify direct employer or applicant tracking system pages whenever available. Attempt Glassdoor, Google Jobs, or ZipRecruiter only when they are explicitly enabled in MULTISOURCE_SOURCES, and report their health separately. Reject unrelated query matches. Consolidate duplicates using normalized title and company, preserve every independent source as evidence, and prefer a verified direct employer or applicant tracking system page. An aggregator-only job from one source must not be inserted. It needs either a verified direct employer page or corroboration from at least two independent sources.

Before permitting a result to stand, review every newer source posting individually. Compare the source evidence with the generated row for title, company, posting date, source and apply URLs, description, responsibilities, requirements, preferred qualifications, employment type, seniority, work arrangement, location, city, country, salary and interval, employer website, skills, certifications, WCAG focus, assistive technology, benefits, and contact data. Keep only source-backed facts. Leave unknown values empty. Never generate an employer email or guess salary, remote eligibility, country, employer website, certifications, or contact information. Reject page chrome, placeholders, duplicate sections, broken fragments, sentence-sized skill chips, implausible salary values, and Unicode em dash characters.

Run scripts/venv/bin/python scripts/test_a11yjobs_quality.py. If it passes, run scripts/venv/bin/python scripts/run_multisource_daily.py exactly once. Do not overlap or restart a healthy run. Inspect scripts/output/multisource_jobs_candidates_final_with_nan.json, scripts/output/multisource_jobs_insert_ready_final.json, and scripts/output/multisource_jobs_candidates_final_table.csv. The JSON roots are objects, so count data['jobs']. Read every review and insert-ready row. Reconcile each generated field with the source evidence and explain every relevance, evidence, duplicate, and validation exclusion. Never bypass source-evidence, required-field, description-quality, salary, dedupe, pre-insert, or post-insert checks.

Verify filtered_newer_jobs, deduped_candidates, validation_failures, inserted, skipped_duplicates, errors, db_total_after, the exact database delta, and rows tagged with this run ID. Confirm inserted rows are approved and match their sources. If the pooler stalls after cutoff, keep all duplicate guards and use one persistent psql session to finish the already prepared guarded inserts. Do not rescrape. If accounting differs, inspect row-level records and run IDs before deciding the run failed.

After a successful insert, verify accessibilityjobs.net after its cache window. Confirm a new job appears in the listing, its canonical detail page loads, and the page emits valid JobPosting structured data. Treat a cache delay separately from a failed database insert.

If a durable parser defect blocks accurate ingestion, make only a narrow source-backed code fix. Keep validation strict. Run the focused Python quality tests plus npm run lint, npm run audit:seo, and npm run build. Commit and push only if all required checks pass. Routine database insertion and refreshed output artifacts do not require a code commit.

Finish with an exact report containing cutoff date, newest source date, counts for every source, source failures, artifact counts, inserted and rejected job details, evidence and duplicate decisions, validation reasons, database before and after totals, run ID verification, artifact paths, live-site visibility, tests, and any commit or push. A verified zero-new-job run is a successful no-op only when the source-family health is also reported. If blocked, identify the precise blocker and confirm that no unsafe write occurred. Append a concise timestamped summary to $CODEX_HOME/automations/daily-a11yjobs-supabase-ingestion/memory.md with the outcome, per-source counts, database total, verification state, blocker, and next-run context. Never write credentials to memory.
```

import json
import unittest
from unittest.mock import Mock

from bs4 import BeautifulSoup

from run_a11yjobs_daily import (
    REQUIREMENTS_FALLBACK,
    RESPONSIBILITIES_FALLBACK,
    extract_company_website,
    extract_experience,
    extract_structured_fields,
    consolidate_source_candidates,
    external_content_matches_job,
    external_content_has_job_detail,
    extract_contact_email,
    fetch_external_text,
    jobspy_record_to_job,
    normalize_description_text,
    normalize_work_arrangement,
    parse_description_sections,
    parse_location_fields,
    parse_salary,
    reconcile_external_jobposting,
    validate_record,
)


class DescriptionQualityTests(unittest.TestCase):
    def test_em_dashes_are_normalized_for_site_copy(self):
        self.assertEqual(
            normalize_description_text("Accessibility matters—it improves access."),
            "Accessibility matters - it improves access.",
        )

    def test_sections_only_split_on_standalone_headings(self):
        source = """About the Role

We build public-sector software and need an engineer who can turn complex policy into accessible, reliable tools for real people. This overview is deliberately substantial.

Key Responsibilities

    Build accessible React interfaces.
    Review AI-generated changes before release.

Required Experience/Clearance

    7+ years of experience building production web systems.
    Ability to obtain a security clearance.

Desired Experience

We encourage applicants who meet the basic requirements to apply.
    WCAG and assistive-technology testing experience.

The salary range provided for this role depends on experience.
"""
        sections = parse_description_sections(source)

        self.assertTrue(sections["description"].startswith("We build public-sector software"))
        self.assertIn("Build accessible React interfaces", sections["key_responsibilities"])
        self.assertTrue(sections["requirements"].startswith("- 7+ years"))
        self.assertIn("basic requirements to apply", sections["nice_to_have"])
        self.assertNotIn("salary range", sections["nice_to_have"].lower())

    def test_what_youll_bring_is_a_requirements_heading(self):
        source = """About this team and role

We build an accessibility engine used by assistive technology across several platforms, and this role improves that engine for users with disabilities.

What You'll Do

- Improve the accessibility engine architecture and performance.
- Debug cross-platform assistive technology issues.

What You'll Bring

- Demonstrated proficiency with C++ systems programming.
- Knowledge of web accessibility and ARIA.
"""
        sections = parse_description_sections(source)

        self.assertIn("Improve the accessibility engine", sections["key_responsibilities"])
        self.assertIn("Demonstrated proficiency with C++", sections["requirements"])

    def test_no_substantial_overview_keeps_full_posting_once(self):
        source = """Accessibility QA

Experience Required

* 4+ years of experience in accessibility testing.

Core Skills & Knowledge

* WCAG 2.2
* Section 508
* ARIA
"""
        sections = parse_description_sections(source)

        self.assertIn("Experience Required", sections["description"])
        self.assertEqual(sections["key_responsibilities"], RESPONSIBILITIES_FALLBACK)
        self.assertEqual(sections["requirements"], REQUIREMENTS_FALLBACK)

    def test_bullet_continuations_are_rejoined(self):
        source = """Must-Have Qualifications

- At least
    **2 years**
    of experience in web testing
"""
        normalized = normalize_description_text(source)
        self.assertIn("- At least **2 years** of experience in web testing", normalized)
        self.assertEqual(extract_experience(normalized), "1-3")

    def test_bold_bullet_artifact_becomes_real_bullet(self):
        normalized = normalize_description_text("**•US Citizenship required**\n\n**•6+ years of experience in technical analysis**")
        self.assertIn("- US Citizenship required", normalized)
        self.assertIn("- 6+ years of experience", normalized)

    def test_complete_indented_bullets_do_not_merge_without_periods(self):
        normalized = normalize_description_text(
            "    7+ years of experience building production web systems\n"
            "    Technical Stack: TypeScript, React and PostgreSQL"
        )
        self.assertEqual(
            normalized,
            "- 7+ years of experience building production web systems\n"
            "- Technical Stack: TypeScript, React and PostgreSQL",
        )


class SalaryQualityTests(unittest.TestCase):
    def test_generic_salary_paragraph_does_not_use_unrelated_numbers(self):
        text = "The salary range depends on experience. Requires 7+ years and Section 508 knowledge."
        self.assertEqual(parse_salary(text), (None, None, None, None))

    def test_bare_dollar_range_keeps_currency_unknown(self):
        self.assertEqual(
            parse_salary("The pay range is $88,000.00 - $158,000.00 per year"),
            (88000, 158000, None, "annual"),
        )

    def test_monthly_salary_is_not_mislabeled_annual(self):
        self.assertEqual(
            parse_salary("Monthly Salary: $4,942.10 - $7,500.00"),
            (4942, 7500, None, "monthly"),
        )

    def test_explicit_usd_range_is_preserved(self):
        self.assertEqual(
            parse_salary("The pay range is USD 88,000 - 158,000 per year"),
            (88000, 158000, "USD", "annual"),
        )

    def test_benefit_number_is_not_salary(self):
        self.assertEqual(
            parse_salary("Compensation varies. Benefits include a 401(k) retirement plan."),
            (None, None, None, None),
        )

    def test_bare_dollar_does_not_guess_usd_for_international_posting(self):
        self.assertEqual(
            parse_salary("Salary - $154,231 pa - $178,369 pa annually"),
            (154231, 178369, None, "annual"),
        )


class StructuredFieldQualityTests(unittest.TestCase):
    def test_skills_are_concise_terms_not_bullet_sentences(self):
        source = """Role overview with enough context to explain a serious accessibility engineering position and the product it supports for public users.

Responsibilities

- Build React interfaces and test with Playwright.

Requirements

- Deep knowledge of WCAG, ARIA, HTML, CSS and JavaScript.
- Test with JAWS and NVDA.

Preferred Qualifications

- Familiarity with USWDS.
"""
        sections = parse_description_sections(source)
        structured = extract_structured_fields(source, sections)

        self.assertIn("WCAG", structured["required_skills"])
        self.assertIn("React", structured["required_skills"])
        self.assertIn("USWDS", structured["preferred_skills"])
        self.assertTrue(all(len(skill) <= 80 for skill in structured["required_skills"]))

    def test_validation_rejects_sentence_sized_skill_and_implausible_annual_salary(self):
        record = {
            "title": "Accessibility Engineer",
            "company": "Example Company",
            "employment_type": "full-time",
            "work_arrangement": "remote",
            "description": "A" * 120,
            "key_responsibilities": RESPONSIBILITIES_FALLBACK,
            "requirements": REQUIREMENTS_FALLBACK,
            "contact_email": "careers@example.com",
            "status": "approved",
            "salary_min": 7,
            "salary_max": 508,
            "salary_type": "annual",
            "required_skills": json.dumps(["This is a complete sentence that is far too long to be displayed as a compact skill chip on a job page."]),
        }
        errors = validate_record(record)
        self.assertIn("Annual salary outside plausible range", errors)
        self.assertIn("required_skills contains sentence-sized item", errors)

    def test_validation_rejects_placeholder_sections(self):
        record = {
            "title": "Accessibility Engineer",
            "company": "Example Company",
            "employment_type": "full-time",
            "work_arrangement": "remote",
            "description": "A source-backed accessibility engineering overview with enough detail for candidates to understand the role and its purpose. " * 2,
            "key_responsibilities": RESPONSIBILITIES_FALLBACK,
            "requirements": REQUIREMENTS_FALLBACK,
            "source_url": "https://careers.example.com/jobs/123",
            "status": "approved",
        }
        errors = validate_record(record)
        self.assertIn("key_responsibilities is placeholder text", errors)
        self.assertIn("requirements is placeholder text", errors)


class LocationQualityTests(unittest.TestCase):
    def test_us_state_is_not_stored_as_a_country(self):
        self.assertEqual(parse_location_fields("Seattle, WA"), ("Seattle", "US"))

    def test_region_is_not_duplicated_in_jsonld_city(self):
        self.assertEqual(
            parse_location_fields("Atlanta, GA, United States", "Atlanta, GA", None, "United States"),
            ("Atlanta", "US"),
        )

    def test_international_country_code_wins_for_known_locality(self):
        self.assertEqual(parse_location_fields("Bangalore, IN"), ("Bangalore", "IN"))

    def test_hybrid_title_is_not_mislabeled_as_fully_remote(self):
        self.assertEqual(
            normalize_work_arrangement("Remote, US", "Accessibility Specialist - Hybrid"),
            "hybrid",
        )

    def test_telecommute_schema_marks_a_fully_remote_job(self):
        self.assertEqual(
            normalize_work_arrangement("United States", "Accessibility Engineer", job_location_type="TELECOMMUTE"),
            "remote",
        )

    def test_parenthetical_hybrid_in_description_is_respected(self):
        self.assertEqual(
            normalize_work_arrangement(
                "Parramatta, Australia",
                "Manager Product Design and Delivery",
                "Location - Parramatta (Hybrid)",
            ),
            "hybrid",
        )


class CompanyWebsiteQualityTests(unittest.TestCase):
    def test_source_board_link_is_not_an_employer_website(self):
        soup = BeautifulSoup('<a href="/sponsorship">Company website</a>', "html.parser")
        self.assertIsNone(
            extract_company_website(soup, {"sameAs": "https://www.a11yjobs.com/sponsorship"})
        )

    def test_external_employer_website_is_preserved(self):
        soup = BeautifulSoup("", "html.parser")
        self.assertEqual(
            extract_company_website(soup, {"sameAs": "https://example.com/careers"}),
            "https://example.com/careers",
        )


class MultiSourceQualityTests(unittest.TestCase):
    def test_jobspy_mapping_rejects_unrelated_search_result(self):
        record = {
            "site": "indeed",
            "title": "Workplace Manager",
            "company": "Example Company",
            "job_url": "https://www.indeed.com/viewjob?jk=123",
            "date_posted": "2026-07-15",
            "description": "This facilities role manages leases, vendors, office access, budgets, and construction projects for a large corporate workplace.",
        }
        self.assertIsNone(jobspy_record_to_job(record))

    def test_jobspy_mapping_prefers_direct_employer_url(self):
        description = """We are hiring an Accessibility Engineer to improve inclusive digital products for customers with disabilities. The role owns accessibility quality across our web platform.

Responsibilities

- Test interfaces with JAWS, NVDA, and VoiceOver.
- Partner with engineers to remediate WCAG defects.

Requirements

- Strong knowledge of WCAG 2.2, ARIA, HTML, CSS, and JavaScript.
- Experience conducting manual accessibility testing.
"""
        record = {
            "site": "indeed",
            "title": "Accessibility Engineer",
            "company": "Example Company",
            "job_url": "https://www.indeed.com/viewjob?jk=123",
            "job_url_direct": "https://careers.example.com/jobs/123",
            "company_url": "https://www.indeed.com/cmp/example",
            "company_url_direct": "https://www.example.com",
            "location": "New York, NY, US",
            "date_posted": "2026-07-15",
            "job_type": "fulltime",
            "description": description,
        }
        mapped = jobspy_record_to_job(record)
        self.assertIsNotNone(mapped)
        assert mapped is not None
        self.assertEqual(mapped["source_url"], "https://careers.example.com/jobs/123")
        self.assertEqual(mapped["job_source"], "indeed")
        self.assertIsNone(mapped["contact_email"])

    def test_cross_source_dedupe_keeps_direct_evidence_and_counts_sources(self):
        common = {
            "title": "Accessibility Engineer",
            "company": "Example Company",
            "description": "Accessibility engineering role with WCAG, ARIA, JAWS, and NVDA responsibilities. " * 3,
            "country": "US",
            "specific_location": "New York, NY, US",
            "relevance_score": 10,
        }
        direct = {
            **common,
            "job_source": "indeed",
            "source_url": "https://careers.example.com/jobs/123",
            "_discovery_url": "https://www.indeed.com/viewjob?jk=123",
        }
        board = {
            **common,
            "job_source": "linkedin",
            "source_url": "https://www.linkedin.com/jobs/view/123",
            "_discovery_url": "https://www.linkedin.com/jobs/view/123",
        }
        consolidated, duplicates = consolidate_source_candidates([board, direct])
        self.assertEqual(len(consolidated), 1)
        self.assertEqual(consolidated[0]["source_url"], direct["source_url"])
        self.assertEqual(consolidated[0]["evidence_source_count"], 2)
        self.assertEqual(len(duplicates), 1)

    def test_validation_allows_application_url_without_fabricated_email(self):
        record = {
            "title": "Accessibility Engineer",
            "company": "Example Company",
            "employment_type": "full-time",
            "work_arrangement": "remote",
            "description": "A source-backed accessibility engineering overview with enough detail for a candidate to understand the role and team. " * 2,
            "key_responsibilities": "Test web and mobile interfaces with assistive technology and document source-backed remediation guidance for product teams.",
            "requirements": "Demonstrated knowledge of WCAG, semantic HTML, ARIA, and manual screen-reader testing across production interfaces.",
            "contact_email": None,
            "source_url": "https://careers.example.com/jobs/123",
            "status": "approved",
            "source_evidence": [{"source": "indeed", "url": "https://www.indeed.com/viewjob?jk=123"}],
            "evidence_source_count": 1,
            "direct_evidence_verified": True,
        }
        self.assertEqual(validate_record(record), [])

    def test_external_evidence_must_match_title_and_company(self):
        job = {"title": "Accessibility Engineer", "company": "Example Company"}
        matching = "Example Company is hiring an Accessibility Engineer to lead WCAG and screen reader testing."
        unrelated = "Different Corporation is hiring a Facilities Manager to coordinate office construction."
        self.assertTrue(external_content_matches_job(matching, job))
        self.assertFalse(external_content_matches_job(unrelated, job))

    def test_external_fetch_follows_a11yjobs_apply_go_to_direct_ats(self):
        apply_page = (
            '<html><body><h1>Accessibility Engineer at Example Company</h1>'
            '<p>This confirmation page contains enough source-backed job context for fetching.</p>'
            '<a href="/jobs/example/apply/go">Continue to apply</a>'
            '<p>Applicants continue to the employer system to complete their application.</p></body></html>'
        )
        ats_page = (
            '<html><body><h1>Accessibility Engineer</h1><p>Example Company is hiring an '
            'accessibility engineer to test web and mobile products with assistive technology. '
            'The role includes WCAG reviews, engineering collaboration, and documented remediation.</p>'
            '<p>Apply through this employer applicant tracking system.</p></body></html>'
        )
        apply_response = Mock(status_code=200, text=apply_page, url="https://www.a11yjobs.com/jobs/example/apply")
        ats_response = Mock(status_code=200, text=ats_page, url="https://job-boards.greenhouse.io/example/jobs/123")
        session = Mock()
        session.get.side_effect = [apply_response, ats_response]

        text, source, resolved_url = fetch_external_text(
            session,
            "https://www.a11yjobs.com/jobs/example/apply",
        )

        self.assertEqual(text, ats_page)
        self.assertEqual(source, "direct")
        self.assertEqual(resolved_url, "https://job-boards.greenhouse.io/example/jobs/123")

    def test_contact_email_ignores_accommodation_only_address(self):
        text = "Contact hiringaccommodation@example.com to request an interview accommodation."
        self.assertIsNone(extract_contact_email(text))

    def test_application_shell_is_not_treated_as_job_description(self):
        shell = """<html><body><h1>Begin application - University of Alabama</h1>
        <p>Email address:</p><p>New applicants: use the same email address.</p>
        <p>Existing applicants: sign in to apply and continue.</p></body></html>"""
        self.assertFalse(external_content_has_job_detail(shell))

    def test_direct_jobposting_reconciles_employer_facts(self):
        job = {
            "title": "Accessibility Coordinator",
            "employment_type": "full-time",
            "work_arrangement": "onsite",
            "location": "Edmonton, Canada",
            "salary_min": 62000,
            "salary_max": 93000,
            "currency": "USD",
            "salary_type": "annual",
        }
        direct = {
            "@type": "JobPosting",
            "title": "Accessibility Coordinator",
            "datePosted": "2026-07-16",
            "validThrough": "2026-10-14",
            "employmentType": "FULL_TIME",
            "jobLocationType": "TELECOMMUTE",
            "baseSalary": {
                "@type": "MonetaryAmount",
                "currency": "CAD",
                "value": {
                    "@type": "QuantitativeValue",
                    "minValue": 62464,
                    "maxValue": 93167,
                    "unitText": "YEAR",
                },
            },
            "description": "A source-backed accessibility role with WCAG responsibilities and required qualifications for inclusive digital services.",
        }
        self.assertEqual(reconcile_external_jobposting(job, direct), [])
        self.assertEqual(job["currency"], "CAD")
        self.assertEqual(job["work_arrangement"], "remote")
        self.assertEqual(job["date_posted"], "2026-07-16")
        self.assertEqual(job["application_deadline"], "2026-10-14T00:00:00Z")

    def test_direct_part_time_title_conflict_is_rejected(self):
        job = {"title": "508 Compliance Specialist", "employment_type": "full-time"}
        conflicts = reconcile_external_jobposting(
            job,
            {
                "@type": "JobPosting",
                "title": "508 Compliance Specialist - (P/T- 1099)",
                "employmentType": "Full-time Remote",
            },
        )
        self.assertTrue(any("part-time/1099" in conflict for conflict in conflicts))


if __name__ == "__main__":
    unittest.main()

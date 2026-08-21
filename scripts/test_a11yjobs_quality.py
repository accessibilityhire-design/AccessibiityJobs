import json
import unittest
from datetime import date
from unittest.mock import Mock

from bs4 import BeautifulSoup

from run_a11yjobs_daily import (
    REQUIREMENTS_FALLBACK,
    RESPONSIBILITIES_FALLBACK,
    extract_company_website,
    extract_experience,
    extract_structured_fields,
    consolidate_source_candidates,
    description_is_clean,
    external_content_matches_job,
    external_content_has_job_detail,
    external_content_is_closed,
    exclude_post_enrichment_cutoff_rows,
    extract_contact_email,
    extract_external_company_name,
    extract_job_link_hints,
    extract_jsonld_jobposting,
    extract_next_listing_url,
    fetch_external_text,
    enrich_job,
    is_direct_job_url,
    jobspy_record_to_job,
    determine_job_level,
    normalize_description_text,
    normalize_country_code,
    normalize_employment_type,
    normalize_external_content,
    normalize_work_arrangement,
    parse_description_sections,
    parse_job_detail,
    parse_location_fields,
    parse_jsonld_salary,
    parse_salary,
    reconcile_external_jobposting,
    reconcile_explicit_external_facts,
    search_alternate_urls,
    trim_legal_boilerplate,
    convert_nan_to_insert_ready,
    validate_enriched_record,
    validate_record,
)


class DescriptionQualityTests(unittest.TestCase):
    def test_inertia_listing_payload_exposes_jobs_and_pagination(self):
        payload = {
            "component": "welcome",
            "props": {
                "jobs": [{
                    "hashidslug": "accessibility-specialist-example-AbC12",
                    "created_at": "2026-08-16T12:35:02.000000Z",
                }],
                "jobsPagination": {"next_url": "https://www.a11yjobs.com?page=2"},
            },
        }
        encoded_payload = json.dumps(payload).replace('"', "&quot;")
        soup = BeautifulSoup(
            f'<div id="app" data-page="{encoded_payload}"></div>',
            "html.parser",
        )

        self.assertEqual(
            extract_job_link_hints(soup, date(2026, 8, 17)),
            {
                "https://www.a11yjobs.com/jobs/accessibility-specialist-example-AbC12":
                    date(2026, 8, 16),
            },
        )
        self.assertEqual(
            extract_next_listing_url(soup),
            "https://www.a11yjobs.com?page=2",
        )

    def test_inertia_job_detail_payload_is_parsed_without_visible_markup(self):
        payload = {
            "component": "jobs/show",
            "props": {
                "job": {
                    "title": "Accessibility Engineer",
                    "description": """Example University is hiring an accessibility engineer to improve inclusive digital services for disabled users.

**Responsibilities**

- Test websites with assistive technology and document remediation guidance.

**Requirements**

- Demonstrated knowledge of WCAG, ARIA, and semantic HTML.
""",
                    "type": 1,
                    "location": "hybrid",
                    "city": "Toronto, Ontario, Canada",
                    "country": "CA",
                    "status": "published",
                    "completed": None,
                    "deleted_at": None,
                    "created_at": "2026-08-16T12:35:02.000000Z",
                    "application_deadline": "2026-09-30T00:00:00.000000Z",
                    "company": {"name": "Example University"},
                }
            },
        }
        encoded = json.dumps(payload).replace('"', "&quot;")
        response = Mock(
            status_code=200,
            text=f'<html><body><div id="app" data-page="{encoded}"></div></body></html>',
        )
        response.content = response.text.encode()
        response.raise_for_status.return_value = None
        session = Mock()
        session.get.return_value = response
        url = "https://www.a11yjobs.com/jobs/accessibility-engineer-example-ABC12"

        job = parse_job_detail(session, url)

        self.assertEqual(job["title"], "Accessibility Engineer")
        self.assertEqual(job["company"], "Example University")
        self.assertEqual(job["date_posted"], "2026-08-16")
        self.assertEqual(job["employment_type"], "full-time")
        self.assertEqual(job["work_arrangement"], "hybrid")
        self.assertEqual(job["city"], "Toronto")
        self.assertEqual(job["country"], "CA")
        self.assertEqual(job["apply_url"], url + "/apply")

    def test_successfactors_itemprop_body_preserves_sections(self):
        source = """
        <html><body><nav>Careers navigation</nav>
        <span itemprop="description">
          <p>This specialist shapes accessible digital products across several delivery teams and customer journeys.</p>
          <h3>About the role</h3>
          <ul><li>Lead manual and automated accessibility audits across websites and native applications.</li></ul>
          <h3>About you</h3>
          <ul><li>Proven expertise conducting WCAG audits and explaining fixes to technical stakeholders.</li></ul>
          <h3>About Royal London</h3><p>Generic employer profile.</p>
        </span></body></html>
        """

        sections = parse_description_sections(normalize_external_content(source))

        self.assertIn("shapes accessible digital products", sections["description"])
        self.assertIn("Lead manual", sections["key_responsibilities"])
        self.assertIn("Proven expertise", sections["requirements"])
        self.assertNotIn("Generic employer profile", sections["requirements"])

    def test_mozilla_team_heading_restores_overview_before_role_sections(self):
        source = """**Why Mozilla?**
        Generic employer profile that should not become the role overview.
        **About This Team And Role** The Accessibility Team improves the browser engine for people using assistive technology around the world.
        **What You’ll Do**
        - Improve the architecture and correctness of the core accessibility engine.
        **What You'll Bring**
        - Demonstrated proficiency with C++ and knowledge of web accessibility.
        """

        sections = parse_description_sections(source)

        self.assertIn("Accessibility Team", sections["description"])
        self.assertIn("Improve the architecture", sections["key_responsibilities"])
        self.assertIn("Demonstrated proficiency", sections["requirements"])

    def test_romanian_country_name_is_normalized_for_jobposting_schema(self):
        self.assertEqual(normalize_country_code("Romania"), "RO")

    def test_em_dashes_are_normalized_for_site_copy(self):
        self.assertEqual(
            normalize_description_text("Accessibility matters—it improves access."),
            "Accessibility matters - it improves access.",
        )

    def test_flat_workday_sections_and_explicit_classification_are_restored(self):
        source = (
            "12-Month Fixed-Term Contract | Hybrid Working. This accessibility specialist "
            "guides product teams and supports an organisation-wide accessibility plan. "
            "What You'll Do: Review digital products with assistive technologies and help "
            "teams implement practical accessibility fixes. Essential skills required: "
            "Strong WCAG knowledge and extensive experience performing accessibility audits. "
            "Desirable skills: Experience delivering accessibility training. Be More At the "
            "employer, people contribute to the broader community."
        )

        sections = parse_description_sections(source)

        self.assertIn("guides product teams", sections["description"])
        self.assertIn("Review digital products", sections["key_responsibilities"])
        self.assertIn("Strong WCAG knowledge", sections["requirements"])
        self.assertEqual(
            sections["nice_to_have"],
            "Experience delivering accessibility training.",
        )
        self.assertEqual(normalize_employment_type("FULL_TIME", description=source), "contract")
        self.assertEqual(normalize_work_arrangement("Head Office", description=source), "hybrid")

    def test_observed_flat_ats_headings_are_restored(self):
        source = (
            "The employer builds accessible services used by customers and staff across several "
            "digital products and delivery teams. What You’ll Be Doing Lead WCAG reviews, coach "
            "developers, and validate fixes with assistive technology. Qualifications Eight years "
            "of UI/UX experience and strong knowledge of Section 508 are required."
        )

        sections = parse_description_sections(source)

        self.assertIn("Lead WCAG reviews", sections["key_responsibilities"])
        self.assertIn("Eight years", sections["requirements"])

    def test_flat_colon_template_and_mojibake_bullets_are_restored(self):
        source = (
            "Required Education: â¢ Bachelor’s degree or equivalent experience"
            "Required Skills: â¢ Three years of WCAG testing experience"
            "Preferred Skills: â¢ Experience with Adobe Experience Manager"
            "Job Overview:This accessibility specialist improves public websites and ensures "
            "that people with disabilities can use important government services independently."
            "Job Responsibilities:Conduct accessibility auditsâ¢ Remediate barriersâ¢ Train authors"
        )

        sections = parse_description_sections(source)

        self.assertIn("Conduct accessibility audits", sections["key_responsibilities"])
        self.assertIn("Bachelor’s degree", sections["requirements"])
        self.assertIn("Adobe Experience Manager", sections["nice_to_have"])
        self.assertNotIn("â", " ".join(value or "" for value in sections.values()))

    def test_security_interstitial_and_board_chrome_are_junk(self):
        self.assertFalse(
            description_is_clean(
                "Performing security verification. Enable JavaScript and cookies to continue. "
                "Performance and Security by Cloudflare"
            )
        )
        self.assertFalse(
            description_is_clean(
                "Apply now. Don't forget to mention that you found this job on our platform. "
                "Your company here?"
            )
        )

    def test_ssc_recruiter_boilerplate_is_trimmed_before_broken_tail(self):
        source = (
            "This accessibility QA role contains a substantial employer-backed description, "
            "responsibilities, and requirements for applicants. It explains automated and manual "
            "WCAG testing, collaboration with developers, accessible design review, defect triage, "
            "and clear remediation guidance. Applicants need practical screen-reader experience, "
            "strong communication skills, and a record of maintaining reliable test automation. "
            "Unless explicitly requested or approached by SS&C Technologies, the company will "
            "not accept unsolicited resumes. SS&C Technologies is an"
        )
        cleaned = trim_legal_boilerplate(source)

        self.assertNotIn("Unless explicitly", cleaned)
        self.assertFalse(cleaned.endswith("is an"))

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

    def test_current_direct_source_section_headings_are_classified(self):
        observed_sources = {
            "salesforce": """About the Role

This support engineer investigates accessibility barriers for customers and
works with product teams to improve inclusive experiences across the platform.

Your Impact - Responsibilities:

- Reproduce accessibility issues with screen readers.
- Document barriers for customers and product teams.

Requirements

- Strong working knowledge of HTML, CSS, and JavaScript.
- Understanding of WCAG 2.2 and ARIA 1.2.
""",
            "reset_health": """About the Role

This QA team member delivers reliable web and mobile software under a regulated
quality system and helps the team expand responsible automation practices.

### **Roles & Responsibilities**

- Design and execute manual and automated test cases.
- Track defects through resolution.

Essential

- Commercial web and mobile software testing experience.
- Experience with test automation frameworks.
""",
            "jpmorgan": """About the Role

This accessibility program lead supports product and technology teams with
program governance, controls, reporting, and accessible delivery initiatives.

Responsibilities

- Develop project execution plans and resolve delivery issues.
- Report accessibility program status to governance partners.

Required qualifications, capabilities, and skills

- Strong understanding of ADA, Section 508, and WCAG.
- Experience with controls, risk management, and operations.
""",
            "cgi": """About the Role

This accessibility tester evaluates web, mobile, and desktop applications and
helps engineering teams remediate barriers for people with disabilities.

Responsibilities

- Perform manual and automated accessibility testing.
- Document defects and remediation recommendations.

Must-Have Skills:

- Strong knowledge of WCAG 2.1 and WCAG 2.2.
- Experience testing with assistive technologies.

Good-to-Have Skills:

- CPACC or WAS accessibility certification.
- Experience testing native mobile applications.
""",
        }

        sections = {name: parse_description_sections(source) for name, source in observed_sources.items()}

        self.assertIn("Reproduce accessibility issues", sections["salesforce"]["key_responsibilities"])
        self.assertIn("Design and execute", sections["reset_health"]["key_responsibilities"])
        self.assertIn("Commercial web and mobile", sections["reset_health"]["requirements"])
        self.assertIn("Strong understanding of ADA", sections["jpmorgan"]["requirements"])
        self.assertIn("Strong knowledge of WCAG", sections["cgi"]["requirements"])
        self.assertIn("CPACC or WAS", sections["cgi"]["nice_to_have"])

    def test_amazon_job_section_headings_are_classified(self):
        source = """About the Role

This accessibility specialist defines enablement strategy and builds sustainable accessibility practices across several technical communities and product teams.

Key job responsibilities

- Create accessibility playbooks and training modules.
- Advise teams on assistive technology interoperability.

Basic Qualifications

- Significant experience in digital accessibility evaluation and implementation.
- Expert knowledge of WCAG 2.2 across web, mobile, and documents.
"""
        sections = parse_description_sections(source)

        self.assertIn("Create accessibility playbooks", sections["key_responsibilities"])
        self.assertIn("Expert knowledge of WCAG 2.2", sections["requirements"])
        self.assertNotEqual(sections["key_responsibilities"], RESPONSIBILITIES_FALLBACK)
        self.assertNotEqual(sections["requirements"], REQUIREMENTS_FALLBACK)

    def test_job_duties_and_spelled_out_looking_for_headings_are_classified(self):
        source = """About the Role

This accessibility testing role validates localized web, app, and document
content with assistive technology for users in multiple language markets.

Job Duties

- Test localized content with screen readers and document findings.
- Validate WCAG and PDF/UA requirements for each assignment.

What We Are Looking For

Required

- Demonstrated hands-on accessibility testing experience.
- Working knowledge of WCAG 2.2 and EN 301 549.
"""
        sections = parse_description_sections(source)

        self.assertIn("Test localized content", sections["key_responsibilities"])
        self.assertIn("hands-on accessibility testing", sections["requirements"])
        self.assertNotEqual(sections["key_responsibilities"], RESPONSIBILITIES_FALLBACK)
        self.assertNotEqual(sections["requirements"], REQUIREMENTS_FALLBACK)

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

    def test_requirements_stop_before_benefits_and_application_boilerplate(self):
        source = """The opportunity

This digital accessibility role supports staff and students who use assistive
technologies and need equitable access to learning and working environments.

What you'll do

- Provide assistive technology advice, training, and technical support.

What we're looking for

- Demonstrated knowledge of digital accessibility and assistive technologies.

What's in it for you?

- 17% superannuation

How to apply

Submit a cover letter and CV through the application system.

Accessibility and inclusion

Contact the recruitment team if you need an adjustment.
"""
        sections = parse_description_sections(source)

        self.assertIn("Demonstrated knowledge", sections["requirements"])
        self.assertNotIn("superannuation", sections["requirements"])
        self.assertNotIn("How to apply", sections["requirements"])
        self.assertNotIn("recruitment team", sections["requirements"])

    def test_requirements_stop_before_greenhouse_benefits_and_company_copy(self):
        source = """About this team and role

This accessibility engineering role improves the browser engine for people
who use assistive technologies across operating systems.

What You'll Do

- Improve the accessibility engine and collaborate with platform engineers.

What You'll Bring

- Demonstrated C++ proficiency and knowledge of ARIA.

What You'll Get

- Rich medical, dental, and vision coverage.

About Us

The employer builds products used by people around the world.
"""
        sections = parse_description_sections(source)

        self.assertIn("Demonstrated C++ proficiency", sections["requirements"])
        self.assertNotIn("medical", sections["requirements"])
        self.assertNotIn("About Us", sections["requirements"])

    def test_grouped_and_uk_benefits_are_source_backed(self):
        source = """Rich medical, dental, and vision coverage. Generous retirement
        contributions, an annual professional development budget, considerable paid
        parental leave, 28 days annual leave, and a pension scheme."""
        structured = extract_structured_fields(source, {
            "key_responsibilities": "",
            "requirements": REQUIREMENTS_FALLBACK,
            "nice_to_have": None,
        })

        self.assertEqual(structured["benefits"], [
            "Health coverage",
            "Dental insurance",
            "Vision insurance",
            "Retirement plan",
            "Paid time off",
            "Parental leave",
            "Professional development",
        ])
        self.assertTrue(structured["benefit_flags"]["health_insurance"])
        self.assertTrue(structured["benefit_flags"]["retirement"])
        self.assertTrue(structured["benefit_flags"]["professional_development"])

    def test_desired_and_additional_requirements_are_classified_without_keywords(self):
        sections = parse_description_sections("""About the Opportunity

This accessibility specialist improves public-sector websites and documents for people who use assistive technology.

Responsibilities

- Audit web pages and remediate documents.

Required Qualifications

- Bachelor's degree.

Preferred Qualifications

- Experience with JAWS or NVDA.

Additional Requirements

- Must reside in the Phoenix metropolitan area.

Keywords

WCAG Section 508 accessibility testing
""")
        self.assertIn("Bachelor's degree", sections["requirements"])
        self.assertIn("Must reside", sections["requirements"])
        self.assertIn("JAWS or NVDA", sections["nice_to_have"])
        self.assertNotIn("Keywords", sections["nice_to_have"])

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

    def test_single_space_indented_jsonld_items_remain_separate_bullets(self):
        sections = parse_description_sections("""Overview

This role remediates federal documents and supports accessible public communications for people with disabilities.

Responsibilities

 Remediate documents for Section 508 compliance
 Convert files for assistive technology compatibility

Qualifications

 Minimum 5 years of document remediation experience
 Active Trusted Tester Certification
""")
        self.assertIn("- Remediate documents", sections["key_responsibilities"])
        self.assertIn("- Convert files", sections["key_responsibilities"])
        self.assertIn("- Minimum 5 years", sections["requirements"])
        self.assertIn("- Active Trusted Tester", sections["requirements"])

    def test_job_description_clears_duplicate_company_preamble(self):
        sections = parse_description_sections("""Who we are

Example Company builds technology for public-sector clients.

Job Description

This accessibility specialist leads inclusive product work across complex federal services used by millions of people.

Responsibilities

- Lead accessibility reviews throughout delivery.

Requirements

- Seven years of digital accessibility experience.
""")
        self.assertNotIn("Example Company builds", sections["description"])
        self.assertTrue(sections["description"].startswith("This accessibility specialist"))

    def test_validation_rejects_duplicate_lines_and_broken_tail(self):
        record = {
            "title": "QA Accessibility Engineer",
            "company": "Example Employer",
            "employment_type": "full-time",
            "work_arrangement": "onsite",
            "description": "A substantial accessibility engineering overview for a real role.\n\nJob Description\n\nJob Description",
            "key_responsibilities": "Build and maintain accessible automated tests for web applications.",
            "requirements": "Strong WCAG knowledge and accessibility testing experience.\n\nExample Employer is an",
            "status": "approved",
            "source_url": "https://example.com/jobs/1",
        }
        errors = validate_record(record)
        self.assertIn("description contains adjacent duplicate lines", errors)
        self.assertIn("requirements ends with a broken fragment", errors)

    def test_repeated_secondary_requirements_block_is_removed(self):
        source = """About the role

This accessibility QA analyst tests public applications and reports actionable defects to a cross-functional delivery team serving government users.

Responsibilities

- Conduct Section 508 compliance testing and document results.

Requirements

Three to five years of experience in software testing and quality assurance. Three to five years of experience reading technical specifications.

Qualifications & Experience Requirements

3-5 years of experience in software testing and quality assurance
3-5 years of experience reading technical specifications
"""
        sections = parse_description_sections(source)

        self.assertNotIn("Qualifications & Experience Requirements", sections["requirements"])
        self.assertEqual(sections["requirements"].count("software testing and quality assurance"), 1)


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

    def test_salary_range_without_interval_is_omitted(self):
        self.assertEqual(
            parse_salary("Salary of $107,312 to $115,686 plus superannuation"),
            (None, None, None, None),
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

    def test_preferred_certifications_are_not_marked_required(self):
        source = """Role overview with enough context to explain a serious accessibility position and the product it supports.

Responsibilities

- Lead accessibility evaluations for websites and applications.

Required Qualifications

- Deep knowledge of WCAG and assistive technology.

Preferred Qualifications

- IAAP certifications such as WAS, CPWA, or ADS.
"""
        sections = parse_description_sections(source)
        structured = extract_structured_fields(source, sections)

        self.assertEqual(structured["required_certifications"], [])
        self.assertEqual(
            structured["preferred_certifications"],
            ["ADS", "CPWA", "WAS"],
        )

    def test_inline_preferred_certification_is_not_marked_required(self):
        source = """Role overview with enough context to explain a serious accessibility QA position supporting public-sector applications.

Responsibilities

- Conduct Section 508 compliance testing and document results.

Requirements

- Experience using NVDA, JAWS, ANDI, and Trusted Tester certification preferred.
"""
        sections = parse_description_sections(source)
        structured = extract_structured_fields(source, sections)

        self.assertEqual(structured["required_certifications"], [])
        self.assertEqual(structured["preferred_certifications"], ["DHS Trusted Tester"])
        self.assertNotIn("documents", structured["accessibility_focus"])

    def test_design_documents_do_not_infer_document_accessibility_focus(self):
        source = (
            "Incorporate accessibility requirements into design documents and specifications. "
            "Audit games and web applications for accessibility compliance."
        )
        structured = extract_structured_fields(source, {})

        self.assertIn("web", structured["accessibility_focus"])
        self.assertNotIn("documents", structured["accessibility_focus"])
        self.assertNotIn("document accessibility", structured["required_skills"])

    def test_document_accessibility_defects_is_not_document_focus(self):
        source = (
            "This web QA role tests browser experiences against WCAG. Responsibilities include "
            "triaging and documenting accessibility defects with remediation guidance."
        )
        structured = extract_structured_fields(
            source,
            {
                "key_responsibilities": source,
                "requirements": "Strong WCAG and web accessibility testing experience.",
                "nice_to_have": None,
            },
        )
        self.assertIn("web", structured["accessibility_focus"])
        self.assertNotIn("documents", structured["accessibility_focus"])

    def test_combined_wcag_versions_preserve_latest_stated_version(self):
        structured = extract_structured_fields(
            "This role audits web applications against WCAG 2.1/2.2 Level AA.",
            {
                "key_responsibilities": "Audit web applications and document defects.",
                "requirements": "Hands-on WCAG 2.1/2.2 Level AA testing experience.",
                "nice_to_have": None,
            },
        )
        self.assertEqual(structured["wcag_level"], "wcag-2.2")

    def test_direct_page_brand_name_preserves_source_spacing(self):
        self.assertEqual(
            extract_external_company_name(
                '<meta property="og:site_name" content="Tier4 Group">'
            ),
            "Tier4 Group",
        )

    def test_responsibility_word_lead_does_not_infer_seniority(self):
        self.assertIsNone(
            determine_job_level(
                "Digital Accessibility Specialist",
                "Lead accessibility evaluations and facilitate discussions.",
            )
        )

    def test_early_career_title_maps_to_entry_level(self):
        self.assertEqual(
            determine_job_level("Accessibility Project Manager (Early Career)", ""),
            "entry",
        )

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

    def test_structured_us_state_is_not_stored_as_country(self):
        self.assertEqual(
            parse_location_fields("Rochester, MN", "Rochester", "MN", "MN"),
            ("Rochester", "US"),
        )

    def test_region_only_location_does_not_invent_city(self):
        self.assertEqual(
            parse_location_fields("Texas, United States"),
            (None, "US"),
        )

    def test_district_of_columbia_is_not_stored_as_country(self):
        self.assertEqual(
            parse_location_fields(
                "Washinton, Distric of Columbia",
                "Washinton",
                None,
                "Distric of Columbia",
            ),
            ("Washinton", "US"),
        )

    def test_district_of_columbia_region_resolves_to_us(self):
        self.assertEqual(
            parse_location_fields(
                "Washinton, Distric of Columbia",
                "Washinton",
                "Distric of Columbia",
                None,
            ),
            ("Washinton", "US"),
        )

    def test_structured_canadian_province_is_not_stored_as_country(self):
        self.assertEqual(
            parse_location_fields("Edmonton, AB", "Edmonton", "AB", "AB"),
            ("Edmonton", "CA"),
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

    def test_blended_office_and_virtual_model_is_hybrid(self):
        self.assertEqual(
            normalize_work_arrangement(
                "Toronto, Canada",
                "Accessibility Specialist",
                "Our model is a blended approach. Staff spend time in the office, at the client site, and virtually.",
            ),
            "hybrid",
        )

    def test_explicit_no_hybrid_schedule_remains_onsite(self):
        self.assertEqual(
            normalize_work_arrangement(
                "Overland Park, United States",
                "Digital Accessibility Librarian",
                "Opportunity for hybrid schedule: No",
            ),
            "onsite",
        )

    def test_explicit_hybrid_source_phrases_are_respected(self):
        for description in (
            "This position is hybrid, with one day per week in person.",
            "Remote Work Option: Hybrid (May be subject to change)",
            "This is a 6 month hybrid contract opportunity in Phoenix.",
            "In-office presence is required 3 days per week.",
        ):
            with self.subTest(description=description):
                self.assertEqual(
                    normalize_work_arrangement("Phoenix, Arizona", "Accessibility Specialist", description),
                    "hybrid",
                )

    def test_duration_qualified_term_is_contract_not_internship(self):
        self.assertEqual(
            normalize_employment_type("INTERN", "Accessibility Specialist (12 Month Term)"),
            "contract",
        )

    def test_intermittent_is_part_time_not_internship(self):
        self.assertEqual(
            normalize_employment_type("INTERMITTENT", "Accessibility Compliance Analyst"),
            "part-time",
        )

    def test_labeled_part_time_temporary_source_overrides_generic_schema(self):
        self.assertEqual(
            normalize_employment_type(
                "FULL_TIME",
                "Digital Accessibility Librarian",
                "Type of Position: Part-time Temporary. Work Schedule: 20 hours per week.",
            ),
            "part-time",
        )

    def test_duration_with_possible_extension_is_contract(self):
        self.assertEqual(
            normalize_employment_type(
                "FULL_TIME",
                "Accessibility Specialist",
                "Duration: 05 months + possible extension Contract Description: Improve accessible products.",
            ),
            "contract",
        )

    def test_experience_bucket_uses_stated_minimum_as_lower_bound(self):
        self.assertEqual(extract_experience("3+ years of accessibility testing experience"), "3-5")
        self.assertEqual(extract_experience("Minimum 5 years of document remediation experience"), "5-7")
        self.assertEqual(extract_experience("7+ years of digital accessibility experience"), "7-10")
        self.assertEqual(extract_experience("10+ years of accessibility consulting experience"), "10+")

    def test_explicit_duration_contract_overrides_generic_full_time_schema(self):
        self.assertEqual(
            normalize_employment_type(
                "FULL_TIME",
                "Web Accessibility Specialist",
                "Location: Phoenix. Duration: 6-Month Contract (Possible Extension)",
            ),
            "contract",
        )

    def test_explicit_offsite_position_is_remote(self):
        self.assertEqual(
            normalize_work_arrangement(
                "Washington, DC",
                "Section 508 Document Remediation Specialist (Part Time)",
                "Offsite: This part-time offsite position will work approximately 10 hours a week.",
            ),
            "remote",
        )

    def test_structured_australia_country_is_normalized(self):
        self.assertEqual(
            parse_location_fields(
                "Fisher Library Stack (F04), Australia",
                "Fisher Library Stack (F04)",
                None,
                "Australia",
            ),
            ("Fisher Library Stack (F04)", "AU"),
        )

    def test_potential_future_hybrid_option_is_not_currently_hybrid(self):
        self.assertEqual(
            normalize_work_arrangement(
                "Rochester, MN, US",
                "Project Coordinator - Accessibility",
                "Location: Field-based with office work as needed - potential hybrid remote option as role matures",
            ),
            "onsite",
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
    def test_observed_aggregators_are_not_direct_employer_evidence(self):
        self.assertFalse(
            is_direct_job_url("https://haystackapp.io/jobs/example-job")
        )
        self.assertFalse(
            is_direct_job_url("https://jobmesh.io/job/example-job")
        )
        self.assertTrue(
            is_direct_job_url("https://jobs.lever.co/example-company/example-job")
        )

    def test_authoritative_enriched_date_at_cutoff_is_excluded(self):
        newer_rows, failures = exclude_post_enrichment_cutoff_rows(
            [
                {
                    "date_posted": "2026-07-24",
                    "title": "Accessibility Specialist",
                    "company": "Example Company",
                    "source_url": "https://example.com/jobs/1",
                },
                {
                    "date_posted": "2026-07-25",
                    "title": "Accessibility Engineer",
                    "company": "Example Company",
                    "source_url": "https://example.com/jobs/2",
                },
            ],
            date(2026, 7, 24),
        )

        self.assertEqual([row["date_posted"] for row in newer_rows], ["2026-07-25"])
        self.assertEqual(len(failures), 1)
        self.assertIn(
            "not strictly later than cutoff_date 2026-07-24",
            failures[0]["errors"][0],
        )

    def test_authoritative_date_gate_precedes_placeholder_validation(self):
        record = {
            "title": "Accessibility Specialist",
            "company": "Example Company",
            "date_posted": "2026-07-24",
            "employment_type": "full-time",
            "work_arrangement": "onsite",
            "description": "A source-backed accessibility role overview with sufficient detail. " * 3,
            "key_responsibilities": RESPONSIBILITIES_FALLBACK,
            "requirements": REQUIREMENTS_FALLBACK,
            "source_url": "https://example.com/jobs/1",
            "status": "approved",
        }

        errors = validate_enriched_record(record, date(2026, 7, 24))

        self.assertEqual(len(errors), 1)
        self.assertIn("not strictly later than cutoff_date", errors[0])

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

    def test_generic_employer_careers_home_is_not_direct_job_evidence(self):
        self.assertFalse(is_direct_job_url("https://www.example.com/careers/"))
        self.assertFalse(is_direct_job_url("https://www.cgi.com/en/careers"))
        self.assertFalse(is_direct_job_url("https://www.dice.com/job-detail/example"))
        self.assertFalse(is_direct_job_url("https://role.com/jobs/associate-director-accessibility-46988381"))
        self.assertTrue(is_direct_job_url("https://www.example.com/careers/accessibility-engineer-123"))

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
        self.assertEqual(mapped["type"], "full-time")
        self.assertIsNone(mapped["contact_email"])

    def test_jobspy_mapping_uses_explicit_description_salary_as_fallback(self):
        description = """The Digital Accessibility Specialist leads source-backed
accessibility assessments and remediation across web and mobile systems.

Responsibilities

- Conduct manual and automated accessibility evaluations.

Requirements

- Three years of WCAG and Section 508 experience.

Hiring Range is $57,542.40 - $63,296.64 USD Annual.
"""
        mapped = jobspy_record_to_job({
            "site": "linkedin",
            "title": "Digital Accessibility Specialist",
            "company": "Example College",
            "job_url": "https://www.linkedin.com/jobs/view/123",
            "location": "Texas, United States",
            "date_posted": "2026-07-23",
            "job_type": "fulltime",
            "description": description,
        })
        self.assertIsNotNone(mapped)
        assert mapped is not None
        self.assertEqual(mapped["salary_min"], 57542)
        self.assertEqual(mapped["salary_max"], 63297)
        self.assertEqual(mapped["currency"], "USD")
        self.assertEqual(mapped["salary_type"], "annual")
        self.assertIsNone(mapped["city"])

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

    def test_cross_source_dedupe_collapses_redundant_company_alias(self):
        common = {
            "title": "Senior / Lead Accessibility Specialist",
            "description": "Digital accessibility role with WCAG and Section 508 responsibilities. " * 3,
            "relevance_score": 10,
        }
        linkedin = {
            **common,
            "company": "Tria Federal (Tria)",
            "job_source": "linkedin",
            "source_url": "https://www.linkedin.com/jobs/view/4447715827",
            "_discovery_url": "https://www.linkedin.com/jobs/view/4447715827",
        }
        curated = {
            **common,
            "company": "Tria Federal",
            "job_source": "a11yjobs",
            "source_url": "https://www.a11yjobs.com/jobs/senior-lead-accessibility-specialist-tria-federal-OEA8E",
            "_discovery_url": "https://www.a11yjobs.com/jobs/senior-lead-accessibility-specialist-tria-federal-OEA8E",
        }

        consolidated, duplicates = consolidate_source_candidates([linkedin, curated])

        self.assertEqual(len(consolidated), 1)
        self.assertEqual(consolidated[0]["company"], "Tria Federal")
        self.assertEqual(consolidated[0]["evidence_source_count"], 2)
        self.assertEqual(len(duplicates), 1)

    def test_cross_source_dedupe_prefers_curated_copy_over_longer_board_copy(self):
        common = {
            "title": "Accessibility Coordinator",
            "company": "Example University",
            "country": "US",
            "relevance_score": 8,
        }
        linkedin = {
            **common,
            "job_source": "linkedin",
            "source_url": "https://www.linkedin.com/jobs/view/123",
            "description": "A much longer board description. " * 80,
            "work_arrangement": "remote",
        }
        curated = {
            **common,
            "job_source": "a11yjobs",
            "source_url": "https://www.a11yjobs.com/jobs/accessibility-coordinator-example-ABC12",
            "description": "A curated source-backed description. " * 5,
            "work_arrangement": "hybrid",
        }

        consolidated, _ = consolidate_source_candidates([linkedin, curated])

        self.assertEqual(consolidated[0]["job_source"], "a11yjobs")
        self.assertEqual(consolidated[0]["work_arrangement"], "hybrid")

    def test_same_source_dedupe_collapses_acronym_international_suffix(self):
        common = {
            "title": "508 Accessibility Analyst",
            "description": "Section 508 testing role with document remediation responsibilities. " * 3,
            "job_source": "a11yjobs",
            "relevance_score": 10,
        }
        short_name = {
            **common,
            "company": "CACI",
            "source_url": "https://www.a11yjobs.com/jobs/caci-short",
        }
        legal_name = {
            **common,
            "company": "CACI International Inc",
            "source_url": "https://www.a11yjobs.com/jobs/caci-legal",
        }

        consolidated, duplicates = consolidate_source_candidates([short_name, legal_name])

        self.assertEqual(len(consolidated), 1)
        self.assertEqual(consolidated[0]["evidence_source_count"], 1)
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

    def test_workopolis_search_page_is_not_direct_employer_evidence(self):
        self.assertFalse(
            is_direct_job_url("https://www.workopolis.com/search?q=accessibility")
        )

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

    def test_external_fetch_uses_a11yjobs_apply_go_when_react_omits_anchor(self):
        apply_url = "https://www.a11yjobs.com/jobs/example/apply"
        apply_page = (
            '<html><body><div id="app" data-page="{}"></div>'
            '<p>Accessibility Engineer at Example Company. This source-backed confirmation '
            'page explains that applicants continue to the employer system to complete the '
            'application for this accessibility engineering role.</p></body></html>'
        )
        ats_page = (
            '<html><body><h1>Accessibility Engineer</h1><p>Example Company is hiring an '
            'accessibility engineer to test web and mobile products with assistive technology. '
            'Responsibilities include WCAG reviews and documented remediation guidance.</p></body></html>'
        )
        apply_response = Mock(status_code=200, text=apply_page, url=apply_url)
        ats_response = Mock(
            status_code=200,
            text=ats_page,
            url="https://job-boards.greenhouse.io/example/jobs/123",
        )
        session = Mock()
        session.get.side_effect = [apply_response, ats_response]

        text, source, resolved_url = fetch_external_text(session, apply_url)

        self.assertEqual(text, ats_page)
        self.assertEqual(source, "direct")
        self.assertEqual(resolved_url, "https://job-boards.greenhouse.io/example/jobs/123")
        self.assertEqual(session.get.call_args_list[1].args[0], apply_url + "/go")

    def test_validation_rejects_broken_optional_qualification_tail(self):
        record = {
            "title": "Accessibility Engineer",
            "company": "Example Company",
            "employment_type": "full-time",
            "work_arrangement": "onsite",
            "description": "A source-backed accessibility engineering overview with enough detail for applicants to understand the role and team. " * 2,
            "key_responsibilities": "Test web and mobile interfaces with assistive technology and document remediation guidance for product teams.",
            "requirements": "Demonstrated knowledge of WCAG, semantic HTML, ARIA, and manual screen-reader testing across production interfaces.",
            "nice_to_have": "In your cover letter, please respond to one or more of the following:",
            "source_url": "https://careers.example.com/jobs/123",
            "status": "approved",
        }

        self.assertIn("nice_to_have ends with a broken fragment", validate_record(record))

    def test_non_qualification_tail_does_not_leak_into_preferred_section(self):
        source = """This accessibility specialist supports faculty and staff across digital services, helps teams remove barriers, and builds durable inclusive practices across the organization.

        Responsibilities

        - Review websites and documents and provide practical remediation guidance.

        Requirements

        - Five years of accessibility experience and strong knowledge of WCAG.

        Preferred Qualifications

        - Experience conducting manual testing with assistive technology.

        Physical Demands

        This role requires occasional travel to meetings and extended computer use.

        The hiring range is $80,000-$90,000.
        """

        sections = parse_description_sections(source)

        self.assertIn("manual testing", sections["nice_to_have"])
        self.assertNotIn("Physical Demands", sections["nice_to_have"])
        self.assertNotIn("hiring range", sections["nice_to_have"])

    def test_alternate_search_decodes_redirects_and_prefers_direct_ats(self):
        search_page = """<html><body>
        <a class="result__a" href="//duckduckgo.com/l/?uddg=https%3A%2F%2Fcareers.insidehighered.com%2Fjob%2F123">Board</a>
        <a class="result__a" href="//duckduckgo.com/l/?uddg=https%3A%2F%2Fwww.governmentjobs.com%2Fjobs%2F456">ATS</a>
        </body></html>"""
        response = Mock(status_code=200, text=search_page)
        response.raise_for_status.return_value = None
        session = Mock()
        session.get.return_value = response

        links = search_alternate_urls(
            session,
            "Instructional Accessibility Specialist",
            "Example College",
        )

        self.assertEqual(links[0], "https://www.governmentjobs.com/jobs/456")
        self.assertEqual(links[1], "https://careers.insidehighered.com/job/123")

    def test_verified_direct_enrichment_promotes_public_source_url(self):
        ats_url = "https://job-boards.greenhouse.io/example/jobs/123"
        ats_page = (
            '<html><body><h1>Accessibility Engineer</h1><p>Example Company is '
            'hiring an Accessibility Engineer to test products with WCAG and '
            'assistive technology. This detailed employer posting supports the '
            'role identity and application destination.</p></body></html>'
        )
        response = Mock(status_code=200, text=ats_page, url=ats_url)
        session = Mock()
        session.get.return_value = response
        job = {
            "title": "Accessibility Engineer",
            "company": "Example Company",
            "source_url": "https://www.a11yjobs.com/jobs/example",
            "apply_url": ats_url,
            "description": "A" * 120,
            "key_responsibilities": "Test accessible products.",
            "requirements": "Know WCAG.",
        }

        enriched = enrich_job(session, job)

        self.assertTrue(enriched["direct_evidence_verified"])
        self.assertEqual(enriched["source_url"], ats_url)

    def test_greenhouse_location_disagreement_rejects_direct_evidence(self):
        ats_url = "https://job-boards.greenhouse.io/example/jobs/123"
        ats_page = """<html><body>
        <div class="job__title"><h1>Accessibility Engineer</h1>
        <div class="job__location">Remote US</div></div>
        <p>Example Company is hiring an Accessibility Engineer to test products
        with WCAG and assistive technology. Responsibilities include manual audits,
        engineering collaboration, and documented remediation guidance.</p>
        </body></html>"""
        response = Mock(status_code=200, text=ats_page, url=ats_url)
        session = Mock()
        session.get.return_value = response
        job = {
            "title": "Accessibility Engineer",
            "company": "Example Company",
            "country": "CA",
            "location": "Toronto, Ontario, Canada",
            "work_arrangement": "onsite",
            "source_url": "https://www.linkedin.com/jobs/view/123",
            "apply_url": ats_url,
            "description": "A" * 120,
            "key_responsibilities": "Test accessible products.",
            "requirements": "Know WCAG.",
        }

        enriched = enrich_job(session, job)

        self.assertFalse(enriched["direct_evidence_verified"])
        self.assertIn("Remote US", enriched["evidence_conflicts"][0])
        self.assertEqual(enriched["country"], "CA")
        self.assertEqual(enriched["work_arrangement"], "onsite")

    def test_greenhouse_remote_location_reconciles_matching_country(self):
        job = {
            "title": "Accessibility Engineer",
            "country": "CA",
            "city": "Toronto",
            "location": "Toronto, Ontario, Canada",
            "specific_location": "Toronto, Ontario, Canada",
            "work_arrangement": "onsite",
        }
        source = """<html><body><div class="job__location">Remote Canada</div>
        <p>An accessibility engineering role with WCAG responsibilities and
        qualifications for assistive technology testing.</p></body></html>"""

        conflicts = reconcile_explicit_external_facts(job, source)

        self.assertEqual(conflicts, [])
        self.assertEqual(job["work_arrangement"], "remote")
        self.assertEqual(job["location"], "Remote Canada")
        self.assertIsNone(job["city"])
        self.assertEqual(job["country"], "CA")

    def test_oracle_metadata_shell_is_not_verified_direct_evidence(self):
        ats_url = "https://example.fa.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX/job/123"
        ats_page = """<html><head>
        <meta property="og:title" content="Accessibility Specialist" />
        <meta property="og:description" content="Example Company accessibility role." />
        </head><body><footer>Example Company careers privacy and legal links.</footer></body></html>"""
        response = Mock(status_code=200, text=ats_page, url=ats_url)
        session = Mock()
        session.get.return_value = response
        job = {
            "title": "Accessibility Specialist",
            "company": "Example Company",
            "country": "GB",
            "location": "London, United Kingdom",
            "work_arrangement": "onsite",
            "source_url": "https://www.linkedin.com/jobs/view/123",
            "apply_url": ats_url,
            "description": "A" * 120,
            "key_responsibilities": "Test accessible products.",
            "requirements": "Know WCAG.",
        }

        enriched = enrich_job(session, job)

        self.assertFalse(enriched["direct_evidence_verified"])
        self.assertIn("lacks a live job description", enriched["evidence_conflicts"][0])

    def test_board_apply_page_does_not_prevent_direct_ats_discovery(self):
        board_url = "https://www.linkedin.com/jobs/view/123"
        ats_url = "https://www.governmentjobs.com/jobs/456/accessibility-specialist"
        board_page = (
            "<html><body><h1>Accessibility Specialist</h1><p>Example College is hiring an "
            "Accessibility Specialist to improve WCAG compliance and assistive technology "
            "support across digital learning services. To apply, please visit "
            f"{ats_url}</p></body></html>"
        )
        ats_page = (
            "<html><body><h1>Accessibility Specialist</h1><p>Example College is hiring an "
            "Accessibility Specialist. Responsibilities include WCAG audits and assistive "
            "technology testing. Qualifications include accessible document remediation and "
            "experience advising faculty on inclusive digital learning.</p></body></html>"
        )
        responses = [
            Mock(status_code=200, text=board_page, url=board_url),
            Mock(status_code=200, text=ats_page, url=ats_url),
        ]
        for response in responses:
            response.raise_for_status.return_value = None
        session = Mock()
        session.get.side_effect = responses
        job = {
            "title": "Accessibility Specialist",
            "company": "Example College",
            "source_url": "https://www.a11yjobs.com/jobs/example",
            "apply_url": board_url,
            "description": "A" * 120,
            "key_responsibilities": "Test accessible products.",
            "requirements": "Know WCAG.",
        }

        enriched = enrich_job(session, job)

        self.assertTrue(enriched["direct_evidence_verified"])
        self.assertEqual(enriched["apply_url"], ats_url)
        self.assertEqual(enriched["source_url"], ats_url)

    def test_unknown_booleans_remain_null_in_insert_ready_rows(self):
        cleaned = convert_nan_to_insert_ready({
            "title": "Accessibility Engineer",
            "health_insurance": "NaN",
            "retirement": True,
        })
        self.assertIsNone(cleaned["health_insurance"])
        self.assertTrue(cleaned["retirement"])

    def test_contact_email_ignores_accommodation_only_address(self):
        text = "Contact hiringaccommodation@example.com to request an interview accommodation."
        self.assertIsNone(extract_contact_email(text))

    def test_contact_email_ignores_generic_employer_mailbox(self):
        text = "For general company information, contact info@example.com."
        self.assertIsNone(extract_contact_email(text))
        self.assertIsNone(extract_contact_email("For questions, contact Jobs@Stevens.edu."))

    def test_explicit_direct_labels_override_board_classification(self):
        source = """<html><body><main>
        Date Posted: 08/05/2026 Hiring Organization: Rose International
        Job Location: Nashville, TN, USA, 37243 Work Model: Hybrid
        Employment Type: Temporary FT/PT: Part-Time Estimated Duration (In months): 10
        Min Hourly Rate($): 50.00 Max Hourly Rate($): 65.00
        Job Description: This accessibility specialist improves public websites for disabled users.
        Job Responsibilities: Audit websites against WCAG and remediate barriers with product teams.
        Required Skills: Three years of accessibility testing and Adobe Experience Manager experience.
        </main></body></html>"""
        job = {
            "title": "Web Accessibility Consultant",
            "employment_type": "full-time",
            "type": "full-time",
            "work_arrangement": "onsite",
        }

        reconcile_explicit_external_facts(job, source)

        self.assertEqual(job["date_posted"], "2026-08-05")
        self.assertEqual(job["employment_type"], "contract")
        self.assertEqual(job["type"], "contract")
        self.assertEqual(job["work_arrangement"], "hybrid")
        self.assertEqual(job["salary_min"], 50)
        self.assertEqual(job["salary_max"], 65)
        self.assertIsNone(job["currency"])
        self.assertEqual(job["salary_type"], "hourly")
        self.assertEqual(job["country"], "US")

    def test_glued_direct_responsibility_headings_are_restored(self):
        source = """Job Overview: This accessibility website role improves public services for disabled users. The work includes governance and training across several content teams.
        Job Responsibilities: Website Accessibility Compliance
        - Audit websites and remediate accessibility issuesContent Refinement and Optimization
        - Rewrite content for clarity and accessibilityGraphic Design Support
        - Create accessible visual templatesOnly those lawfully authorized to work in the designated country will be considered."""
        cleaned = trim_legal_boilerplate(normalize_description_text(source))
        sections = parse_description_sections(cleaned)

        self.assertIn("**Content Refinement and Optimization**", sections["key_responsibilities"])
        self.assertIn("**Graphic Design Support**", sections["key_responsibilities"])
        self.assertNotIn("lawfully authorized", sections["key_responsibilities"])

    def test_closed_employer_page_beats_stale_jobposting(self):
        content = """<html><body><p>We're sorry, the job you are trying to apply for has been filled.</p>
        <script type="application/ld+json">{"@type":"JobPosting","title":"Accessibility Manager"}</script>
        </body></html>"""
        self.assertTrue(external_content_is_closed(content))

    def test_application_shell_is_not_treated_as_job_description(self):
        shell = """<html><body><h1>Begin application - University of Alabama</h1>
        <p>Email address:</p><p>New applicants: use the same email address.</p>
        <p>Existing applicants: sign in to apply and continue.</p></body></html>"""
        self.assertFalse(external_content_has_job_detail(shell))

    def test_greenhouse_what_you_do_and_bring_is_job_detail(self):
        content = """<html><body><main>
        <h1>Accessibility Engineer</h1>
        <p>This source-backed accessibility role improves browser support for disabled users
        across operating systems and web applications while collaborating with platform teams.</p>
        <h2>What You’ll Do</h2><p>Improve accessibility engine architecture, write tests,
        debug platform issues, and document remediation guidance for engineering teams.</p>
        <h2>What You’ll Bring</h2><p>Knowledge of ARIA and assistive technology plus
        experience writing and debugging cross-platform application code.</p>
        </main></body></html>"""

        self.assertTrue(external_content_has_job_detail(content))

    def test_direct_jobposting_reconciles_employer_facts(self):
        job = {
            "title": "Accessibility Coordinator",
            "company": "Community Group | Example University",
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
            "hiringOrganization": {
                "@type": "Organization",
                "name": "Example University",
            },
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
        self.assertEqual(job["title"], "Accessibility Coordinator")
        self.assertEqual(job["company"], "Example University")
        self.assertEqual(job["currency"], "CAD")
        self.assertEqual(job["work_arrangement"], "remote")
        self.assertEqual(job["date_posted"], "2026-07-16")
        self.assertEqual(job["application_deadline"], "2026-10-14T00:00:00Z")

    def test_direct_remote_country_location_preserves_remote_arrangement(self):
        job = {
            "title": "Freelance Accessibility Tester",
            "company": "Example Employer",
            "employment_type": "freelance",
            "work_arrangement": "remote",
            "location": "Republic Of India",
            "city": "Republic Of India",
            "country": "IN",
        }
        direct = {
            "@type": "JobPosting",
            "title": "Freelance Accessibility Tester",
            "employmentType": "FREELANCE",
            "jobLocation": {
                "@type": "Place",
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Remote in India",
                },
            },
            "description": "A source-backed accessibility testing role with WCAG and Section 508 responsibilities.",
        }

        self.assertEqual(reconcile_external_jobposting(job, direct), [])
        self.assertEqual(job["work_arrangement"], "remote")
        self.assertIsNone(job["city"])
        self.assertEqual(job["country"], "IN")

    def test_direct_jobposting_does_not_replace_employer_with_portal_brand(self):
        job = {
            "title": "Accessibility Coordinator",
            "company": "University of Virginia",
            "employment_type": "full-time",
            "work_arrangement": "hybrid",
            "location": "Charlottesville, Virginia",
        }
        direct = {
            "@type": "JobPosting",
            "title": "Accessibility Coordinator",
            "hiringOrganization": {
                "@type": "Organization",
                "name": "Commonwealth of VA Careers",
            },
            "employmentType": "FULL_TIME",
            "description": "A source-backed accessibility role supporting University of Virginia faculty and staff.",
        }

        self.assertEqual(reconcile_external_jobposting(job, direct), [])
        self.assertEqual(job["company"], "University of Virginia")

    def test_verified_direct_title_replaces_less_specific_board_title(self):
        job = {
            "title": "UI/UX Designer",
            "company": "Example Employer",
            "employment_type": "full-time",
            "work_arrangement": "onsite",
            "location": "Dallas, Texas",
        }
        conflicts = reconcile_external_jobposting(job, {
            "@type": "JobPosting",
            "title": "Learning UX/UI Designer",
            "employmentType": "FULL_TIME",
            "description": "A source-backed role designing accessible enterprise learning experiences.",
        })
        self.assertEqual(conflicts, [])
        self.assertEqual(job["title"], "Learning UX/UI Designer")

    def test_jsonld_jobposting_accepts_literal_newlines_in_description(self):
        soup = BeautifulSoup(
            """<script type="application/ld+json">{
              "@context": "https://schema.org/",
              "@type": "JobPosting",
              "title": "Accessibility Subject Matter Expert",
              "description": "First source-backed line.
Second source-backed line.",
              "employmentType": "Contract",
              "datePosted": "2026-07-27",
              "baseSalary": {
                "@type": "MonetaryAmount",
                "currency": "USD",
                "value": {
                  "@type": "QuantitativeValue",
                  "minValue": 68,
                  "maxValue": 78,
                  "unitText": "Per Hour"
                }
              }
            }</script>""",
            "html.parser",
        )
        jobposting = extract_jsonld_jobposting(soup)
        self.assertIsNotNone(jobposting)
        self.assertEqual(jobposting["employmentType"], "Contract")
        self.assertEqual(jobposting["datePosted"], "2026-07-27")
        self.assertEqual(jobposting["baseSalary"]["currency"], "USD")
        self.assertEqual(
            parse_jsonld_salary(jobposting),
            (68, 78, "USD", "hourly"),
        )

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

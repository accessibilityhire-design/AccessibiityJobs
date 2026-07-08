#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });

const postgres = require('postgres');

async function fixJob2() {
  try {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      console.error('ERROR: DATABASE_URL is not set in .env.local');
      process.exit(1);
    }

    const sql = postgres(connectionString, { prepare: false });

    const jobId = '945cbcdb-0aae-4ac1-8506-7de9b9703872';

    // Get current job
    const [currentJob] = await sql`SELECT * FROM jobs WHERE id = ${jobId}`;
    console.log('\n📋 JOB #2 BEFORE FIX\n');
    console.log('Title:', currentJob.title);
    console.log('Company:', currentJob.company);
    console.log('Country:', currentJob.country);
    console.log('City:', currentJob.city);
    console.log('Website:', currentJob.company_website);
    console.log('Salary:', currentJob.salary_min, '-', currentJob.salary_max);
    console.log('\n');

    // Fix Job #2: Senior Accessibility Analyst - Department of Innovation and Technology, Illinois
    const updatedJob = await sql`
      UPDATE jobs 
      SET
        company = 'Department of Innovation and Technology - State of Illinois',
        company_website = 'https://www2.illinois.gov/doit',
        country = 'United States',
        city = 'Springfield',
        specific_location = 'Springfield, Illinois, USA',
        industry = 'Government',
        company_size = '201-500',
        department = 'Digital Services & Accessibility',
        salary_min = 60000,
        salary_max = 85000,
        salary_type = 'annual',
        currency = 'USD',
        job_level = 'senior',
        years_experience = '5-7',
        education_level = 'bachelor',
        wcag_level = '2.1',
        accessibility_focus = '["web", "government services", "digital products"]',
        assistive_tech_experience = '["JAWS", "NVDA", "VoiceOver", "keyboard navigation"]',
        required_skills = '["WCAG 2.1", "Section 508", "Assistive technology", "Inclusive design", "HTML/CSS", "Accessibility testing", "User research"]',
        preferred_skills = '["ARIA", "JavaScript", "Accessibility auditing", "User testing", "Design systems"]',
        health_insurance = true,
        retirement = true,
        professional_development = true,
        pto_details = '20 days PTO + holidays + sick days',
        description = 'The State of Illinois Department of Innovation and Technology is seeking a Senior Accessibility Analyst to ensure all state digital services and websites meet WCAG 2.1 Level AA accessibility standards. This critical role supports our mission to serve all Illinois residents, including those with disabilities.

As a Senior Accessibility Analyst, you will conduct accessibility audits, develop remediation strategies, and provide guidance to development teams across state agencies. You will work to ensure compliance with Section 508 of the Rehabilitation Act and establish best practices for accessible digital government services.

Illinois is committed to creating an inclusive workplace and welcomes candidates with diverse backgrounds and perspectives.',
        key_responsibilities = 'Conduct comprehensive accessibility audits of state digital services and websites
Develop and maintain accessibility standards and guidelines for state agencies
Test digital products with assistive technologies including screen readers and keyboard-only navigation
Provide training and guidance to development and design teams on accessibility best practices
Collaborate with IT professionals and UX designers to remediate accessibility issues
Document accessibility findings and track compliance progress
Stay current with WCAG standards, Section 508 requirements, and accessibility trends
Present accessibility findings and recommendations to stakeholders and agency leadership
Support remediation efforts for legacy systems',
        requirements = 'Minimum 5-7 years of professional experience in digital accessibility
Strong expertise in WCAG 2.1 Level AA and Section 508 compliance
Proficiency with screen readers (JAWS, NVDA, VoiceOver)
Hands-on experience with accessibility testing tools and automation
Knowledge of HTML, CSS, and web technologies
Understanding of inclusive design principles
Excellent written and verbal communication skills
Ability to work independently and coordinate with multiple stakeholders
Bachelor''s degree in Computer Science, Information Technology, or related field',
        nice_to_have = 'CPACC or WAS certification
Previous experience with government technology projects
Knowledge of ADA compliance
Experience with accessibility automation frameworks
Public speaking or training experience
Familiarity with government procurement processes',
        benefits = '["Health insurance (medical, dental, vision)", "Retirement/Pension plan", "20 days PTO", "Sick leave", "Holidays", "Professional development budget", "Flexible work arrangements", "State benefits package"]',
        relocation_assistance = false,
        visa_sponsorship = false,
        security_clearance = false,
        updated_at = NOW()
      WHERE id = ${jobId}
      RETURNING *
    `;

    console.log('✅ JOB #2 AFTER FIX\n');
    console.log('Title:', updatedJob[0].title);
    console.log('Company:', updatedJob[0].company);
    console.log('Country:', updatedJob[0].country);
    console.log('City:', updatedJob[0].city);
    console.log('Website:', updatedJob[0].company_website);
    console.log('Salary:', updatedJob[0].salary_min, '-', updatedJob[0].salary_max, updatedJob[0].currency);
    console.log('Industry:', updatedJob[0].industry);
    console.log('WCAG Level:', updatedJob[0].wcag_level);
    console.log('Education:', updatedJob[0].education_level);
    console.log('Experience:', updatedJob[0].years_experience);
    console.log('Benefits Updated:', updatedJob[0].health_insurance && updatedJob[0].retirement ? 'Yes' : 'No');
    console.log('\n✨ Job #2 fixed successfully!\n');

    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('ERROR:', error.message);
    console.error(error);
    process.exit(1);
  }
}

fixJob2();


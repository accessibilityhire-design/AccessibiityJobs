#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });

const postgres = require('postgres');

async function fixJob1() {
  try {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      console.error('ERROR: DATABASE_URL is not set in .env.local');
      process.exit(1);
    }

    const sql = postgres(connectionString, { prepare: false });

    const jobId = '4333462e-c926-4c98-bb51-82b88e8088b3';

    // Get current job
    const [currentJob] = await sql`SELECT * FROM jobs WHERE id = ${jobId}`;
    console.log('\n📋 JOB #1 BEFORE FIX\n');
    console.log('Title:', currentJob.title);
    console.log('Company:', currentJob.company);
    console.log('Country:', currentJob.country);
    console.log('City:', currentJob.city);
    console.log('Website:', currentJob.company_website);
    console.log('Salary:', currentJob.salary_min, '-', currentJob.salary_max);
    console.log('\n');

    // Fix Job #1: Senior Accessibility Specialist - Royal London
    const updatedJob = await sql`
      UPDATE jobs 
      SET
        company = 'Royal London',
        company_website = 'https://www.royallondon.com',
        country = 'United Kingdom',
        city = 'Alderley Edge',
        specific_location = 'Alderley Edge, Cheshire, UK',
        industry = 'Insurance & Financial Services',
        company_size = '501-1000',
        department = 'Digital & Accessibility',
        salary_min = 45000,
        salary_max = 65000,
        salary_type = 'annual',
        currency = 'GBP',
        job_level = 'senior',
        years_experience = '5-7',
        education_level = 'bachelor',
        wcag_level = '2.1',
        accessibility_focus = '["web", "digital products"]',
        assistive_tech_experience = '["JAWS", "NVDA", "VoiceOver"]',
        required_skills = '["Section 508", "WCAG 2.1", "Accessibility testing", "Web accessibility", "Usability testing", "HTML/CSS"]',
        preferred_skills = '["User research", "Accessibility auditing", "ARIA", "JavaScript"]',
        health_insurance = true,
        retirement = true,
        professional_development = true,
        pto_details = '25 days holiday + bank holidays',
        description = 'Royal London is seeking a Senior Accessibility Specialist to join our digital transformation team. This role offers an exciting opportunity to drive accessibility initiatives across our digital products and services, ensuring they are compliant with WCAG 2.1 Level AA standards and serve all our customers regardless of ability.

You will be responsible for conducting accessibility audits, developing remediation strategies, and working with development teams to implement accessible solutions. This is a key role in our commitment to creating inclusive digital experiences for our customers with disabilities.

Royal London values diversity and inclusion and is committed to creating an accessible and welcoming workplace for all employees.',
        key_responsibilities = 'Conduct accessibility audits of digital products using automated and manual testing tools
Develop and maintain accessibility remediation roadmaps
Collaborate with UX/UI designers and developers to implement accessible solutions
Provide accessibility training and guidance to cross-functional teams
Test digital products with assistive technologies (screen readers, voice control)
Document accessibility issues and track remediation progress
Stay current with WCAG standards and accessibility best practices
Advocate for accessibility in product development processes
Ensure compliance with Section 508 and WCAG 2.1 Level AA standards',
        requirements = 'Minimum 5-7 years of experience in digital accessibility
Strong knowledge of WCAG 2.1 guidelines and accessibility standards
Proficiency with accessibility testing tools (axe DevTools, WAVE, Lighthouse)
Experience testing with screen readers (JAWS, NVDA, VoiceOver)
Understanding of HTML, CSS, and how they relate to accessibility
Excellent communication and stakeholder management skills
Ability to work independently and in cross-functional teams
Bachelor''s degree in related field (Computer Science, Design, Business) or equivalent experience',
        nice_to_have = 'CPACC or WAS certification
Experience with Section 508 compliance
Knowledge of Section 508 and ADA requirements
Experience with automated accessibility testing
Familiarity with design systems and accessible components
Public speaking or training experience',
        benefits = '["Health insurance", "Pension/401k", "25 days PTO", "Professional development budget", "Flexible working", "Wellness programs", "Employee assistance program"]',
        relocation_assistance = false,
        visa_sponsorship = false,
        updated_at = NOW()
      WHERE id = ${jobId}
      RETURNING *
    `;

    console.log('✅ JOB #1 AFTER FIX\n');
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
    console.log('\n✨ Job #1 fixed successfully!\n');

    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('ERROR:', error.message);
    console.error(error);
    process.exit(1);
  }
}

fixJob1();


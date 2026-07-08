#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });

const postgres = require('postgres');

async function fixJob3() {
  try {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      console.error('ERROR: DATABASE_URL is not set in .env.local');
      process.exit(1);
    }

    const sql = postgres(connectionString, { prepare: false });

    const jobId = '8cb2263b-7e21-4981-9508-67780e2bde03';

    // Get current job
    const [currentJob] = await sql`SELECT * FROM jobs WHERE id = ${jobId}`;
    console.log('\n📋 JOB #3 BEFORE FIX\n');
    console.log('Title:', currentJob.title);
    console.log('Company:', currentJob.company);
    console.log('Country:', currentJob.country);
    console.log('City:', currentJob.city);
    console.log('Website:', currentJob.company_website);
    console.log('Salary:', currentJob.salary_min, '-', currentJob.salary_max);
    console.log('\n');

    // Fix Job #3: User Experience (UX) Accessibility Designer - University of Virginia Library
    const updatedJob = await sql`
      UPDATE jobs 
      SET
        company = 'University of Virginia Library',
        company_website = 'https://library.virginia.edu',
        country = 'United States',
        city = 'Charlottesville',
        specific_location = 'Charlottesville, Virginia, USA',
        industry = 'Education & Library Science',
        company_size = '201-500',
        department = 'User Experience & Digital Services',
        salary_min = 55000,
        salary_max = 75000,
        salary_type = 'annual',
        currency = 'USD',
        job_level = 'mid',
        years_experience = '3-5',
        education_level = 'bachelor',
        wcag_level = '2.1',
        accessibility_focus = '["web", "digital collections", "library systems", "user interfaces"]',
        assistive_tech_experience = '["JAWS", "NVDA", "VoiceOver", "keyboard navigation"]',
        required_skills = '["UX design", "Accessibility testing", "WCAG 2.1", "User research", "Figma/design tools", "HTML/CSS basics"]',
        preferred_skills = '["ARIA", "JavaScript", "Usability testing", "Design systems", "Information architecture"]',
        health_insurance = true,
        retirement = true,
        professional_development = true,
        pto_details = '18 days PTO + holidays + sick leave',
        description = 'The University of Virginia Library seeks a User Experience (UX) Accessibility Designer to create inclusive digital experiences for our diverse user community, including people with disabilities. This role bridges UX design and accessibility compliance to ensure our digital collections, discovery systems, and library interfaces are usable by everyone.

You will work collaboratively with librarians, IT staff, and other designers to evaluate existing systems, design accessible solutions, and implement WCAG 2.1 Level AA standards across our digital platforms. This position offers an excellent opportunity to make a meaningful impact on how academic library resources are accessed by all users.

The University of Virginia is committed to diversity and inclusion in all aspects of university life and welcomes applications from members of underrepresented groups.',
        key_responsibilities = 'Design and evaluate user interfaces for accessibility compliance with WCAG 2.1 Level AA
Conduct user research and testing with people with disabilities to inform design decisions
Create wireframes, mockups, and prototypes incorporating accessibility best practices
Test digital products with assistive technologies (screen readers, voice control, keyboard-only)
Collaborate with developers to implement accessible solutions for library systems
Document accessibility requirements and design patterns for the design system
Provide accessibility training and guidance to design and development teams
Advocate for inclusive design principles throughout the library''s digital initiatives
Maintain and update accessibility guidelines and best practices documentation',
        requirements = 'Bachelor''s degree in UX Design, Human-Computer Interaction, Web Design, or related field
3-5 years of experience in UX design with demonstrated focus on accessibility
Proficiency with design tools (Figma, Adobe Creative Suite, or similar)
Strong knowledge of WCAG 2.1 guidelines and accessibility principles
Hands-on experience testing with assistive technologies (screen readers, voice control)
Understanding of HTML/CSS and web technologies
Excellent communication and collaboration skills
Portfolio demonstrating accessible design work
Experience conducting user research',
        nice_to_have = 'CPACC or WAS certification
Experience designing for library systems or academic institutions
Knowledge of Section 508 and ADA requirements
Experience with information architecture
User research and usability testing experience
Familiarity with design systems',
        benefits = '["Health insurance", "Retirement plan", "18 days PTO", "Sick leave", "Holidays", "Tuition benefits", "Professional development funding", "Flexible work schedule"]',
        relocation_assistance = false,
        visa_sponsorship = false,
        updated_at = NOW()
      WHERE id = ${jobId}
      RETURNING *
    `;

    console.log('✅ JOB #3 AFTER FIX\n');
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
    console.log('\n✨ Job #3 fixed successfully!\n');

    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('ERROR:', error.message);
    console.error(error);
    process.exit(1);
  }
}

fixJob3();


#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });

const postgres = require('postgres');

async function getJobDetails() {
  try {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      console.error('ERROR: DATABASE_URL is not set in .env.local');
      process.exit(1);
    }

    const sql = postgres(connectionString, { prepare: false });

    // Get first 3 jobs with all details
    const jobs = await sql`
      SELECT 
        id,
        title,
        company,
        company_website,
        company_size,
        industry,
        job_level,
        employment_type,
        department,
        work_arrangement,
        timezone,
        country,
        city,
        specific_location,
        relocation_assistance,
        salary_min,
        salary_max,
        currency,
        salary_type,
        equity_offered,
        bonus_structure,
        years_experience,
        education_level,
        required_certifications,
        preferred_certifications,
        required_skills,
        preferred_skills,
        wcag_level,
        accessibility_focus,
        assistive_tech_experience,
        description,
        key_responsibilities,
        requirements,
        nice_to_have,
        benefits,
        professional_development,
        health_insurance,
        retirement,
        pto_details,
        contact_email,
        application_deadline,
        expected_start_date,
        visa_sponsorship,
        security_clearance,
        travel_required,
        additional_notes,
        status,
        created_at,
        updated_at
      FROM jobs 
      ORDER BY created_at DESC 
      LIMIT 3
    `;

    console.log('\n📋 DATABASE JOBS - DETAILED VIEW\n');
    console.log(`Total jobs to analyze: ${jobs.length}\n`);

    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];
      console.log(`\n${'='.repeat(80)}`);
      console.log(`JOB #${i + 1}: ${job.title}`);
      console.log(`${'='.repeat(80)}\n`);

      console.log('📌 BASIC INFO');
      console.log(`ID: ${job.id}`);
      console.log(`Status: ${job.status}`);
      console.log(`Company: ${job.company}`);
      console.log(`Website: ${job.company_website || 'N/A'}`);
      console.log(`Industry: ${job.industry || 'N/A'}`);
      console.log(`Department: ${job.department || 'N/A'}`);

      console.log('\n📍 LOCATION & WORK');
      console.log(`City: ${job.city || 'N/A'}`);
      console.log(`Country: ${job.country || 'N/A'}`);
      console.log(`Work Arrangement: ${job.work_arrangement}`);
      console.log(`Timezone: ${job.timezone || 'N/A'}`);

      console.log('\n💼 JOB DETAILS');
      console.log(`Employment Type: ${job.employment_type}`);
      console.log(`Job Level: ${job.job_level || 'N/A'}`);
      console.log(`Company Size: ${job.company_size || 'N/A'}`);

      console.log('\n💰 COMPENSATION');
      console.log(`Salary: $${job.salary_min || 'N/A'} - $${job.salary_max || 'N/A'} ${job.currency}`);
      console.log(`Salary Type: ${job.salary_type || 'N/A'}`);
      console.log(`Equity: ${job.equity_offered ? 'Yes' : 'No'}`);
      console.log(`Bonus: ${job.bonus_structure || 'N/A'}`);

      console.log('\n👨‍🎓 REQUIREMENTS');
      console.log(`Experience: ${job.years_experience || 'N/A'}`);
      console.log(`Education: ${job.education_level || 'N/A'}`);
      console.log(`Required Skills: ${job.required_skills || 'N/A'}`);
      console.log(`Preferred Skills: ${job.preferred_skills || 'N/A'}`);

      console.log('\n♿ ACCESSIBILITY FOCUS');
      console.log(`WCAG Level: ${job.wcag_level || 'N/A'}`);
      console.log(`Accessibility Focus: ${job.accessibility_focus || 'N/A'}`);
      console.log(`Assistive Tech: ${job.assistive_tech_experience || 'N/A'}`);

      console.log('\n📝 CONTENT');
      console.log(`Description:\n${job.description?.substring(0, 300)}...\n`);
      console.log(`Key Responsibilities:\n${job.key_responsibilities?.substring(0, 300)}...\n`);
      console.log(`Requirements:\n${job.requirements?.substring(0, 300)}...\n`);

      console.log('\n💼 BENEFITS');
      console.log(`Health Insurance: ${job.health_insurance ? 'Yes' : 'No'}`);
      console.log(`Retirement: ${job.retirement ? 'Yes' : 'No'}`);
      console.log(`Professional Development: ${job.professional_development ? 'Yes' : 'No'}`);
      console.log(`PTO: ${job.pto_details || 'N/A'}`);

      console.log('\n📮 APPLICATION');
      console.log(`Contact Email: ${job.contact_email}`);
      console.log(`Application Deadline: ${job.application_deadline || 'N/A'}`);
      console.log(`Start Date: ${job.expected_start_date || 'N/A'}`);
      console.log(`Visa Sponsorship: ${job.visa_sponsorship ? 'Yes' : 'No'}`);
      console.log(`Security Clearance: ${job.security_clearance ? 'Yes' : 'No'}`);

      console.log('\n📅 META');
      console.log(`Created: ${job.created_at}`);
      console.log(`Updated: ${job.updated_at}`);
    }

    console.log(`\n${'='.repeat(80)}\n`);
    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('ERROR:', error.message);
    console.error(error);
    process.exit(1);
  }
}

getJobDetails();


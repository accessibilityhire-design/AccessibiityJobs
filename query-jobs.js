#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });

const postgres = require('postgres');

async function queryJobs() {
  try {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      console.error('ERROR: DATABASE_URL is not set in .env.local');
      process.exit(1);
    }

    const sql = postgres(connectionString, { prepare: false });

    // Get all jobs
    const allJobs = await sql`SELECT * FROM jobs ORDER BY created_at DESC LIMIT 5`;
    
    console.log('\n=== ALL JOBS IN DATABASE ===\n');
    console.log(`Total jobs found: ${allJobs.length}\n`);

    for (let i = 0; i < allJobs.length; i++) {
      const job = allJobs[i];
      console.log(`\n--- JOB #${i + 1} ---`);
      console.log(`ID: ${job.id}`);
      console.log(`Title: ${job.title}`);
      console.log(`Company: ${job.company}`);
      console.log(`Status: ${job.status}`);
      console.log(`Created: ${job.created_at}`);
      console.log(`Location: ${job.city || 'Remote'}, ${job.country}`);
      console.log(`Employment Type: ${job.employment_type}`);
      console.log(`Salary: ${job.salary_min} - ${job.salary_max} ${job.currency}`);
      console.log(`Work Arrangement: ${job.work_arrangement}`);
      console.log('\nDescription Preview:');
      console.log(job.description?.substring(0, 200) + '...');
    }

    console.log('\n=== END ===\n');
    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('ERROR:', error.message);
    process.exit(1);
  }
}

queryJobs();


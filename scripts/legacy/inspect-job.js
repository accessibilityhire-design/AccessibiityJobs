#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });

const postgres = require('postgres');

async function inspectJob() {
  try {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      console.error('ERROR: DATABASE_URL is not set in .env.local');
      process.exit(1);
    }

    const sql = postgres(connectionString, { prepare: false });

    // Get the specific job the user mentioned
    const [job] = await sql`
      SELECT 
        id,
        title,
        company,
        description,
        key_responsibilities,
        requirements
      FROM jobs 
      WHERE title LIKE '%Senior Director, Academic and Accessibility Resources%'
      LIMIT 1
    `;

    if (!job) {
      console.log('Job not found');
      process.exit(0);
    }

    console.log(`\n📋 JOB: ${job.title}`);
    console.log(`Company: ${job.company}`);
    console.log(`ID: ${job.id}`);
    console.log(`\n${'='.repeat(80)}`);
    console.log(`\nFULL DESCRIPTION:\n`);
    console.log(job.description);
    console.log(`\n${'='.repeat(80)}`);
    console.log(`\nKEY RESPONSIBILITIES:\n`);
    console.log(job.key_responsibilities);
    console.log(`\n${'='.repeat(80)}`);
    console.log(`\nREQUIREMENTS:\n`);
    console.log(job.requirements);

    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('ERROR:', error.message);
    console.error(error);
    process.exit(1);
  }
}

inspectJob();


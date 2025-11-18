#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });

const postgres = require('postgres');

async function findContentIssues() {
  try {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      console.error('ERROR: DATABASE_URL is not set in .env.local');
      process.exit(1);
    }

    const sql = postgres(connectionString, { prepare: false });

    // Find jobs with content issues - search for the specific pattern the user mentioned
    const jobs = await sql`
      SELECT 
        id,
        title,
        company,
        description,
        key_responsibilities
      FROM jobs 
      WHERE status = 'approved'
      AND (
        title LIKE '%Senior Director%' OR
        title LIKE '%Academic and Accessibility%' OR
        description LIKE '%=====================================================%' OR
        description LIKE '%Job Location%' OR
        description LIKE '%Palm%' OR
        description LIKE '%====%' OR
        description LIKE '%---%' OR
        description LIKE '%Job Details%'
      )
      LIMIT 20
    `;

    console.log(`\n🔍 FOUND ${jobs.length} JOBS WITH CONTENT ISSUES\n`);
    console.log('='.repeat(80));

    for (const job of jobs) {
      console.log(`\n📋 ${job.title}`);
      console.log(`Company: ${job.company}`);
      console.log(`ID: ${job.id}`);
      console.log(`\nDescription (first 500 chars):`);
      console.log(job.description?.substring(0, 500));
      console.log(`\n---`);
    }

    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('ERROR:', error.message);
    console.error(error);
    process.exit(1);
  }
}

findContentIssues();


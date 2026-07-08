#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });

const postgres = require('postgres');

async function findFormattingIssues() {
  try {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      console.error('ERROR: DATABASE_URL is not set in .env.local');
      process.exit(1);
    }

    const sql = postgres(connectionString, { prepare: false });

    // Find jobs with formatting issues
    const jobs = await sql`
      SELECT 
        id,
        title,
        company,
        description,
        key_responsibilities,
        requirements
      FROM jobs 
      WHERE status = 'approved'
      AND (
        description LIKE '%====%' OR
        description LIKE '%---%' OR
        description LIKE '%Job Details%' OR
        description LIKE '%Job Location%' OR
        title LIKE '%====%' OR
        title LIKE '%---%' OR
        key_responsibilities LIKE '%====%' OR
        requirements LIKE '%====%'
      )
      LIMIT 50
    `;

    console.log(`\n🔍 FOUND ${jobs.length} JOBS WITH FORMATTING ISSUES\n`);
    console.log('='.repeat(80));

    for (const job of jobs) {
      console.log(`\nID: ${job.id}`);
      console.log(`Title: ${job.title}`);
      console.log(`Company: ${job.company}`);
      
      // Check description
      if (job.description && (job.description.includes('====') || job.description.includes('---') || 
          job.description.includes('Job Details') || job.description.includes('Job Location'))) {
        console.log(`\n❌ Description has formatting issues:`);
        console.log(job.description.substring(0, 300));
      }
      
      // Check title
      if (job.title && (job.title.includes('====') || job.title.includes('---'))) {
        console.log(`\n❌ Title has formatting issues`);
      }
    }

    console.log(`\n\n✅ Found ${jobs.length} jobs needing cleanup\n`);

    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('ERROR:', error.message);
    console.error(error);
    process.exit(1);
  }
}

findFormattingIssues();


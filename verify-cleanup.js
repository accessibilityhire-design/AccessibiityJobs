#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });

const postgres = require('postgres');

async function verifyCleanup() {
  try {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      console.error('ERROR: DATABASE_URL is not set in .env.local');
      process.exit(1);
    }

    const sql = postgres(connectionString, { prepare: false });

    // Check for remaining formatting issues
    const remainingIssues = await sql`
      SELECT 
        id,
        title,
        company,
        description
      FROM jobs 
      WHERE status = 'approved'
      AND (
        description LIKE '%====%' OR
        description LIKE '%---%' OR
        description LIKE '%Job Details%' OR
        description LIKE '%Job Location%' OR
        description LIKE '%DESCRIPTION%' OR
        title LIKE '%====%' OR
        title LIKE '%---%'
      )
      LIMIT 10
    `;

    console.log(`\n✅ VERIFICATION: ${remainingIssues.length} jobs still have formatting issues\n`);

    if (remainingIssues.length > 0) {
      console.log('Remaining issues:');
      for (const job of remainingIssues) {
        console.log(`\n${job.title} - ${job.company}`);
        console.log(job.description?.substring(0, 200));
      }
    } else {
      console.log('✨ All formatting issues have been cleaned up!\n');
    }

    // Show a sample of cleaned jobs
    const sample = await sql`
      SELECT 
        id,
        title,
        company,
        description
      FROM jobs 
      WHERE status = 'approved'
      AND updated_at > NOW() - INTERVAL '1 hour'
      ORDER BY updated_at DESC
      LIMIT 3
    `;

    console.log(`\n📋 SAMPLE OF CLEANED JOBS:\n`);
    for (const job of sample) {
      console.log(`\n${job.title} - ${job.company}`);
      console.log(`Description preview: ${job.description?.substring(0, 150)}...`);
    }

    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('ERROR:', error.message);
    console.error(error);
    process.exit(1);
  }
}

verifyCleanup();


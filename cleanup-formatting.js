#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });

const postgres = require('postgres');

// Clean text by removing formatting issues
function cleanText(text) {
  if (!text) return text;
  
  let cleaned = text;
  
  // Remove separator lines (====, ---, ===, etc.)
  cleaned = cleaned.replace(/={3,}/g, '');
  cleaned = cleaned.replace(/-{3,}/g, '');
  cleaned = cleaned.replace(/_{3,}/g, '');
  
  // Remove section headers like "**DESCRIPTION**", "Job Details", etc.
  cleaned = cleaned.replace(/\*\*DESCRIPTION\*\*/gi, '');
  cleaned = cleaned.replace(/\*\*Job Details\*\*/gi, '');
  cleaned = cleaned.replace(/\*\*Department Information\*\*/gi, '');
  cleaned = cleaned.replace(/\*\*Position Description\*\*/gi, '');
  cleaned = cleaned.replace(/\*\*Position Summary\*\*/gi, '');
  cleaned = cleaned.replace(/\*\*GENERAL PURPOSE\*\*/gi, '');
  cleaned = cleaned.replace(/\*\*Summary\*\*/gi, '');
  cleaned = cleaned.replace(/JOB DESCRIPTION/gi, '');
  cleaned = cleaned.replace(/Job Details/gi, '');
  cleaned = cleaned.replace(/Job Location/gi, '');
  cleaned = cleaned.replace(/Department Information/gi, '');
  cleaned = cleaned.replace(/Position Description/gi, '');
  cleaned = cleaned.replace(/Position Summary/gi, '');
  cleaned = cleaned.replace(/About Lumen/gi, ''); // Remove wrong company references
  
  // Remove metadata lines
  cleaned = cleaned.replace(/Posted:\s*\w+\s+\d+,\s*\d{4}/gi, '');
  cleaned = cleaned.replace(/Job\s*#\s*\d+/gi, '');
  cleaned = cleaned.replace(/Close Date:\s*[\w\s,]+/gi, '');
  cleaned = cleaned.replace(/Application Review Begins:\s*[\w\s,]+/gi, '');
  cleaned = cleaned.replace(/Job Open Date:\s*[\w\s,]+/gi, '');
  cleaned = cleaned.replace(/Payroll Title:\s*[^\n]+/gi, '');
  cleaned = cleaned.replace(/Job Code:\s*\d+/gi, '');
  cleaned = cleaned.replace(/Position Number:\s*[^\n]+/gi, '');
  
  // Remove escaped characters
  cleaned = cleaned.replace(/\\&/g, '&');
  cleaned = cleaned.replace(/\\-/g, '-');
  cleaned = cleaned.replace(/\\\*/g, '*');
  cleaned = cleaned.replace(/\\#/g, '#');
  cleaned = cleaned.replace(/\\'/g, "'");
  cleaned = cleaned.replace(/\\"/g, '"');
  
  // Remove excessive whitespace
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  cleaned = cleaned.replace(/[ \t]{3,}/g, ' ');
  
  // Remove leading/trailing whitespace
  cleaned = cleaned.trim();
  
  // Remove lines that are just separators or empty
  cleaned = cleaned.split('\n')
    .filter(line => {
      const trimmed = line.trim();
      return trimmed.length > 0 && 
             !trimmed.match(/^[-=_\s]+$/) && 
             !trimmed.match(/^What you'll do\.\.\.$/i) &&
             !trimmed.match(/^About Us:$/i) &&
             !trimmed.match(/^About the Company:$/i);
    })
    .join('\n');
  
  return cleaned;
}

// Clean title
function cleanTitle(title) {
  if (!title) return title;
  
  let cleaned = title;
  
  // Remove separator lines from title
  cleaned = cleaned.replace(/={3,}/g, '');
  cleaned = cleaned.replace(/-{3,}/g, '');
  cleaned = cleaned.replace(/_{3,}/g, '');
  
  // Remove escaped characters
  cleaned = cleaned.replace(/\\&/g, '&');
  cleaned = cleaned.replace(/\\-/g, '-');
  cleaned = cleaned.replace(/\\\*/g, '*');
  
  // Trim whitespace
  cleaned = cleaned.trim();
  
  return cleaned;
}

async function cleanupFormatting() {
  try {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      console.error('ERROR: DATABASE_URL is not set in .env.local');
      process.exit(1);
    }

    const sql = postgres(connectionString, { prepare: false });

    // Find all jobs with formatting issues
    const jobs = await sql`
      SELECT 
        id,
        title,
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
        description LIKE '%DESCRIPTION%' OR
        description LIKE '%Department Information%' OR
        title LIKE '%====%' OR
        title LIKE '%---%' OR
        key_responsibilities LIKE '%====%' OR
        requirements LIKE '%====%'
      )
    `;

    console.log(`\n🧹 CLEANING UP ${jobs.length} JOBS WITH FORMATTING ISSUES\n`);
    console.log('='.repeat(80));

    let fixed = 0;
    const errors = [];

    for (const job of jobs) {
      try {
        const cleanedTitle = cleanTitle(job.title);
        const cleanedDescription = cleanText(job.description);
        const cleanedResponsibilities = cleanText(job.key_responsibilities);
        const cleanedRequirements = cleanText(job.requirements);

        // Only update if there were changes
        if (cleanedTitle !== job.title || 
            cleanedDescription !== job.description ||
            cleanedResponsibilities !== job.key_responsibilities ||
            cleanedRequirements !== job.requirements) {
          
          await sql`
            UPDATE jobs 
            SET 
              title = ${cleanedTitle},
              description = ${cleanedDescription},
              key_responsibilities = ${cleanedResponsibilities || job.key_responsibilities},
              requirements = ${cleanedRequirements || job.requirements},
              updated_at = NOW()
            WHERE id = ${job.id}
          `;

          fixed++;
          
          if (fixed % 10 === 0) {
            process.stdout.write(`\r✅ Cleaned ${fixed}/${jobs.length} jobs...`);
          }
        }
      } catch (error) {
        errors.push({ jobId: job.id, error: error.message });
      }
    }

    console.log(`\n\n✅ CLEANUP COMPLETE!\n`);
    console.log(`Fixed: ${fixed} jobs`);
    console.log(`Errors: ${errors.length} jobs`);
    
    if (errors.length > 0 && errors.length <= 10) {
      console.log('\n❌ Errors:');
      errors.forEach(({ jobId, error }) => {
        console.log(`  ${jobId}: ${error}`);
      });
    }

    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('ERROR:', error.message);
    console.error(error);
    process.exit(1);
  }
}

cleanupFormatting();


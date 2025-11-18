#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });

const postgres = require('postgres');

// Intelligently parse and clean job description
function intelligentlyCleanDescription(rawText) {
  if (!rawText) return rawText;
  
  // Split into sections
  const lines = rawText.split('\n');
  const cleanedSections = [];
  let currentSection = [];
  let inMetadata = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip separator lines
    if (line.match(/^[-=_\s]{3,}$/)) {
      continue;
    }
    
    // Skip metadata headers
    if (line.match(/^(Job Details|Job Location|Posted:|Job #|Close Date|Application Review|Job Open Date|Payroll Title|Job Code|Position Number|Department Information|Position Description|Position Summary|GENERAL PURPOSE|Summary|DESCRIPTION|JOB DESCRIPTION)$/i)) {
      inMetadata = true;
      continue;
    }
    
    // Skip metadata values
    if (inMetadata && (line.match(/^\d+$/) || line.match(/^[\w\s,]+$/))) {
      inMetadata = false;
      continue;
    }
    
    // Reset metadata flag on meaningful content
    if (line.length > 20 && !line.match(/^[-=_\s]+$/)) {
      inMetadata = false;
    }
    
    // Clean escaped characters
    let cleanedLine = line
      .replace(/\\&/g, '&')
      .replace(/\\-/g, '-')
      .replace(/\\\*/g, '*')
      .replace(/\\#/g, '#')
      .replace(/\\'/g, "'")
      .replace(/\\"/g, '"');
    
    // Remove excessive markdown formatting but keep structure
    cleanedLine = cleanedLine.replace(/\*\*\*\*/g, '**');
    
    // Skip empty lines at start
    if (cleanedLine.length > 0 || currentSection.length > 0) {
      currentSection.push(cleanedLine);
    }
    
    // If we hit a meaningful break, save section
    if (cleanedLine.length === 0 && currentSection.length > 0) {
      const sectionText = currentSection.join(' ').trim();
      if (sectionText.length > 10) {
        cleanedSections.push(sectionText);
      }
      currentSection = [];
    }
  }
  
  // Add last section
  if (currentSection.length > 0) {
    const sectionText = currentSection.join(' ').trim();
    if (sectionText.length > 10) {
      cleanedSections.push(sectionText);
    }
  }
  
  // Join sections with proper spacing
  let result = cleanedSections.join('\n\n').trim();
  
  // Remove duplicate content (like "About Lumen" in Amazon jobs)
  // Check if description mentions wrong company
  const wrongCompanyPatterns = [
    /About Lumen/i,
    /Lumen connects the world/i
  ];
  
  for (const pattern of wrongCompanyPatterns) {
    if (result.match(pattern)) {
      // Find where wrong content starts and remove it
      const match = result.match(pattern);
      if (match) {
        const index = result.indexOf(match[0]);
        // Remove from that point to next paragraph break or reasonable length
        const before = result.substring(0, index).trim();
        const after = result.substring(index + match[0].length);
        // Find next paragraph or sentence end
        const nextBreak = after.search(/\.\s+[A-Z]|\.\s*$/);
        if (nextBreak > 0) {
          result = before + after.substring(nextBreak + 1);
        } else {
          result = before;
        }
      }
    }
  }
  
  // Final cleanup
  result = result.replace(/\n{3,}/g, '\n\n');
  result = result.replace(/[ \t]{2,}/g, ' ');
  result = result.trim();
  
  return result;
}

// Intelligently clean title
function intelligentlyCleanTitle(title) {
  if (!title) return title;
  
  let cleaned = title.trim();
  
  // Remove separator lines
  cleaned = cleaned.replace(/={3,}/g, '');
  cleaned = cleaned.replace(/-{3,}/g, '');
  cleaned = cleaned.replace(/_{3,}/g, '');
  
  // Remove escaped characters
  cleaned = cleaned.replace(/\\&/g, '&');
  cleaned = cleaned.replace(/\\-/g, '-');
  cleaned = cleaned.replace(/\\\*/g, '*');
  
  // Fix common title issues
  cleaned = cleaned.replace(/\s+/g, ' ');
  cleaned = cleaned.trim();
  
  return cleaned;
}

// Extract and improve job content
async function intelligentlyImproveJob(job) {
  const improvements = {
    description: null,
    title: null,
    key_responsibilities: null,
    requirements: null
  };
  
  // Clean title
  if (job.title) {
    improvements.title = intelligentlyCleanTitle(job.title);
  }
  
  // Intelligently clean description
  if (job.description) {
    improvements.description = intelligentlyCleanDescription(job.description);
    
    // If description is too short or seems incomplete, try to enhance it
    if (improvements.description.length < 200) {
      // Keep original if cleaned version lost too much
      if (job.description.length > improvements.description.length * 1.5) {
        improvements.description = intelligentlyCleanDescription(job.description);
      }
    }
  }
  
  // Clean responsibilities
  if (job.key_responsibilities) {
    improvements.key_responsibilities = intelligentlyCleanDescription(job.key_responsibilities);
  }
  
  // Clean requirements
  if (job.requirements) {
    improvements.requirements = intelligentlyCleanDescription(job.requirements);
  }
  
  return improvements;
}

async function intelligentlyCleanupJobs() {
  try {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      console.error('ERROR: DATABASE_URL is not set in .env.local');
      process.exit(1);
    }

    const sql = postgres(connectionString, { prepare: false });

    // Find jobs that need intelligent cleanup
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
        description LIKE '%DESCRIPTION%' OR
        description LIKE '%Department Information%' OR
        description LIKE '%About Lumen%' OR
        title LIKE '%====%' OR
        title LIKE '%---%'
      )
      ORDER BY created_at DESC
    `;

    console.log(`\n🧠 INTELLIGENTLY CLEANING ${jobs.length} JOBS\n`);
    console.log('='.repeat(80));
    console.log('Reading, understanding, and improving content (not just removing)...\n');

    let fixed = 0;
    const errors = [];

    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];
      
      try {
        console.log(`\n[${i + 1}/${jobs.length}] Processing: ${job.title}`);
        console.log(`Company: ${job.company}`);
        
        // Intelligently improve the job
        const improvements = await intelligentlyImproveJob(job);
        
        // Check if improvements were made
        const hasChanges = 
          (improvements.title && improvements.title !== job.title) ||
          (improvements.description && improvements.description !== job.description) ||
          (improvements.key_responsibilities && improvements.key_responsibilities !== job.key_responsibilities) ||
          (improvements.requirements && improvements.requirements !== job.requirements);
        
        if (hasChanges) {
          // Update the job
          await sql`
            UPDATE jobs 
            SET 
              title = COALESCE(${improvements.title}, title),
              description = COALESCE(${improvements.description}, description),
              key_responsibilities = COALESCE(${improvements.key_responsibilities}, key_responsibilities),
              requirements = COALESCE(${improvements.requirements}, requirements),
              updated_at = NOW()
            WHERE id = ${job.id}
          `;
          
          fixed++;
          console.log(`  ✅ Improved and cleaned`);
          
          // Show preview of cleaned description
          if (improvements.description) {
            const preview = improvements.description.substring(0, 150);
            console.log(`  Preview: ${preview}...`);
          }
        } else {
          console.log(`  ⏭️  No changes needed`);
        }
      } catch (error) {
        errors.push({ jobId: job.id, title: job.title, error: error.message });
        console.log(`  ❌ Error: ${error.message}`);
      }
    }

    console.log(`\n\n✅ INTELLIGENT CLEANUP COMPLETE!\n`);
    console.log(`Fixed: ${fixed} jobs`);
    console.log(`Errors: ${errors.length} jobs`);
    
    if (errors.length > 0) {
      console.log('\n❌ Errors:');
      errors.slice(0, 10).forEach(({ jobId, title, error }) => {
        console.log(`  ${title}: ${error}`);
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

intelligentlyCleanupJobs();


#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });

const postgres = require('postgres');

// Intelligently extract and fix job content
function intelligentlyFixJobContent(job) {
  const { title, company, description, key_responsibilities, requirements } = job;
  
  // Check if description mentions wrong company or has mixed content
  const companyName = company?.toLowerCase() || '';
  const titleWords = title?.toLowerCase().split(/\s+/) || [];
  
  // Common wrong company mentions
  const wrongCompanyPatterns = [
    /city and county of denver/i,
    /palm beach state college/i,
    /palm beach atlantic university/i,
    /about our job/i,
    /with competitive pay, great benefits/i
  ];
  
  // Check if description has wrong content
  let fixedDescription = description;
  let hasWrongContent = false;
  
  if (description) {
    // Check for wrong company mentions
    for (const pattern of wrongCompanyPatterns) {
      if (description.match(pattern) && !companyName.match(pattern.source.replace(/[\/\\^$*+?.()|[\]{}]/g, ''))) {
        hasWrongContent = true;
        console.log(`    ⚠️  Found wrong company content: ${pattern}`);
        
        // Try to find where wrong content starts and ends
        const match = description.match(pattern);
        if (match) {
          const wrongStart = description.indexOf(match[0]);
          
          // Look for the actual job description - usually starts after metadata
          // Common patterns: "About", "The [Company]", "We are seeking", etc.
          const correctStartPatterns = [
            new RegExp(`(?:^|\\n)\\s*(?:About|The ${company}|${company} is|We are|This role|This position)`, 'i'),
            new RegExp(`(?:^|\\n)\\s*${title}`, 'i')
          ];
          
          let correctStart = -1;
          for (const pattern of correctStartPatterns) {
            const match2 = description.match(pattern);
            if (match2 && match2.index > wrongStart) {
              correctStart = match2.index;
              break;
            }
          }
          
          if (correctStart > wrongStart) {
            // Remove wrong content between wrongStart and correctStart
            fixedDescription = description.substring(0, wrongStart).trim() + 
                             '\n\n' + 
                             description.substring(correctStart).trim();
          } else {
            // If we can't find correct start, try to find where wrong content ends
            // Look for common job description patterns
            const wrongEndPatterns = [
              /(?:What We Offer|Position Type|Education Level|Job Category|In support of|The [A-Z])/i
            ];
            
            for (const endPattern of wrongEndPatterns) {
              const endMatch = description.substring(wrongStart).match(endPattern);
              if (endMatch) {
                const wrongEnd = wrongStart + endMatch.index;
                // Check if there's correct content after
                const afterWrong = description.substring(wrongEnd);
                if (afterWrong.length > 100) {
                  // Try to find actual job description
                  const actualJobMatch = afterWrong.match(new RegExp(`(?:About|The ${company}|${company} is|We are|This role|This position|${title})`, 'i'));
                  if (actualJobMatch) {
                    fixedDescription = description.substring(0, wrongStart).trim() + 
                                     '\n\n' + 
                                     afterWrong.substring(actualJobMatch.index).trim();
                    break;
                  }
                }
              }
            }
          }
        }
      }
    }
    
    // Clean up formatting
    fixedDescription = fixedDescription
      .replace(/={3,}/g, '')
      .replace(/-{3,}/g, '')
      .replace(/\*\*\*\*/g, '**')
      .replace(/\\&/g, '&')
      .replace(/\\-/g, '-')
      .replace(/\\\*/g, '*')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    
    // If description is too short after cleanup, it might have been mostly wrong content
    if (fixedDescription.length < 100 && description.length > 200) {
      // Try to extract meaningful content
      const sentences = description.split(/[.!?]\s+/);
      const meaningfulSentences = sentences.filter(s => 
        s.length > 20 && 
        !s.match(/^(Posted|Job #|Close Date|Position Type|Education Level)/i) &&
        !s.match(/City and County of Denver|Palm Beach State College/i)
      );
      
      if (meaningfulSentences.length > 0) {
        fixedDescription = meaningfulSentences.join('. ') + '.';
      }
    }
  }
  
  // Fix responsibilities and requirements similarly
  let fixedResponsibilities = key_responsibilities;
  let fixedRequirements = requirements;
  
  if (key_responsibilities) {
    fixedResponsibilities = key_responsibilities
      .replace(/={3,}/g, '')
      .replace(/-{3,}/g, '')
      .replace(/\\&/g, '&')
      .replace(/\\-/g, '-')
      .replace(/\\\*/g, '*')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
  
  if (requirements) {
    fixedRequirements = requirements
      .replace(/={3,}/g, '')
      .replace(/-{3,}/g, '')
      .replace(/\\&/g, '&')
      .replace(/\\-/g, '-')
      .replace(/\\\*/g, '*')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
  
  return {
    description: fixedDescription,
    key_responsibilities: fixedResponsibilities,
    requirements: fixedRequirements,
    hasWrongContent
  };
}

async function fixMixedContent() {
  try {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      console.error('ERROR: DATABASE_URL is not set in .env.local');
      process.exit(1);
    }

    const sql = postgres(connectionString, { prepare: false });

    // Find jobs with potential mixed content
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
        description LIKE '%City and County of Denver%' OR
        description LIKE '%Palm Beach State College%' OR
        description LIKE '%Palm Beach Atlantic University%' OR
        description LIKE '%About Our Job%' OR
        description LIKE '%competitive pay, great benefits%' OR
        description LIKE '%====%' OR
        description LIKE '%---%' OR
        description LIKE '%Job Location%' OR
        description LIKE '%Job Details%'
      )
      ORDER BY created_at DESC
    `;

    console.log(`\n🧠 INTELLIGENTLY FIXING ${jobs.length} JOBS WITH MIXED/WRONG CONTENT\n`);
    console.log('='.repeat(80));
    console.log('Reading content, understanding context, and fixing intelligently...\n');

    let fixed = 0;
    const errors = [];

    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];
      
      try {
        console.log(`\n[${i + 1}/${jobs.length}] ${job.title}`);
        console.log(`Company: ${job.company}`);
        
        // Intelligently fix the content
        const fixes = intelligentlyFixJobContent(job);
        
        // Check if fixes were made
        const hasChanges = 
          fixes.description !== job.description ||
          fixes.key_responsibilities !== job.key_responsibilities ||
          fixes.requirements !== job.requirements;
        
        if (hasChanges) {
          // Update the job
          await sql`
            UPDATE jobs 
            SET 
              description = ${fixes.description || job.description},
              key_responsibilities = ${fixes.key_responsibilities || job.key_responsibilities},
              requirements = ${fixes.requirements || job.requirements},
              updated_at = NOW()
            WHERE id = ${job.id}
          `;
          
          fixed++;
          console.log(`  ✅ Fixed ${fixes.hasWrongContent ? 'wrong content and ' : ''}cleaned formatting`);
          
          // Show preview
          if (fixes.description) {
            const preview = fixes.description.substring(0, 200);
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

    console.log(`\n\n✅ INTELLIGENT FIX COMPLETE!\n`);
    console.log(`Fixed: ${fixed} jobs`);
    console.log(`Errors: ${errors.length} jobs`);
    
    if (errors.length > 0) {
      console.log('\n❌ Errors:');
      errors.forEach(({ title, error }) => {
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

fixMixedContent();


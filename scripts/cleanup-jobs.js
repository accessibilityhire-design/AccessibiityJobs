#!/usr/bin/env node
/**
 * Database Cleanup Script
 * 
 * This script fixes existing jobs with:
 * 1. "Unknown Company" or "NaN" company names - tries to extract from description
 * 2. Unformatted markdown descriptions - converts to clean HTML
 * 
 * Run: node scripts/cleanup-jobs.js
 */

require('dotenv').config({ path: '.env' });

const postgres = require('postgres');

// Patterns to extract company name from description
const COMPANY_PATTERNS = [
    // "Company Name is seeking..."
    /^([A-Z][A-Za-z0-9\s&.,'\-]+?)\s+is\s+(?:seeking|looking|hiring)/m,
    // "At Company Name, we..."
    /^At\s+([A-Z][A-Za-z0-9\s&.,'\-]+?),\s+/m,
    // "Join Company Name"
    /^Join\s+([A-Z][A-Za-z0-9\s&.,'\-]+?)\s+/m,
    // "**Company Name**\nLocation"
    /^\*\*([A-Z][A-Za-z0-9\s&.,'\-]+?)\*\*\n/m,
    // "Company Name\nCity, STATE"
    /^([A-Z][A-Za-z0-9\s&.,'\-]+?)\n[A-Z][a-z]+,\s*[A-Z]{2}/m,
    // University patterns
    /(?:University|College|Institute)\s+(?:of\s+)?([A-Za-z\s]+?)(?:\n|$)/i,
    // "Cal State University (CSU) Name"
    /Cal State University \(CSU\) ([A-Za-z]+)/i,
    // "Client:\n\nCompany Name" pattern from staffing agencies
    /Client:\s*\n+([A-Z][A-Za-z0-9\s&.,'\-]+)/m,
];

const INVALID_COMPANY_VALUES = [
    'unknown company', 'unknown', 'nan', 'null', 'undefined',
    'n/a', 'none', 'tbd', 'to be determined', 'company information pending'
];

function extractCompanyFromDescription(description) {
    if (!description) return null;

    const text = description.substring(0, 1000); // Only check first 1000 chars

    for (const pattern of COMPANY_PATTERNS) {
        const match = text.match(pattern);
        if (match && match[1]) {
            const company = match[1].trim();
            // Validate
            if (company.length >= 2 &&
                company.length <= 100 &&
                /^[A-Za-z]/.test(company) &&
                !INVALID_COMPANY_VALUES.includes(company.toLowerCase())) {
                return company;
            }
        }
    }

    return null;
}

function cleanMarkdown(text) {
    if (!text) return text;

    let result = text;

    // Unescape common escape sequences
    result = result.replace(/\\-/g, '-');
    result = result.replace(/\\\*/g, '*');
    result = result.replace(/\\_/g, '_');
    result = result.replace(/\\\[/g, '[');
    result = result.replace(/\\\]/g, ']');
    result = result.replace(/\\\(/g, '(');
    result = result.replace(/\\\)/g, ')');

    // Clean up excessive newlines
    result = result.replace(/\n{3,}/g, '\n\n');

    // Clean up excessive spaces
    result = result.replace(/ {3,}/g, ' ');

    return result.trim();
}

async function cleanupJobs() {
    console.log('\n🧹 DATABASE CLEANUP SCRIPT\n');
    console.log('='.repeat(60));

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error('❌ ERROR: DATABASE_URL not set in .env');
        process.exit(1);
    }

    const sql = postgres(connectionString, { prepare: false });

    try {
        // === PHASE 1: Fix Company Names ===
        console.log('\n📋 PHASE 1: Fixing Company Names\n');

        const invalidCompanyJobs = await sql`
      SELECT id, title, company, description 
      FROM jobs 
      WHERE LOWER(company) LIKE '%unknown%' 
         OR company = 'NaN' 
         OR company = 'nan'
         OR company = 'null'
         OR company = ''
         OR company IS NULL
    `;

        console.log(`Found ${invalidCompanyJobs.length} jobs with invalid company names\n`);

        let fixedCompanies = 0;
        let unfixableCompanies = 0;

        for (const job of invalidCompanyJobs) {
            const extractedCompany = extractCompanyFromDescription(job.description);

            if (extractedCompany) {
                await sql`
          UPDATE jobs 
          SET company = ${extractedCompany}, updated_at = NOW() 
          WHERE id = ${job.id}
        `;
                console.log(`✅ Fixed: "${job.title}"`);
                console.log(`   Old: "${job.company}" → New: "${extractedCompany}"`);
                fixedCompanies++;
            } else {
                // Mark as pending instead of unknown
                await sql`
          UPDATE jobs 
          SET company = 'Company Information Pending', updated_at = NOW() 
          WHERE id = ${job.id}
        `;
                console.log(`⚠️  Could not extract company for: "${job.title}"`);
                console.log(`   Description preview: ${job.description?.substring(0, 100)}...`);
                unfixableCompanies++;
            }
        }

        console.log(`\n📊 Company Fix Summary:`);
        console.log(`   ✅ Fixed: ${fixedCompanies}`);
        console.log(`   ⚠️  Marked as pending: ${unfixableCompanies}`);

        // === PHASE 2: Clean Markdown Formatting ===
        console.log('\n📋 PHASE 2: Cleaning Markdown Formatting\n');

        const markdownJobs = await sql`
      SELECT id, title, description, key_responsibilities, requirements, nice_to_have
      FROM jobs 
      WHERE description LIKE '%\\-%' 
         OR description LIKE '%\\*%'
         OR description LIKE '%\\_\_%'
    `;

        console.log(`Found ${markdownJobs.length} jobs with escaped characters\n`);

        let cleanedJobs = 0;

        for (const job of markdownJobs) {
            const cleanedDesc = cleanMarkdown(job.description);
            const cleanedResp = cleanMarkdown(job.key_responsibilities);
            const cleanedReq = cleanMarkdown(job.requirements);
            const cleanedNice = cleanMarkdown(job.nice_to_have);

            // Only update if something changed
            if (cleanedDesc !== job.description ||
                cleanedResp !== job.key_responsibilities ||
                cleanedReq !== job.requirements ||
                cleanedNice !== job.nice_to_have) {

                await sql`
          UPDATE jobs 
          SET 
            description = ${cleanedDesc},
            key_responsibilities = ${cleanedResp},
            requirements = ${cleanedReq},
            nice_to_have = ${cleanedNice},
            updated_at = NOW()
          WHERE id = ${job.id}
        `;

                console.log(`✅ Cleaned formatting: "${job.title}"`);
                cleanedJobs++;
            }
        }

        console.log(`\n📊 Formatting Cleanup Summary:`);
        console.log(`   ✅ Jobs cleaned: ${cleanedJobs}`);

        // === FINAL REPORT ===
        console.log('\n' + '='.repeat(60));
        console.log('🎉 CLEANUP COMPLETE!\n');

        const totalJobs = await sql`SELECT COUNT(*) as count FROM jobs`;
        const pendingCompanies = await sql`
      SELECT COUNT(*) as count FROM jobs 
      WHERE company = 'Company Information Pending'
    `;

        console.log(`📊 Database Status:`);
        console.log(`   Total jobs: ${totalJobs[0].count}`);
        console.log(`   Companies fixed: ${fixedCompanies}`);
        console.log(`   Formatting cleaned: ${cleanedJobs}`);
        console.log(`   Jobs needing manual review: ${pendingCompanies[0].count}`);
        console.log('\n');

        await sql.end();
        process.exit(0);

    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        await sql.end();
        process.exit(1);
    }
}

cleanupJobs();

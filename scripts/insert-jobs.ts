import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { jobs } from '../lib/db/schema';

// Database connection — set DATABASE_URL in .env (never hardcode credentials)
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is required');
}

const client = postgres(connectionString, {
    prepare: false,
    max: 5,
    connect_timeout: 30,
});

const db = drizzle(client);

// Helper to parse salary info
function parseSalary(salaryStr: string | null): { min: number | null; max: number | null; type: string } {
    if (!salaryStr) return { min: null, max: null, type: 'annual' };

    // Check if hourly
    if (salaryStr.includes('/hr')) {
        const matches = salaryStr.match(/[\$£€]?([\d,]+)(?:\s*-\s*[\$£€]?([\d,]+))?/);
        if (matches) {
            const min = parseInt(matches[1].replace(/,/g, ''));
            const max = matches[2] ? parseInt(matches[2].replace(/,/g, '')) : min;
            return { min, max, type: 'hourly' };
        }
    }

    // Check if annual
    if (salaryStr.includes('/yr') || salaryStr.includes('per year')) {
        const matches = salaryStr.match(/[\$£€]?([\d,]+)(?:\s*-\s*[\$£€]?([\d,]+))?/);
        if (matches) {
            const min = parseInt(matches[1].replace(/,/g, ''));
            const max = matches[2] ? parseInt(matches[2].replace(/,/g, '')) : min;
            return { min, max, type: 'annual' };
        }
    }

    // Per month
    if (salaryStr.includes('per month')) {
        const matches = salaryStr.match(/[\$£€]?([\d,]+)(?:\s*-\s*[\$£€]?([\d,]+))?/);
        if (matches) {
            const min = parseInt(matches[1].replace(/,/g, '')) * 12;
            const max = matches[2] ? parseInt(matches[2].replace(/,/g, '')) * 12 : min;
            return { min, max, type: 'annual' };
        }
    }

    // UK pounds - parse differently
    if (salaryStr.includes('£')) {
        const matches = salaryStr.match(/£([\d,]+)(?:\s*-\s*£?([\d,]+))?/);
        if (matches) {
            const min = parseInt(matches[1].replace(/,/g, ''));
            const max = matches[2] ? parseInt(matches[2].replace(/,/g, '')) : min;
            return { min, max, type: 'annual' };
        }
    }

    // Generic parsing
    const matches = salaryStr.match(/[\$£€]?([\d,]+)(?:\s*-\s*[\$£€]?([\d,]+))?/);
    if (matches) {
        const min = parseInt(matches[1].replace(/,/g, ''));
        const max = matches[2] ? parseInt(matches[2].replace(/,/g, '')) : min;
        return { min, max, type: 'annual' };
    }

    return { min: null, max: null, type: 'annual' };
}

// Map job type to employment_type
function mapJobType(jobType: string): string {
    const mapping: Record<string, string> = {
        'Full Time': 'full-time',
        'Part Time': 'part-time',
        'Contract': 'contract',
        'Intern': 'internship',
        'Freelance': 'freelance',
    };
    return mapping[jobType] || 'full-time';
}

// Map work arrangement
function mapWorkArrangement(arrangement: string): string {
    const lower = arrangement.toLowerCase();
    if (lower.includes('remote')) return 'remote';
    if (lower.includes('hybrid')) return 'hybrid';
    return 'onsite';
}

// Parse location for country/city
function parseLocation(location: string): { country: string | null; city: string | null; specificLocation: string } {
    const parts = location.split(',').map(p => p.trim());

    // Common patterns
    if (parts.length >= 2) {
        const lastPart = parts[parts.length - 1];

        // US locations
        if (lastPart === 'US' || lastPart === 'USA') {
            return {
                country: 'United States',
                city: parts[0] === 'Remote' ? null : parts[0],
                specificLocation: location,
            };
        }

        // UK locations
        if (lastPart === 'UK') {
            return {
                country: 'United Kingdom',
                city: parts[0],
                specificLocation: location,
            };
        }

        // Other countries
        return {
            country: lastPart,
            city: parts[0],
            specificLocation: location,
        };
    }

    if (location.toLowerCase().includes('remote')) {
        return { country: null, city: null, specificLocation: 'Remote' };
    }

    return { country: null, city: location, specificLocation: location };
}

// The jobs data
const jobsData = [
    {
        "title": "Web Accessibility Engineer",
        "company": "Ztek Consulting",
        "location": "Austin, TX, US",
        "date_posted": "2026-01-30",
        "job_type": "Full Time",
        "work_arrangement": "On-site",
        "salary": "$80,000 - $120,000/yr",
        "description": "Position: Web Accessibility Engineer. Work involves testing digital product accessibility features and ensuring compatibility with assistive technologies."
        ,
        "link": "https://www.dice.com/job-detail/159c3a80-5920-42aa-98c5-5e7a29afbb5b"
    },
    {
        "title": "Accessibility & Compliance Lead or UI Accessibility Engineer",
        "company": "Bits & Bytes Technology Solutions",
        "location": "Albany, NY, US",
        "date_posted": "2026-01-30",
        "job_type": "Contract",
        "work_arrangement": "On-site",
        "salary": null,
        "description": "Requires extensive experience in web accessibility audits, coding (HTML/CSS/JS), and UI accessibility testing.",
        "link": "https://www.dice.com/job-detail/5d0b44ae-a713-44bc-8591-2bea63179138"
    },
    {
        "title": "Web Accessibility Analyst - HBITS-07-14574",
        "company": "GreyCell Labs, Inc",
        "location": "Albany, NY, US",
        "date_posted": "2026-01-22",
        "job_type": "Contract",
        "work_arrangement": "On-site",
        "salary": null,
        "description": "Perform web accessibility audits and document code issues (HTML/CSS/JS) using assistive technologies compliance standards.",
        "link": "https://www.dice.com/job-detail/73062d10-681e-457c-90bb-bfeb961d4afd"
    },
    {
        "title": "Accessibility Compliance Manager (Backfill/Replacement role)",
        "company": "TechAffinity Inc",
        "location": "Remote, US",
        "date_posted": "2026-01-27",
        "job_type": "Contract",
        "work_arrangement": "Remote",
        "salary": null,
        "description": "Manage digital accessibility compliance initiatives and Section 508 processes; collaborate with teams on remediation.",
        "link": "https://www.dice.com/job-detail/4bd30590-3f40-4651-acbb-6c943b1b1364"
    },
    {
        "title": "Electronic Information Resources (EIR) Accessibility Compliance - W2",
        "company": "Estaff LLC",
        "location": "Remote, US",
        "date_posted": "2026-01-27",
        "job_type": "Contract",
        "work_arrangement": "Remote",
        "salary": "$45/hr",
        "description": "Requires bachelor's degree, 3+ years of EIR and web development experience, and knowledge of WCAG and EIR accessibility standards.",
        "link": "https://www.dice.com/job-detail/6d59b5f9-278e-4e9c-8420-cf663ed8cec4"
    },
    {
        "title": "Web Accessibility Specialist",
        "company": "System Edge (USA) L.L.C.",
        "location": "Hybrid in Albany, NY, US",
        "date_posted": "2026-01-30",
        "job_type": "Contract",
        "work_arrangement": "Hybrid",
        "salary": null,
        "description": "NY State client role requiring 3+ years of WCAG implementation and assistive technology testing experience.",
        "link": "https://www.dice.com/job-detail/27630301-9238-4fa5-b9d1-988fe9fad8cd"
    },
    {
        "title": "Digital Accessibility Program Manager",
        "company": "Xove Consulting Services",
        "location": "Raleigh, NC, US",
        "date_posted": "2026-01-27",
        "job_type": "Contract",
        "work_arrangement": "On-site",
        "salary": "$50 - $55/hr",
        "description": "Seeking experienced program manager to lead a digital accessibility program and coordinate schedule delivery for clients.",
        "link": "https://www.dice.com/job-detail/e9f47964-669f-40af-84e8-ba12b36dc4ef"
    },
    {
        "title": "Accessibility Specialist",
        "company": "Strategix Management LLC",
        "location": "Remote, US",
        "date_posted": "2026-01-31",
        "job_type": "Full Time",
        "work_arrangement": "Remote",
        "salary": null,
        "description": "Provide on-call accessibility support for federal clients; ensure deliverables meet accessibility standards. Fully remote role.",
        "link": "https://www.dice.com/job-detail/c3e80a88-2dda-4aba-ae4c-2b6043a2e818"
    },
    {
        "title": "Sr Technical Analyst (Digital Accessibility)",
        "company": "SVMM Inc",
        "location": "Remote, US",
        "date_posted": "2026-01-24",
        "job_type": "Contract",
        "work_arrangement": "Remote",
        "salary": "$63/hr",
        "description": "Senior accessibility engineer role requiring 3+ years ARC software development and UI coding experience.",
        "link": "https://www.dice.com/job-detail/cc70aed2-2ba4-402b-a719-bab9eb432d8e"
    },
    {
        "title": "Accessibility Training Delivery Manager - UK (Gateshead)",
        "company": "Recite Me",
        "location": "Newcastle, England, UK",
        "date_posted": "2026-01-29",
        "job_type": "Full Time",
        "work_arrangement": "On-site",
        "salary": null,
        "description": "Recite Me seeks a Delivery Manager to develop and deliver web accessibility training programs and services.",
        "link": "https://www.a11yjobs.com/jobs/J0TLS-accessibility-training-delivery-manager-uk-gateshead-based-recite-me"
    },
    {
        "title": "Research and Policy Intern",
        "company": "Disability:IN",
        "location": "Remote, US",
        "date_posted": "2026-01-29",
        "job_type": "Intern",
        "work_arrangement": "Remote",
        "salary": "$20/hr",
        "description": "Intern assists with disability employment data collection, analysis, and policy research support for web and IT initiatives.",
        "link": "https://www.a11yjobs.com/jobs/XJFUY-research-and-policy-intern-disabilityin"
    },
    {
        "title": "eLearning Implementation Specialist",
        "company": "Catharsis Productions",
        "location": "Remote, US",
        "date_posted": "2026-01-29",
        "job_type": "Full Time",
        "work_arrangement": "Remote",
        "salary": null,
        "description": "Manage implementation of accessible eLearning and exam content in educational testing; ensure media meets accessibility requirements.",
        "link": "https://www.a11yjobs.com/jobs/GWXOV-elearning-implementation-specialist-catharsis-productions"
    },
    {
        "title": "Digital Accessibility Director",
        "company": "University of Alabama",
        "location": "Tuscaloosa, AL, US",
        "date_posted": "2026-01-29",
        "job_type": "Full Time",
        "work_arrangement": "Hybrid",
        "salary": "$93,900 - $126,800/yr",
        "description": "Lead university efforts to ensure digital instructional materials and technology comply with accessibility laws and policies.",
        "link": "https://www.a11yjobs.com/jobs/VE2FN-digital-accessibility-director-528428-the-university-of-alabama"
    },
    {
        "title": "UI/UX Application Designer",
        "company": "Attain Talent",
        "location": "EPA, US",
        "date_posted": "2026-01-29",
        "job_type": "Full Time",
        "work_arrangement": "On-site",
        "salary": null,
        "description": "Design and develop user interfaces and prototypes with a focus on accessibility compliance in EPA systems.",
        "link": "https://www.a11yjobs.com/jobs/PCHZC-uiux-application-designer-attain-talent"
    },
    {
        "title": "Senior Web Administrator",
        "company": "Boulder County",
        "location": "Boulder, CO, US",
        "date_posted": "2026-01-29",
        "job_type": "Full Time",
        "work_arrangement": "On-site",
        "salary": "$94,320 - $135,804/yr",
        "description": "Oversee county web operations and lead ADA compliance efforts for public content and systems.",
        "link": "https://www.a11yjobs.com/jobs/BFTPD-senior-web-administrator-boulder-county"
    },
    {
        "title": "Digital Accessibility & Instructional Technology Consultant",
        "company": "Campbell University",
        "location": "Buies Creek, NC, US",
        "date_posted": "2026-01-29",
        "job_type": "Full Time",
        "work_arrangement": "Hybrid",
        "salary": null,
        "description": "Coordinate accessibility of university instructional media and technology; support production of accessible materials and training.",
        "link": "https://www.a11yjobs.com/jobs/ZHAJG-hiring-digital-accessibility-instructional-technology-consultant-it-services-main-campus-buies-creek-nc-campbell-university"
    },
    {
        "title": "Administrative Coordinator, Student Accessibility Services",
        "company": "Tarleton State University",
        "location": "Stephenville, TX, US",
        "date_posted": "2026-01-29",
        "job_type": "Full Time",
        "work_arrangement": "On-site",
        "salary": "$34,776 - $47,952/yr",
        "description": "Administer student accommodations services; ensure delivery of accessible media, coordinate exam accommodations, and support disability services.",
        "link": "https://www.a11yjobs.com/jobs/SKKDL-administrative-coordinator-student-accessibility-services-tarleton-state-university"
    },
    {
        "title": "Accessibility Auditor",
        "company": "Zenyth",
        "location": "Santa Monica, CA, US",
        "date_posted": "2026-01-28",
        "job_type": "Full Time",
        "work_arrangement": "Remote",
        "salary": "$55,000 - $65,000/yr",
        "description": "Conduct manual and automated accessibility testing on web/mobile platforms; ensure compliance with WCAG/ADA and report defects.",
        "link": "https://www.a11yjobs.com/jobs/68EVp-accessibility-auditor-zenyth"
    },
    {
        "title": "Operations Manager (Accessibility Engagements)",
        "company": "Zenyth",
        "location": "Los Angeles, CA, US",
        "date_posted": "2026-01-28",
        "job_type": "Full Time",
        "work_arrangement": "On-site",
        "salary": "$25 - $35/hr",
        "description": "Lead operations of accessibility consulting projects, including staffing and scheduling of trainings and audits.",
        "link": "https://www.a11yjobs.com/jobs/IHUVB-operations-manager-accessibility-engagements-zenyth"
    },
    {
        "title": "Quality Assurance Tester",
        "company": "KYM Advisors. Inc",
        "location": "Remote, US",
        "date_posted": "2026-01-28",
        "job_type": "Full Time",
        "work_arrangement": "Remote",
        "salary": "$125,000 - $135,000/yr",
        "description": "Manual and automated testing (Selenium/Cypress) with focus on Section 508/WCAG compliance and assistive technology validation.",
        "link": "https://www.a11yjobs.com/jobs/TJ4QT-quality-assurance-tester-kym-advisors-inc"
    },
    {
        "title": "Web Accessibility Specialist (WCAG Expert)",
        "company": "EnableAll Limited",
        "location": "London, UK",
        "date_posted": "2026-01-28",
        "job_type": "Full Time",
        "work_arrangement": "Hybrid",
        "salary": "£60,000 - £100,000",
        "description": "In-house WCAG specialist role for B2B SaaS startup; guide product accessibility development and lead customer-facing audits and training.",
        "link": "https://www.a11yjobs.com/jobs/A8U19-web-accessibility-specialist-wcag-expert-enableall-limited"
    },
    {
        "title": "ADA Tester",
        "company": "Dexian",
        "location": "Charlotte, NC, US",
        "date_posted": "2026-01-28",
        "job_type": "Full Time",
        "work_arrangement": "On-site",
        "salary": null,
        "description": "Perform manual and automated accessibility testing on client web/mobile applications; ensure WCAG and Section 508 compliance.",
        "link": "https://www.a11yjobs.com/jobs/MJ4TA-ada-tester-dexian"
    },
    {
        "title": "Principal System Engineer",
        "company": "AT&T",
        "location": "Plano, TX, US",
        "date_posted": "2026-01-28",
        "job_type": "Full Time",
        "work_arrangement": "On-site",
        "salary": "$155,400 - $261,100/yr",
        "description": "Design, develop, and test technical solutions to ensure all digital products meet accessibility compliance requirements.",
        "link": "https://www.a11yjobs.com/jobs/4EXHW-principal-system-engineer-att"
    },
    {
        "title": "Accessibility Specialist",
        "company": "Seattle University",
        "location": "Seattle, WA, US",
        "date_posted": "2026-01-28",
        "job_type": "Full Time",
        "work_arrangement": "Hybrid",
        "salary": "$60,000 - $64,000/yr",
        "description": "Provide student support for disability accommodations; ensure accessible technology and media (captions, alt text) across campus.",
        "link": "https://www.a11yjobs.com/jobs/FKKXB-accessibility-specialist-seattle-university"
    },
    {
        "title": "Supervisor - Accessible Media",
        "company": "The Ohio State University - Student Life Disability Services",
        "location": "Columbus, OH, US",
        "date_posted": "2026-01-28",
        "job_type": "Full Time",
        "work_arrangement": "Hybrid",
        "salary": "$51,500 - $67,250/yr",
        "description": "Oversee production of accessible course media (text, audio, video), manage staff, and ensure timely delivery of accommodations.",
        "link": "https://www.a11yjobs.com/jobs/23pgZ-supervisor-accessible-media-the-ohio-state-university-student-life-disability-services"
    },
    {
        "title": "Expert Digital Accessibility (f/m/d)",
        "company": "Light for the World International",
        "location": "Ethiopia, Uganda or Kenya",
        "date_posted": "2026-01-28",
        "job_type": "Full Time",
        "work_arrangement": "Hybrid",
        "salary": null,
        "description": "Provide digital accessibility expertise and training to universities and EdTech partners in Africa; support inclusive technology initiatives.",
        "link": "https://www.a11yjobs.com/jobs/JF743-expert-digital-accessibility-fmd-light-for-the-world-international"
    },
    {
        "title": "Safety & Accessibility Director",
        "company": "The Arc Prince George's County",
        "location": "Prince George's County, MD, US",
        "date_posted": "2026-01-28",
        "job_type": "Full Time",
        "work_arrangement": "On-site",
        "salary": "Up to $93,000/yr",
        "description": "Ensure organizational compliance with safety and accessibility standards; conduct accessibility audits and implement improvement plans.",
        "link": "https://www.a11yjobs.com/jobs/NGV38-safety-accessibility-director-the-arc-prince-georges-county"
    },
    {
        "title": "Executive Staff Advisor",
        "company": "Commonwealth of Kentucky",
        "location": "Frankfort, KY, US",
        "date_posted": "2026-01-27",
        "job_type": "Full Time",
        "work_arrangement": "On-site",
        "salary": null,
        "description": "Review and monitor web content compliance with ADA/508 policies; develop training and governance for accessible digital communications.",
        "link": "https://www.a11yjobs.com/jobs/T6E4K-executive-staff-advisor-commonwealth-of-kentucky"
    },
    {
        "title": "UX Consultant - Accessibility & Inclusion",
        "company": "Equal Experts",
        "location": "Remote, US",
        "date_posted": "2026-01-27",
        "job_type": "Contract",
        "work_arrangement": "Remote",
        "salary": null,
        "description": "Provide UX consulting services with focus on accessibility and inclusive design practices.",
        "link": "https://www.a11yjobs.com/jobs/9AOSR-ux-consultant-accessibility-inclusion-equal-experts"
    },
    {
        "title": "Program Specialist III (Statewide Digital Accessibility Program Specialist)",
        "company": "Department of Information Resources",
        "location": "Austin, TX, US",
        "date_posted": "2026-01-27",
        "job_type": "Full Time",
        "work_arrangement": "On-site",
        "salary": "$4,958 - $5,167 per month",
        "description": "Assist Texas statewide digital accessibility program; provide accessibility consulting and outreach to agencies to ensure WCAG/EIR compliance.",
        "link": "https://www.a11yjobs.com/jobs/N1T4X-program-specialist-iii-statewide-digital-accessibility-program-specialist-department-of-information-resources"
    },
    {
        "title": "Accessibility Compliance Manager (W2 Contract)",
        "company": "My3Tech",
        "location": "Texas, US (Remote)",
        "date_posted": "2026-01-27",
        "job_type": "Contract",
        "work_arrangement": "Remote",
        "salary": null,
        "description": "Oversee EIR accessibility compliance under Texas law; requires knowledge of WCAG and electronic information resources policies.",
        "link": "https://www.a11yjobs.com/jobs/MNETP-on-w2-accessibility-compliance-manager-my3tech"
    }
];

async function insertJobs() {
    console.log(`Starting to insert ${jobsData.length} jobs...`);

    let successCount = 0;
    let errorCount = 0;

    for (const job of jobsData) {
        try {
            const salary = parseSalary(job.salary);
            const location = parseLocation(job.location);
            const employmentType = mapJobType(job.job_type);
            const workArrangement = mapWorkArrangement(job.work_arrangement);

            // Determine job source
            let jobSource = 'direct';
            if (job.link.includes('dice.com')) jobSource = 'dice';
            else if (job.link.includes('a11yjobs.com')) jobSource = 'a11yjobs';
            else if (job.link.includes('linkedin.com')) jobSource = 'linkedin';
            else if (job.link.includes('indeed.com')) jobSource = 'indeed';

            // Determine currency
            let currency = 'USD';
            if (job.salary?.includes('£')) currency = 'GBP';
            else if (job.salary?.includes('€')) currency = 'EUR';

            const jobRecord = {
                title: job.title,
                company: job.company,
                description: job.description,
                keyResponsibilities: `• ${job.description}`,
                requirements: 'Please refer to the original job posting for full requirements.',
                employmentType,
                workArrangement,
                country: location.country,
                city: location.city,
                specificLocation: location.specificLocation,
                location: job.location, // Legacy field
                type: employmentType, // Legacy field
                salaryMin: salary.min,
                salaryMax: salary.max,
                currency,
                salaryType: salary.type,
                salaryRange: job.salary || null, // Legacy field
                jobSource,
                sourceUrl: job.link,
                contactEmail: 'jobs@accessibilityjobs.net', // Default contact email
                status: 'approved', // Auto-approve bulk imported jobs
                createdAt: new Date(job.date_posted),
                updatedAt: new Date(),
            };

            await db.insert(jobs).values(jobRecord);
            console.log(`✓ Added: ${job.title} at ${job.company}`);
            successCount++;
        } catch (error) {
            console.error(`✗ Error adding "${job.title}": ${error}`);
            errorCount++;
        }
    }

    console.log(`\nCompleted: ${successCount} jobs added, ${errorCount} errors`);
    await client.end();
    process.exit(0);
}

insertJobs().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
});

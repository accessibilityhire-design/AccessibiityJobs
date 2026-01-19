import { Job } from './db/schema';

/**
 * Enhanced JobPosting Schema for 2025
 * Includes all Google recommended fields for better visibility in Google for Jobs
 */
export function generateJobStructuredData(job: Job, url: string) {
  // Parse skills from JSON string if needed
  let requiredSkills: string[] = [];
  let preferredSkills: string[] = [];
  try {
    if (job.requiredSkills) {
      requiredSkills = typeof job.requiredSkills === 'string'
        ? JSON.parse(job.requiredSkills)
        : job.requiredSkills;
    }
    if (job.preferredSkills) {
      preferredSkills = typeof job.preferredSkills === 'string'
        ? JSON.parse(job.preferredSkills)
        : job.preferredSkills;
    }
  } catch (e) {
    // Ignore parsing errors
  }

  // Combine description sections for full description
  const fullDescription = [
    job.description,
    job.keyResponsibilities && `\n\nKey Responsibilities:\n${job.keyResponsibilities}`,
    job.requirements && `\n\nRequirements:\n${job.requirements}`,
    job.niceToHave && `\n\nNice to Have:\n${job.niceToHave}`,
  ].filter(Boolean).join('');

  // Calculate validThrough (90 days from posting date)
  const createdAtDate = job.createdAt instanceof Date
    ? job.createdAt
    : new Date(job.createdAt);
  const validCreatedAt = isNaN(createdAtDate.getTime()) ? new Date() : createdAtDate;
  const validThrough = new Date(validCreatedAt);
  validThrough.setDate(validThrough.getDate() + 90);

  // Determine occupational category
  const occupationalCategory = determineOccupationalCategory(job.title, job.description);

  // Determine industry based on job context
  const industry = determineIndustry(job.title, job.description);

  // Build job location with proper structure
  const isRemote = job.type === 'remote' || job.workArrangement === 'remote';
  const isHybrid = job.workArrangement === 'hybrid';

  const jobLocation: any = {
    '@type': 'Place',
    address: {
      '@type': 'PostalAddress',
      ...(job.city && { addressLocality: job.city }),
      ...(job.country && { addressCountry: job.country }),
      ...(job.specificLocation && { streetAddress: job.specificLocation }),
      // Default country for remote jobs
      ...(!job.country && isRemote && { addressCountry: 'US' }),
    },
  };

  // Build base salary if available
  let baseSalary: any = undefined;
  if (job.salaryMin || job.salaryMax) {
    baseSalary = {
      '@type': 'MonetaryAmount',
      currency: job.currency || 'USD',
      value: {
        '@type': 'QuantitativeValue',
        ...(job.salaryMin && job.salaryMax ? {
          minValue: job.salaryMin,
          maxValue: job.salaryMax,
        } : job.salaryMin ? {
          value: job.salaryMin,
        } : {
          value: job.salaryMax,
        }),
        unitText: job.salaryType === 'Hourly' ? 'HOUR' :
          job.salaryType === 'Monthly' ? 'MONTH' : 'YEAR',
      },
    };
  } else if (job.salaryRange) {
    // Try to parse salary range
    const parsedSalary = parseSalaryRange(job.salaryRange);
    if (parsedSalary) {
      baseSalary = {
        '@type': 'MonetaryAmount',
        currency: parsedSalary.currency,
        value: {
          '@type': 'QuantitativeValue',
          ...(parsedSalary.min && parsedSalary.max ? {
            minValue: parsedSalary.min,
            maxValue: parsedSalary.max,
          } : {
            value: parsedSalary.min || parsedSalary.max,
          }),
          unitText: 'YEAR',
        },
      };
    }
  }

  // Extract responsibilities as array
  const responsibilities = extractResponsibilities(job.keyResponsibilities);

  // Build qualifications string
  const qualifications = buildQualifications(job);

  // Build job benefits if available
  const jobBenefits = extractBenefits(job.description);

  // Build applicant location requirements for remote jobs
  const applicantLocationRequirements = isRemote ? [
    { '@type': 'Country', name: 'United States' },
    { '@type': 'Country', name: 'Canada' },
    { '@type': 'Country', name: 'United Kingdom' },
  ] : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',

    // Core required fields
    title: job.title,
    description: fullDescription,
    datePosted: validCreatedAt.toISOString(),
    validThrough: validThrough.toISOString(),

    // Identifier for tracking
    identifier: {
      '@type': 'PropertyValue',
      name: 'AccessibilityJobs',
      value: job.id,
    },

    // Hiring organization - enhanced
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company,
      ...(job.companyWebsite && {
        sameAs: job.companyWebsite,
        url: job.companyWebsite,
      }),
      logo: 'https://accessibilityjobs.net/logo.png',
    },

    // Location handling
    jobLocation,

    // Employment type - required
    employmentType: mapEmploymentType((job.employmentType || job.type || 'full-time') as string),

    // Salary - highly recommended
    ...(baseSalary && { baseSalary }),

    // Experience requirements
    ...(job.yearsExperience && {
      experienceRequirements: {
        '@type': 'OccupationalExperienceRequirements',
        monthsOfExperience: mapExperienceLevel(job.yearsExperience),
      },
    }),

    // Education requirements
    ...(job.educationLevel && {
      educationRequirements: {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: mapEducationLevel(job.educationLevel),
      },
    }),

    // Occupational category (O*NET code)
    ...(occupationalCategory && { occupationalCategory }),

    // Industry - new 2025 recommended field
    ...(industry && { industry }),

    // Remote work handling - enhanced for 2025
    ...(isRemote && {
      jobLocationType: 'TELECOMMUTE',
      applicantLocationRequirements,
    }),

    // Hybrid work indicator
    ...(isHybrid && {
      workHours: 'Flexible - Hybrid',
      specialCommitments: 'Hybrid work arrangement',
    }),

    // Skills - array format
    ...(requiredSkills.length > 0 && {
      skills: requiredSkills,
    }),

    // Qualifications - text format
    ...(qualifications && { qualifications }),

    // Responsibilities - array format (2025 recommended)
    ...(responsibilities.length > 0 && {
      responsibilities,
    }),

    // Job benefits - 2025 recommended field
    ...(jobBenefits.length > 0 && {
      jobBenefits: jobBenefits.join(', '),
    }),

    // Direct apply - Google recommended
    directApply: true,

    // Canonical URL
    url,

    // Main entity of page reference
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

/**
 * Parse salary range string into structured data
 */
function parseSalaryRange(salaryRange: string): { min?: number; max?: number; currency: string } | null {
  if (!salaryRange) return null;

  // Common patterns: "$80,000 - $120,000", "$80k-$120k", "80000-120000"
  const cleanedRange = salaryRange.replace(/,/g, '').toLowerCase();

  // Detect currency
  let currency = 'USD';
  if (cleanedRange.includes('£') || cleanedRange.includes('gbp')) currency = 'GBP';
  if (cleanedRange.includes('€') || cleanedRange.includes('eur')) currency = 'EUR';
  if (cleanedRange.includes('cad') || cleanedRange.includes('ca$')) currency = 'CAD';

  // Extract numbers
  const numbers = cleanedRange.match(/\d+(\.\d+)?k?/g);
  if (!numbers || numbers.length === 0) return null;

  const parseNumber = (s: string): number => {
    const num = parseFloat(s.replace('k', ''));
    return s.includes('k') ? num * 1000 : num;
  };

  if (numbers.length >= 2) {
    return {
      min: parseNumber(numbers[0]),
      max: parseNumber(numbers[1]),
      currency,
    };
  } else if (numbers.length === 1) {
    return {
      min: parseNumber(numbers[0]),
      currency,
    };
  }

  return null;
}

/**
 * Extract responsibilities from text as array
 */
function extractResponsibilities(text: string | null): string[] {
  if (!text) return [];

  // Split by common list patterns
  const lines = text.split(/[\n•\-\*]/).map(s => s.trim()).filter(s => s.length > 10);

  // Limit to top 8 responsibilities
  return lines.slice(0, 8);
}

/**
 * Build qualifications string from job data
 */
function buildQualifications(job: Job): string | undefined {
  const parts: string[] = [];

  if (job.wcagLevel) {
    parts.push(`WCAG ${job.wcagLevel} knowledge required`);
  }

  if (job.yearsExperience) {
    parts.push(`${job.yearsExperience} years of experience`);
  }

  if (job.educationLevel && job.educationLevel !== 'none-required') {
    parts.push(`${job.educationLevel} degree preferred`);
  }

  return parts.length > 0 ? parts.join('. ') : undefined;
}

/**
 * Extract benefits mentioned in description
 */
function extractBenefits(description: string | null): string[] {
  if (!description) return [];

  const benefitKeywords = [
    'health insurance', 'dental', 'vision', '401k', '401(k)', 'retirement',
    'remote work', 'work from home', 'flexible hours', 'pto', 'paid time off',
    'parental leave', 'maternity leave', 'paternity leave', 'stock options',
    'equity', 'bonus', 'professional development', 'tuition reimbursement',
    'gym membership', 'wellness', 'mental health'
  ];

  const descLower = description.toLowerCase();
  return benefitKeywords.filter(benefit => descLower.includes(benefit));
}

/**
 * Determine industry based on job content
 */
function determineIndustry(title: string, description: string | null): string {
  const content = `${title} ${description || ''}`.toLowerCase();

  if (content.includes('healthcare') || content.includes('medical') || content.includes('hospital')) {
    return 'Healthcare';
  }
  if (content.includes('fintech') || content.includes('banking') || content.includes('financial')) {
    return 'Financial Services';
  }
  if (content.includes('education') || content.includes('university') || content.includes('school')) {
    return 'Education';
  }
  if (content.includes('government') || content.includes('federal') || content.includes('public sector')) {
    return 'Government';
  }
  if (content.includes('e-commerce') || content.includes('retail') || content.includes('shopping')) {
    return 'Retail & E-commerce';
  }

  return 'Technology'; // Default for accessibility roles
}

function determineOccupationalCategory(title: string, description: string | null): string {
  const titleLower = title.toLowerCase();
  const descLower = (description || '').toLowerCase();

  if (titleLower.includes('engineer') || titleLower.includes('developer')) {
    return '15-1132.00'; // Software Developers, Applications
  } else if (titleLower.includes('designer') || titleLower.includes('ux') || titleLower.includes('ui')) {
    return '27-1024.00'; // Graphic Designers
  } else if (titleLower.includes('tester') || titleLower.includes('qa')) {
    return '15-1199.00'; // Computer Occupations, All Other
  } else if (titleLower.includes('manager') || titleLower.includes('lead')) {
    return '11-3021.00'; // Computer and Information Systems Managers
  } else if (titleLower.includes('consultant') || titleLower.includes('specialist')) {
    return '15-1199.00'; // Computer Occupations, All Other
  }

  return '15-1199.00'; // Default: Computer Occupations, All Other
}

function mapEmploymentType(type: string): string | string[] {
  const typeMap: Record<string, string> = {
    'full-time': 'FULL_TIME',
    'fulltime': 'FULL_TIME',
    'part-time': 'PART_TIME',
    'parttime': 'PART_TIME',
    'contract': 'CONTRACTOR',
    'temporary': 'TEMPORARY',
    'internship': 'INTERN',
    'freelance': 'CONTRACTOR',
  };

  const normalized = type.toLowerCase().trim();

  // Handle multiple employment types
  if (normalized.includes(',') || normalized.includes('/')) {
    const types = normalized.split(/[,\/]/).map(t => t.trim());
    return types.map(t => typeMap[t] || 'FULL_TIME').filter((v, i, a) => a.indexOf(v) === i);
  }

  return typeMap[normalized] || 'FULL_TIME';
}

function mapExperienceLevel(yearsExp: string | null): number {
  if (!yearsExp) return 0;

  const expMap: Record<string, number> = {
    '0-1': 6,
    '1-3': 18,
    '3-5': 36,
    '5-7': 60,
    '7-10': 84,
    '10+': 120,
  };

  return expMap[yearsExp] || 0;
}

function mapEducationLevel(level: string | null): string {
  if (!level) return 'bachelor degree';

  const eduMap: Record<string, string> = {
    'high-school': 'high school',
    'associate': 'associate degree',
    'bachelor': 'bachelor degree',
    'master': 'master degree',
    'phd': 'doctoral degree',
    'none-required': 'no requirements',
  };

  return eduMap[level.toLowerCase()] || level;
}

export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AccessibilityJobs',
    url: 'https://accessibilityjobs.net',
    description: 'The leading job board for digital accessibility professionals. Find accessibility engineer jobs, WCAG specialist positions, a11y roles, and digital accessibility careers.',
    logo: 'https://accessibilityjobs.net/logo.svg',
    foundingDate: '2024',
    sameAs: [
      // Add social media links when available
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'info@accessibilityjobs.net',
    },
    areaServed: 'Worldwide',
    serviceType: 'Job Board',
  };
}

export function generateJobPostingCollection(jobs: Job[], baseUrl: string = 'https://accessibilityjobs.net') {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Accessibility Jobs - Digital Accessibility Job Board',
    description: 'Browse hundreds of accessibility jobs including accessibility engineer, WCAG specialist, a11y consultant, and digital accessibility roles.',
    url: baseUrl,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: jobs.length,
      itemListElement: jobs.map((job, index) => {
        const createdAtDate = job.createdAt instanceof Date
          ? job.createdAt
          : new Date(job.createdAt);
        const validCreatedAt = isNaN(createdAtDate.getTime()) ? new Date() : createdAtDate;

        return {
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'JobPosting',
            title: job.title,
            identifier: {
              '@type': 'PropertyValue',
              name: 'AccessibilityJobs',
              value: job.id,
            },
            datePosted: validCreatedAt.toISOString(),
            hiringOrganization: {
              '@type': 'Organization',
              name: job.company,
            },
            jobLocation: {
              '@type': 'Place',
              address: {
                '@type': 'PostalAddress',
                addressLocality: job.location || 'Remote',
              },
            },
            employmentType: mapEmploymentType((job.employmentType || job.type || 'full-time') as string),
            url: `${baseUrl}/jobs/${job.id}`,
          },
        };
      }),
    },
  };
}

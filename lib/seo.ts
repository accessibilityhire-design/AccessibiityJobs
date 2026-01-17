import { Job } from './db/schema';

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
    job.keyResponsibilities,
    job.requirements,
    job.niceToHave,
  ].filter(Boolean).join('\n\n');

  // Calculate validThrough (90 days from posting date)
  // Ensure createdAt is a Date object
  const createdAtDate = job.createdAt instanceof Date
    ? job.createdAt
    : new Date(job.createdAt);

  // Validate date - fallback to current date if invalid
  const validCreatedAt = isNaN(createdAtDate.getTime()) ? new Date() : createdAtDate;
  const validThrough = new Date(validCreatedAt);
  validThrough.setDate(validThrough.getDate() + 90);

  // Determine occupational category
  const occupationalCategory = determineOccupationalCategory(job.title, job.description);

  // Build job location with proper structure
  const jobLocation: any = {
    '@type': 'Place',
    address: {
      '@type': 'PostalAddress',
      ...(job.city && { addressLocality: job.city }),
      ...(job.country && { addressCountry: job.country }),
      ...(job.specificLocation && { streetAddress: job.specificLocation }),
    },
  };

  // For remote jobs, add telecommute flag
  if (job.type === 'remote' || job.workArrangement === 'remote') {
    jobLocation.address.addressCountry = 'US'; // Default for remote
  }

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
    // Fallback to salaryRange if structured data not available
    baseSalary = {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: {
        '@type': 'QuantitativeValue',
        value: job.salaryRange,
        unitText: 'YEAR',
      },
    };
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: fullDescription,
    identifier: {
      '@type': 'PropertyValue',
      name: 'AccessibilityJobs',
      value: job.id,
    },
    datePosted: validCreatedAt.toISOString(),
    validThrough: validThrough.toISOString(),
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company,
      ...(job.companyWebsite && {
        sameAs: job.companyWebsite,
        url: job.companyWebsite,
      }),
      // Placeholder for company logo - improves Google Jobs visibility
      logo: 'https://accessibilityjobs.net/logo.png',
    },
    jobLocation,
    employmentType: mapEmploymentType((job.employmentType || job.type || 'full-time') as string),
    ...(baseSalary && { baseSalary }),
    // Experience requirements
    ...(job.yearsExperience && {
      experienceRequirements: {
        '@type': 'OccupationalExperienceRequirements',
        monthsOfExperience: mapExperienceLevel(job.yearsExperience),
      },
    }),
    // Education requirements - Google recommended field
    ...(job.educationLevel && {
      educationRequirements: {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: mapEducationLevel(job.educationLevel),
      },
    }),
    ...(occupationalCategory && { occupationalCategory }),
    ...(job.workArrangement === 'remote' && {
      applicantLocationRequirements: {
        '@type': 'Country',
        name: 'Global',
      },
      jobLocationType: 'TELECOMMUTE',
    }),
    ...(requiredSkills.length > 0 && {
      skills: requiredSkills,
    }),
    ...(job.wcagLevel && {
      qualifications: `WCAG ${job.wcagLevel} knowledge required`,
    }),
    ...(job.workArrangement === 'hybrid' && {
      workHours: 'Flexible',
    }),
    // Direct apply indicator - Google recommended field
    directApply: true,
    url,
  };
}

function determineOccupationalCategory(title: string, description: string): string {
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

function mapEmploymentType(type: string): string {
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

  return typeMap[type.toLowerCase()] || 'FULL_TIME';
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
  if (!level) return 'bachelor';

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
    description: 'A job board platform connecting employers with accessibility professionals worldwide. Find accessibility engineer jobs, WCAG specialist positions, a11y roles, and digital accessibility careers.',
    logo: 'https://accessibilityjobs.net/logo.svg',
    sameAs: [
      // Add social media links when available
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'info@accessibilityjobs.net',
    },
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
        // Ensure createdAt is a Date object
        const createdAtDate = job.createdAt instanceof Date
          ? job.createdAt
          : new Date(job.createdAt);

        // Validate date - fallback to current date if invalid
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
            datePosted: createdAtDate.toISOString(),
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


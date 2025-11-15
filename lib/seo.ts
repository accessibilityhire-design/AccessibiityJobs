import { Job } from './db/schema';

export function generateJobStructuredData(job: Job, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    identifier: {
      '@type': 'PropertyValue',
      name: 'AccessibilityJobs',
      value: job.id,
    },
    datePosted: job.createdAt.toISOString(),
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company,
      ...(job.companyWebsite && { sameAs: job.companyWebsite }),
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location,
      },
    },
    employmentType: job.type.toUpperCase(),
    ...(job.salaryRange && {
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: 'USD',
        value: {
          '@type': 'QuantitativeValue',
          value: job.salaryRange,
          unitText: 'YEAR',
        },
      },
    }),
    url,
    applicantLocationRequirements: job.type === 'remote' ? {
      '@type': 'Country',
      name: 'Global',
    } : undefined,
    jobLocationType: job.type === 'remote' ? 'TELECOMMUTE' : undefined,
  };
}

export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AccessibilityJobs',
    url: 'https://accessibilityjobs.com',
    description: 'A job board platform connecting employers with accessibility professionals worldwide.',
    logo: 'https://accessibilityjobs.com/logo.png',
  };
}


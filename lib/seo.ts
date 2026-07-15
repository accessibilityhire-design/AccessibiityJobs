import type { Job } from './db/schema';
import { jobValidThrough } from './constants/jobs';
import { jobPath } from './slug';
import {
  extractPlainText,
  formatCompanyName,
  formatJobDescription,
  hasMeaningfulJobSection,
  sanitizeJobHtml,
} from './job-formatter';
import { replaceEmDashes } from './text-style';

const SITE_URL = 'https://accessibilityjobs.net';
const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * Serialize structured data for a <script type="application/ld+json"> block.
 * Escapes `<` so user-sourced strings can never break out of the script tag.
 */
export function safeJsonLd(data: unknown): string {
  return replaceEmDashes(JSON.stringify(data)).replace(/</g, '\\u003c');
}

function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is string => typeof item === 'string')
      .map((item) => replaceEmDashes(item.trim()))
      .filter(Boolean);
  } catch {
    return [];
  }
}

function validHttpUrl(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

const JOB_BOARD_HOSTS = new Set([
  'a11yjobs.com',
  'indeed.com',
  'linkedin.com',
  'glassdoor.com',
  'ziprecruiter.com',
  'monster.com',
]);

/** Do not present an aggregator or source-board URL as the employer website. */
export function validCompanyWebsite(value: string | null | undefined): string | undefined {
  const validUrl = validHttpUrl(value);
  if (!validUrl) return undefined;
  const hostname = new URL(validUrl).hostname.toLowerCase().replace(/^www\./, '');
  if ([...JOB_BOARD_HOSTS].some((host) => hostname === host || hostname.endsWith(`.${host}`))) {
    return undefined;
  }
  return validUrl;
}

function buildFullDescription(job: Job): string {
  const sections: Array<{ heading?: string; value: string | null }> = [
    { value: job.description },
    {
      heading: 'Key responsibilities',
      value: hasMeaningfulJobSection(job.keyResponsibilities) ? job.keyResponsibilities : null,
    },
    {
      heading: 'Requirements',
      value: hasMeaningfulJobSection(job.requirements) ? job.requirements : null,
    },
    {
      heading: 'Nice to have',
      value: hasMeaningfulJobSection(job.niceToHave) ? job.niceToHave : null,
    },
  ];

  return sanitizeJobHtml(
    sections
      .filter((section): section is { heading?: string; value: string } => Boolean(section.value))
      .map((section) => {
        const heading = section.heading ? `<h3>${section.heading}</h3>` : '';
        return `${heading}${formatJobDescription(section.value)}`;
      })
      .join('')
  );
}

const COUNTRY_ALIASES: Record<string, string> = {
  us: 'US',
  usa: 'US',
  'u.s.': 'US',
  'u.s.a.': 'US',
  'united states': 'US',
  'united states of america': 'US',
  ca: 'CA',
  canada: 'CA',
  uk: 'GB',
  gb: 'GB',
  'united kingdom': 'GB',
  england: 'GB',
  india: 'IN',
  in: 'IN',
  ecuador: 'EC',
  ec: 'EC',
  philippines: 'PH',
  ph: 'PH',
  sweden: 'SE',
  se: 'SE',
};

const US_STATE_CODES = new Set([
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL',
  'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT',
  'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI',
  'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC',
]);

const CANADIAN_PROVINCE_CODES = new Set([
  'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT',
]);

function countryCodesForJob(job: Job): string[] {
  const codes = new Set<string>();

  // Prefer the dedicated country field. The scraper normalizes it, while short
  // values such as CA and IN are ambiguous inside a free-form location string.
  for (const token of (job.country || '').split(/[|/]/).map((value) => value.trim()).filter(Boolean)) {
    const normalized = token.toLowerCase().replace(/\s+/g, ' ').trim();
    const alias = COUNTRY_ALIASES[normalized];
    if (alias) {
      codes.add(alias);
      continue;
    }

    const segments = token.split(',').map((part) => part.trim()).filter(Boolean);
    for (const segment of segments) {
      const segmentAlias = COUNTRY_ALIASES[segment.toLowerCase()];
      if (segmentAlias) {
        codes.add(segmentAlias);
        continue;
      }
      const upper = segment.toUpperCase();
      if (US_STATE_CODES.has(upper)) codes.add('US');
      if (CANADIAN_PROVINCE_CODES.has(upper)) codes.add('CA');
    }
  }

  if (codes.size > 0) return [...codes];

  // Fall back only to unambiguous country names or state/province codes. If a
  // short token could be both a country and a state (CA or IN), omitting the
  // JobPosting result is safer than publishing a false eligible location.
  for (const source of [job.specificLocation, job.location]) {
    if (!source) continue;
    for (const segment of source.split(',').map((part) => part.trim()).filter(Boolean)) {
      const upper = segment.toUpperCase();
      const alias = COUNTRY_ALIASES[segment.toLowerCase()];
      if (alias && upper !== 'CA' && upper !== 'IN') codes.add(alias);
      if (US_STATE_CODES.has(upper) && upper !== 'CA' && upper !== 'IN') codes.add('US');
      if (CANADIAN_PROVINCE_CODES.has(upper) && upper !== 'CA') codes.add('CA');
    }
  }

  return [...codes];
}

function locationRegion(job: Job, countryCode: string): string | undefined {
  const source = job.specificLocation || job.location || '';
  const segments = source
    .split(',')
    .map((part) => part.trim().toUpperCase())
    .filter(Boolean)
    .reverse();
  if (countryCode === 'US') return segments.find((segment) => US_STATE_CODES.has(segment));
  if (countryCode === 'CA') return segments.find((segment) => CANADIAN_PROVINCE_CODES.has(segment));
  return undefined;
}

function buildJobLocation(job: Job, isRemote: boolean) {
  const countryCodes = countryCodesForJob(job);

  if (isRemote) {
    if (countryCodes.length === 0) return null;
    return {
      applicantLocationRequirements: countryCodes.map((code) => ({
        '@type': 'Country',
        name: code,
      })),
      jobLocationType: 'TELECOMMUTE',
    };
  }

  const countryCode = countryCodes[0];
  if (!countryCode) return null;

  const city = job.city && !/^remote$/i.test(job.city.trim())
    ? replaceEmDashes(job.city.trim())
    : undefined;
  const region = locationRegion(job, countryCode);
  return {
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        ...(city && { addressLocality: city }),
        ...(region && { addressRegion: region }),
        addressCountry: countryCode,
      },
    },
  };
}

function buildBaseSalary(job: Job): Record<string, unknown> | undefined {
  const salaryMin = typeof job.salaryMin === 'number' && job.salaryMin > 0 ? job.salaryMin : undefined;
  const salaryMax = typeof job.salaryMax === 'number' && job.salaryMax > 0 ? job.salaryMax : undefined;
  if (!salaryMin && !salaryMax) return undefined;

  const units: Record<string, string> = {
    hourly: 'HOUR',
    daily: 'DAY',
    weekly: 'WEEK',
    monthly: 'MONTH',
    annual: 'YEAR',
    yearly: 'YEAR',
  };
  const unitText = units[(job.salaryType || '').toLowerCase()];
  if (!unitText) return undefined;

  const currency = /^[A-Z]{3}$/i.test(job.currency || '')
    ? (job.currency || 'USD').toUpperCase()
    : 'USD';

  return {
    '@type': 'MonetaryAmount',
    currency,
    value: {
      '@type': 'QuantitativeValue',
      ...(salaryMin && salaryMax
        ? { minValue: Math.min(salaryMin, salaryMax), maxValue: Math.max(salaryMin, salaryMax) }
        : { value: salaryMin || salaryMax }),
      unitText,
    },
  };
}

function mapEmploymentType(value: string): string | string[] {
  const typeMap: Record<string, string> = {
    'full-time': 'FULL_TIME',
    fulltime: 'FULL_TIME',
    'part-time': 'PART_TIME',
    parttime: 'PART_TIME',
    contract: 'CONTRACTOR',
    contractor: 'CONTRACTOR',
    temporary: 'TEMPORARY',
    internship: 'INTERN',
    intern: 'INTERN',
    freelance: 'CONTRACTOR',
    volunteer: 'VOLUNTEER',
    'per-diem': 'PER_DIEM',
  };

  const normalized = value.toLowerCase().trim();
  if (normalized.includes(',') || normalized.includes('/')) {
    const mapped = normalized
      .split(/[,/]/)
      .map((type) => typeMap[type.trim()] || 'OTHER');
    return [...new Set(mapped)];
  }
  return typeMap[normalized] || 'OTHER';
}

function minimumMonthsOfExperience(value: string | null): number | undefined {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  if (/^(none|no requirements?|0(?:-0)?)$/.test(normalized)) return 0;
  const match = normalized.match(/(\d+(?:\.\d+)?)/);
  if (!match) return undefined;
  return Math.round(Number(match[1]) * 12);
}

function educationCredential(value: string | null): string | undefined {
  if (!value) return undefined;
  const map: Record<string, string> = {
    'high-school': 'high school',
    'high school': 'high school',
    associate: 'associate degree',
    bachelor: 'bachelor degree',
    "bachelor's": 'bachelor degree',
    master: 'postgraduate degree',
    "master's": 'postgraduate degree',
    phd: 'postgraduate degree',
    doctorate: 'postgraduate degree',
    'none-required': 'no requirements',
    none: 'no requirements',
  };
  return map[value.toLowerCase().trim()];
}

/**
 * Evidence-backed JobPosting JSON-LD. Returns null rather than fabricating a
 * required Google field when a listing is incomplete or geographically vague.
 */
export function generateJobStructuredData(job: Job, url: string) {
  const title = job.title ? replaceEmDashes(job.title.trim()) : undefined;
  const company = formatCompanyName(job.company);
  const createdAt = new Date(job.createdAt);
  const description = buildFullDescription(job);
  const plainDescription = extractPlainText(description, 10_000);
  const isRemote = job.workArrangement === 'remote';
  const location = buildJobLocation(job, isRemote);

  if (
    !title ||
    !company ||
    isNaN(createdAt.getTime()) ||
    plainDescription.length < 100 ||
    !location
  ) {
    return null;
  }

  const requiredSkills = parseJsonArray(job.requiredSkills);
  const preferredSkills = parseJsonArray(job.preferredSkills);
  const benefits = parseJsonArray(job.benefits);
  const companyWebsite = validCompanyWebsite(job.companyWebsite);
  const baseSalary = buildBaseSalary(job);
  const monthsOfExperience = minimumMonthsOfExperience(job.yearsExperience);
  const educationRequirements = educationCredential(job.educationLevel);
  const responsibilities = hasMeaningfulJobSection(job.keyResponsibilities)
    ? extractPlainText(job.keyResponsibilities, 10_000)
    : undefined;
  const qualifications = hasMeaningfulJobSection(job.requirements)
    ? extractPlainText(job.requirements, 10_000)
    : undefined;
  const skills = [...new Set([...requiredSkills, ...preferredSkills])];
  const validThrough = jobValidThrough(job);

  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    '@id': `${url}#jobposting`,
    title,
    description,
    datePosted: createdAt.toISOString(),
    validThrough: validThrough.toISOString(),
    identifier: {
      '@type': 'PropertyValue',
      name: company,
      value: job.id,
    },
    hiringOrganization: {
      '@type': 'Organization',
      name: company,
      ...(companyWebsite && { sameAs: companyWebsite, url: companyWebsite }),
    },
    ...location,
    employmentType: mapEmploymentType(job.employmentType || job.type || ''),
    ...(baseSalary && { baseSalary }),
    ...(monthsOfExperience !== undefined && {
      experienceRequirements: {
        '@type': 'OccupationalExperienceRequirements',
        monthsOfExperience,
      },
    }),
    ...(educationRequirements && {
      educationRequirements: {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: educationRequirements,
      },
    }),
    ...(job.industry?.trim() && { industry: replaceEmDashes(job.industry.trim()) }),
    ...(skills.length > 0 && { skills: skills.join(', ') }),
    ...(qualifications && { qualifications }),
    ...(responsibilities && { responsibilities }),
    ...(benefits.length > 0 && { jobBenefits: benefits.join('; ') }),
    directApply: false,
    url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
    },
  };
}

export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: 'AccessibilityJobs',
    alternateName: ['Accessibility Jobs', 'A11y Jobs', 'AccessibilityJobs.net'],
    url: SITE_URL,
    description:
      'A focused job board for digital accessibility professionals and organizations building inclusive products and services.',
    logo: {
      '@type': 'ImageObject',
      '@id': `${SITE_URL}/#logo`,
      url: `${SITE_URL}/android-chrome-512x512.png`,
      contentUrl: `${SITE_URL}/android-chrome-512x512.png`,
      width: 512,
      height: 512,
      caption: 'AccessibilityJobs',
    },
    foundingDate: '2024',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'hello@accessibilityjobs.net',
      availableLanguage: 'English',
    },
    areaServed: 'Worldwide',
    serviceType: 'Job board',
  };
}

export function generateJobCollectionStructuredData(
  jobs: Job[],
  options: {
    url?: string;
    name?: string;
    description?: string;
    total?: number;
  } = {}
) {
  const url = options.url || SITE_URL;
  const name = options.name || 'Accessibility Jobs';
  const description = options.description || 'Browse current digital accessibility job openings.';

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#webpage`,
    name,
    description,
    url,
    isPartOf: { '@id': WEBSITE_ID },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: options.total ?? jobs.length,
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
      itemListElement: jobs.map((job, index) => {
        const jobUrl = `${SITE_URL}${jobPath(job)}`;
        return {
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'WebPage',
            '@id': `${jobUrl}#webpage`,
            url: jobUrl,
            name: `${replaceEmDashes(job.title)} at ${formatCompanyName(job.company)}`,
          },
        };
      }),
    },
  };
}

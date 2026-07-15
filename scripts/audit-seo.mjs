#!/usr/bin/env node

/** Crawl every sitemap URL and validate rendered SEO + JSON-LD invariants. */

const baseUrl = new URL(process.argv[2] || process.env.SEO_AUDIT_BASE_URL || 'http://localhost:3000');
const productionOrigin = 'https://accessibilityjobs.net';

function localUrl(url) {
  const parsed = new URL(url, productionOrigin);
  return new URL(`${parsed.pathname}${parsed.search}`, baseUrl).toString();
}

function decodeHtml(value = '') {
  return value
    .replace(/&mdash;|&#8212;|&#x2014;/gi, '—')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

function attributes(tag) {
  const result = {};
  for (const match of tag.matchAll(/([:\w-]+)=["']([^"']*)["']/g)) {
    result[match[1].toLowerCase()] = decodeHtml(match[2]);
  }
  return result;
}

function metaContent(html, name) {
  for (const tag of html.match(/<meta\b[^>]*>/gi) || []) {
    const attrs = attributes(tag);
    if ((attrs.name || attrs.property) === name) return attrs.content || '';
  }
  return '';
}

function canonicalUrl(html) {
  for (const tag of html.match(/<link\b[^>]*>/gi) || []) {
    const attrs = attributes(tag);
    if ((attrs.rel || '').split(/\s+/).includes('canonical')) return attrs.href || '';
  }
  return '';
}

function titleText(html) {
  return decodeHtml(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '');
}

function h1Count(html) {
  return (html.match(/<h1\b/gi) || []).length;
}

function jsonLdNodes(html, errors, path) {
  const roots = [];
  const pattern = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  for (const match of html.matchAll(pattern)) {
    try {
      roots.push(JSON.parse(match[1]));
    } catch (error) {
      errors.push(`${path}: invalid JSON-LD (${error.message})`);
    }
  }

  const nodes = [];
  for (const root of roots) {
    if (Array.isArray(root)) nodes.push(...root);
    else if (Array.isArray(root?.['@graph'])) nodes.push(...root['@graph']);
    else if (root && typeof root === 'object') nodes.push(root);
  }
  return nodes;
}

function hasType(nodes, type) {
  return nodes.some((node) => {
    const value = node?.['@type'];
    return value === type || (Array.isArray(value) && value.includes(type));
  });
}

async function fetchText(url, options = {}) {
  const response = await fetch(url, { redirect: 'follow', ...options });
  return { response, text: await response.text() };
}

async function auditPage(productionUrl) {
  const parsed = new URL(productionUrl);
  const path = parsed.pathname;
  const errors = [];
  const warnings = [];
  const { response, text: html } = await fetchText(localUrl(productionUrl));

  if (response.status !== 200) errors.push(`${path}: HTTP ${response.status}`);

  const title = titleText(html);
  const description = metaContent(html, 'description');
  const canonical = canonicalUrl(html);
  const robots = metaContent(html, 'robots');
  const nodes = jsonLdNodes(html, errors, path);
  const visibleMarkup = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');

  if (decodeHtml(visibleMarkup).includes('—')) errors.push(`${path}: rendered copy contains an em dash`);
  if (JSON.stringify(nodes).includes('—')) errors.push(`${path}: structured data contains an em dash`);

  if (!title) errors.push(`${path}: missing title`);
  if ((title.match(/AccessibilityJobs/gi) || []).length > 1) {
    errors.push(`${path}: repeated site name in title (${title})`);
  }
  if (description.length < 40 || description.length > 200) {
    errors.push(`${path}: meta description length ${description.length}`);
  }
  if (canonical !== productionUrl.replace(/\/$/, '') && !(path === '/' && canonical === productionOrigin)) {
    errors.push(`${path}: canonical mismatch (${canonical || 'missing'})`);
  }
  if (/noindex/i.test(robots)) errors.push(`${path}: sitemap URL is noindex`);
  if (h1Count(html) !== 1) errors.push(`${path}: expected one h1, found ${h1Count(html)}`);

  const isJob = path.startsWith('/jobs/');
  if (isJob) {
    if (!hasType(nodes, 'WebPage')) errors.push(`${path}: missing WebPage schema`);
    if (!hasType(nodes, 'BreadcrumbList')) errors.push(`${path}: missing BreadcrumbList schema`);

    const postings = nodes.filter((node) => node?.['@type'] === 'JobPosting');
    if (postings.length > 1) errors.push(`${path}: multiple JobPosting objects`);
    if (postings.length === 0) {
      warnings.push(`${path}: WebPage only; source lacks a Google-eligible country or other required evidence`);
    } else {
      const job = postings[0];
      for (const field of ['title', 'description', 'datePosted', 'hiringOrganization', 'employmentType', 'url']) {
        if (!job[field]) errors.push(`${path}: JobPosting missing ${field}`);
      }
      if (job.url !== productionUrl) errors.push(`${path}: JobPosting URL mismatch`);
      if (job.hiringOrganization?.logo?.includes?.('accessibilityjobs.net')) {
        errors.push(`${path}: job board logo is incorrectly assigned to employer`);
      }
      const employerUrl = job.hiringOrganization?.url || job.hiringOrganization?.sameAs;
      if (employerUrl && /(?:a11yjobs|indeed|linkedin|glassdoor|ziprecruiter|monster)\.com/i.test(employerUrl)) {
        errors.push(`${path}: source job board is incorrectly assigned as employer website`);
      }
      if (job.jobLocationType === 'TELECOMMUTE') {
        const locations = Array.isArray(job.applicantLocationRequirements)
          ? job.applicantLocationRequirements
          : [job.applicantLocationRequirements].filter(Boolean);
        if (!locations.length || locations.some((location) => location?.['@type'] !== 'Country')) {
          errors.push(`${path}: remote JobPosting lacks country-level applicant eligibility`);
        }
      } else if (!job.jobLocation?.address?.addressCountry) {
        errors.push(`${path}: physical JobPosting lacks addressCountry`);
      }
      if (job.baseSalary) {
        const unit = job.baseSalary?.value?.unitText;
        if (!['HOUR', 'DAY', 'WEEK', 'MONTH', 'YEAR'].includes(unit)) {
          errors.push(`${path}: invalid salary unit ${unit}`);
        }
      }
    }
  } else {
    if (hasType(nodes, 'JobPosting')) errors.push(`${path}: JobPosting schema is forbidden on a list/content page`);
    if (path === '/') {
      for (const type of ['Organization', 'WebSite', 'CollectionPage']) {
        if (!hasType(nodes, type)) errors.push(`${path}: missing ${type} schema`);
      }
    } else {
      if (!hasType(nodes, 'WebPage') && !hasType(nodes, 'CollectionPage') && !hasType(nodes, 'AboutPage') && !hasType(nodes, 'ContactPage')) {
        errors.push(`${path}: missing page-level schema`);
      }
      if (!hasType(nodes, 'BreadcrumbList')) errors.push(`${path}: missing BreadcrumbList schema`);
    }
  }

  return { path, errors, warnings, jobPosting: nodes.some((node) => node?.['@type'] === 'JobPosting') };
}

async function mapConcurrent(items, concurrency, callback) {
  const results = new Array(items.length);
  let cursor = 0;
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, async () => {
      while (cursor < items.length) {
        const index = cursor++;
        results[index] = await callback(items[index]);
      }
    })
  );
  return results;
}

async function main() {
  const errors = [];
  const warnings = [];

  const { response: robotsResponse, text: robots } = await fetchText(new URL('/robots.txt', baseUrl));
  if (robotsResponse.status !== 200) errors.push(`robots.txt: HTTP ${robotsResponse.status}`);
  if (!/Sitemap:\s*https:\/\/accessibilityjobs\.net\/sitemap\.xml/i.test(robots)) {
    errors.push('robots.txt: canonical sitemap directive missing');
  }
  if (/Disallow:\s*\/admin/i.test(robots)) {
    errors.push('robots.txt: admin is disallowed, preventing crawlers from seeing noindex');
  }

  const { response: sitemapResponse, text: sitemap } = await fetchText(new URL('/sitemap.xml', baseUrl));
  if (sitemapResponse.status !== 200) errors.push(`sitemap.xml: HTTP ${sitemapResponse.status}`);
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => decodeHtml(match[1]));
  if (!urls.length) errors.push('sitemap.xml: no URLs found');
  if (new Set(urls).size !== urls.length) errors.push('sitemap.xml: duplicate URLs found');

  const pageResults = await mapConcurrent(urls, 8, auditPage);
  for (const result of pageResults) {
    errors.push(...result.errors);
    warnings.push(...result.warnings);
  }

  const filtered = await fetchText(new URL('/?search=accessibility', baseUrl));
  if (!/noindex/i.test(metaContent(filtered.text, 'robots'))) {
    errors.push('filtered homepage: missing noindex');
  }
  if (canonicalUrl(filtered.text) !== productionOrigin) {
    errors.push('filtered homepage: canonical does not point to homepage');
  }

  const admin = await fetch(new URL('/admin/login', baseUrl), { redirect: 'manual' });
  if (!/noindex/i.test(admin.headers.get('x-robots-tag') || '')) {
    errors.push('admin: X-Robots-Tag noindex header missing');
  }

  for (const resourcePath of ['/feed.xml', '/site.webmanifest']) {
    const resource = await fetchText(new URL(resourcePath, baseUrl));
    if (decodeHtml(resource.text).includes('—')) {
      errors.push(`${resourcePath}: contains an em dash`);
    }
  }

  const jobPages = pageResults.filter((result) => result.path.startsWith('/jobs/'));
  const jobPostingPages = jobPages.filter((result) => result.jobPosting);

  console.log(`base_url: ${baseUrl.origin}`);
  console.log(`sitemap_urls: ${urls.length}`);
  console.log(`job_pages: ${jobPages.length}`);
  console.log(`google_eligible_job_postings: ${jobPostingPages.length}`);
  console.log(`webpage_only_jobs: ${jobPages.length - jobPostingPages.length}`);
  console.log(`warnings: ${warnings.length}`);
  for (const warning of warnings) console.log(`WARN ${warning}`);
  console.log(`errors: ${errors.length}`);
  for (const error of errors) console.error(`ERROR ${error}`);

  process.exitCode = errors.length ? 1 : 0;
}

main().catch((error) => {
  console.error(`SEO audit failed: ${error.stack || error.message}`);
  process.exitCode = 1;
});

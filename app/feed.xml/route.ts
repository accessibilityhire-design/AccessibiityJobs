import { recentActiveJobs } from '@/lib/jobs-query';
import { jobPath } from '@/lib/slug';
import { extractPlainText, formatCompanyName } from '@/lib/job-formatter';
import { replaceEmDashes } from '@/lib/text-style';

export const revalidate = 900; // 15 minutes

const SITE_URL = 'https://accessibilityjobs.net';

function xmlEscape(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  let jobs: Awaited<ReturnType<typeof recentActiveJobs>> = [];
  try {
    jobs = await recentActiveJobs(50);
  } catch (error) {
    console.error('Failed to build RSS feed:', error);
  }

  const items = jobs
    .map((job) => {
      const url = `${SITE_URL}${jobPath(job)}`;
      const title = `${replaceEmDashes(job.title)} at ${formatCompanyName(job.company)}`;
      const description = extractPlainText(job.description, 300);
      const pubDate = new Date(job.createdAt).toUTCString();
      return `    <item>
      <title>${xmlEscape(title)}</title>
      <link>${xmlEscape(url)}</link>
      <guid isPermaLink="true">${xmlEscape(url)}</guid>
      <description>${xmlEscape(description)}</description>
      <pubDate>${pubDate}</pubDate>
      <category>${xmlEscape(job.workArrangement || 'accessibility')}</category>
    </item>`;
    })
    .join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AccessibilityJobs: New Accessibility Jobs</title>
    <link>${SITE_URL}</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>The latest digital accessibility jobs: engineers, auditors, designers, and consultants.</description>
    <language>en-us</language>
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=3600',
    },
  });
}

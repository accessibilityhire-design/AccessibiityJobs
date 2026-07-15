import { MetadataRoute } from 'next';
import { indexableJobs } from '@/lib/jobs-query';
import { jobPath } from '@/lib/slug';
import { PUBLIC_SEO_PAGES } from '@/lib/seo-pages';

export const revalidate = 3600;

const SITE_URL = 'https://accessibilityjobs.net';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let jobUrls: MetadataRoute.Sitemap = [];

  try {
    const activeJobs = await indexableJobs(2000);
    jobUrls = activeJobs.map((job) => ({
      url: `${SITE_URL}${jobPath(job)}`,
      lastModified: job.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Failed to fetch jobs for sitemap:', error);
  }

  const staticUrls: MetadataRoute.Sitemap = PUBLIC_SEO_PAGES.map((page) => ({
    url: page.path === '/' ? SITE_URL : `${SITE_URL}${page.path}`,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  return [...staticUrls, ...jobUrls];
}

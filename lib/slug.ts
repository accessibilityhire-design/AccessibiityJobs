/**
 * SEO-friendly job URLs: /jobs/<title>-<company>-<uuid>
 * The trailing UUID is the source of truth; the slug prefix is cosmetic,
 * so old /jobs/<uuid> links keep working and get redirected to the
 * canonical slug URL.
 */

const UUID_RE = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip combining diacritics left by NFKD
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');
}

export function jobPath(job: { id: string; title: string; company: string }): string {
  const slug = slugify(`${job.title} ${job.company}`);
  return slug ? `/jobs/${slug}-${job.id}` : `/jobs/${job.id}`;
}

/** Extract the job UUID from a /jobs/[id] route param (slugged or bare). */
export function extractJobId(param: string): string | null {
  const match = decodeURIComponent(param).match(UUID_RE);
  return match ? match[1].toLowerCase() : null;
}

/**
 * Listing freshness window shared by queries, structured data, sitemap,
 * and feeds. A job expires this many days after posting unless its
 * applicationDeadline says otherwise.
 *
 * 90 days is what we advertise to Google Jobs as validThrough — raising
 * JOB_EXPIRY_DAYS via env keeps older listings visible on the site, but
 * they'll drop out of Google's job index once their validThrough passes.
 */
export const JOB_EXPIRY_DAYS = Number(process.env.JOB_EXPIRY_DAYS) || 90;

export function jobValidThrough(job: { createdAt: Date | string; applicationDeadline?: Date | string | null }): Date {
  if (job.applicationDeadline) {
    const deadline = new Date(job.applicationDeadline);
    if (!isNaN(deadline.getTime())) return deadline;
  }
  const created = new Date(job.createdAt);
  const base = isNaN(created.getTime()) ? new Date() : created;
  const validThrough = new Date(base);
  validThrough.setDate(validThrough.getDate() + JOB_EXPIRY_DAYS);
  return validThrough;
}

export function isJobExpired(job: { createdAt: Date | string; applicationDeadline?: Date | string | null }): boolean {
  return jobValidThrough(job).getTime() < Date.now();
}

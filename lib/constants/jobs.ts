/**
 * Two decoupled listing windows:
 *
 * - DISPLAY window: how long a job stays visible on the site (board, search,
 *   related jobs, feed). Generous so the board stays populated.
 * - GOOGLE window: how long a job is treated as fresh for Google Jobs — it
 *   caps validThrough, and past it a job is dropped from JobPosting schema,
 *   set to noindex, excluded from the sitemap, and flagged "may be filled".
 *   Kept at ~90 days so we never tell Google a stale job is still open.
 */
export const JOB_DISPLAY_DAYS = Number(process.env.JOB_DISPLAY_DAYS) || 365;
export const JOB_GOOGLE_VALID_DAYS = Number(process.env.JOB_GOOGLE_VALID_DAYS) || 90;

type JobDates = { createdAt: Date | string; applicationDeadline?: Date | string | null };

function postedDate(job: JobDates): Date {
  const created = new Date(job.createdAt);
  return isNaN(created.getTime()) ? new Date() : created;
}

/**
 * validThrough for Google: the application deadline if it falls sooner,
 * otherwise posting date + the Google window. Never exceeds the Google
 * window, so we don't claim a year-long opening.
 */
export function jobValidThrough(job: JobDates): Date {
  const cap = new Date(postedDate(job));
  cap.setDate(cap.getDate() + JOB_GOOGLE_VALID_DAYS);
  if (job.applicationDeadline) {
    const deadline = new Date(job.applicationDeadline);
    if (!isNaN(deadline.getTime()) && deadline.getTime() < cap.getTime()) {
      return deadline;
    }
  }
  return cap;
}

/**
 * Stale for Google/SEO purposes: past its validThrough. Such jobs still
 * render for humans (with a banner) but must not be indexed or emit
 * JobPosting schema.
 */
export function isJobStale(job: JobDates): boolean {
  return jobValidThrough(job).getTime() < Date.now();
}

/** Back-compat alias — same meaning as isJobStale. */
export const isJobExpired = isJobStale;

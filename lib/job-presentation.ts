import type { Job } from '@/lib/db/schema';
import { replaceEmDashes } from '@/lib/text-style';

export function salaryLabel(job: Pick<Job, 'salaryMin' | 'salaryMax' | 'salaryRange' | 'salaryType' | 'currency'>): string | null {
  const min = job.salaryMin && job.salaryMin > 0 ? job.salaryMin : null;
  const max = job.salaryMax && job.salaryMax > 0 ? job.salaryMax : null;
  if ((min || max) && job.currency && /^[A-Z]{3}$/i.test(job.currency)) {
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: job.currency.toUpperCase(), currencyDisplay: 'code', maximumFractionDigits: 0 });
    const amount = min && max ? min === max ? formatter.format(min) : `${formatter.format(min)} - ${new Intl.NumberFormat('en-US').format(max)}` : min ? `From ${formatter.format(min)}` : `Up to ${formatter.format(max!)}`;
    const period = { annual: 'year', monthly: 'month', weekly: 'week', daily: 'day', hourly: 'hour', project: 'project' }[job.salaryType || ''];
    return `${amount}${period ? ` / ${period}` : ''}`;
  }
  const raw = job.salaryRange?.trim();
  return raw && /\d/.test(raw) ? replaceEmDashes(raw) : null;
}

export function locationLabel(job: Pick<Job, 'city' | 'country' | 'specificLocation' | 'location'>): string {
  let country = job.country || '';
  if (/^[a-z]{2}$/i.test(country)) {
    try { country = new Intl.DisplayNames(['en'], { type: 'region' }).of(country.toUpperCase()) || country; } catch { /* Keep supplied label. */ }
  }
  const city = job.city?.trim();
  if (city && country && city.toLowerCase() !== country.toLowerCase()) return replaceEmDashes(`${city}, ${country}`);
  return replaceEmDashes(job.specificLocation || job.location || city || country || 'Location not specified');
}

export function skillLabels(value: string | null): string[] {
  try {
    const parsed: unknown = JSON.parse(value || '[]');
    return Array.isArray(parsed) ? [...new Set(parsed.filter((s): s is string => typeof s === 'string' && s.trim().length > 0 && s.length <= 48).map(s => replaceEmDashes(s.trim())))] : [];
  } catch { return []; }
}

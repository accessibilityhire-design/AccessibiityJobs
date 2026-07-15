/** Replace em dashes with a spaced hyphen throughout user-facing copy. */
export function replaceEmDashes(text: string): string {
  return text.replace(/\s*—\s*/g, ' - ');
}

/** Recursively normalize text received from JSON-backed submission forms. */
export function normalizeSubmittedCopy<T>(value: T): T {
  if (typeof value === 'string') return replaceEmDashes(value) as T;
  if (Array.isArray(value)) return value.map((item) => normalizeSubmittedCopy(item)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, normalizeSubmittedCopy(item)])
    ) as T;
  }
  return value;
}

// Shared constants for job posting form

export const CERTIFICATIONS = [
  'CPACC (Certified Professional in Accessibility Core Competencies)',
  'WAS (Web Accessibility Specialist)',
  'CPWA (Certified Professional in Web Accessibility)',
  'IAAP Certification',
  'Section 508 Trusted Tester',
  'DHS Trusted Tester',
  'ACTCP (Accessible Technology Certified Professional)',
];

export const COMPANY_SIZES = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '501-1000', label: '501-1,000 employees' },
  { value: '1000+', label: '1,000+ employees' },
];

export const JOB_LEVELS = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead' },
  { value: 'principal', label: 'Principal' },
  { value: 'director', label: 'Director' },
  { value: 'vp', label: 'Vice President' },
  { value: 'c-level', label: 'C-Level Executive' },
];

export const EMPLOYMENT_TYPES = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'internship', label: 'Internship' },
];

export const EXPERIENCE_LEVELS = [
  { value: '0-1', label: '0-1 years' },
  { value: '1-3', label: '1-3 years' },
  { value: '3-5', label: '3-5 years' },
  { value: '5-7', label: '5-7 years' },
  { value: '7-10', label: '7-10 years' },
  { value: '10+', label: '10+ years' },
];

export const EDUCATION_LEVELS = [
  { value: 'none-required', label: 'No degree required' },
  { value: 'high-school', label: 'High School / GED' },
  { value: 'associate', label: 'Associate Degree' },
  { value: 'bachelor', label: 'Bachelor\'s Degree' },
  { value: 'master', label: 'Master\'s Degree' },
  { value: 'phd', label: 'Ph.D.' },
];

export const WCAG_LEVELS = [
  { value: 'wcag-2.0', label: 'WCAG 2.0' },
  { value: 'wcag-2.1', label: 'WCAG 2.1' },
  { value: 'wcag-2.2', label: 'WCAG 2.2' },
  { value: 'wcag-3.0', label: 'WCAG 3.0 (W3C Silver)' },
];

export const ACCESSIBILITY_FOCUS_AREAS = [
  'Web Accessibility',
  'Mobile Accessibility (iOS)',
  'Mobile Accessibility (Android)',
  'Desktop Applications',
  'Document Accessibility (PDF)',
  'Video & Media Accessibility',
  'Gaming Accessibility',
  'AR/VR Accessibility',
  'IoT & Smart Devices',
  'Kiosk & ATM Accessibility',
];

export const ASSISTIVE_TECH = [
  'JAWS (Screen Reader)',
  'NVDA (Screen Reader)',
  'VoiceOver (macOS/iOS)',
  'TalkBack (Android)',
  'ANDI (Accessibility Testing)',
  'Axe DevTools',
  'Wave',
  'Dragon NaturallySpeaking (Voice Control)',
  'Magnification Software',
  'Switch Control',
  'Eye Tracking Technology',
];

export const COMMON_SKILLS = [
  'ARIA (Accessible Rich Internet Applications)',
  'HTML5 Semantics',
  'CSS for Accessibility',
  'JavaScript Accessibility',
  'React Accessibility',
  'Angular Accessibility',
  'Vue.js Accessibility',
  'Manual Testing',
  'Automated Testing',
  'Color Contrast Analysis',
  'Keyboard Navigation',
  'Focus Management',
  'Alternative Text Writing',
  'Accessible Forms',
  'WCAG Auditing',
  'Accessibility Remediation',
  'Inclusive Design Principles',
  'User Research with PWD',
];

export const BENEFITS_OPTIONS = [
  'Health Insurance (Medical, Dental, Vision)',
  '401(k) / Pension Plan',
  'Paid Time Off (PTO)',
  'Sick Leave',
  'Parental Leave',
  'Remote Work Stipend',
  'Home Office Equipment',
  'Professional Development Budget',
  'Conference Attendance',
  'Certification Reimbursement',
  'Flexible Work Hours',
  'Mental Health Support',
  'Gym Membership / Wellness Program',
  'Life Insurance',
  'Disability Insurance',
  'Stock Options / Equity',
  'Performance Bonuses',
  'Relocation Assistance',
];

export const CURRENCIES = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'CAD', label: 'CAD ($)' },
  { value: 'AUD', label: 'AUD ($)' },
  { value: 'INR', label: 'INR (₹)' },
  { value: 'JPY', label: 'JPY (¥)' },
  { value: 'CNY', label: 'CNY (¥)' },
];

export const SALARY_TYPES = [
  { value: 'annual', label: 'Annual' },
  { value: 'hourly', label: 'Hourly' },
  { value: 'daily', label: 'Daily' },
  { value: 'project', label: 'Per Project' },
];

export const TRAVEL_REQUIREMENTS = [
  { value: 'none', label: 'No travel required' },
  { value: 'occasional', label: 'Occasional (1-2 times/year)' },
  { value: 'regular', label: 'Regular (Monthly)' },
  { value: 'frequent', label: 'Frequent (Weekly)' },
];

// Helper function to toggle array items
export function toggleArrayItem<T>(array: T[], item: T, setter: (val: T[]) => void) {
  if (array.includes(item)) {
    setter(array.filter((i) => i !== item));
  } else {
    setter([...array, item]);
  }
}


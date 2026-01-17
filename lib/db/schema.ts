import { pgTable, text, timestamp, uuid, varchar, integer, boolean } from 'drizzle-orm/pg-core';

// Jobs table - comprehensive accessibility job postings
export const jobs = pgTable('jobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  
  // Basic Information
  title: varchar('title', { length: 255 }).notNull(),
  company: varchar('company', { length: 255 }).notNull(),
  companyWebsite: varchar('company_website', { length: 500 }),
  companySize: varchar('company_size', { length: 50 }), // 1-10, 11-50, 51-200, 201-500, 501-1000, 1000+
  industry: varchar('industry', { length: 100 }),
  
  // Job Details
  jobLevel: varchar('job_level', { length: 50 }), // entry, mid, senior, lead, principal, director, vp, c-level
  employmentType: varchar('employment_type', { length: 50 }).notNull(), // full-time, part-time, contract, freelance, internship
  department: varchar('department', { length: 100 }),
  
  // Location & Remote Work
  workArrangement: varchar('work_arrangement', { length: 50 }).notNull(), // remote, hybrid, onsite
  timezone: varchar('timezone', { length: 100 }), // e.g., "America/New_York" or "GMT-5"
  country: varchar('country', { length: 100 }),
  city: varchar('city', { length: 100 }),
  specificLocation: varchar('specific_location', { length: 255 }), // Full address or region
  relocationAssistance: boolean('relocation_assistance').default(false),
  
  // Compensation
  salaryMin: integer('salary_min'),
  salaryMax: integer('salary_max'),
  currency: varchar('currency', { length: 10 }).default('USD'),
  salaryType: varchar('salary_type', { length: 50 }), // annual, hourly, daily, project
  equityOffered: boolean('equity_offered').default(false),
  bonusStructure: varchar('bonus_structure', { length: 255 }),
  
  // Experience & Education
  yearsExperience: varchar('years_experience', { length: 50 }), // 0-1, 1-3, 3-5, 5-7, 7-10, 10+
  educationLevel: varchar('education_level', { length: 100 }), // high-school, associate, bachelor, master, phd, none-required
  requiredCertifications: text('required_certifications'), // JSON array
  preferredCertifications: text('preferred_certifications'), // JSON array
  
  // Skills & Accessibility Focus
  requiredSkills: text('required_skills'), // JSON array
  preferredSkills: text('preferred_skills'), // JSON array
  wcagLevel: varchar('wcag_level', { length: 50 }), // WCAG 2.0, 2.1, 2.2, 3.0
  accessibilityFocus: text('accessibility_focus'), // JSON array: web, mobile, desktop, document, etc.
  assistiveTechExperience: text('assistive_tech_experience'), // JSON array: JAWS, NVDA, VoiceOver, etc.
  
  // Job Description
  description: text('description').notNull(),
  keyResponsibilities: text('key_responsibilities').notNull(),
  requirements: text('requirements').notNull(),
  niceToHave: text('nice_to_have'),
  
  // Benefits
  benefits: text('benefits'), // JSON array
  professionalDevelopment: boolean('professional_development').default(false),
  healthInsurance: boolean('health_insurance').default(false),
  retirement: boolean('retirement').default(false),
  ptoDetails: varchar('pto_details', { length: 255 }),
  
  // Application Details
  contactEmail: varchar('contact_email', { length: 255 }).notNull(),
  applicationDeadline: timestamp('application_deadline'),
  expectedStartDate: varchar('expected_start_date', { length: 100 }),
  visaSponsorship: boolean('visa_sponsorship').default(false),
  securityClearance: boolean('security_clearance').default(false),
  travelRequired: varchar('travel_required', { length: 50 }), // none, occasional, frequent
  
  // Additional Info
  additionalNotes: text('additional_notes'),
  
  // Legacy fields for backward compatibility (will be deprecated)
  location: varchar('location', { length: 255 }), // Kept for backward compatibility
  type: varchar('type', { length: 50 }), // Kept for backward compatibility
  salaryRange: varchar('salary_range', { length: 100 }), // Kept for backward compatibility
  
  // Job Source Tracking
  jobSource: varchar('job_source', { length: 50 }), // linkedin, indeed, a11yjobs, ziprecruiter, direct
  sourceUrl: varchar('source_url', { length: 500 }), // Original job posting URL
  
  // Meta
  status: varchar('status', { length: 20 }).notNull().default('pending'), // pending, approved, rejected
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Type exports
export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;

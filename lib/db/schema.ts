import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

// Jobs table - the only table we need in the database
export const jobs = pgTable('jobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  company: varchar('company', { length: 255 }).notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // remote, hybrid, onsite
  description: text('description').notNull(),
  requirements: text('requirements').notNull(),
  salaryRange: varchar('salary_range', { length: 100 }),
  companyWebsite: varchar('company_website', { length: 500 }),
  contactEmail: varchar('contact_email', { length: 255 }).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('pending'), // pending, approved, rejected
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Type exports
export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;


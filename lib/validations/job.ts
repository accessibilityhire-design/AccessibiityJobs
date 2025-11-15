import { z } from 'zod';

export const jobSubmissionSchema = z.object({
  title: z.string().min(5, 'Job title must be at least 5 characters').max(255, 'Job title is too long'),
  company: z.string().min(2, 'Company name must be at least 2 characters').max(255, 'Company name is too long'),
  location: z.string().min(2, 'Location must be at least 2 characters').max(255, 'Location is too long'),
  type: z.enum(['remote', 'hybrid', 'onsite']),
  description: z.string().min(50, 'Description must be at least 50 characters').max(5000, 'Description is too long'),
  requirements: z.string().min(50, 'Requirements must be at least 50 characters').max(5000, 'Requirements are too long'),
  salaryRange: z.string().max(100, 'Salary range is too long').optional().or(z.literal('')),
  companyWebsite: z.string().url('Please enter a valid URL').max(500, 'URL is too long').optional().or(z.literal('')),
  contactEmail: z.string().email('Please enter a valid email address').max(255, 'Email is too long'),
});

export type JobSubmissionData = z.infer<typeof jobSubmissionSchema>;


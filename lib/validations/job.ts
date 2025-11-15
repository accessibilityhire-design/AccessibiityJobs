import { z } from 'zod';

export const jobSubmissionSchema = z.object({
  // Basic Information
  title: z.string().min(5, 'Job title must be at least 5 characters').max(255, 'Job title is too long'),
  company: z.string().min(2, 'Company name must be at least 2 characters').max(255, 'Company name is too long'),
  companyWebsite: z.string().url('Please enter a valid URL').max(500, 'URL is too long').optional().or(z.literal('')),
  companySize: z.string().optional(),
  industry: z.string().max(100).optional(),
  
  // Job Details
  jobLevel: z.string().optional(),
  employmentType: z.string().min(1, 'Employment type is required'),
  department: z.string().max(100).optional(),
  
  // Location & Remote Work
  workArrangement: z.enum(['remote', 'hybrid', 'onsite']),
  timezone: z.string().optional(),
  country: z.string().optional(),
  city: z.string().max(100).optional(),
  specificLocation: z.string().max(255).optional(),
  relocationAssistance: z.boolean().optional(),
  
  // Compensation
  salaryMin: z.number().min(0).optional().or(z.literal(null)),
  salaryMax: z.number().min(0).optional().or(z.literal(null)),
  currency: z.string().optional(),
  salaryType: z.string().optional(),
  equityOffered: z.boolean().optional(),
  bonusStructure: z.string().max(255).optional(),
  
  // Experience & Education
  yearsExperience: z.string().optional(),
  educationLevel: z.string().optional(),
  requiredCertifications: z.array(z.string()).optional(),
  preferredCertifications: z.array(z.string()).optional(),
  
  // Skills & Accessibility Focus
  requiredSkills: z.array(z.string()).min(1, 'At least one required skill is needed').optional(),
  preferredSkills: z.array(z.string()).optional(),
  wcagLevel: z.string().optional(),
  accessibilityFocus: z.array(z.string()).min(1, 'At least one accessibility focus area is required').optional(),
  assistiveTechExperience: z.array(z.string()).optional(),
  
  // Job Description
  description: z.string()
    .min(1, 'Job overview is required')
    .refine((val) => {
      // Strip HTML tags and check text content length
      const textContent = val.replace(/<[^>]*>/g, '').trim();
      return textContent.length >= 100;
    }, { message: 'Description must be at least 100 characters (excluding formatting)' })
    .max(10000, 'Description is too long'),
  keyResponsibilities: z.string()
    .min(1, 'Key responsibilities are required')
    .refine((val) => {
      const textContent = val.replace(/<[^>]*>/g, '').trim();
      return textContent.length >= 50;
    }, { message: 'Key responsibilities must be at least 50 characters (excluding formatting)' })
    .max(5000),
  requirements: z.string()
    .min(1, 'Required qualifications are required')
    .refine((val) => {
      const textContent = val.replace(/<[^>]*>/g, '').trim();
      return textContent.length >= 50;
    }, { message: 'Requirements must be at least 50 characters (excluding formatting)' })
    .max(5000, 'Requirements are too long'),
  niceToHave: z.string().max(3000).optional().or(z.literal('')),
  
  // Benefits
  benefits: z.array(z.string()).optional(),
  professionalDevelopment: z.boolean().optional(),
  healthInsurance: z.boolean().optional(),
  retirement: z.boolean().optional(),
  ptoDetails: z.string().max(255).optional(),
  
  // Application Details
  contactEmail: z.string().email('Please enter a valid email address').max(255, 'Email is too long'),
  applicationDeadline: z.string().optional(), // Will be converted to date on backend
  expectedStartDate: z.string().max(100).optional(),
  visaSponsorship: z.boolean().optional(),
  securityClearance: z.boolean().optional(),
  travelRequired: z.string().optional(),
  
  // Additional Info
  additionalNotes: z.string().max(2000).optional(),
  
  // Legacy fields for backward compatibility
  location: z.string().optional(),
  type: z.string().optional(),
  salaryRange: z.string().optional(),
});

export type JobSubmissionData = z.infer<typeof jobSubmissionSchema>;

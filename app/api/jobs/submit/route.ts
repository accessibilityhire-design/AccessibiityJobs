import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { jobs } from '@/lib/db/schema';
import { jobSubmissionSchema } from '@/lib/validations/job';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validationResult = jobSubmissionSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid job data', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Convert arrays to JSON strings for storage
    const requiredCertifications = data.requiredCertifications ? JSON.stringify(data.requiredCertifications) : null;
    const preferredCertifications = data.preferredCertifications ? JSON.stringify(data.preferredCertifications) : null;
    const requiredSkills = data.requiredSkills ? JSON.stringify(data.requiredSkills) : null;
    const preferredSkills = data.preferredSkills ? JSON.stringify(data.preferredSkills) : null;
    const accessibilityFocus = data.accessibilityFocus ? JSON.stringify(data.accessibilityFocus) : null;
    const assistiveTechExperience = data.assistiveTechExperience ? JSON.stringify(data.assistiveTechExperience) : null;
    const benefitsArray = data.benefits ? JSON.stringify(data.benefits) : null;

    // Parse application deadline if provided
    const applicationDeadline = data.applicationDeadline ? new Date(data.applicationDeadline) : null;

    // Insert the job with pending status
    const newJob = await db.insert(jobs).values({
      // Basic Information
      title: data.title,
      company: data.company,
      companyWebsite: data.companyWebsite || null,
      companySize: data.companySize || null,
      industry: data.industry || null,
      
      // Job Details
      jobLevel: data.jobLevel || null,
      employmentType: data.employmentType,
      department: data.department || null,
      
      // Location & Remote Work
      workArrangement: data.workArrangement,
      timezone: data.timezone || null,
      country: data.country || null,
      city: data.city || null,
      specificLocation: data.specificLocation || null,
      relocationAssistance: data.relocationAssistance || false,
      
      // Compensation
      salaryMin: data.salaryMin || null,
      salaryMax: data.salaryMax || null,
      currency: data.currency || 'USD',
      salaryType: data.salaryType || null,
      equityOffered: data.equityOffered || false,
      bonusStructure: data.bonusStructure || null,
      
      // Experience & Education
      yearsExperience: data.yearsExperience || null,
      educationLevel: data.educationLevel || null,
      requiredCertifications,
      preferredCertifications,
      
      // Skills & Accessibility Focus
      requiredSkills,
      preferredSkills,
      wcagLevel: data.wcagLevel || null,
      accessibilityFocus,
      assistiveTechExperience,
      
      // Job Description
      description: data.description,
      keyResponsibilities: data.keyResponsibilities,
      requirements: data.requirements,
      niceToHave: data.niceToHave || null,
      
      // Benefits
      benefits: benefitsArray,
      professionalDevelopment: data.professionalDevelopment || false,
      healthInsurance: data.healthInsurance || false,
      retirement: data.retirement || false,
      ptoDetails: data.ptoDetails || null,
      
      // Application Details
      contactEmail: data.contactEmail,
      applicationDeadline,
      expectedStartDate: data.expectedStartDate || null,
      visaSponsorship: data.visaSponsorship || false,
      securityClearance: data.securityClearance || false,
      travelRequired: data.travelRequired || null,
      
      // Additional Info
      additionalNotes: data.additionalNotes || null,
      
      // Legacy fields for backward compatibility
      location: data.location || null,
      type: data.type || data.workArrangement,
      salaryRange: data.salaryRange || null,
      
      // Meta
      status: 'pending',
    }).returning();

    return NextResponse.json(
      { message: 'Job submitted successfully', job: newJob[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting job:', error);
    return NextResponse.json(
      { error: 'Failed to submit job' },
      { status: 500 }
    );
  }
}

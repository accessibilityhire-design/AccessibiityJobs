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

    // Insert the job with pending status
    const newJob = await db.insert(jobs).values({
      title: data.title,
      company: data.company,
      location: data.location,
      type: data.type,
      description: data.description,
      requirements: data.requirements,
      salaryRange: data.salaryRange || null,
      companyWebsite: data.companyWebsite || null,
      contactEmail: data.contactEmail,
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


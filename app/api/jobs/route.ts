import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { jobs } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');

    // Build query
    let query = db
      .select()
      .from(jobs)
      .where(eq(jobs.status, 'approved'))
      .orderBy(desc(jobs.createdAt));

    // Execute query
    let allJobs = await query;

    // Filter by type if specified (client-side filter for simplicity)
    if (type && type !== 'all') {
      allJobs = allJobs.filter(job => job.type === type);
    }

    return NextResponse.json({ jobs: allJobs }, { status: 200 });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}


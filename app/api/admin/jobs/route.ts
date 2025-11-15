import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { jobs } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'pending';

    // Fetch jobs based on status
    const allJobs = await db
      .select()
      .from(jobs)
      .orderBy(desc(jobs.createdAt));

    // Filter by status
    const filteredJobs = allJobs.filter(job => job.status === status);

    return NextResponse.json({ jobs: filteredJobs }, { status: 200 });
  } catch (error) {
    console.error('Error fetching admin jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}


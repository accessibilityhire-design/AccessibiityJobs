import { NextRequest, NextResponse } from 'next/server';
import { parseJobsSearchParams, queryJobs, JOBS_PER_PAGE } from '@/lib/jobs-query';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filter = parseJobsSearchParams({
      search: searchParams.get('search') || undefined,
      type: searchParams.get('type') || undefined,
      employment: searchParams.get('employment') || undefined,
      level: searchParams.get('level') || undefined,
      page: searchParams.get('page') || undefined,
    });

    const perPage = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get('perPage') || String(JOBS_PER_PAGE), 10) || JOBS_PER_PAGE)
    );

    const result = await queryJobs(filter, perPage);

    return NextResponse.json(
      {
        jobs: result.jobs,
        pagination: {
          page: result.page,
          perPage: result.perPage,
          total: result.total,
          totalPages: result.totalPages,
        },
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

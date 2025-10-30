import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  try {
    // Get table information using Prisma meta queries
    const tableQueries = [
      { name: 'departments', query: () => prisma.departments.count() },
      { name: 'cities', query: () => prisma.cities.count() },
      { name: 'places', query: () => prisma.places.count() },
      { name: 'figures', query: () => prisma.figures.count() },
      { name: 'users', query: () => prisma.user.count() },
      { name: 'profiles', query: () => prisma.profiles.count() },
      { name: 'media', query: () => prisma.media.count() },
      { name: 'reviews', query: () => prisma.reviews.count() },
      { name: 'place_views', query: () => prisma.place_views.count() },
    ];

    const tables = await Promise.allSettled(
      tableQueries.map(async ({ name, query }) => ({
        table_name: name,
        row_count: await query()
      }))
    ).then(results => 
      results
        .filter((result): result is PromiseFulfilledResult<{ table_name: string; row_count: number }> => 
          result.status === 'fulfilled'
        )
        .map(result => result.value)
    );

    return NextResponse.json({
      tables,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching table info:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      tables: []
    }, { status: 500 });
  }
}
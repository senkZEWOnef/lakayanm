import { NextResponse } from 'next/server';
import { checkDatabaseConnection } from '@/lib/db';

export async function GET() {
  try {
    const connected = await checkDatabaseConnection();
    
    return NextResponse.json({
      connected,
      timestamp: new Date().toISOString(),
      status: connected ? 'healthy' : 'unhealthy'
    });
  } catch (error) {
    return NextResponse.json({
      connected: false,
      timestamp: new Date().toISOString(),
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
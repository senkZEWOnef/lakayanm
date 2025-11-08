import { NextResponse } from 'next/server';
import { checkDatabaseConnection } from '@/lib/db';

export async function GET() {
  try {
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database health check timed out')), 5000)
    );
    
    const connected = await Promise.race([
      checkDatabaseConnection(),
      timeoutPromise
    ]);
    
    return NextResponse.json({
      connected: connected as boolean,
      timestamp: new Date().toISOString(),
      status: (connected as boolean) ? 'healthy' : 'unhealthy'
    });
  } catch (error) {
    console.error('Database health check failed:', error);
    return NextResponse.json({
      connected: false,
      timestamp: new Date().toISOString(),
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "info", "warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Database connection health check
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
}

// Retry helper for database operations
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      const err = error as { code?: string | number; message?: string };
      
      // Check if it's a retryable error
      const isRetryable = 
        err.code === 'P1001' || // Can't reach database server
        err.code === 'P1008' || // Operations timed out
        err.code === 23 ||       // Timeout error
        err.message?.includes('timeout') ||
        err.message?.includes('connection') ||
        err.message?.includes('ECONNRESET');

      if (!isRetryable || attempt === maxRetries) {
        throw error;
      }

      console.log(`Database operation failed (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 1.5; // Exponential backoff
    }
  }
  
  throw new Error('Max retries exceeded');
}

// Enhanced database operation wrapper
export async function safeDbOperation<T>(
  operation: () => Promise<T>,
  fallback?: T
): Promise<T | null> {
  try {
    return await withRetry(operation);
  } catch (error) {
    console.error('Database operation failed after retries:', error);
    return fallback ?? null;
  }
}
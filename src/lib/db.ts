import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL } },
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Add connection retry helper
export async function retryPrismaOperation<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      if (i === maxRetries - 1) throw error;
      
      // Check if it's a connection/timeout error
      if (
        error.code === 'P1001' || // Can't reach database server
        error.code === 'P1008' || // Operations timed out
        error.code === 23 ||       // Timeout error
        error.message?.includes('timeout') ||
        error.message?.includes('connection')
      ) {
        console.log(`Database operation failed (attempt ${i + 1}/${maxRetries}), retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      } else {
        throw error; // Non-connection error, don't retry
      }
    }
  }
  throw new Error('Max retries exceeded');
}
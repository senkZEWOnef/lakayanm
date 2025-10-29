import { PrismaClient } from "@prisma/client";
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

let prismaClient: PrismaClient;

if (process.env.NODE_ENV === "production") {
  const neon = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaNeon(neon);
  
  prismaClient = new PrismaClient({
    adapter,
    log: ["error"],
  });
} else {
  prismaClient = new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL } },
    log: ["query", "error", "warn"],
  });
}

export const prisma = globalForPrisma.prisma ?? prismaClient;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
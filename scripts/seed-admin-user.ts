import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

const EMAIL = process.argv[2];
const PASSWORD = process.argv[3];

async function main() {
  if (!EMAIL || !PASSWORD) {
    throw new Error("Usage: npx tsx scripts/seed-admin-user.ts <email> <password>");
  }

  const existing = await prisma.users.findUnique({ where: { email: EMAIL } });
  if (existing) {
    console.log(`User already exists: ${EMAIL} (id: ${existing.id})`);
    return;
  }

  const hashed = await bcrypt.hash(PASSWORD, 10);
  const user = await prisma.users.create({
    data: {
      id: randomUUID(),
      email: EMAIL,
      password: hashed,
      name: "Admin",
      role: "admin",
      updated_at: new Date(),
    },
  });

  console.log(`Created admin user: ${user.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

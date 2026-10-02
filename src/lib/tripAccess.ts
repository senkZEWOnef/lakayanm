import { prisma } from "@/lib/db";

// Packages are browsable by anyone — the code is only required to actually
// book. Validates the code and (on success) consumes one use, same
// accounting as the old page-gate used to do.
export async function validateAndConsumeAccessCode(code: string): Promise<boolean> {
  const record = await prisma.access_codes.findUnique({ where: { code: code.trim().toUpperCase() } });
  if (!record) return false;
  if (!record.is_active) return false;
  if (record.expires_at && record.expires_at <= new Date()) return false;
  if (record.max_uses != null && record.use_count >= record.max_uses) return false;

  await prisma.access_codes.update({ where: { id: record.id }, data: { use_count: { increment: 1 } } });
  return true;
}

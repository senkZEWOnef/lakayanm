import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

export const TRIP_ACCESS_COOKIE = "trip_access";

// Re-validated against the DB on every load (not just checked for cookie
// presence) so deactivating or exhausting a code locks a friend out
// immediately, without needing them to clear cookies.
export async function hasValidTripAccess(): Promise<boolean> {
  const cookieStore = await cookies();
  const code = cookieStore.get(TRIP_ACCESS_COOKIE)?.value;
  if (!code) return false;

  const record = await prisma.access_codes.findUnique({ where: { code } });
  if (!record) return false;

  if (!record.is_active) return false;
  if (record.expires_at && record.expires_at <= new Date()) return false;
  if (record.max_uses != null && record.use_count > record.max_uses) return false;

  return true;
}

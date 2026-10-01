import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const COOKIE_NAME = "trip_access";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const code = (formData.get("code") as string | null)?.trim();
  const redirectTo = (formData.get("redirectTo") as string | null) || "/trips";

  if (!code) {
    return NextResponse.redirect(new URL(`/trips?error=missing`, request.url), 303);
  }

  const record = await prisma.access_codes.findUnique({ where: { code } });

  const isValid =
    !!record &&
    record.is_active &&
    (!record.expires_at || record.expires_at > new Date()) &&
    (record.max_uses == null || record.use_count < record.max_uses);

  if (!isValid) {
    return NextResponse.redirect(new URL(`/trips?error=invalid`, request.url), 303);
  }

  await prisma.access_codes.update({
    where: { id: record.id },
    data: { use_count: { increment: 1 } },
  });

  const response = NextResponse.redirect(new URL(redirectTo, request.url), 303);
  response.cookies.set(COOKIE_NAME, code, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 180, // 180 days
    path: "/",
  });
  return response;
}

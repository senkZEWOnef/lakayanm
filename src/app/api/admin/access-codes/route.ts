import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Protected by the /api/admin/:path* matcher in src/middleware.ts (NextAuth).
export async function GET() {
  const codes = await prisma.access_codes.findMany({ orderBy: { created_at: "desc" } });
  return NextResponse.json({ codes });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, label, maxUses, expiresAt } = body;

    if (!code) {
      return NextResponse.json({ error: "code is required" }, { status: 400 });
    }

    const created = await prisma.access_codes.create({
      data: {
        code: code.trim(),
        label: label || null,
        max_uses: maxUses ? parseInt(maxUses, 10) : null,
        expires_at: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return NextResponse.json({ ok: true, code: created });
  } catch (error) {
    console.error("Access code create error:", error);
    return NextResponse.json({ error: "Failed to create code (it may already exist)" }, { status: 500 });
  }
}

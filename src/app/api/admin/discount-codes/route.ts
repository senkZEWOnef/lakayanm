import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const codes = await prisma.discount_codes.findMany({ orderBy: { created_at: "desc" } });
  return NextResponse.json({ codes });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, kind, value, label, maxUses, expiresAt } = body;

    if (!code || !kind || value == null) {
      return NextResponse.json({ error: "code, kind, and value are required" }, { status: 400 });
    }

    const created = await prisma.discount_codes.create({
      data: {
        code: code.trim().toUpperCase(),
        kind,
        value: parseInt(value, 10),
        label: label || null,
        max_uses: maxUses ? parseInt(maxUses, 10) : null,
        expires_at: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return NextResponse.json({ ok: true, code: created });
  } catch (error) {
    console.error("Discount code create error:", error);
    return NextResponse.json({ error: "Failed to create code (it may already exist)" }, { status: 500 });
  }
}

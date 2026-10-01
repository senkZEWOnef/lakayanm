import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Public — previews a code's discount without redeeming it (use_count only
// increments when a reservation is actually submitted).
export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    if (!code) return NextResponse.json({ valid: false });

    const record = await prisma.discount_codes.findUnique({ where: { code: code.trim().toUpperCase() } });
    const valid =
      !!record &&
      record.is_active &&
      (!record.expires_at || record.expires_at > new Date()) &&
      (record.max_uses == null || record.use_count < record.max_uses);

    if (!valid || !record) {
      return NextResponse.json({ valid: false });
    }

    return NextResponse.json({ valid: true, kind: record.kind, value: record.value, label: record.label });
  } catch (error) {
    console.error("Discount code validate error:", error);
    return NextResponse.json({ valid: false });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Protected by the /api/admin/:path* matcher in src/middleware.ts (NextAuth).
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { body } = await request.json();
    if (!body || !body.trim()) {
      return NextResponse.json({ error: "Message can't be empty" }, { status: 400 });
    }

    const created = await prisma.reservation_messages.create({
      data: { reservation_id: id, from_role: "admin", kind: "message", body: body.trim() },
    });

    return NextResponse.json({ ok: true, message: created });
  } catch (error) {
    console.error("Admin reply error:", error);
    return NextResponse.json({ error: "Failed to send reply" }, { status: 500 });
  }
}

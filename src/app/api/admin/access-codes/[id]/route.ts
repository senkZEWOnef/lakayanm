import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Protected by the /api/admin/:path* matcher in src/middleware.ts (NextAuth).
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { isActive } = await request.json();
    const updated = await prisma.access_codes.update({
      where: { id },
      data: { is_active: isActive },
    });
    return NextResponse.json({ ok: true, code: updated });
  } catch (error) {
    console.error("Access code update error:", error);
    return NextResponse.json({ error: "Failed to update code" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.access_codes.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Access code delete error:", error);
    return NextResponse.json({ error: "Failed to delete code" }, { status: 500 });
  }
}

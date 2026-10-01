import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Protected by the /api/admin/:path* matcher in src/middleware.ts (NextAuth).
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.gallery_items.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Gallery delete error:", error);
    return NextResponse.json({ error: "Failed to delete gallery item" }, { status: 500 });
  }
}

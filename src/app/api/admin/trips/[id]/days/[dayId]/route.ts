import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string; dayId: string }> }) {
  try {
    const { dayId } = await params;
    await prisma.trip_days.delete({ where: { id: dayId } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Day delete error:", error);
    return NextResponse.json({ error: "Failed to delete day" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { heroUrl } = await request.json();
    const department = await prisma.departments.update({ where: { id }, data: { hero_url: heroUrl } });
    return NextResponse.json({ ok: true, department });
  } catch (error) {
    console.error("Department update error:", error);
    return NextResponse.json({ error: "Failed to update department" }, { status: 500 });
  }
}

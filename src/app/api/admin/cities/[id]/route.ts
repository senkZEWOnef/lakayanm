import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { heroUrl } = await request.json();
    const city = await prisma.cities.update({ where: { id }, data: { hero_url: heroUrl } });
    return NextResponse.json({ ok: true, city });
  } catch (error) {
    console.error("City update error:", error);
    return NextResponse.json({ error: "Failed to update city" }, { status: 500 });
  }
}

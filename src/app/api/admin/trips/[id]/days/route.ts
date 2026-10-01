import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { dayNumber, title, description, imageUrl } = body;

    if (!dayNumber || !title || !description) {
      return NextResponse.json({ error: "dayNumber, title, and description are required" }, { status: 400 });
    }

    const day = await prisma.trip_days.upsert({
      where: { trip_id_day_number: { trip_id: id, day_number: parseInt(dayNumber, 10) } },
      update: { title, description, image_url: imageUrl || null },
      create: { trip_id: id, day_number: parseInt(dayNumber, 10), title, description, image_url: imageUrl || null },
    });

    return NextResponse.json({ ok: true, day });
  } catch (error) {
    console.error("Day create error:", error);
    return NextResponse.json({ error: "Failed to save day" }, { status: 500 });
  }
}

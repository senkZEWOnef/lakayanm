import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { dayNumber, title, description, location, startTime, mealInfo, photos } = body;

    if (!dayNumber || !title || !description) {
      return NextResponse.json({ error: "dayNumber, title, and description are required" }, { status: 400 });
    }

    const data = {
      title,
      description,
      location: location || null,
      start_time: startTime || null,
      meal_info: mealInfo || null,
      photos: Array.isArray(photos) ? photos : [],
    };

    const day = await prisma.trip_days.upsert({
      where: { trip_id_day_number: { trip_id: id, day_number: parseInt(dayNumber, 10) } },
      update: data,
      create: { trip_id: id, day_number: parseInt(dayNumber, 10), ...data },
    });

    return NextResponse.json({ ok: true, day });
  } catch (error) {
    console.error("Day create error:", error);
    return NextResponse.json({ error: "Failed to save day" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Replaces the full set of linked cities for this trip.
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { cityIds } = await request.json();

    await prisma.trip_cities.deleteMany({ where: { trip_id: id } });
    if (Array.isArray(cityIds) && cityIds.length > 0) {
      await prisma.trip_cities.createMany({
        data: cityIds.map((cityId: string) => ({ trip_id: id, city_id: cityId })),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Trip cities update error:", error);
    return NextResponse.json({ error: "Failed to update cities" }, { status: 500 });
  }
}

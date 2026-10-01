import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const data: Record<string, unknown> = {};
    const stringFields = ["title", "tagline", "summary", "category", "heroUrl", "videoUrl", "currency"] as const;
    const fieldMap: Record<string, string> = {
      heroUrl: "hero_url",
      videoUrl: "video_url",
    };
    for (const f of stringFields) {
      if (body[f] !== undefined) data[fieldMap[f] || f] = body[f] || null;
    }

    const intFields: Record<string, string> = {
      durationDays: "duration_days",
      groupMin: "group_min",
      groupThreshold: "group_threshold",
      priceIndividualCents: "price_individual_cents",
      priceGroupCents: "price_group_cents",
      depositCents: "deposit_cents",
    };
    for (const [key, col] of Object.entries(intFields)) {
      if (body[key] !== undefined) data[col] = parseInt(body[key], 10);
    }

    if (body.isPublished !== undefined) data.is_published = body.isPublished;
    if (body.isFeatured !== undefined) data.is_featured = body.isFeatured;
    if (body.departmentId !== undefined) data.department_id = body.departmentId;
    if (body.includes !== undefined) data.includes = body.includes;
    if (body.excludes !== undefined) data.excludes = body.excludes;

    const trip = await prisma.trips.update({ where: { id }, data });
    return NextResponse.json({ ok: true, trip });
  } catch (error) {
    console.error("Package update error:", error);
    return NextResponse.json({ error: "Failed to update package" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.trip_days.deleteMany({ where: { trip_id: id } });
    await prisma.trip_cities.deleteMany({ where: { trip_id: id } });
    await prisma.trip_assignments.deleteMany({ where: { trip_id: id } });
    await prisma.trips.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Package delete error:", error);
    return NextResponse.json({ error: "Failed to delete package (it may have reservations)" }, { status: 500 });
  }
}

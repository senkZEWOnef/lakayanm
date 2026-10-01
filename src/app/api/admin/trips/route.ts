import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import slugify from "slugify";

export async function GET() {
  const trips = await prisma.trips.findMany({
    include: { department: true, _count: { select: { reservations: true } } },
    orderBy: { created_at: "desc" },
  });
  return NextResponse.json({ trips });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, departmentId, durationDays, priceIndividualCents, priceGroupCents, depositCents } = body;

    if (!title || !departmentId) {
      return NextResponse.json({ error: "title and departmentId are required" }, { status: 400 });
    }

    const baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    let n = 1;
    while (await prisma.trips.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${++n}`;
    }

    const trip = await prisma.trips.create({
      data: {
        title,
        slug,
        department_id: departmentId,
        duration_days: durationDays ? parseInt(durationDays, 10) : 1,
        price_individual_cents: priceIndividualCents ? parseInt(priceIndividualCents, 10) : 0,
        price_group_cents: priceGroupCents ? parseInt(priceGroupCents, 10) : 0,
        deposit_cents: depositCents ? parseInt(depositCents, 10) : 0,
        is_published: false,
      },
    });

    return NextResponse.json({ ok: true, trip });
  } catch (error) {
    console.error("Package create error:", error);
    return NextResponse.json({ error: "Failed to create package" }, { status: 500 });
  }
}

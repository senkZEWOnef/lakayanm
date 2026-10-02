import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import slugify from "slugify";

// Protected by the /api/admin/:path* matcher in src/middleware.ts (NextAuth).
export async function GET() {
  const places = await prisma.places.findMany({
    include: { city: { include: { department: true } } },
    orderBy: [{ is_featured: "desc" }, { created_at: "desc" }],
  });
  return NextResponse.json({ places });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, kind, cityId } = body;

    if (!name || !kind || !cityId) {
      return NextResponse.json({ error: "name, kind, and cityId are required" }, { status: 400 });
    }

    const baseSlug = slugify(name, { lower: true, strict: true });
    let slug = baseSlug;
    let n = 1;
    while (await prisma.places.findUnique({ where: { city_id_slug: { city_id: cityId, slug } } })) {
      slug = `${baseSlug}-${++n}`;
    }

    const place = await prisma.places.create({
      data: {
        name,
        slug,
        kind,
        city_id: cityId,
        is_published: false,
      },
    });

    return NextResponse.json({ ok: true, place });
  } catch (error) {
    console.error("Place create error:", error);
    return NextResponse.json({ error: "Failed to create business" }, { status: 500 });
  }
}

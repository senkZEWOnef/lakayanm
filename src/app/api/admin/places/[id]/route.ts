import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Protected by the /api/admin/:path* matcher in src/middleware.ts (NextAuth).
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      kind,
      cityId,
      description,
      address,
      phone,
      website,
      bookingUrl,
      priceRange,
      coverUrl,
      isFeatured,
      isPublished,
    } = body;

    const place = await prisma.places.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(kind !== undefined && { kind }),
        ...(cityId !== undefined && { city_id: cityId }),
        ...(description !== undefined && { description: description || null }),
        ...(address !== undefined && { address: address || null }),
        ...(phone !== undefined && { phone: phone || null }),
        ...(website !== undefined && { website: website || null }),
        ...(bookingUrl !== undefined && { booking_url: bookingUrl || null }),
        ...(priceRange !== undefined && { price_range: priceRange || null }),
        ...(coverUrl !== undefined && { cover_url: coverUrl || null }),
        ...(isFeatured !== undefined && { is_featured: isFeatured }),
        ...(isPublished !== undefined && { is_published: isPublished }),
      },
    });

    return NextResponse.json({ ok: true, place });
  } catch (error) {
    console.error("Place update error:", error);
    return NextResponse.json({ error: "Failed to update business" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.places.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Place delete error:", error);
    return NextResponse.json({ error: "Failed to delete business" }, { status: 500 });
  }
}

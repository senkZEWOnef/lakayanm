import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Protected by the /api/admin/:path* matcher in src/middleware.ts (NextAuth).
export async function GET() {
  const items = await prisma.gallery_items.findMany({ orderBy: { created_at: "desc" } });
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mediaType, url, thumbnailUrl, caption, location, credit } = body;

    if (!mediaType || !url) {
      return NextResponse.json({ error: "mediaType and url are required" }, { status: 400 });
    }
    if (!["photo", "video", "youtube"].includes(mediaType)) {
      return NextResponse.json({ error: "Invalid mediaType" }, { status: 400 });
    }

    const item = await prisma.gallery_items.create({
      data: {
        media_type: mediaType,
        url,
        thumbnail_url: thumbnailUrl || null,
        caption: caption || null,
        location: location || null,
        credit: credit || null,
      },
    });

    return NextResponse.json({ ok: true, item });
  } catch (error) {
    console.error("Gallery create error:", error);
    return NextResponse.json({ error: "Failed to add gallery item" }, { status: 500 });
  }
}

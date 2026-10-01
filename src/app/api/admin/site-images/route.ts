import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { key, url } = await request.json();
    if (!key || !url) return NextResponse.json({ error: "key and url are required" }, { status: 400 });

    const image = await prisma.site_images.upsert({
      where: { key },
      update: { url },
      create: { key, url },
    });

    return NextResponse.json({ ok: true, image });
  } catch (error) {
    console.error("Site image update error:", error);
    return NextResponse.json({ error: "Failed to update image" }, { status: 500 });
  }
}

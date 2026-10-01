import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Public — serves current site image overrides so pages can fall back to
// their hardcoded defaults when nothing's been set yet.
export async function GET() {
  const images = await prisma.site_images.findMany();
  const map: Record<string, string> = {};
  for (const img of images) map[img.key] = img.url;
  return NextResponse.json({ images: map });
}

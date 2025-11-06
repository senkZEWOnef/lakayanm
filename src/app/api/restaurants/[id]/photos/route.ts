import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const alt = formData.get("alt") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Verify the restaurant exists
    const restaurant = await prisma.places.findFirst({
      where: { 
        id, 
        kind: { in: ['restaurant', 'shop'] },
        is_published: true 
      }
    });

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    // In a real app, you'd upload to a cloud storage service like AWS S3, Cloudinary, etc.
    // For now, we'll simulate this with a placeholder URL
    const photoUrl = `/uploads/restaurants/${id}/${Date.now()}-${file.name}`;

    // Save photo record to database
    const photo = await prisma.media.create({
      data: {
        path: photoUrl,
        alt: alt || `Photo of ${restaurant.name}`,
        place_id: restaurant.id,
        bucket: "user-uploads"
      }
    });

    return NextResponse.json({ 
      success: true, 
      photo: {
        id: photo.id,
        url: photo.path,
        alt: photo.alt
      }
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload photo" }, 
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const photos = await prisma.media.findMany({
      where: { place_id: id },
      orderBy: { created_at: "desc" }
    });

    return NextResponse.json({ photos });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch photos" }, 
      { status: 500 }
    );
  }
}
import Image from "next/image";
import { prisma } from "@/lib/db";
import GalleryGrid from "@/components/GalleryGrid";

export default async function GalleryPage() {
  let items: Awaited<ReturnType<typeof getItems>> = [];

  try {
    items = await getItems();
  } catch (error) {
    console.error("Database connection error:", error);
    return (
      <div className="card text-center">
        <h3 className="font-semibold mb-2">🔌 Database Connection Issue</h3>
        <p className="sub">We&apos;re having trouble loading the gallery right now. Please try again in a moment.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10">
        <Image src="/banner.png" alt="Haiti landscape" fill className="object-cover" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/65"></div>
      </div>

      <div className="relative z-10 px-4 md:px-6 py-8 md:py-12 max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">The Gallery</h1>
          <p className="text-white/80 max-w-2xl text-base md:text-lg leading-relaxed">
            Photos and videos of Haiti — some ours, some from other creators showcasing the country. This grows
            first; the packages come once we&apos;ve personally scouted every spot you see here.
          </p>
        </div>

        <GalleryGrid items={items} />
      </div>
    </div>
  );
}

async function getItems() {
  return prisma.gallery_items.findMany({
    where: { is_published: true },
    orderBy: [{ is_featured: "desc" }, { created_at: "desc" }],
  });
}

export const dynamic = "force-dynamic";

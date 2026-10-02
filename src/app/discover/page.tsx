import Image from "next/image";
import { prisma } from "@/lib/db";
import DiscoverGrid from "@/components/DiscoverGrid";

async function getData() {
  const [departments, places] = await Promise.all([
    prisma.departments.findMany({
      where: { is_published: true },
      orderBy: { name: "asc" },
      include: {
        cities: {
          where: { is_published: true },
          orderBy: { name: "asc" },
        },
      },
    }),
    prisma.places.findMany({
      where: { is_published: true },
      include: { city: { include: { department: true } } },
      orderBy: [{ is_featured: "desc" }, { created_at: "desc" }],
    }),
  ]);

  return { departments, places };
}

export default async function DiscoverPage() {
  let departments: Awaited<ReturnType<typeof getData>>["departments"] = [];
  let places: Awaited<ReturnType<typeof getData>>["places"] = [];

  try {
    ({ departments, places } = await getData());
  } catch (error) {
    console.error("Database connection error:", error);
    return (
      <div className="card text-center">
        <h3 className="font-semibold mb-2">🔌 Database Connection Issue</h3>
        <p className="sub">We&apos;re having trouble loading Discover right now. Please try again in a moment.</p>
      </div>
    );
  }

  const departmentOptions = departments.map((d) => ({
    slug: d.slug,
    name: d.name,
    cities: d.cities.map((c) => ({ slug: c.slug, name: c.name })),
  }));

  const placeCards = places
    .filter((p) => p.city?.department)
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      kind: p.kind,
      name: p.name,
      description: p.description,
      cover_url: p.cover_url,
      price_range: p.price_range,
      address: p.address,
      phone: p.phone,
      website: p.website,
      booking_url: p.booking_url,
      is_featured: p.is_featured,
      citySlug: p.city.slug,
      cityName: p.city.name,
      departmentSlug: p.city.department.slug,
      departmentName: p.city.department.name,
    }));

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10">
        <Image src="/banner.png" alt="Haiti landscape" fill className="object-cover" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/65"></div>
      </div>

      <div className="relative z-10 px-4 md:px-6 py-8 md:py-12 max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">Discover</h1>
          <p className="text-white/80 max-w-2xl text-base md:text-lg leading-relaxed">
            Hotels, Airbnbs, restaurants, shops, and local businesses across Haiti — browse by department, city,
            or type to find what you need while you&apos;re there.
          </p>
        </div>

        <DiscoverGrid places={placeCards} departments={departmentOptions} />
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";

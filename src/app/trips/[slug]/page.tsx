import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import TripInquiryWidget from "@/components/TripInquiryWidget";
import TripItinerary from "@/components/TripItinerary";

async function getTrip(slug: string) {
  const trip = await prisma.trips.findFirst({
    where: { slug, is_published: true },
    include: {
      department: true,
      days: { orderBy: { day_number: "asc" } },
      cities: { include: { city: true } },
    },
  });
  return trip;
}

export default async function TripDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let trip;
  try {
    trip = await getTrip(slug);
  } catch (error) {
    console.error("Database connection error:", error);
    return (
      <div className="card text-center">
        <h3 className="font-semibold mb-2">🔌 Database Connection Issue</h3>
        <p className="sub">We&apos;re having trouble loading this trip right now. Please try again in a moment.</p>
      </div>
    );
  }

  if (!trip) return <div className="sub">Trip not found.</div>;

  const includes = (trip.includes as string[] | null) ?? [];
  const excludes = (trip.excludes as string[] | null) ?? [];

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10">
        <Image src="/banner.png" alt="Haiti landscape" fill className="object-cover" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60"></div>
      </div>

      <div className="relative z-10 space-y-10 px-4 md:px-6 py-8 md:py-12 max-w-6xl mx-auto">
        <Link href="/trips" className="text-amber-300 hover:text-amber-200 text-sm inline-block">
          ← All Trips
        </Link>

        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl h-72 md:h-96">
          {trip.video_url ? (
            <video src={trip.video_url} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />
          ) : trip.hero_url ? (
            <Image src={trip.hero_url} alt={trip.title} fill className="object-cover" priority />
          ) : (
            <div className="absolute inset-0 bg-haiti-navy" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-haiti-midnight/80 via-haiti-navy/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 md:p-8">
            <span className="inline-block bg-amber-500 text-white text-xs px-3 py-1 rounded-full font-medium mb-3">
              {trip.duration_days} day{trip.duration_days > 1 ? "s" : ""} · {trip.department.name}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">{trip.title}</h1>
            {trip.tagline && <p className="text-haiti-turquoise text-lg mt-2 drop-shadow">{trip.tagline}</p>}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-8">
            {trip.summary && (
              <div className="card">
                <p className="leading-relaxed">{trip.summary}</p>
              </div>
            )}

            {/* Itinerary */}
            <TripItinerary days={trip.days} />

            {/* Includes / Excludes */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card-light">
                <h3 className="font-bold text-haiti-navy mb-3">What&apos;s Included</h3>
                <ul className="space-y-2 text-sm">
                  {includes.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-haiti-emerald">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                  {includes.length === 0 && <li className="text-slate-500">Details coming soon.</li>}
                </ul>
              </div>
              <div className="card">
                <h3 className="font-bold text-haiti-navy dark:text-haiti-turquoise mb-3">Not Included</h3>
                <ul className="space-y-2 text-sm">
                  {excludes.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-red-500">✗</span>
                      <span>{item}</span>
                    </li>
                  ))}
                  {excludes.length === 0 && <li className="sub">Details coming soon.</li>}
                </ul>
              </div>
            </div>

            {trip.cities.length > 0 && (
              <div className="card">
                <h3 className="font-bold text-haiti-navy dark:text-haiti-turquoise mb-3">Where You&apos;ll Go</h3>
                <div className="flex flex-wrap gap-2">
                  {trip.cities.map(({ city }) => (
                    <Link
                      key={city.id}
                      href={`/dept/${trip.department.slug}/city/${city.slug}`}
                      className="bg-haiti-turquoise/10 text-haiti-turquoise text-sm px-3 py-1 rounded-full hover:bg-haiti-turquoise/20 transition-colors"
                    >
                      {city.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column — booking */}
          <div>
            <TripInquiryWidget
              trip={{
                slug: trip.slug,
                title: trip.title,
                price_individual_cents: trip.price_individual_cents,
                price_group_cents: trip.price_group_cents,
                deposit_cents: trip.deposit_cents,
                group_threshold: trip.group_threshold,
                currency: trip.currency,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";

function formatCurrency(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

export default async function TripsPage() {
  let trips: Awaited<ReturnType<typeof getTrips>> = [];

  try {
    trips = await getTrips();
  } catch (error) {
    console.error("Database connection error:", error);
    return (
      <div className="card text-center">
        <h3 className="font-semibold mb-2">🔌 Database Connection Issue</h3>
        <p className="sub">We&apos;re having trouble loading trips right now. Please try again in a moment.</p>
      </div>
    );
  }

  const byDepartment = trips.reduce<Record<string, { name: string; trips: typeof trips }>>((acc, trip) => {
    const key = trip.department.slug;
    if (!acc[key]) acc[key] = { name: trip.department.name, trips: [] };
    acc[key].trips.push(trip);
    return acc;
  }, {});

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10">
        <Image src="/banner.png" alt="Haiti landscape" fill className="object-cover" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60"></div>
      </div>

      <div className="relative z-10 space-y-12 px-4 md:px-6 py-8 md:py-12">
        <div className="relative bg-slate-800/80 backdrop-blur-sm border border-amber-400/30 rounded-2xl p-6 md:p-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Come home. We&apos;ll help you experience more of it.
          </h1>
          <p className="text-white/90 max-w-3xl text-base md:text-lg leading-relaxed">
            Curated trips we&apos;ve personally researched and verified — starting in the North. Every price shows
            exactly what&apos;s included, so you know what you&apos;re paying for before you send a request.
          </p>
        </div>

        {Object.keys(byDepartment).length === 0 && (
          <div className="card text-center py-12">
            <p className="sub text-lg">Trips are coming soon. Check back shortly!</p>
          </div>
        )}

        {Object.entries(byDepartment).map(([deptSlug, group]) => (
          <section key={deptSlug}>
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white">{group.name}</h2>
              <div className="h-px bg-gradient-to-r from-amber-400 to-transparent flex-1"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.trips.map((trip) => (
                <Link
                  key={trip.id}
                  href={`/trips/${trip.slug}`}
                  className="card hover:shadow-xl transition-all duration-300 group cursor-pointer border-l-4 border-haiti-turquoise"
                >
                  {trip.hero_url && (
                    <div className="relative w-full h-48 mb-4 overflow-hidden rounded-xl">
                      <Image
                        src={trip.hero_url}
                        alt={trip.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                        {trip.duration_days} day{trip.duration_days > 1 ? "s" : ""}
                      </div>
                    </div>
                  )}

                  <h3 className="font-bold text-xl text-haiti-navy dark:text-haiti-turquoise mb-1">{trip.title}</h3>
                  {trip.tagline && <p className="sub text-sm mb-3">{trip.tagline}</p>}

                  <div className="flex items-baseline justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <span className="text-lg font-bold text-haiti-turquoise">
                        {formatCurrency(trip.price_individual_cents, trip.currency)}
                      </span>
                      <span className="text-xs sub"> / person</span>
                    </div>
                    <span className="text-haiti-turquoise text-sm font-medium group-hover:text-haiti-turquoise/80">
                      Details →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

async function getTrips() {
  return prisma.trips.findMany({
    where: { is_published: true },
    include: { department: true },
    orderBy: [{ is_featured: "desc" }, { created_at: "asc" }],
  });
}

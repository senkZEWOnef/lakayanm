import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { normalizeConfirmationCode } from "@/lib/confirmationCode";
import TripItinerary from "@/components/TripItinerary";
import TripMessages from "@/components/TripMessages";

const KIND_EMOJI: Record<string, string> = {
  hotel: "🏨",
  restaurant: "🍽️",
  shop: "🛍️",
  tour: "🧭",
  activity: "🎯",
  event: "🎉",
  beach: "🏖️",
  landmark: "🏛️",
};

function formatCurrency(cents: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(cents / 100);
}

function daysUntil(date: Date): number {
  const ms = date.getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

const STATUS_LABEL: Record<string, string> = {
  new: "Request Received",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default async function MyTripPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const normalized = normalizeConfirmationCode(code);

  const reservation = await prisma.reservations.findUnique({
    where: { confirmation_code: normalized },
    include: {
      trip: { include: { days: { orderBy: { day_number: "asc" } }, cities: { include: { city: true } } } },
      payments: { orderBy: { created_at: "desc" } },
      messages: { orderBy: { created_at: "asc" } },
      assigned_employee: true,
    },
  });

  if (!reservation) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-haiti-midnight">
        <div className="card text-center max-w-md">
          <p className="sub mb-4">We couldn&apos;t find a trip with that code. Double-check it, or try again.</p>
          <Link href="/my-trip" className="text-haiti-turquoise hover:underline text-sm">
            ← Try another code
          </Link>
        </div>
      </div>
    );
  }

  const balanceDueCents = Math.max(0, (reservation.quoted_total_cents || 0) - reservation.amount_paid_cents);
  const includes = (reservation.trip.includes as string[] | null) ?? [];
  const excludes = (reservation.trip.excludes as string[] | null) ?? [];
  const cityIds = reservation.trip.cities.map(({ city }) => city.id);
  const countdown = reservation.preferred_start_date ? daysUntil(reservation.preferred_start_date) : null;

  const nearby =
    cityIds.length > 0
      ? await prisma.places.findMany({
          where: { city_id: { in: cityIds }, is_published: true },
          include: { city: { include: { department: true } } },
          orderBy: [{ is_featured: "desc" }, { created_at: "desc" }],
          take: 6,
        })
      : [];

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10">
        <Image src="/banner.png" alt="Haiti landscape" fill className="object-cover" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
      </div>

      <div className="relative z-10 px-4 md:px-6 py-8 md:py-12 max-w-3xl mx-auto space-y-6">
        {/* Hero */}
        {reservation.trip.hero_url && (
          <div className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden">
            <Image src={reservation.trip.hero_url} alt={reservation.trip.title} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-haiti-midnight/80 via-transparent to-transparent" />
          </div>
        )}

        <div className="card">
          <p className="text-xs sub uppercase tracking-wide mb-1 font-mono">{reservation.confirmation_code}</p>
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-haiti-navy dark:text-haiti-turquoise">{reservation.trip.title}</h1>
              {reservation.trip.tagline && <p className="text-haiti-turquoise text-sm mt-1">{reservation.trip.tagline}</p>}
              <p className="sub mt-1">
                {reservation.name} · {reservation.traveler_count} traveler{reservation.traveler_count > 1 ? "s" : ""} ·{" "}
                {reservation.flexible_dates
                  ? "Flexible dates"
                  : reservation.preferred_start_date
                    ? new Date(reservation.preferred_start_date).toLocaleDateString()
                    : "No date set"}
              </p>
              {countdown !== null && countdown >= 0 && (
                <p className="text-sm font-medium text-haiti-amber mt-1">
                  {countdown === 0 ? "Your trip is today! 🎉" : `${countdown} day${countdown === 1 ? "" : "s"} to go`}
                </p>
              )}
            </div>
            <span className="text-xs px-3 py-1 rounded-full font-medium bg-haiti-turquoise/10 text-haiti-turquoise">
              {STATUS_LABEL[reservation.status] || reservation.status}
            </span>
          </div>
          {reservation.trip.summary && <p className="sub text-sm mt-4 leading-relaxed">{reservation.trip.summary}</p>}
          {reservation.assigned_employee && (
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {reservation.assigned_employee.photo_url && (
                <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                  <Image src={reservation.assigned_employee.photo_url} alt={reservation.assigned_employee.name} fill className="object-cover" />
                </div>
              )}
              <div className="text-sm">
                <p className="font-medium">Your guide: {reservation.assigned_employee.name}</p>
                <p className="sub text-xs">
                  {reservation.assigned_employee.phone && <span>📱 {reservation.assigned_employee.phone} </span>}
                  {reservation.assigned_employee.email && <span>· ✉️ {reservation.assigned_employee.email}</span>}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Payment summary */}
        <div className="card">
          <h3 className="font-bold text-haiti-navy dark:text-haiti-turquoise mb-3">Payment</h3>
          <div className="grid grid-cols-2 gap-4 text-sm mb-3">
            <div>
              <p className="sub text-xs">Total</p>
              <p className="font-medium">{formatCurrency(reservation.quoted_total_cents || 0)}</p>
            </div>
            <div>
              <p className="sub text-xs">Paid so far</p>
              <p className="font-medium">{formatCurrency(reservation.amount_paid_cents)}</p>
            </div>
          </div>
          {balanceDueCents > 0 ? (
            <Link
              href={`/pay/${reservation.id}`}
              className="inline-block bg-haiti-turquoise text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-haiti-turquoise/80 transition-colors"
            >
              Pay {formatCurrency(balanceDueCents)} Remaining
            </Link>
          ) : (
            <p className="text-sm text-green-600 font-medium">Paid in full ✓</p>
          )}
        </div>

        {/* Where this trip goes */}
        {reservation.trip.cities.length > 0 && (
          <div className="card">
            <h3 className="font-bold text-haiti-navy dark:text-haiti-turquoise mb-2">Where You&apos;re Going</h3>
            <div className="flex flex-wrap gap-2">
              {reservation.trip.cities.map(({ city }) => (
                <span key={city.id} className="bg-haiti-turquoise/10 text-haiti-turquoise text-sm px-3 py-1 rounded-full">
                  {city.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Itinerary — what time, where */}
        <TripItinerary days={reservation.trip.days} heading="Your Itinerary" />

        {/* Includes / Excludes */}
        {(includes.length > 0 || excludes.length > 0) && (
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
                {includes.length === 0 && <li className="text-slate-500">—</li>}
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
                {excludes.length === 0 && <li className="sub">—</li>}
              </ul>
            </div>
          </div>
        )}

        {/* Recommended nearby — real local businesses from Discover; this is the
            future ad placement, using the same is_featured flag Discover uses
            for sponsored spots */}
        {nearby.length > 0 && (
          <div className="card">
            <h3 className="font-bold text-haiti-navy dark:text-haiti-turquoise mb-1">Recommended Near Your Trip</h3>
            <p className="text-xs sub mb-4">Local favorites in the area, from our Discover guide.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {nearby.map((place) => (
                <Link
                  key={place.id}
                  href={`/discover`}
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-haiti-turquoise transition-colors"
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-haiti-navy/10 flex items-center justify-center text-xl">
                    {place.cover_url ? (
                      <Image src={place.cover_url} alt={place.name} fill className="object-cover" sizes="48px" />
                    ) : (
                      KIND_EMOJI[place.kind] ?? "📍"
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{place.name}</p>
                    <p className="text-xs sub">
                      {KIND_EMOJI[place.kind] ?? "📍"} {place.city.name}
                      {place.is_featured && <span className="text-haiti-coral"> · Featured</span>}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Help / change requests */}
        <TripMessages code={reservation.confirmation_code || normalized} messages={reservation.messages} />
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";

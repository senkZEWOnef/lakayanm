import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { normalizeConfirmationCode } from "@/lib/confirmationCode";
import TripItinerary from "@/components/TripItinerary";
import TripMessages from "@/components/TripMessages";

function formatCurrency(cents: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(cents / 100);
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

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10">
        <Image src="/banner.png" alt="Haiti landscape" fill className="object-cover" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
      </div>

      <div className="relative z-10 px-4 md:px-6 py-8 md:py-12 max-w-3xl mx-auto space-y-6">
        <div className="card">
          <p className="text-xs sub uppercase tracking-wide mb-1 font-mono">{reservation.confirmation_code}</p>
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-haiti-navy dark:text-haiti-turquoise">{reservation.trip.title}</h1>
              <p className="sub mt-1">
                {reservation.name} · {reservation.traveler_count} traveler{reservation.traveler_count > 1 ? "s" : ""} ·{" "}
                {reservation.flexible_dates
                  ? "Flexible dates"
                  : reservation.preferred_start_date
                    ? new Date(reservation.preferred_start_date).toLocaleDateString()
                    : "No date set"}
              </p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full font-medium bg-haiti-turquoise/10 text-haiti-turquoise">
              {STATUS_LABEL[reservation.status] || reservation.status}
            </span>
          </div>
          {reservation.assigned_employee && (
            <p className="text-sm sub mt-3">Your guide: {reservation.assigned_employee.name}</p>
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

        {/* Help / change requests */}
        <TripMessages code={reservation.confirmation_code || normalized} messages={reservation.messages} />
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";

import Image from "next/image";
import { prisma } from "@/lib/db";
import { amountDueCents, isEligibleForCash } from "@/lib/paymentLedger";
import { usdCentsToHtg } from "@/lib/moncash";
import { getUsdToHtgRate } from "@/lib/settings";
import { stripeConfigured } from "@/lib/stripe";
import { paypalConfigured } from "@/lib/paypal";
import { moncashConfigured } from "@/lib/moncash";
import { athmovilConfigured } from "@/lib/athmovil";
import PaymentOptions from "@/components/PaymentOptions";

function formatCurrency(cents: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(cents / 100);
}

export default async function PayPage({
  params,
  searchParams,
}: {
  params: Promise<{ reservationId: string }>;
  searchParams: Promise<{ paid?: string }>;
}) {
  const { reservationId } = await params;
  const { paid } = await searchParams;

  const reservation = await prisma.reservations.findUnique({
    where: { id: reservationId },
    include: { trip: true },
  });

  if (!reservation) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-haiti-midnight">
        <div className="card text-center max-w-md">
          <p className="sub">We couldn&apos;t find that payment link. Double check the URL, or ask for a new one.</p>
        </div>
      </div>
    );
  }

  const kind = reservation.payment_status === "unpaid" ? "deposit" : "balance";
  const amountCents = amountDueCents(reservation, kind);
  const fullyPaid = reservation.payment_status === "paid_in_full" || amountCents <= 0;

  const [htgAmount, rate, cashEligible] = fullyPaid
    ? [0, 0, false]
    : await Promise.all([usdCentsToHtg(amountCents), getUsdToHtgRate(), isEligibleForCash(reservation.email, reservation.id)]);

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10">
        <Image src="/banner.png" alt="Haiti landscape" fill className="object-cover" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg space-y-6">
          <div className="card">
            <p className="text-xs sub uppercase tracking-wide mb-1">{reservation.trip.title}</p>
            <h1 className="text-2xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-4">
              {fullyPaid ? "You're all set!" : `${kind === "deposit" ? "Deposit" : "Balance"} Due`}
            </h1>

            {fullyPaid ? (
              <p className="sub">
                Hi {reservation.name}, this trip is fully paid. We&apos;ll see you soon — reach out anytime if you have
                questions.
              </p>
            ) : (
              <>
                <p className="text-3xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-1">
                  {formatCurrency(amountCents, "usd")}
                </p>
                <p className="text-sm sub">
                  or {htgAmount.toLocaleString()} HTG at today&apos;s rate (1 USD ≈ {rate} HTG)
                </p>
                <p className="text-sm sub mt-3">Hi {reservation.name}, here&apos;s your secure payment link for {reservation.trip.title}.</p>
              </>
            )}
          </div>

          {paid === "1" && (
            <div className="card border-green-500/30 bg-green-500/5 text-center">
              <p className="text-green-700 dark:text-green-400 font-medium">Payment received — thank you!</p>
            </div>
          )}

          {reservation.confirmation_code && (
            <div className="card text-center">
              <p className="text-xs sub uppercase tracking-wide mb-1">Your trip code</p>
              <p className="text-2xl font-bold tracking-wider text-haiti-navy dark:text-haiti-turquoise font-mono mb-2">
                {reservation.confirmation_code}
              </p>
              <p className="text-sm sub mb-3">
                Save this — it&apos;s all you need to see your full itinerary, check payment status, or send us a
                message. No account needed.
              </p>
              <a
                href={`/my-trip/${reservation.confirmation_code}`}
                className="inline-flex items-center gap-2 bg-haiti-navy text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-haiti-navy/80 transition-colors"
              >
                View My Trip
              </a>
            </div>
          )}
          {paid === "0" && (
            <div className="card border-red-500/30 bg-red-500/5 text-center">
              <p className="text-red-600 dark:text-red-400 font-medium">That payment didn&apos;t go through. Feel free to try again.</p>
            </div>
          )}

          {!fullyPaid && (
            <PaymentOptions
              reservationId={reservation.id}
              kind={kind}
              amountCents={amountCents}
              htgAmount={htgAmount}
              providers={{ stripe: stripeConfigured, paypal: paypalConfigured, moncash: moncashConfigured, athmovil: athmovilConfigured }}
              cashEligible={cashEligible}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";

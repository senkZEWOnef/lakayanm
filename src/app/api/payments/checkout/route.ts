import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { stripe, stripeConfigured } from "@/lib/stripe";
import { amountDueCents } from "@/lib/paymentLedger";

export async function POST(request: NextRequest) {
  if (!stripeConfigured || !stripe) {
    return NextResponse.json({ error: "Stripe isn't configured yet — add STRIPE_SECRET_KEY to .env." }, { status: 400 });
  }

  try {
    const { reservationId, kind } = await request.json();
    const reservation = await prisma.reservations.findUnique({ where: { id: reservationId }, include: { trip: true } });
    if (!reservation) return NextResponse.json({ error: "Reservation not found" }, { status: 404 });

    const amountCents = amountDueCents(reservation, kind);

    if (amountCents <= 0) {
      return NextResponse.json({ error: "Nothing to charge" }, { status: 400 });
    }

    const origin = request.nextUrl.origin;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: reservation.email,
      line_items: [
        {
          price_data: {
            currency: reservation.trip.currency,
            product_data: { name: `${reservation.trip.title} — ${kind === "balance" ? "Balance" : "Deposit"}` },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/pay/${reservation.id}?paid=1`,
      cancel_url: `${origin}/pay/${reservation.id}`,
      metadata: { reservationId: reservation.id, kind: kind || "deposit" },
    });

    await prisma.payments.create({
      data: {
        reservation_id: reservation.id,
        amount_cents: amountCents,
        currency: reservation.trip.currency,
        kind: kind || "deposit",
        stripe_payment_intent_id: session.id,
        status: "pending",
      },
    });

    await prisma.reservations.update({ where: { id: reservation.id }, data: { stripe_checkout_session_id: session.id } });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Failed to start checkout" }, { status: 500 });
  }
}

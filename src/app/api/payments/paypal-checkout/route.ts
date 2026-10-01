import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createPayPalOrder, paypalConfigured } from "@/lib/paypal";
import { amountDueCents } from "@/lib/paymentLedger";

export async function POST(request: NextRequest) {
  if (!paypalConfigured) {
    return NextResponse.json(
      { error: "PayPal isn't configured yet — add PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET to .env." },
      { status: 400 }
    );
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
    const description = `${reservation.trip.title} — ${kind === "balance" ? "Balance" : "Deposit"}`;

    const payment = await prisma.payments.create({
      data: {
        reservation_id: reservation.id,
        amount_cents: amountCents,
        currency: "usd",
        kind: kind || "deposit",
        method: "paypal",
        status: "pending",
      },
    });

    const { orderId, approveUrl } = await createPayPalOrder(
      amountCents / 100,
      description,
      `${origin}/api/payments/paypal-capture?paymentId=${payment.id}`,
      `${origin}/pay/${reservation.id}`
    );

    await prisma.payments.update({ where: { id: payment.id }, data: { paypal_order_id: orderId } });

    return NextResponse.json({ url: approveUrl });
  } catch (error) {
    console.error("PayPal checkout error:", error);
    return NextResponse.json({ error: "Failed to start PayPal checkout" }, { status: 500 });
  }
}

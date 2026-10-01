import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createMonCashPayment, moncashConfigured, usdCentsToHtg } from "@/lib/moncash";
import { amountDueCents } from "@/lib/paymentLedger";

export async function POST(request: NextRequest) {
  if (!moncashConfigured) {
    return NextResponse.json(
      { error: "MonCash isn't configured yet — add MONCASH_CLIENT_ID and MONCASH_CLIENT_SECRET to .env." },
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

    const amountHtg = await usdCentsToHtg(amountCents);

    // Create the payments row first so its id can serve as MonCash's required
    // unique orderId — then update it with what CreatePayment returns.
    const payment = await prisma.payments.create({
      data: {
        reservation_id: reservation.id,
        amount_cents: amountCents,
        currency: reservation.trip.currency,
        kind: kind || "deposit",
        method: "moncash",
        moncash_amount_htg: amountHtg,
        status: "pending",
      },
    });

    const { token, redirectUrl } = await createMonCashPayment(amountHtg, payment.id);

    await prisma.payments.update({ where: { id: payment.id }, data: { moncash_order_id: payment.id } });

    return NextResponse.json({ url: redirectUrl, token, amountHtg });
  } catch (error) {
    console.error("MonCash checkout error:", error);
    return NextResponse.json({ error: "Failed to start MonCash checkout" }, { status: 500 });
  }
}

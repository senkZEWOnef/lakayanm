import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { amountDueCents, isEligibleForCash, CASH_MIN_COMPLETED_TRIPS } from "@/lib/paymentLedger";

// No gateway involved — this just records the traveler's intent to pay cash
// in person. An admin marks it received later from the reservation page.
// Eligibility is re-checked here regardless of what the client showed, same
// as every other gated thing in this app (discount codes, access codes).
export async function POST(request: NextRequest) {
  try {
    const { reservationId, kind } = await request.json();
    const reservation = await prisma.reservations.findUnique({ where: { id: reservationId }, include: { trip: true } });
    if (!reservation) return NextResponse.json({ error: "Reservation not found" }, { status: 404 });

    const eligible = await isEligibleForCash(reservation.email, reservation.id);
    if (!eligible) {
      return NextResponse.json(
        { error: `Cash is only available to travelers with ${CASH_MIN_COMPLETED_TRIPS}+ completed trips with us.` },
        { status: 403 }
      );
    }

    const amountCents = amountDueCents(reservation, kind);
    if (amountCents <= 0) {
      return NextResponse.json({ error: "Nothing to charge" }, { status: 400 });
    }

    await prisma.payments.create({
      data: {
        reservation_id: reservation.id,
        amount_cents: amountCents,
        currency: "usd",
        kind: kind || "deposit",
        method: "cash",
        status: "pending",
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Cash checkout error:", error);
    return NextResponse.json({ error: "Failed to record cash request" }, { status: 500 });
  }
}

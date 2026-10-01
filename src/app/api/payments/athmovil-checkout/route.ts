import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createAthMovilPayment, athmovilConfigured } from "@/lib/athmovil";
import { amountDueCents } from "@/lib/paymentLedger";

export async function POST(request: NextRequest) {
  if (!athmovilConfigured) {
    return NextResponse.json(
      { error: "ATH Móvil isn't configured yet — add ATHMOVIL_PUBLIC_TOKEN and ATHMOVIL_PRIVATE_TOKEN to .env." },
      { status: 400 }
    );
  }

  try {
    const { reservationId, kind, phoneNumber } = await request.json();
    if (!phoneNumber) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    const reservation = await prisma.reservations.findUnique({ where: { id: reservationId }, include: { trip: true } });
    if (!reservation) return NextResponse.json({ error: "Reservation not found" }, { status: 404 });

    const amountCents = amountDueCents(reservation, kind);
    if (amountCents <= 0) {
      return NextResponse.json({ error: "Nothing to charge" }, { status: 400 });
    }
    if (amountCents / 100 > 1500) {
      return NextResponse.json({ error: "ATH Móvil has a $1,500 limit per transaction" }, { status: 400 });
    }

    const payment = await prisma.payments.create({
      data: {
        reservation_id: reservation.id,
        amount_cents: amountCents,
        currency: "usd",
        kind: kind || "deposit",
        method: "athmovil",
        status: "pending",
      },
    });

    const { ecommerceId, authToken } = await createAthMovilPayment(amountCents / 100, phoneNumber, payment.id);

    await prisma.payments.update({ where: { id: payment.id }, data: { athmovil_reference: ecommerceId } });

    return NextResponse.json({ paymentId: payment.id, ecommerceId, authToken });
  } catch (error) {
    console.error("ATH Móvil checkout error:", error);
    return NextResponse.json({ error: "Failed to start ATH Móvil payment" }, { status: 500 });
  }
}

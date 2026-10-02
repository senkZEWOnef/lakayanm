import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateConfirmationCode } from "@/lib/confirmationCode";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { name, email, phone, travelerCount, preferredStartDate, flexibleDates, message, discountCode } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const trip = await prisma.trips.findFirst({ where: { slug, is_published: true } });
    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    const count = travelerCount ? parseInt(travelerCount, 10) : 1;
    const perPerson = count >= trip.group_threshold ? trip.price_group_cents : trip.price_individual_cents;
    let totalCents = perPerson * count;
    let appliedCode: string | null = null;

    if (discountCode) {
      const code = await prisma.discount_codes.findUnique({ where: { code: discountCode.trim().toUpperCase() } });
      const valid =
        !!code &&
        code.is_active &&
        (!code.expires_at || code.expires_at > new Date()) &&
        (code.max_uses == null || code.use_count < code.max_uses);

      if (valid && code) {
        totalCents = code.kind === "percent" ? Math.round(totalCents * (1 - code.value / 100)) : Math.max(0, totalCents - code.value);
        appliedCode = code.code;
        await prisma.discount_codes.update({ where: { id: code.id }, data: { use_count: { increment: 1 } } });
      }
    }

    const confirmationCode = await generateConfirmationCode();

    const reservation = await prisma.reservations.create({
      data: {
        trip_id: trip.id,
        name,
        email,
        phone: phone || null,
        traveler_count: count,
        preferred_start_date: preferredStartDate ? new Date(preferredStartDate) : null,
        flexible_dates: flexibleDates ?? true,
        message: message || null,
        quoted_total_cents: totalCents,
        discount_code: appliedCode,
        deposit_due_cents: trip.deposit_cents * count,
        confirmation_code: confirmationCode,
      },
    });

    return NextResponse.json({ ok: true, id: reservation.id, quotedTotalCents: totalCents, confirmationCode });
  } catch (error) {
    console.error("Reservation error:", error);
    return NextResponse.json({ error: "Failed to submit request" }, { status: 500 });
  }
}

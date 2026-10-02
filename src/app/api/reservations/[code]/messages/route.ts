import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { normalizeConfirmationCode } from "@/lib/confirmationCode";

export async function POST(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params;
    const { body, kind } = await request.json();

    if (!body || !body.trim()) {
      return NextResponse.json({ error: "Message can't be empty" }, { status: 400 });
    }

    const reservation = await prisma.reservations.findUnique({
      where: { confirmation_code: normalizeConfirmationCode(code) },
    });
    if (!reservation) return NextResponse.json({ error: "Trip not found" }, { status: 404 });

    const created = await prisma.reservation_messages.create({
      data: {
        reservation_id: reservation.id,
        from_role: "client",
        kind: kind === "change_request" ? "change_request" : "message",
        body: body.trim(),
      },
    });

    return NextResponse.json({ ok: true, message: created });
  } catch (error) {
    console.error("Reservation message error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

import { prisma } from "@/lib/db";
import type { reservations } from "@prisma/client";

// Shared by every checkout route — the deposit is due in full the first time;
// after that, "balance" means whatever's left of the quoted total.
export function amountDueCents(reservation: reservations, kind: string | undefined): number {
  if (kind === "balance") {
    return Math.max(0, (reservation.quoted_total_cents || 0) - reservation.amount_paid_cents);
  }
  return reservation.deposit_due_cents || 0;
}

// Shared by every provider's confirmation path (Stripe webhook, MonCash
// return URL, PayPal capture, ATH Móvil polling) — marks a payment row
// succeeded and rolls its amount into the reservation's running total.
export async function markPaymentSucceeded(paymentId: string, extra: Record<string, unknown> = {}) {
  const payment = await prisma.payments.update({ where: { id: paymentId }, data: { status: "succeeded", ...extra } });

  const reservation = await prisma.reservations.findUnique({ where: { id: payment.reservation_id } });
  if (reservation) {
    const newAmountPaid = reservation.amount_paid_cents + payment.amount_cents;
    const paidInFull = reservation.quoted_total_cents != null && newAmountPaid >= reservation.quoted_total_cents;

    await prisma.reservations.update({
      where: { id: reservation.id },
      data: {
        amount_paid_cents: newAmountPaid,
        payment_status: paidInFull ? "paid_in_full" : "deposit_paid",
      },
    });
  }

  return payment;
}

export async function markPaymentFailed(paymentId: string, extra: Record<string, unknown> = {}) {
  return prisma.payments.update({ where: { id: paymentId }, data: { status: "failed", ...extra } });
}

// Cash is only offered to travelers with a track record — matched by email
// since there's no login system. "Previous trip" means a reservation whose
// status actually reached "completed", not just any past booking.
export const CASH_MIN_COMPLETED_TRIPS = 3;

export async function isEligibleForCash(email: string, excludeReservationId: string): Promise<boolean> {
  const count = await prisma.reservations.count({
    where: { email, status: "completed", id: { not: excludeReservationId } },
  });
  return count >= CASH_MIN_COMPLETED_TRIPS;
}

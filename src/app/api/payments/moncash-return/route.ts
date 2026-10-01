import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { retrieveMonCashPaymentByOrderId } from "@/lib/moncash";
import { markPaymentSucceeded, markPaymentFailed } from "@/lib/paymentLedger";

// Configure THIS route's full URL as the "return URL" in your MonCash business
// portal (it's a fixed setting there, not passed per-request by the API).
// MonCash redirects the payer's browser here after they complete (or cancel)
// payment on the hosted page. We never trust the redirect alone — we look the
// payment back up via the API before marking anything paid.
export async function GET(request: NextRequest) {
  const orderId =
    request.nextUrl.searchParams.get("orderId") ||
    request.nextUrl.searchParams.get("order_id") ||
    request.nextUrl.searchParams.get("transactionId");

  const origin = request.nextUrl.origin;

  if (!orderId) {
    return NextResponse.redirect(`${origin}/?moncash=missing_order`);
  }

  const payment = await prisma.payments.findFirst({ where: { moncash_order_id: orderId, method: "moncash" } });
  if (!payment) {
    return NextResponse.redirect(`${origin}/?moncash=unknown_order`);
  }

  try {
    const details = await retrieveMonCashPaymentByOrderId(orderId);

    if (details && details.message === "successful") {
      await markPaymentSucceeded(payment.id, { moncash_transaction_id: details.transactionId });
      return NextResponse.redirect(`${origin}/pay/${payment.reservation_id}?paid=1`);
    }

    await markPaymentFailed(payment.id);
    return NextResponse.redirect(`${origin}/pay/${payment.reservation_id}?paid=0`);
  } catch (error) {
    console.error("MonCash return error:", error);
    return NextResponse.redirect(`${origin}/pay/${payment.reservation_id}?paid=0`);
  }
}

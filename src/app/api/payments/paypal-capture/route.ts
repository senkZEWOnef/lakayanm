import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { capturePayPalOrder } from "@/lib/paypal";
import { markPaymentSucceeded, markPaymentFailed } from "@/lib/paymentLedger";

// PayPal's own "return_url" from createPayPalOrder — we embedded our payment
// row's id in it so we know which row to update without trusting anything
// else in the query string.
export async function GET(request: NextRequest) {
  const paymentId = request.nextUrl.searchParams.get("paymentId");
  const origin = request.nextUrl.origin;

  if (!paymentId) {
    return NextResponse.redirect(`${origin}/?paypal=missing_payment`);
  }

  const payment = await prisma.payments.findUnique({ where: { id: paymentId } });
  if (!payment || !payment.paypal_order_id) {
    return NextResponse.redirect(`${origin}/?paypal=unknown_payment`);
  }

  try {
    const result = await capturePayPalOrder(payment.paypal_order_id);

    if (result.status === "COMPLETED") {
      await markPaymentSucceeded(payment.id);
      return NextResponse.redirect(`${origin}/pay/${payment.reservation_id}?paid=1`);
    }

    await markPaymentFailed(payment.id);
    return NextResponse.redirect(`${origin}/pay/${payment.reservation_id}?paid=0`);
  } catch (error) {
    console.error("PayPal capture error:", error);
    await markPaymentFailed(payment.id);
    return NextResponse.redirect(`${origin}/pay/${payment.reservation_id}?paid=0`);
  }
}

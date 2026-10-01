import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { findAthMovilPayment, authorizeAthMovilPayment } from "@/lib/athmovil";
import { markPaymentSucceeded, markPaymentFailed } from "@/lib/paymentLedger";

// Polled by the payment page every few seconds after the customer confirms
// the charge in their own ATH Móvil app. authToken comes back from the
// checkout response — we never persist it, the client holds it for the
// duration of this one payment attempt.
export async function GET(request: NextRequest) {
  const paymentId = request.nextUrl.searchParams.get("paymentId");
  const ecommerceId = request.nextUrl.searchParams.get("ecommerceId");
  const authToken = request.nextUrl.searchParams.get("authToken");

  if (!paymentId || !ecommerceId) {
    return NextResponse.json({ error: "paymentId and ecommerceId are required" }, { status: 400 });
  }

  const payment = await prisma.payments.findUnique({ where: { id: paymentId } });
  if (!payment) return NextResponse.json({ error: "Payment not found" }, { status: 404 });

  if (payment.status === "succeeded") return NextResponse.json({ status: "COMPLETED" });
  if (payment.status === "failed") return NextResponse.json({ status: "CANCEL" });

  try {
    const status = await findAthMovilPayment(ecommerceId);

    if (status === "CONFIRM" && authToken) {
      const finalStatus = await authorizeAthMovilPayment(authToken);
      if (finalStatus === "COMPLETED") {
        await markPaymentSucceeded(payment.id);
        return NextResponse.json({ status: "COMPLETED" });
      }
      return NextResponse.json({ status: finalStatus });
    }

    if (status === "CANCEL" || status === "EXPIRED") {
      await markPaymentFailed(payment.id);
    }

    return NextResponse.json({ status });
  } catch (error) {
    console.error("ATH Móvil status error:", error);
    return NextResponse.json({ status: "OPEN" }); // keep polling rather than fail hard on a transient error
  }
}

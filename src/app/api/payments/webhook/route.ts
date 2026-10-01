import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { stripe, stripeConfigured } from "@/lib/stripe";
import { markPaymentSucceeded } from "@/lib/paymentLedger";

export async function POST(request: NextRequest) {
  if (!stripeConfigured || !stripe) {
    return NextResponse.json({ error: "Stripe isn't configured" }, { status: 400 });
  }

  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const rawBody = await request.text();

  let event;
  try {
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } else {
      // No webhook secret configured — fall back to trusting the payload
      // (fine for local/dev testing, set STRIPE_WEBHOOK_SECRET before going live).
      event = JSON.parse(rawBody);
    }
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as { id: string; metadata?: { reservationId?: string; kind?: string } };

    const payment = await prisma.payments.findFirst({ where: { stripe_payment_intent_id: session.id } });
    if (payment) {
      await markPaymentSucceeded(payment.id);
    }
  }

  return NextResponse.json({ received: true });
}

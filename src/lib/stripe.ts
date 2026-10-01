import Stripe from "stripe";

export const stripeConfigured = !!process.env.STRIPE_SECRET_KEY;

export const stripe = stripeConfigured
  ? new Stripe(process.env.STRIPE_SECRET_KEY as string)
  : null;

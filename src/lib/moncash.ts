// MonCash (Digicel) REST API client — https://moncashbutton.digicelgroup.com
// Docs: Rest API MonCash Documentation (2019), as supplied by the user.

import { getUsdToHtgRate } from "@/lib/settings";

const MODE = process.env.MONCASH_MODE === "live" ? "live" : "sandbox";

const HOST_REST_API =
  MODE === "live" ? "https://moncashbutton.digicelgroup.com/Api" : "https://sandbox.moncashbutton.digicelgroup.com/Api";

const GATEWAY_BASE =
  MODE === "live"
    ? "https://moncashbutton.digicelgroup.com/Moncash-middleware"
    : "https://sandbox.moncashbutton.digicelgroup.com/Moncash-middleware";

export const moncashConfigured = !!process.env.MONCASH_CLIENT_ID && !!process.env.MONCASH_CLIENT_SECRET;

// Rate is admin-controlled via /admin/payments (stored in the `settings` table),
// not a static env var — takes effect immediately, no deploy needed.
export async function usdCentsToHtg(usdCents: number): Promise<number> {
  const rate = await getUsdToHtgRate();
  const htg = (usdCents / 100) * rate;
  return Math.round(htg * 100) / 100; // 2 decimal places
}

async function getAccessToken(): Promise<string> {
  const clientId = process.env.MONCASH_CLIENT_ID;
  const clientSecret = process.env.MONCASH_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("MonCash isn't configured — add MONCASH_CLIENT_ID and MONCASH_CLIENT_SECRET to .env.");
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch(`${HOST_REST_API}/oauth/token`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basic}`,
    },
    body: "scope=read,write&grant_type=client_credentials",
  });

  if (!res.ok) {
    throw new Error(`MonCash auth failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return data.access_token as string;
}

export interface MonCashPayment {
  token: string;
  redirectUrl: string;
}

// Creates a payment and returns the hosted MonCash page the payer should be sent to.
// `orderId` must be unique per MonCash account — we pass the payment row's own id.
export async function createMonCashPayment(amountHtg: number, orderId: string): Promise<MonCashPayment> {
  const accessToken = await getAccessToken();

  const res = await fetch(`${HOST_REST_API}/v1/CreatePayment`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ amount: amountHtg, orderId }),
  });

  if (!res.ok) {
    throw new Error(`MonCash CreatePayment failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  const token = data.payment_token?.token;
  if (!token) throw new Error("MonCash CreatePayment returned no token");

  return { token, redirectUrl: `${GATEWAY_BASE}/Payment/Redirect?token=${token}` };
}

export interface MonCashPaymentDetails {
  reference: string;
  transactionId: string;
  cost: number;
  message: string;
  payer: string;
}

// Call this from the return-URL handler to confirm what actually happened —
// never trust the redirect alone, MonCash's own docs frame this as the
// authoritative check.
export async function retrieveMonCashPaymentByOrderId(orderId: string): Promise<MonCashPaymentDetails | null> {
  const accessToken = await getAccessToken();

  const res = await fetch(`${HOST_REST_API}/v1/RetrieveOrderPayment`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ orderId }),
  });

  if (!res.ok) return null;

  const data = await res.json();
  if (!data.payment) return null;

  return {
    reference: data.payment.reference,
    transactionId: data.payment.transaction_id,
    cost: data.payment.cost,
    message: data.payment.message,
    payer: data.payment.payer,
  };
}

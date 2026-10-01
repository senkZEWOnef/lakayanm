// PayPal Orders API v2 — https://developer.paypal.com/docs/api/orders/v2/

const MODE = process.env.PAYPAL_MODE === "live" ? "live" : "sandbox";

const BASE_URL = MODE === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

export const paypalConfigured = !!process.env.PAYPAL_CLIENT_ID && !!process.env.PAYPAL_CLIENT_SECRET;

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("PayPal isn't configured — add PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET to .env.");
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch(`${BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    throw new Error(`PayPal auth failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return data.access_token as string;
}

export interface PayPalOrder {
  orderId: string;
  approveUrl: string;
}

export async function createPayPalOrder(amountUsd: number, description: string, returnUrl: string, cancelUrl: string): Promise<PayPalOrder> {
  const accessToken = await getAccessToken();

  const res = await fetch(`${BASE_URL}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: { currency_code: "USD", value: amountUsd.toFixed(2) },
          description,
        },
      ],
      application_context: {
        return_url: returnUrl,
        cancel_url: cancelUrl,
        user_action: "PAY_NOW",
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`PayPal CreateOrder failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  const approveLink = (data.links as { rel: string; href: string }[]).find((l) => l.rel === "approve");
  if (!approveLink) throw new Error("PayPal order has no approve link");

  return { orderId: data.id, approveUrl: approveLink.href };
}

export interface PayPalCaptureResult {
  status: string;
  captureId?: string;
  amount?: string;
}

export async function capturePayPalOrder(orderId: string): Promise<PayPalCaptureResult> {
  const accessToken = await getAccessToken();

  const res = await fetch(`${BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    // ORDER_ALREADY_CAPTURED can happen on a double-hit of the return URL — treat as success.
    if (data?.details?.[0]?.issue === "ORDER_ALREADY_CAPTURED") {
      return { status: "COMPLETED" };
    }
    throw new Error(`PayPal Capture failed: ${res.status} ${JSON.stringify(data)}`);
  }

  const capture = data.purchase_units?.[0]?.payments?.captures?.[0];
  return { status: data.status, captureId: capture?.id, amount: capture?.amount?.value };
}

// ATH Móvil (Evertec) Business eCommerce API — https://github.com/evertec/ATHM-Payment-Button-API
//
// No sandbox exists — this is production-only and requires an active ATH
// Business account. It's a polling flow, not a redirect: create a payment,
// the customer confirms it in their own ATH Móvil app, we poll for status,
// then authorize once it's confirmed.
//
// Field names for findPayment/authorization are implemented from the best
// available docs — verify against a real account before trusting this in
// production, same as every other provider in this project.

const BASE_URL = "https://payments.athmovil.com/api/business-transaction";

export const athmovilConfigured = !!process.env.ATHMOVIL_PUBLIC_TOKEN && !!process.env.ATHMOVIL_PRIVATE_TOKEN;

function requirePublicToken(): string {
  const token = process.env.ATHMOVIL_PUBLIC_TOKEN;
  if (!token) throw new Error("ATH Móvil isn't configured — add ATHMOVIL_PUBLIC_TOKEN and ATHMOVIL_PRIVATE_TOKEN to .env.");
  return token;
}

export interface AthMovilPayment {
  ecommerceId: string;
  authToken: string;
}

export async function createAthMovilPayment(amountUsd: number, phoneNumber: string, metadata1: string): Promise<AthMovilPayment> {
  const publicToken = requirePublicToken();

  const res = await fetch(`${BASE_URL}/ecommerce/payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      publicToken,
      total: Number(amountUsd.toFixed(2)),
      phoneNumber,
      metadata1: metadata1.slice(0, 40),
      timeout: 600,
    }),
  });

  if (!res.ok) {
    throw new Error(`ATH Móvil CreatePayment failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  if (data.status !== "success" || !data.data?.ecommerceId) {
    throw new Error(`ATH Móvil CreatePayment returned unexpected response: ${JSON.stringify(data)}`);
  }

  return { ecommerceId: data.data.ecommerceId, authToken: data.data.auth_token };
}

export type AthMovilStatus = "OPEN" | "CONFIRM" | "COMPLETED" | "CANCEL" | "EXPIRED";

export async function findAthMovilPayment(ecommerceId: string): Promise<AthMovilStatus> {
  const publicToken = requirePublicToken();

  const res = await fetch(`${BASE_URL}/business/findPayment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ publicToken, ecommerceId }),
  });

  if (!res.ok) {
    throw new Error(`ATH Móvil findPayment failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return (data.data?.status ?? data.status) as AthMovilStatus;
}

// Call once findAthMovilPayment reports "CONFIRM" — finalizes to "COMPLETED".
export async function authorizeAthMovilPayment(authToken: string): Promise<AthMovilStatus> {
  const res = await fetch(`${BASE_URL}/ecommerce/authorization`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({}),
  });

  if (!res.ok) {
    throw new Error(`ATH Móvil authorization failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return (data.data?.status ?? data.status) as AthMovilStatus;
}

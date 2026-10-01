"use client";

import { useEffect, useRef, useState } from "react";

interface Providers {
  stripe: boolean;
  paypal: boolean;
  moncash: boolean;
  athmovil: boolean;
}

interface PaymentOptionsProps {
  reservationId: string;
  kind: string;
  amountCents: number;
  htgAmount: number;
  providers: Providers;
  cashEligible: boolean;
}

type Location = "" | "haiti" | "us" | "pr" | "other";
type AthStatus = "idle" | "requesting" | "waiting" | "completed" | "failed";

function formatUsd(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export default function PaymentOptions({ reservationId, kind, amountCents, htgAmount, providers, cashEligible }: PaymentOptionsProps) {
  const [location, setLocation] = useState<Location>("");
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [cashRequested, setCashRequested] = useState(false);

  const [athPhone, setAthPhone] = useState("");
  const [athStatus, setAthStatus] = useState<AthStatus>("idle");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const redirectCheckout = async (endpoint: string, provider: string, extra: Record<string, unknown> = {}) => {
    setLoadingProvider(provider);
    setError("");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reservationId, kind, ...extra }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Something went wrong — please try again.");
        setLoadingProvider(null);
      }
    } catch {
      setError("Something went wrong — please try again.");
      setLoadingProvider(null);
    }
  };

  const requestCash = async () => {
    setLoadingProvider("cash");
    setError("");
    try {
      const res = await fetch("/api/payments/cash-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reservationId, kind }),
      });
      const data = await res.json();
      if (res.ok) {
        setCashRequested(true);
      } else {
        setError(data.error || "Couldn't record the cash request.");
      }
    } catch {
      setError("Something went wrong — please try again.");
    } finally {
      setLoadingProvider(null);
    }
  };

  const startAthMovil = async () => {
    if (!athPhone.trim()) {
      setError("Enter the phone number linked to your ATH Móvil account.");
      return;
    }
    setError("");
    setAthStatus("requesting");
    try {
      const res = await fetch("/api/payments/athmovil-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reservationId, kind, phoneNumber: athPhone.trim() }),
      });
      const data = await res.json();
      if (!data.ecommerceId) {
        setError(data.error || "Couldn't start the ATH Móvil payment.");
        setAthStatus("idle");
        return;
      }

      setAthStatus("waiting");
      pollRef.current = setInterval(async () => {
        const statusRes = await fetch(
          `/api/payments/athmovil-status?paymentId=${data.paymentId}&ecommerceId=${data.ecommerceId}&authToken=${encodeURIComponent(data.authToken)}`
        );
        const statusData = await statusRes.json();

        if (statusData.status === "COMPLETED") {
          setAthStatus("completed");
          if (pollRef.current) clearInterval(pollRef.current);
          setTimeout(() => window.location.reload(), 1500);
        } else if (statusData.status === "CANCEL" || statusData.status === "EXPIRED") {
          setAthStatus("failed");
          if (pollRef.current) clearInterval(pollRef.current);
        }
      }, 3000);
    } catch {
      setError("Something went wrong — please try again.");
      setAthStatus("idle");
    }
  };

  return (
    <div className="card space-y-5">
      <div>
        <label className="block text-xs font-medium mb-1">Where are you paying from?</label>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value as Location)}
          className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
        >
          <option value="">Select...</option>
          <option value="haiti">Haiti</option>
          <option value="us">United States</option>
          <option value="pr">Puerto Rico</option>
          <option value="other">Somewhere else</option>
        </select>
      </div>

      {/* Pay in USD */}
      <div>
        <p className="text-sm font-semibold mb-2">Pay in US Dollars</p>
        <div className="space-y-2">
          <button
            onClick={() => redirectCheckout("/api/payments/checkout", "stripe")}
            disabled={!providers.stripe || loadingProvider !== null}
            className="w-full bg-haiti-navy text-white py-3 rounded-lg text-sm font-medium hover:bg-haiti-navy/80 transition-colors disabled:opacity-40"
          >
            {loadingProvider === "stripe" ? "Redirecting..." : providers.stripe ? "💳 Pay with Card" : "💳 Card (temporarily unavailable)"}
          </button>
          <button
            onClick={() => redirectCheckout("/api/payments/paypal-checkout", "paypal")}
            disabled={!providers.paypal || loadingProvider !== null}
            className="w-full bg-[#0070ba] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#005ea6] transition-colors disabled:opacity-40"
          >
            {loadingProvider === "paypal" ? "Redirecting..." : providers.paypal ? "PayPal" : "PayPal (temporarily unavailable)"}
          </button>

          {location === "pr" && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2">
              <p className="text-sm font-medium">ATH Móvil</p>
              {!providers.athmovil ? (
                <p className="text-xs sub">Not available yet.</p>
              ) : athStatus === "completed" ? (
                <p className="text-sm text-green-600">Payment confirmed ✓</p>
              ) : athStatus === "failed" ? (
                <p className="text-sm text-red-500">That request expired or was cancelled — try again.</p>
              ) : athStatus === "waiting" ? (
                <p className="text-xs sub">Open your ATH Móvil app to confirm the ${(amountCents / 100).toFixed(2)} request...</p>
              ) : (
                <>
                  <input
                    type="tel"
                    value={athPhone}
                    onChange={(e) => setAthPhone(e.target.value)}
                    placeholder="Phone number on your ATH Móvil account"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                  />
                  <button
                    onClick={startAthMovil}
                    disabled={athStatus === "requesting"}
                    className="w-full bg-red-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-40"
                  >
                    {athStatus === "requesting" ? "Requesting..." : "Request Payment"}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Pay in HTG */}
      <div>
        <p className="text-sm font-semibold mb-2">Pay in Haitian Gourdes</p>
        <button
          onClick={() => redirectCheckout("/api/payments/moncash-checkout", "moncash")}
          disabled={!providers.moncash || loadingProvider !== null}
          className="w-full bg-[#e2001a] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#c2001a] transition-colors disabled:opacity-40"
        >
          {loadingProvider === "moncash"
            ? "Redirecting..."
            : providers.moncash
              ? `MonCash — ${htgAmount.toLocaleString()} HTG`
              : "MonCash (temporarily unavailable)"}
        </button>
      </div>

      {/* Cash — only shown to travelers with 3+ completed trips with us */}
      {cashEligible && (
        <div>
          <p className="text-sm font-semibold mb-2">Pay with Cash</p>
          {cashRequested ? (
            <p className="text-sm text-green-600 border border-green-500/30 bg-green-500/5 rounded-lg p-3">
              Noted — bring {formatUsd(amountCents)} in cash and we&apos;ll confirm it with you directly.
            </p>
          ) : (
            <button
              onClick={requestCash}
              disabled={loadingProvider !== null}
              className="w-full border-2 border-haiti-emerald text-haiti-emerald py-3 rounded-lg text-sm font-medium hover:bg-haiti-emerald/10 transition-colors disabled:opacity-40"
            >
              {loadingProvider === "cash" ? "Recording..." : "💵 I'll Pay in Cash"}
            </button>
          )}
          <p className="text-xs sub mt-1">Available to returning travelers — thanks for coming back.</p>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
      <p className="text-xs text-center sub">Payments are processed securely by each provider — we never see your card or account details.</p>
    </div>
  );
}

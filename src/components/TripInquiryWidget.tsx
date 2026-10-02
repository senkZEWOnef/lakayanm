"use client";

import { useMemo, useState } from "react";

interface Trip {
  slug: string;
  title: string;
  price_individual_cents: number;
  price_group_cents: number;
  deposit_cents: number;
  group_threshold: number;
  currency: string;
}

interface TripInquiryWidgetProps {
  trip: Trip;
}

function formatCurrency(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

export default function TripInquiryWidget({ trip }: TripInquiryWidgetProps) {
  const [travelerCount, setTravelerCount] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredStartDate, setPreferredStartDate] = useState("");
  const [flexibleDates, setFlexibleDates] = useState(true);
  const [message, setMessage] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{ kind: string; value: number; label?: string } | null>(null);
  const [discountStatus, setDiscountStatus] = useState<"idle" | "checking" | "invalid">("idle");
  const [status, setStatus] = useState<"idle" | "submitting" | "redirecting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const isGroupRate = travelerCount >= trip.group_threshold;
  const perPersonCents = isGroupRate ? trip.price_group_cents : trip.price_individual_cents;
  const subtotalCents = perPersonCents * travelerCount;
  const totalCents = appliedDiscount
    ? appliedDiscount.kind === "percent"
      ? Math.round(subtotalCents * (1 - appliedDiscount.value / 100))
      : Math.max(0, subtotalCents - appliedDiscount.value)
    : subtotalCents;

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  const checkDiscountCode = async () => {
    if (!discountCode.trim()) {
      setAppliedDiscount(null);
      setDiscountStatus("idle");
      return;
    }
    setDiscountStatus("checking");
    try {
      const res = await fetch("/api/discount-codes/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: discountCode }),
      });
      const data = await res.json();
      if (data.valid) {
        setAppliedDiscount({ kind: data.kind, value: data.value, label: data.label });
        setDiscountStatus("idle");
      } else {
        setAppliedDiscount(null);
        setDiscountStatus("invalid");
      }
    } catch {
      setAppliedDiscount(null);
      setDiscountStatus("invalid");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !accessCode.trim()) return;

    setStatus("submitting");
    setErrorMessage("");
    try {
      const res = await fetch(`/api/trips/${trip.slug}/inquire`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          travelerCount,
          preferredStartDate: preferredStartDate || undefined,
          flexibleDates,
          message,
          accessCode,
          discountCode: appliedDiscount ? discountCode : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Request failed — please try again.");
        setStatus("error");
        return;
      }
      setStatus("redirecting");
      window.location.href = `/pay/${data.id}`;
    } catch {
      setErrorMessage("Something went wrong — please try again.");
      setStatus("error");
    }
  };

  if (status === "redirecting") {
    return (
      <div className="card sticky top-4 text-center py-10">
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-2">Taking you to payment...</h3>
        <p className="sub text-sm">Thanks, {name}. One moment.</p>
      </div>
    );
  }

  return (
    <div className="card sticky top-4">
      {/* Pricing */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className={`rounded-xl p-3 border ${!isGroupRate ? "border-haiti-turquoise bg-haiti-turquoise/10" : "border-gray-200 dark:border-gray-700"}`}>
          <p className="text-xs sub">Individual</p>
          <p className="text-lg font-bold text-haiti-navy dark:text-haiti-turquoise">
            {formatCurrency(trip.price_individual_cents, trip.currency)}
          </p>
          <p className="text-xs sub">per person</p>
        </div>
        <div className={`rounded-xl p-3 border ${isGroupRate ? "border-haiti-turquoise bg-haiti-turquoise/10" : "border-gray-200 dark:border-gray-700"}`}>
          <p className="text-xs sub">Group ({trip.group_threshold}+)</p>
          <p className="text-lg font-bold text-haiti-navy dark:text-haiti-turquoise">
            {formatCurrency(trip.price_group_cents, trip.currency)}
          </p>
          <p className="text-xs sub">per person</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Traveler count */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Travelers</label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setTravelerCount((n) => Math.max(1, n - 1))}
              className="w-9 h-9 rounded-lg border border-gray-300 dark:border-gray-600 text-lg"
            >
              −
            </button>
            <span className="w-8 text-center font-medium">{travelerCount}</span>
            <button
              type="button"
              onClick={() => setTravelerCount((n) => Math.min(20, n + 1))}
              className="w-9 h-9 rounded-lg border border-gray-300 dark:border-gray-600 text-lg"
            >
              +
            </button>
          </div>
        </div>

        {/* Access code — required to book */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Access code</label>
          <input
            required
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
            placeholder="Got a code? Enter it here"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-mono focus:ring-2 focus:ring-haiti-turquoise focus:border-transparent"
          />
          <p className="text-xs sub mt-1">
            We&apos;re testing this feature with a small group — reach out if you&apos;d like a code.
          </p>
        </div>

        {/* Discount code */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Discount code (optional)</label>
          <div className="flex gap-2">
            <input
              value={discountCode}
              onChange={(e) => {
                setDiscountCode(e.target.value.toUpperCase());
                setAppliedDiscount(null);
                setDiscountStatus("idle");
              }}
              placeholder="CODE"
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-mono focus:ring-2 focus:ring-haiti-turquoise focus:border-transparent"
            />
            <button
              type="button"
              onClick={checkDiscountCode}
              disabled={discountStatus === "checking"}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Apply
            </button>
          </div>
          {appliedDiscount && (
            <p className="text-xs text-green-600 mt-1">
              ✓ {appliedDiscount.label || "Discount"} applied ({appliedDiscount.kind === "percent" ? `${appliedDiscount.value}% off` : `${formatCurrency(appliedDiscount.value, trip.currency)} off`})
            </p>
          )}
          {discountStatus === "invalid" && <p className="text-xs text-red-500 mt-1">That code isn&apos;t valid.</p>}
        </div>

        {/* Estimate */}
        <div className="space-y-1 pt-3 border-t border-gray-200 dark:border-gray-700 text-sm">
          <div className="flex justify-between">
            <span>
              {formatCurrency(perPersonCents, trip.currency)} × {travelerCount}
            </span>
            <span>{formatCurrency(subtotalCents, trip.currency)}</span>
          </div>
          {appliedDiscount && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-{formatCurrency(subtotalCents - totalCents, trip.currency)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold pt-1">
            <span>Estimated total</span>
            <span>{formatCurrency(totalCents, trip.currency)}</span>
          </div>
          <p className="text-xs sub pt-1">
            Deposit to hold your spot: <strong>{formatCurrency(trip.deposit_cents, trip.currency)}</strong> per person
          </p>
        </div>

        {/* Dates */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Preferred start date</label>
          <input
            type="date"
            min={today}
            value={preferredStartDate}
            onChange={(e) => setPreferredStartDate(e.target.value)}
            disabled={flexibleDates}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-haiti-turquoise focus:border-transparent disabled:opacity-50"
          />
          <label className="flex items-center gap-2 mt-2 text-xs sub">
            <input type="checkbox" checked={flexibleDates} onChange={(e) => setFlexibleDates(e.target.checked)} />
            My dates are flexible
          </label>
        </div>

        {/* Contact */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-haiti-turquoise focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-haiti-turquoise focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Phone (optional)</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-haiti-turquoise focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Anything we should know?</label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-haiti-turquoise focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full bg-haiti-turquoise text-white py-3 rounded-lg font-medium text-sm hover:bg-haiti-turquoise/80 transition-colors disabled:bg-gray-400"
        >
          {status === "submitting" ? "Sending..." : "Request This Trip"}
        </button>

        {status === "error" && (
          <p className="text-xs text-red-500 text-center">{errorMessage || "Something went wrong — please try again."}</p>
        )}

        <p className="text-xs text-center sub">You won&apos;t be charged yet — we&apos;ll confirm availability first.</p>
      </form>
    </div>
  );
}

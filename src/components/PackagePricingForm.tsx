"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Trip {
  id: string;
  price_individual_cents: number;
  price_group_cents: number;
  group_threshold: number;
  deposit_cents: number;
  currency: string;
}

export default function PackagePricingForm({ trip }: { trip: Trip }) {
  const router = useRouter();
  const [individual, setIndividual] = useState((trip.price_individual_cents / 100).toString());
  const [group, setGroup] = useState((trip.price_group_cents / 100).toString());
  const [threshold, setThreshold] = useState(String(trip.group_threshold));
  const [deposit, setDeposit] = useState((trip.deposit_cents / 100).toString());
  const [currency, setCurrency] = useState(trip.currency);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch(`/api/admin/trips/${trip.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceIndividualCents: Math.round(parseFloat(individual) * 100),
          priceGroupCents: Math.round(parseFloat(group) * 100),
          groupThreshold: threshold,
          depositCents: Math.round(parseFloat(deposit) * 100),
          currency,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("saved");
      router.refresh();
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h2 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise">Pricing — Individual vs. Group</h2>
      <div className="grid md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-medium mb-1">Individual price ($/person)</label>
          <input type="number" min="0" step="0.01" value={individual} onChange={(e) => setIndividual(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Group price ($/person)</label>
          <input type="number" min="0" step="0.01" value={group} onChange={(e) => setGroup(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Group kicks in at</label>
          <input type="number" min="1" value={threshold} onChange={(e) => setThreshold(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg" />
          <p className="text-xs sub mt-1">travelers</p>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Deposit ($/person)</label>
          <input type="number" min="0" step="0.01" value={deposit} onChange={(e) => setDeposit(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">Currency</label>
        <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-32 p-2 border border-gray-300 dark:border-gray-600 rounded-lg">
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
        </select>
      </div>
      <button type="submit" disabled={status === "saving"} className="bg-haiti-turquoise text-white px-6 py-2.5 rounded-lg font-medium hover:bg-haiti-turquoise/80 transition-colors disabled:bg-gray-400">
        {status === "saving" ? "Saving..." : "Save Pricing"}
      </button>
      {status === "saved" && <span className="text-green-600 text-sm ml-3">Saved ✓</span>}
      {status === "error" && <span className="text-red-500 text-sm ml-3">Failed to save</span>}
    </form>
  );
}

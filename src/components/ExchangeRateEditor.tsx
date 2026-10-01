"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ExchangeRateEditor({ currentRate }: { currentRate: number }) {
  const router = useRouter();
  const [rate, setRate] = useState(String(currentRate));
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usdToHtgRate: rate }),
      });
      if (!res.ok) throw new Error();
      setStatus("saved");
      router.refresh();
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={save} className="card">
      <h2 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-1">Exchange Rate</h2>
      <p className="text-xs sub mb-3">Used to convert deposit/balance amounts for MonCash. Takes effect immediately — no deploy needed.</p>
      <div className="flex items-center gap-2">
        <span className="text-sm sub">1 USD =</span>
        <input
          type="number"
          step="0.01"
          min="0"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          className="w-28 p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
        />
        <span className="text-sm sub">HTG</span>
        <button
          type="submit"
          disabled={status === "saving"}
          className="bg-haiti-turquoise text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-haiti-turquoise/80 transition-colors disabled:bg-gray-400"
        >
          {status === "saving" ? "Saving..." : "Save"}
        </button>
        {status === "saved" && <span className="text-green-600 text-sm">Saved ✓</span>}
        {status === "error" && <span className="text-red-500 text-sm">Failed to save</span>}
      </div>
    </form>
  );
}

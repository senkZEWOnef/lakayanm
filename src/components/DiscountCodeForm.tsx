"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DiscountCodeForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [kind, setKind] = useState<"percent" | "fixed">("percent");
  const [value, setValue] = useState("10");
  const [label, setLabel] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/discount-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          kind,
          value: kind === "fixed" ? Math.round(parseFloat(value) * 100) : value,
          label,
          maxUses: maxUses || undefined,
        }),
      });
      if (!res.ok) throw new Error();
      setCode("");
      setLabel("");
      setMaxUses("");
      setStatus("idle");
      router.refresh();
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card flex flex-wrap gap-3 items-end">
      <div>
        <label className="block text-xs font-medium mb-1">Code</label>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          required
          placeholder="SUMMER10"
          className="w-32 p-2 border border-gray-300 dark:border-gray-600 rounded-lg font-mono focus:ring-2 focus:ring-haiti-turquoise focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">Type</label>
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value as "percent" | "fixed")}
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg"
        >
          <option value="percent">% off</option>
          <option value="fixed">$ off</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">{kind === "percent" ? "Percent" : "Dollars off"}</label>
        <input
          type="number"
          min="0"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-24 p-2 border border-gray-300 dark:border-gray-600 rounded-lg"
        />
      </div>
      <div className="flex-1 min-w-[160px]">
        <label className="block text-xs font-medium mb-1">Label</label>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g. Summer promo"
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg"
        />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">Max uses</label>
        <input
          type="number"
          min="1"
          value={maxUses}
          onChange={(e) => setMaxUses(e.target.value)}
          placeholder="unlimited"
          className="w-24 p-2 border border-gray-300 dark:border-gray-600 rounded-lg"
        />
      </div>
      <button
        type="submit"
        disabled={status === "saving"}
        className="bg-haiti-turquoise text-white px-5 py-2 rounded-lg font-medium hover:bg-haiti-turquoise/80 transition-colors disabled:bg-gray-400"
      >
        {status === "saving" ? "Creating..." : "Create Code"}
      </button>
      {status === "error" && <p className="text-red-500 text-sm w-full">Failed to create — code may already exist.</p>}
    </form>
  );
}

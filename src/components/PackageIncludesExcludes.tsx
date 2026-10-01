"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Trip {
  id: string;
  includes: unknown;
  excludes: unknown;
}

function toLines(value: unknown): string {
  return Array.isArray(value) ? value.join("\n") : "";
}

export default function PackageIncludesExcludes({ trip }: { trip: Trip }) {
  const router = useRouter();
  const [includes, setIncludes] = useState(toLines(trip.includes));
  const [excludes, setExcludes] = useState(toLines(trip.excludes));
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch(`/api/admin/trips/${trip.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          includes: includes.split("\n").map((s) => s.trim()).filter(Boolean),
          excludes: excludes.split("\n").map((s) => s.trim()).filter(Boolean),
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
      <h2 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise">What&apos;s Included / Not Included</h2>
      <p className="text-xs sub">One item per line.</p>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium mb-1">Included</label>
          <textarea rows={6} value={includes} onChange={(e) => setIncludes(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Not included</label>
          <textarea rows={6} value={excludes} onChange={(e) => setExcludes(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm" />
        </div>
      </div>
      <button type="submit" disabled={status === "saving"} className="bg-haiti-turquoise text-white px-6 py-2.5 rounded-lg font-medium hover:bg-haiti-turquoise/80 transition-colors disabled:bg-gray-400">
        {status === "saving" ? "Saving..." : "Save"}
      </button>
      {status === "saved" && <span className="text-green-600 text-sm ml-3">Saved ✓</span>}
      {status === "error" && <span className="text-red-500 text-sm ml-3">Failed to save</span>}
    </form>
  );
}

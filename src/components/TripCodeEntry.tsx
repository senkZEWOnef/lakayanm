"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TripCodeEntry() {
  const router = useRouter();
  const [code, setCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    router.push(`/my-trip/${encodeURIComponent(code.trim().toUpperCase())}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="e.g. LKYM-7F3K"
        className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600 text-center sm:text-left font-mono tracking-wider uppercase"
      />
      <button type="submit" className="bg-haiti-turquoise text-white px-6 py-3 rounded-lg font-medium hover:bg-haiti-turquoise/80 transition-colors">
        View My Trip
      </button>
    </form>
  );
}

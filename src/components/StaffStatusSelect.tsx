"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["new", "confirmed", "completed", "cancelled"];

export default function StaffStatusSelect({ reservationId, status }: { reservationId: string; status: string }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const update = async (value: string) => {
    setSaving(true);
    try {
      await fetch(`/api/admin/reservations/${reservationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: value }),
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <select
      value={status}
      disabled={saving}
      onChange={(e) => update(e.target.value)}
      className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg capitalize"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}

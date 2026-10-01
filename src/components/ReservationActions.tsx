"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Employee {
  id: string;
  name: string;
}

interface ReservationActionsProps {
  reservationId: string;
  status: string;
  assignedEmployeeId: string | null;
  employees: Employee[];
  paymentStatus: string;
  depositDueCents: number | null;
  currency: string;
}

const STATUSES = ["new", "confirmed", "completed", "cancelled"];

export default function ReservationActions({
  reservationId,
  status,
  assignedEmployeeId,
  employees,
  paymentStatus,
  depositDueCents,
  currency,
}: ReservationActionsProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const update = async (data: Record<string, unknown>) => {
    setSaving(true);
    try {
      await fetch(`/api/admin/reservations/${reservationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const paymentLink = typeof window !== "undefined" ? `${window.location.origin}/pay/${reservationId}` : `/pay/${reservationId}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(paymentLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable — the "View Payment Page" link below still works
    }
  };

  return (
    <div className="card space-y-4">
      <h3 className="font-bold text-haiti-navy dark:text-haiti-turquoise">Manage</h3>

      <div>
        <label className="block text-xs font-medium mb-1">Status</label>
        <select
          value={status}
          disabled={saving}
          onChange={(e) => update({ status: e.target.value })}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm capitalize"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1">Assigned employee</label>
        <select
          value={assignedEmployeeId || ""}
          disabled={saving}
          onChange={(e) => update({ assignedEmployeeId: e.target.value || null })}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
        >
          <option value="">Unassigned</option>
          {employees.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>
      </div>

      {paymentStatus !== "paid_in_full" && depositDueCents != null && (
        <div>
          <label className="block text-xs font-medium mb-1">
            {paymentStatus === "unpaid" ? "Deposit due" : "Balance remaining"}:{" "}
            {new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(depositDueCents / 100)}
          </label>
          <div className="flex gap-2">
            <button
              onClick={copyLink}
              className="flex-1 bg-haiti-turquoise text-white py-2.5 rounded-lg text-sm font-medium hover:bg-haiti-turquoise/80 transition-colors"
            >
              {copied ? "Copied ✓" : "Copy Payment Link"}
            </button>
            <a
              href={`/pay/${reservationId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              View
            </a>
          </div>
          <p className="text-xs sub mt-1">
            Send this to {`the traveler`} — they pick their own currency and method (card, PayPal, MonCash, or ATH Móvil).
          </p>
        </div>
      )}
    </div>
  );
}

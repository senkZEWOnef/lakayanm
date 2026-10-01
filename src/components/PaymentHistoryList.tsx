"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Payment {
  id: string;
  kind: string;
  method: string;
  amount_cents: number;
  currency: string;
  status: string;
  created_at: string | Date;
}

function formatCurrency(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(cents / 100);
}

export default function PaymentHistoryList({ payments }: { payments: Payment[] }) {
  const router = useRouter();
  const [markingId, setMarkingId] = useState<string | null>(null);

  const markReceived = async (id: string) => {
    if (!confirm("Confirm you've actually received this cash payment?")) return;
    setMarkingId(id);
    try {
      await fetch(`/api/admin/payments/${id}/mark-received`, { method: "POST" });
      router.refresh();
    } finally {
      setMarkingId(null);
    }
  };

  if (payments.length === 0) {
    return <p className="sub text-sm">No payments yet.</p>;
  }

  return (
    <div className="space-y-2">
      {payments.map((p) => (
        <div key={p.id} className="flex items-center justify-between text-sm border-b border-gray-100 dark:border-gray-800 pb-2 gap-2 flex-wrap">
          <span className="capitalize">
            {p.kind} <span className="sub">· {p.method}</span>
          </span>
          <span>{formatCurrency(p.amount_cents, p.currency)}</span>
          <span className="capitalize sub">{p.status}</span>
          <span className="sub">{new Date(p.created_at).toLocaleDateString()}</span>
          {p.method === "cash" && p.status === "pending" && (
            <button
              onClick={() => markReceived(p.id)}
              disabled={markingId === p.id}
              className="text-xs px-2 py-1 rounded-lg border border-haiti-emerald text-haiti-emerald hover:bg-haiti-emerald/10 transition-colors disabled:opacity-40"
            >
              {markingId === p.id ? "Marking..." : "Mark Received"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

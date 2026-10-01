"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Employee {
  id: string;
  name: string;
  role: string;
  phone: string | null;
  email: string | null;
  photo_url: string | null;
  is_active: boolean;
  user_id: string | null;
  assignments: { trip: { title: string } }[];
}

export default function EmployeeList({ employees }: { employees: Employee[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null);

  const grantLogin = async (id: string) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/employees/${id}/grant-login`, { method: "POST" });
      const data = await res.json();
      if (data.ok) {
        setCredentials({ email: data.email, password: data.password });
        router.refresh();
      } else {
        alert(data.error || "Failed to grant login");
      }
    } finally {
      setBusyId(null);
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    setBusyId(id);
    try {
      await fetch(`/api/admin/employees/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  };

  if (employees.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="sub">No employees yet.</p>
      </div>
    );
  }

  return (
    <>
      {credentials && (
        <div className="card border-green-500/30 bg-green-500/5 mb-4">
          <p className="font-medium text-green-700 dark:text-green-400 mb-1">Login created — copy this now, it won&apos;t be shown again:</p>
          <p className="font-mono text-sm">
            {credentials.email} / {credentials.password}
          </p>
          <button onClick={() => setCredentials(null)} className="text-xs text-green-700 dark:text-green-400 mt-2 underline">
            Dismiss
          </button>
        </div>
      )}

      <div className="space-y-3">
        {employees.map((e) => (
          <div key={e.id} className="card flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              {e.photo_url ? (
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                  <Image src={e.photo_url} alt={e.name} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-haiti-turquoise/20 flex items-center justify-center text-haiti-turquoise font-bold shrink-0">
                  {e.name.charAt(0)}
                </div>
              )}
              <div>
                <p className="font-bold text-haiti-navy dark:text-haiti-turquoise">
                  {e.name} <span className="text-xs sub capitalize">· {e.role}</span>
                </p>
                <p className="text-xs sub">
                  {e.email || "no email"} {e.phone ? `· ${e.phone}` : ""}
                </p>
                {e.assignments.length > 0 && (
                  <p className="text-xs sub mt-1">Assigned: {e.assignments.map((a) => a.trip.title).join(", ")}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {e.user_id ? (
                <span className="text-xs px-3 py-1 rounded-full bg-green-500/10 text-green-600 font-medium">Has login</span>
              ) : (
                <button
                  onClick={() => grantLogin(e.id)}
                  disabled={busyId === e.id || !e.email}
                  className="text-xs px-3 py-1.5 rounded-lg border border-haiti-turquoise text-haiti-turquoise hover:bg-haiti-turquoise/10 disabled:opacity-40"
                >
                  Grant login
                </button>
              )}
              <button
                onClick={() => toggleActive(e.id, !e.is_active)}
                disabled={busyId === e.id}
                className={`text-xs px-3 py-1.5 rounded-lg border ${e.is_active ? "border-red-400 text-red-500 hover:bg-red-50" : "border-gray-300 text-gray-500"}`}
              >
                {e.is_active ? "Deactivate" : "Reactivate"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

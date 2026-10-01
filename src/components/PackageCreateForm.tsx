"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Department {
  id: string;
  name: string;
}

export default function PackageCreateForm({ departments }: { departments: Department[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || "");
  const [durationDays, setDurationDays] = useState("1");
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, departmentId, durationDays }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      router.push(`/admin/packages/${data.trip.id}`);
    } catch {
      setStatus("error");
    }
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="bg-haiti-turquoise text-white px-6 py-3 rounded-lg font-medium hover:bg-haiti-turquoise/80 transition-colors">
        + New Package
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card flex flex-wrap gap-3 items-end">
      <div className="flex-1 min-w-[200px]">
        <label className="block text-xs font-medium mb-1">Title</label>
        <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Jacmel Weekend" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg" />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">Department</label>
        <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg">
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">Days</label>
        <input type="number" min="1" value={durationDays} onChange={(e) => setDurationDays(e.target.value)} className="w-20 p-2 border border-gray-300 dark:border-gray-600 rounded-lg" />
      </div>
      <button type="submit" disabled={status === "saving"} className="bg-haiti-turquoise text-white px-5 py-2 rounded-lg font-medium disabled:bg-gray-400">
        {status === "saving" ? "Creating..." : "Create & Edit"}
      </button>
      <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-sm text-gray-500">
        Cancel
      </button>
      {status === "error" && <p className="text-red-500 text-sm w-full">Something went wrong.</p>}
    </form>
  );
}

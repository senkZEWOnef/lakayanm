"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Day {
  id: string;
  day_number: number;
  title: string;
  description: string;
}

export default function PackageDaysEditor({ tripId, days }: { tripId: string; days: Day[] }) {
  const router = useRouter();
  const [dayNumber, setDayNumber] = useState(String(days.length + 1));
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const addDay = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch(`/api/admin/trips/${tripId}/days`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dayNumber, title, description }),
      });
      if (!res.ok) throw new Error();
      setTitle("");
      setDescription("");
      setDayNumber(String(days.length + 2));
      setStatus("idle");
      router.refresh();
    } catch {
      setStatus("error");
    }
  };

  const removeDay = async (id: string) => {
    setDeletingId(id);
    try {
      await fetch(`/api/admin/trips/${tripId}/days/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="card space-y-4">
      <h2 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise">Day-by-Day Itinerary</h2>

      {days.length > 0 && (
        <div className="space-y-2">
          {days.map((d) => (
            <div key={d.id} className="flex items-start gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
              <div className="w-8 h-8 shrink-0 bg-haiti-amber/10 text-haiti-amber rounded-full flex items-center justify-center font-bold text-sm">
                {d.day_number}
              </div>
              <div className="flex-1">
                <p className="font-medium">{d.title}</p>
                <p className="text-sm sub">{d.description}</p>
              </div>
              <button onClick={() => removeDay(d.id)} disabled={deletingId === d.id} className="text-xs text-red-500 hover:text-red-600 shrink-0">
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={addDay} className="grid md:grid-cols-4 gap-3 items-end pt-2">
        <div>
          <label className="block text-xs font-medium mb-1">Day #</label>
          <input type="number" min="1" required value={dayNumber} onChange={(e) => setDayNumber(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg" />
        </div>
        <div className="md:col-span-1">
          <label className="block text-xs font-medium mb-1">Title</label>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg" />
        </div>
        <div className="md:col-span-1">
          <label className="block text-xs font-medium mb-1">Description</label>
          <input required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg" />
        </div>
        <button type="submit" disabled={status === "saving"} className="bg-haiti-turquoise text-white px-4 py-2 rounded-lg font-medium disabled:bg-gray-400">
          {status === "saving" ? "Adding..." : "Add / Update Day"}
        </button>
      </form>
      {status === "error" && <p className="text-red-500 text-sm">Failed to save that day.</p>}
    </div>
  );
}

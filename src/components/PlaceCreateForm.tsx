"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface City {
  id: string;
  name: string;
}
interface Department {
  id: string;
  name: string;
  cities: City[];
}

const KINDS: { value: string; label: string }[] = [
  { value: "hotel", label: "Hotel / Airbnb" },
  { value: "restaurant", label: "Restaurant" },
  { value: "shop", label: "Shop" },
  { value: "tour", label: "Tour" },
  { value: "activity", label: "Activity" },
  { value: "event", label: "Event" },
  { value: "beach", label: "Beach" },
  { value: "landmark", label: "Landmark" },
];

export default function PlaceCreateForm({ departments }: { departments: Department[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [kind, setKind] = useState(KINDS[0].value);
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || "");
  const [cityId, setCityId] = useState(departments[0]?.cities[0]?.id || "");
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");

  const cities = departments.find((d) => d.id === departmentId)?.cities || [];

  const handleDepartmentChange = (id: string) => {
    setDepartmentId(id);
    const dept = departments.find((d) => d.id === id);
    setCityId(dept?.cities[0]?.id || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityId) {
      setStatus("error");
      return;
    }
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, kind, cityId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      router.push(`/admin/places/${data.place.id}`);
    } catch {
      setStatus("error");
    }
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="bg-haiti-turquoise text-white px-6 py-3 rounded-lg font-medium hover:bg-haiti-turquoise/80 transition-colors">
        + Add Business
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card flex flex-wrap gap-3 items-end">
      <div className="flex-1 min-w-[180px]">
        <label className="block text-xs font-medium mb-1">Name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Hotel Roi Christophe"
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg"
        />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">Type</label>
        <select value={kind} onChange={(e) => setKind(e.target.value)} className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg">
          {KINDS.map((k) => (
            <option key={k.value} value={k.value}>
              {k.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">Department</label>
        <select value={departmentId} onChange={(e) => handleDepartmentChange(e.target.value)} className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg">
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">City</label>
        <select value={cityId} onChange={(e) => setCityId(e.target.value)} className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg">
          {cities.length === 0 && <option value="">No cities</option>}
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" disabled={status === "saving"} className="bg-haiti-turquoise text-white px-5 py-2 rounded-lg font-medium disabled:bg-gray-400">
        {status === "saving" ? "Creating..." : "Create & Edit"}
      </button>
      <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-sm text-gray-500">
        Cancel
      </button>
      {status === "error" && <p className="text-red-500 text-sm w-full">Something went wrong — make sure a city is selected.</p>}
    </form>
  );
}

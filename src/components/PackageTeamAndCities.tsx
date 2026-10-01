"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Item {
  id: string;
  name: string;
}

interface PackageTeamAndCitiesProps {
  tripId: string;
  cities: Item[];
  employees: Item[];
  selectedCityIds: string[];
  selectedEmployeeIds: string[];
}

export default function PackageTeamAndCities({ tripId, cities, employees, selectedCityIds, selectedEmployeeIds }: PackageTeamAndCitiesProps) {
  const router = useRouter();
  const [cityIds, setCityIds] = useState<string[]>(selectedCityIds);
  const [employeeIds, setEmployeeIds] = useState<string[]>(selectedEmployeeIds);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const toggle = (list: string[], setList: (v: string[]) => void, id: string) => {
    setList(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  };

  const save = async () => {
    setStatus("saving");
    try {
      await Promise.all([
        fetch(`/api/admin/trips/${tripId}/cities`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cityIds }),
        }),
        fetch(`/api/admin/trips/${tripId}/assignments`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ employeeIds }),
        }),
      ]);
      setStatus("saved");
      router.refresh();
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="card space-y-4">
      <h2 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise">Cities & Team</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-medium mb-2">Cities this trip visits</p>
          {cities.length === 0 ? (
            <p className="text-sm sub">No cities in this department yet.</p>
          ) : (
            <div className="space-y-1">
              {cities.map((c) => (
                <label key={c.id} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={cityIds.includes(c.id)} onChange={() => toggle(cityIds, setCityIds, c.id)} />
                  {c.name}
                </label>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-medium mb-2">Assigned team (guides, drivers...)</p>
          {employees.length === 0 ? (
            <p className="text-sm sub">
              No employees yet — add some on the Employees page.
            </p>
          ) : (
            <div className="space-y-1">
              {employees.map((e) => (
                <label key={e.id} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={employeeIds.includes(e.id)} onChange={() => toggle(employeeIds, setEmployeeIds, e.id)} />
                  {e.name}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      <button onClick={save} disabled={status === "saving"} className="bg-haiti-turquoise text-white px-6 py-2.5 rounded-lg font-medium hover:bg-haiti-turquoise/80 transition-colors disabled:bg-gray-400">
        {status === "saving" ? "Saving..." : "Save"}
      </button>
      {status === "saved" && <span className="text-green-600 text-sm ml-3">Saved ✓</span>}
      {status === "error" && <span className="text-red-500 text-sm ml-3">Failed to save</span>}
    </div>
  );
}

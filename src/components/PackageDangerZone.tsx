"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PackageDangerZone({ tripId }: { tripId: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!confirm("Delete this package permanently? This cannot be undone.")) return;
    setDeleting(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/trips/${tripId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      router.push("/admin/packages");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
      setDeleting(false);
    }
  };

  return (
    <div className="card border-red-500/30">
      <h2 className="text-lg font-bold text-red-500 mb-2">Danger Zone</h2>
      <p className="text-sm sub mb-3">Deleting a package removes its itinerary and links. Packages with reservations can&apos;t be deleted.</p>
      <button onClick={handleDelete} disabled={deleting} className="text-sm px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 disabled:opacity-50">
        {deleting ? "Deleting..." : "Delete Package"}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}

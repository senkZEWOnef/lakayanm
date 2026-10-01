"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface GalleryItem {
  id: string;
  media_type: string;
  url: string;
  caption: string | null;
  location: string | null;
}

export default function AdminGalleryList({ items }: { items: GalleryItem[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this from the gallery?")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  };

  if (items.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="sub">Nothing in the gallery yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item) => (
        <div key={item.id} className="card p-3 space-y-2">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
            {item.media_type === "photo" && <Image src={item.url} alt={item.caption || ""} fill className="object-cover" />}
            {item.media_type === "video" && <video src={item.url} className="w-full h-full object-cover" muted />}
            {item.media_type === "youtube" && (
              <div className="w-full h-full flex items-center justify-center text-4xl">▶️</div>
            )}
          </div>
          <p className="text-xs font-medium line-clamp-1">{item.caption || "Untitled"}</p>
          <button
            onClick={() => handleDelete(item.id)}
            disabled={deletingId === item.id}
            className="w-full text-xs text-red-500 hover:text-red-600 py-1 border border-red-500/30 rounded-lg"
          >
            {deletingId === item.id ? "Removing..." : "Remove"}
          </button>
        </div>
      ))}
    </div>
  );
}

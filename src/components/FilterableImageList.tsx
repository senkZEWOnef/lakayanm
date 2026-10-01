"use client";

import { useMemo, useState } from "react";
import ImageSlotEditor from "@/components/ImageSlotEditor";

interface Item {
  id: string;
  name: string;
  hero_url: string | null;
}

export default function FilterableImageList({ items, endpointBase }: { items: Item[]; endpointBase: string }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return items;
    return items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));
  }, [items, search]);

  const save = async (id: string, url: string) => {
    await fetch(`${endpointBase}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ heroUrl: url }),
    });
  };

  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        className="w-full p-2 mb-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
      />
      <div className="max-h-96 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
        {filtered.map((item) => (
          <ImageSlotEditor key={item.id} label={item.name} currentUrl={item.hero_url} onSave={(url) => save(item.id, url)} />
        ))}
      </div>
    </div>
  );
}

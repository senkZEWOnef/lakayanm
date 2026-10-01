"use client";

import ImageSlotEditor from "@/components/ImageSlotEditor";

const SLOTS = [
  { key: "home_hero_1", label: "Home hero photo 1" },
  { key: "home_hero_2", label: "Home hero photo 2" },
  { key: "home_hero_3", label: "Home hero photo 3" },
  { key: "home_hero_4", label: "Home hero photo 4" },
  { key: "home_hero_5", label: "Home hero photo 5" },
];

export default function HomeHeroEditor({ current }: { current: Record<string, string> }) {
  const save = async (key: string, url: string) => {
    await fetch("/api/admin/site-images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, url }),
    });
  };

  return (
    <div className="divide-y divide-gray-100 dark:divide-gray-800">
      {SLOTS.map((slot) => (
        <ImageSlotEditor key={slot.key} label={slot.label} currentUrl={current[slot.key] || null} onSave={(url) => save(slot.key, url)} />
      ))}
    </div>
  );
}

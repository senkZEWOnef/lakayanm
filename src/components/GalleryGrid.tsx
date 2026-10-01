"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type MediaType = "photo" | "video" | "youtube";

interface GalleryItem {
  id: string;
  media_type: MediaType;
  url: string;
  thumbnail_url: string | null;
  caption: string | null;
  location: string | null;
  credit: string | null;
}

interface GalleryGridProps {
  items: GalleryItem[];
}

function youtubeId(url: string) {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  return match ? match[1] : null;
}

const FILTERS: { key: "all" | MediaType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "photo", label: "📷 Photos" },
  { key: "video", label: "🎬 Videos" },
  { key: "youtube", label: "▶️ YouTube" },
];

export default function GalleryGrid({ items }: GalleryGridProps) {
  const [filter, setFilter] = useState<"all" | MediaType>("all");
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((item) => item.media_type === filter);
  }, [items, filter]);

  const counts = useMemo(() => {
    return {
      all: items.length,
      photo: items.filter((i) => i.media_type === "photo").length,
      video: items.filter((i) => i.media_type === "video").length,
      youtube: items.filter((i) => i.media_type === "youtube").length,
    };
  }, [items]);

  return (
    <div className="space-y-6">
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
              filter === f.key
                ? "bg-haiti-turquoise text-white"
                : "bg-slate-800/60 text-white/70 hover:bg-slate-800/90"
            }`}
          >
            {f.label} ({counts[f.key]})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-white/20 rounded-2xl">
          <div className="text-4xl mb-3">📸</div>
          <p className="text-white/70">No {filter === "all" ? "media" : filter} yet — check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="group">
              {item.media_type === "photo" && (
                <button
                  onClick={() => setLightbox(item)}
                  className="relative aspect-square w-full overflow-hidden rounded-xl block"
                >
                  <Image
                    src={item.url}
                    alt={item.caption || "Haiti"}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </button>
              )}

              {item.media_type === "video" && (
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
                  <video src={item.url} controls poster={item.thumbnail_url || undefined} className="w-full h-full object-cover" />
                </div>
              )}

              {item.media_type === "youtube" && youtubeId(item.url) && (
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId(item.url)}`}
                    title={item.caption || "YouTube video"}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              )}

              {(item.caption || item.location) && (
                <div className="mt-2">
                  {item.caption && <p className="text-white text-sm font-medium line-clamp-1">{item.caption}</p>}
                  {item.location && <p className="text-white/50 text-xs">📍 {item.location}</p>}
                  {item.credit && <p className="text-white/40 text-xs">{item.credit}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox for photos */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="relative w-full max-w-4xl h-[80vh]">
            <Image src={lightbox.url} alt={lightbox.caption || "Haiti"} fill className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}

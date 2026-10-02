"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type PlaceKind = "restaurant" | "hotel" | "beach" | "landmark" | "shop" | "tour" | "activity" | "event";

interface DiscoverPlace {
  id: string;
  slug: string;
  kind: PlaceKind;
  name: string;
  description: string | null;
  cover_url: string | null;
  price_range: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  booking_url: string | null;
  is_featured: boolean;
  citySlug: string;
  cityName: string;
  departmentSlug: string;
  departmentName: string;
}

interface DepartmentOption {
  slug: string;
  name: string;
  cities: { slug: string; name: string }[];
}

const KIND_META: Record<PlaceKind, { label: string; emoji: string }> = {
  hotel: { label: "Hotels & Stays", emoji: "🏨" },
  restaurant: { label: "Restaurants", emoji: "🍽️" },
  shop: { label: "Shops", emoji: "🛍️" },
  tour: { label: "Tours", emoji: "🧭" },
  activity: { label: "Activities", emoji: "🎯" },
  event: { label: "Events", emoji: "🎉" },
  beach: { label: "Beaches", emoji: "🏖️" },
  landmark: { label: "Landmarks", emoji: "🏛️" },
};

const KIND_ORDER: PlaceKind[] = ["hotel", "restaurant", "shop", "tour", "activity", "event", "beach", "landmark"];

function placeHref(place: DiscoverPlace) {
  const base = `/dept/${place.departmentSlug}/city/${place.citySlug}`;
  if (place.kind === "restaurant") return `${base}/restaurants/${place.slug}`;
  if (place.kind === "hotel") return `${base}/rentals/${place.slug}`;
  if (place.kind === "landmark") return `${base}/landmarks/${place.slug}`;
  return base;
}

export default function DiscoverGrid({ places, departments }: { places: DiscoverPlace[]; departments: DepartmentOption[] }) {
  const [deptFilter, setDeptFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [kindFilter, setKindFilter] = useState<"all" | PlaceKind>("all");
  const [search, setSearch] = useState("");

  const cityOptions = useMemo(() => {
    if (deptFilter === "all") {
      return departments.flatMap((d) => d.cities.map((c) => ({ ...c, departmentSlug: d.slug })));
    }
    const dept = departments.find((d) => d.slug === deptFilter);
    return dept ? dept.cities.map((c) => ({ ...c, departmentSlug: dept.slug })) : [];
  }, [departments, deptFilter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: places.length };
    for (const kind of KIND_ORDER) c[kind] = places.filter((p) => p.kind === kind).length;
    return c;
  }, [places]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return places.filter((p) => {
      if (deptFilter !== "all" && p.departmentSlug !== deptFilter) return false;
      if (cityFilter !== "all" && p.citySlug !== cityFilter) return false;
      if (kindFilter !== "all" && p.kind !== kindFilter) return false;
      if (q && !p.name.toLowerCase().includes(q) && !(p.description ?? "").toLowerCase().includes(q)) return false;
      return true;
    });
  }, [places, deptFilter, cityFilter, kindFilter, search]);

  return (
    <div className="space-y-6">
      {/* Department / City / Search */}
      <div className="grid sm:grid-cols-3 gap-3">
        <select
          value={deptFilter}
          onChange={(e) => {
            setDeptFilter(e.target.value);
            setCityFilter("all");
          }}
          className="p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-slate-800/90 text-sm"
        >
          <option value="all">All Departments</option>
          {departments.map((d) => (
            <option key={d.slug} value={d.slug}>
              {d.name}
            </option>
          ))}
        </select>

        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-slate-800/90 text-sm"
        >
          <option value="all">All Cities</option>
          {cityOptions.map((c) => (
            <option key={`${c.departmentSlug}-${c.slug}`} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name..."
          className="p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-slate-800/90 text-sm"
        />
      </div>

      {/* Type pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setKindFilter("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
            kindFilter === "all" ? "bg-haiti-turquoise text-white" : "bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300"
          }`}
        >
          All ({counts.all})
        </button>
        {KIND_ORDER.map((kind) => (
          <button
            key={kind}
            onClick={() => setKindFilter(kind)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
              kindFilter === kind ? "bg-haiti-turquoise text-white" : "bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300"
            }`}
          >
            {KIND_META[kind].emoji} {KIND_META[kind].label} ({counts[kind]})
          </button>
        ))}
      </div>

      <p className="text-white/70 text-sm">{filtered.length} result{filtered.length === 1 ? "" : "s"}</p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="card text-center py-14">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-2">Nothing here yet</h3>
          <p className="sub">
            {places.length === 0
              ? "We're still adding hotels, restaurants, and local businesses. Check back soon!"
              : "Try a different department, city, or type."}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((place) => (
            <Link
              key={place.id}
              href={placeHref(place)}
              className="card hover:shadow-xl transition-all duration-300 group cursor-pointer border-l-4 border-haiti-turquoise"
            >
              <div className="relative w-full h-48 mb-4 overflow-hidden rounded-xl bg-haiti-navy/10">
                {place.cover_url ? (
                  <Image
                    src={place.cover_url}
                    alt={place.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-5xl">{KIND_META[place.kind].emoji}</div>
                )}
                {place.is_featured && (
                  <div className="absolute top-3 right-3 bg-haiti-coral text-white text-xs px-2 py-1 rounded-full font-medium">
                    Featured
                  </div>
                )}
                <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                  {KIND_META[place.kind].emoji} {KIND_META[place.kind].label.replace(/s$/, "")}
                </div>
              </div>

              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-bold text-lg text-haiti-navy dark:text-haiti-turquoise">{place.name}</h3>
                {place.price_range && <span className="text-sm font-bold text-haiti-turquoise shrink-0">{place.price_range}</span>}
              </div>
              <p className="text-xs sub mb-3">
                {place.cityName}, {place.departmentName}
              </p>

              {place.description && <p className="sub text-sm line-clamp-2 mb-3">{place.description}</p>}

              <div className="flex items-center gap-3 text-xs pt-3 border-t border-gray-200 dark:border-gray-700">
                {place.booking_url && <span className="text-haiti-teal">📞 Booking</span>}
                {place.website && <span className="text-haiti-sage">🌐 Website</span>}
                {place.phone && <span className="text-haiti-amber">📱 Call</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

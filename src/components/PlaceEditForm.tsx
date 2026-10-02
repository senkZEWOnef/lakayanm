"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCloudinaryUpload, cloudinaryConfigured } from "@/lib/useCloudinaryUpload";

interface City {
  id: string;
  name: string;
}
interface Department {
  id: string;
  name: string;
  cities: City[];
}

interface Place {
  id: string;
  name: string;
  kind: string;
  city_id: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  booking_url: string | null;
  price_range: string | null;
  cover_url: string | null;
  is_featured: boolean;
  is_published: boolean;
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

export default function PlaceEditForm({ place, departments }: { place: Place; departments: Department[] }) {
  const router = useRouter();
  const { upload, progress, uploading } = useCloudinaryUpload();

  const initialDept = departments.find((d) => d.cities.some((c) => c.id === place.city_id)) || departments[0];

  const [name, setName] = useState(place.name);
  const [kind, setKind] = useState(place.kind);
  const [departmentId, setDepartmentId] = useState(initialDept?.id || "");
  const [cityId, setCityId] = useState(place.city_id);
  const [description, setDescription] = useState(place.description || "");
  const [address, setAddress] = useState(place.address || "");
  const [phone, setPhone] = useState(place.phone || "");
  const [website, setWebsite] = useState(place.website || "");
  const [bookingUrl, setBookingUrl] = useState(place.booking_url || "");
  const [priceRange, setPriceRange] = useState(place.price_range || "");
  const [coverUrl, setCoverUrl] = useState(place.cover_url || "");
  const [isFeatured, setIsFeatured] = useState(place.is_featured);
  const [isPublished, setIsPublished] = useState(place.is_published);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const cities = departments.find((d) => d.id === departmentId)?.cities || [];

  const handleDepartmentChange = (id: string) => {
    setDepartmentId(id);
    const dept = departments.find((d) => d.id === id);
    setCityId(dept?.cities[0]?.id || "");
  };

  const handleFile = async (file: File) => {
    if (!cloudinaryConfigured) return;
    const result = await upload(file);
    setCoverUrl(result.secure_url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch(`/api/admin/places/${place.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          kind,
          cityId,
          description,
          address,
          phone,
          website,
          bookingUrl,
          priceRange,
          coverUrl,
          isFeatured,
          isPublished,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("saved");
      router.refresh();
    } catch {
      setStatus("error");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this business permanently? This cannot be undone.")) return;
    setDeleting(true);
    setDeleteError("");
    try {
      const res = await fetch(`/api/admin/places/${place.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      router.push("/admin/places");
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete");
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="card space-y-4">
        <h2 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise">Details</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium mb-1">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg" />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Type</label>
            <select value={kind} onChange={(e) => setKind(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg">
              {KINDS.map((k) => (
                <option key={k.value} value={k.value}>
                  {k.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Price range</label>
            <input
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              placeholder="$, $$, or $$$"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Department</label>
            <select value={departmentId} onChange={(e) => handleDepartmentChange(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg">
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">City</label>
            <select value={cityId} onChange={(e) => setCityId(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg">
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium mb-1">Description</label>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium mb-1">Address</label>
            <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg" />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Phone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Website</label>
            <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium mb-1">Booking link (optional)</label>
            <input
              value={bookingUrl}
              onChange={(e) => setBookingUrl(e.target.value)}
              placeholder="https://... (Booking.com, Airbnb, WhatsApp, etc.)"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium mb-1">Cover photo</label>
            <div className="flex items-center gap-4">
              {coverUrl && (
                <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0">
                  <Image src={coverUrl} alt="Cover" fill className="object-cover" />
                </div>
              )}
              <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} className="text-sm" />
            </div>
            {uploading && <p className="text-xs sub mt-1">Uploading... {progress}%</p>}
            {!cloudinaryConfigured && <p className="text-xs sub mt-1">Cloudinary isn&apos;t configured yet — paste a URL isn&apos;t supported here, upload needs it set up.</p>}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
            Published (visible on /discover)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
            Featured
          </label>
        </div>

        <button type="submit" disabled={status === "saving"} className="bg-haiti-turquoise text-white px-6 py-2.5 rounded-lg font-medium hover:bg-haiti-turquoise/80 transition-colors disabled:bg-gray-400">
          {status === "saving" ? "Saving..." : "Save Details"}
        </button>
        {status === "saved" && <span className="text-green-600 text-sm ml-3">Saved ✓</span>}
        {status === "error" && <span className="text-red-500 text-sm ml-3">Failed to save</span>}
      </form>

      <div className="card border-red-500/30">
        <h2 className="text-lg font-bold text-red-500 mb-2">Danger Zone</h2>
        <p className="text-sm sub mb-3">Deleting a business removes it from Discover permanently.</p>
        <button onClick={handleDelete} disabled={deleting} className="text-sm px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 disabled:opacity-50">
          {deleting ? "Deleting..." : "Delete Business"}
        </button>
        {deleteError && <p className="text-red-500 text-sm mt-2">{deleteError}</p>}
      </div>
    </div>
  );
}

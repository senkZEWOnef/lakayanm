"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCloudinaryUpload, cloudinaryConfigured } from "@/lib/useCloudinaryUpload";

interface Trip {
  id: string;
  title: string;
  tagline: string | null;
  summary: string | null;
  category: string | null;
  hero_url: string | null;
  video_url: string | null;
  duration_days: number;
  department_id: string;
  is_published: boolean;
  is_featured: boolean;
}

interface Department {
  id: string;
  name: string;
}

export default function PackageDetailsForm({ trip, departments }: { trip: Trip; departments: Department[] }) {
  const router = useRouter();
  const { upload, progress, uploading } = useCloudinaryUpload();
  const [title, setTitle] = useState(trip.title);
  const [tagline, setTagline] = useState(trip.tagline || "");
  const [summary, setSummary] = useState(trip.summary || "");
  const [category, setCategory] = useState(trip.category || "");
  const [heroUrl, setHeroUrl] = useState(trip.hero_url || "");
  const [videoUrl, setVideoUrl] = useState(trip.video_url || "");
  const [durationDays, setDurationDays] = useState(String(trip.duration_days));
  const [departmentId, setDepartmentId] = useState(trip.department_id);
  const [isPublished, setIsPublished] = useState(trip.is_published);
  const [isFeatured, setIsFeatured] = useState(trip.is_featured);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const handleFile = async (file: File) => {
    if (!cloudinaryConfigured) return;
    const result = await upload(file);
    setHeroUrl(result.secure_url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch(`/api/admin/trips/${trip.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          tagline,
          summary,
          category,
          heroUrl,
          videoUrl,
          durationDays,
          departmentId,
          isPublished,
          isFeatured,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("saved");
      router.refresh();
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h2 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise">Details</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-medium mb-1">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium mb-1">Tagline</label>
          <input value={tagline} onChange={(e) => setTagline(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium mb-1">Summary</label>
          <textarea rows={3} value={summary} onChange={(e) => setSummary(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg" />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">Category</label>
          <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="history, beach, culture..." className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Duration (days)</label>
          <input type="number" min="1" value={durationDays} onChange={(e) => setDurationDays(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg" />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">Department</label>
          <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg">
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Video URL (optional)</label>
          <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://..." className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-medium mb-1">Hero image</label>
          <div className="flex items-center gap-4">
            {heroUrl && (
              <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0">
                <Image src={heroUrl} alt="Hero" fill className="object-cover" />
              </div>
            )}
            <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} className="text-sm" />
          </div>
          {uploading && <p className="text-xs sub mt-1">Uploading... {progress}%</p>}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
          Published (visible on /trips)
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
  );
}

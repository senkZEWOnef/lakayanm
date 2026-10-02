"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCloudinaryUpload, cloudinaryConfigured } from "@/lib/useCloudinaryUpload";

interface Day {
  id: string;
  day_number: number;
  title: string;
  description: string;
  location: string | null;
  start_time: string | null;
  meal_info: string | null;
  photos: unknown;
}

function dayPhotos(photos: unknown): string[] {
  return Array.isArray(photos) ? (photos as string[]) : [];
}

export default function PackageDaysEditor({ tripId, days }: { tripId: string; days: Day[] }) {
  const router = useRouter();
  const { upload, progress, uploading } = useCloudinaryUpload();

  const [dayNumber, setDayNumber] = useState(String(days.length + 1));
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [mealInfo, setMealInfo] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);

  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const resetForm = (nextDayNumber: number) => {
    setDayNumber(String(nextDayNumber));
    setTitle("");
    setDescription("");
    setLocation("");
    setStartTime("");
    setMealInfo("");
    setPhotos([]);
  };

  const editDay = (d: Day) => {
    setDayNumber(String(d.day_number));
    setTitle(d.title);
    setDescription(d.description);
    setLocation(d.location || "");
    setStartTime(d.start_time || "");
    setMealInfo(d.meal_info || "");
    setPhotos(dayPhotos(d.photos));
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const handlePhotoUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!cloudinaryConfigured) return;
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const result = await upload(file);
      uploaded.push(result.secure_url);
    }
    setPhotos((prev) => [...prev, ...uploaded]);
  };

  const removePhoto = (url: string) => {
    setPhotos((prev) => prev.filter((p) => p !== url));
  };

  const addDay = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch(`/api/admin/trips/${tripId}/days`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dayNumber, title, description, location, startTime, mealInfo, photos }),
      });
      if (!res.ok) throw new Error();
      resetForm(days.length + 2);
      setStatus("idle");
      router.refresh();
    } catch {
      setStatus("error");
    }
  };

  const removeDay = async (id: string) => {
    setDeletingId(id);
    try {
      await fetch(`/api/admin/trips/${tripId}/days/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="card space-y-4">
      <h2 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise">Day-by-Day Itinerary</h2>

      {days.length > 0 && (
        <div className="space-y-3">
          {days.map((d) => (
            <div key={d.id} className="flex items-start gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
              <div className="w-8 h-8 shrink-0 bg-haiti-amber/10 text-haiti-amber rounded-full flex items-center justify-center font-bold text-sm">
                {d.day_number}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{d.title}</p>
                <p className="text-sm sub">{d.description}</p>
                <p className="text-xs sub mt-1">
                  {d.location && <span>📍 {d.location} </span>}
                  {d.start_time && <span>· 🕐 {d.start_time} </span>}
                  {d.meal_info && <span>· 🍽️ {d.meal_info}</span>}
                </p>
                {dayPhotos(d.photos).length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {dayPhotos(d.photos).map((url) => (
                      <div key={url} className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                        <Image src={url} alt={d.title} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <button onClick={() => editDay(d)} className="text-xs text-haiti-turquoise hover:text-haiti-turquoise/80">
                  Edit
                </button>
                <button onClick={() => removeDay(d.id)} disabled={deletingId === d.id} className="text-xs text-red-500 hover:text-red-600">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={addDay} className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800">
        <div className="grid md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1">Day #</label>
            <input type="number" min="1" required value={dayNumber} onChange={(e) => setDayNumber(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg" />
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-medium mb-1">Title</label>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">Description</label>
          <textarea required rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg" />
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1">Place / Location</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Citadelle Laferrière" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Start time</label>
            <input value={startTime} onChange={(e) => setStartTime(e.target.value)} placeholder="e.g. 9:00 AM" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Meal info</label>
            <input value={mealInfo} onChange={(e) => setMealInfo(e.target.value)} placeholder="e.g. Lunch included, 1pm" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">Photos from your visit</label>
          {!cloudinaryConfigured && <p className="text-xs sub mb-1">Cloudinary isn&apos;t configured yet — photo upload is disabled.</p>}
          <input type="file" accept="image/*" multiple disabled={!cloudinaryConfigured} onChange={(e) => handlePhotoUpload(e.target.files)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm" />
          {uploading && (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
              <div className="bg-haiti-turquoise h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}
          {photos.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {photos.map((url) => (
                <div key={url} className="relative w-16 h-16 rounded-lg overflow-hidden group">
                  <Image src={url} alt="" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(url)}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs flex items-center justify-center"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" disabled={status === "saving" || uploading} className="bg-haiti-turquoise text-white px-4 py-2 rounded-lg font-medium disabled:bg-gray-400">
          {status === "saving" ? "Saving..." : "Add / Update Day"}
        </button>
        {status === "error" && <p className="text-red-500 text-sm">Failed to save that day.</p>}
      </form>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCloudinaryUpload, cloudinaryConfigured } from "@/lib/useCloudinaryUpload";

type MediaType = "photo" | "video" | "youtube";

export default function GalleryUploadForm() {
  const router = useRouter();
  const { upload, progress } = useCloudinaryUpload();
  const [mediaType, setMediaType] = useState<MediaType>("photo");
  const [file, setFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [credit, setCredit] = useState("");
  const [status, setStatus] = useState<"idle" | "uploading" | "saving" | "error">("idle");
  const [error, setError] = useState("");

  const reset = () => {
    setFile(null);
    setYoutubeUrl("");
    setCaption("");
    setLocation("");
    setCredit("");
    setStatus("idle");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      let url = youtubeUrl;
      const thumbnailUrl: string | undefined = undefined;

      if (mediaType !== "youtube") {
        if (!file) {
          setError("Choose a file first.");
          return;
        }
        if (!cloudinaryConfigured) {
          setError("Cloudinary isn't configured yet — add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to .env.");
          return;
        }
        setStatus("uploading");
        const result = await upload(file);
        url = result.secure_url;
      } else if (!youtubeUrl) {
        setError("Paste a YouTube link.");
        return;
      }

      setStatus("saving");
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaType, url, thumbnailUrl, caption, location, credit }),
      });
      if (!res.ok) throw new Error("Failed to save");

      reset();
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h2 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise">Add to Gallery</h2>

      {!cloudinaryConfigured && (
        <p className="text-xs bg-amber-500/10 text-amber-600 p-3 rounded-lg">
          Photo/video upload needs Cloudinary set up (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME +
          NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env). YouTube links work without it.
        </p>
      )}

      <div className="flex gap-2">
        {(["photo", "video", "youtube"] as MediaType[]).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setMediaType(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
              mediaType === type ? "bg-haiti-turquoise text-white" : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {mediaType === "youtube" ? (
        <div>
          <label className="block text-sm font-medium mb-1">YouTube URL</label>
          <input
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-haiti-turquoise focus:border-transparent"
          />
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium mb-1">{mediaType === "photo" ? "Photo" : "Video"} file</label>
          <input
            type="file"
            accept={mediaType === "photo" ? "image/*" : "video/*"}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg"
          />
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-3">
        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Caption"
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
        />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location (e.g. Jacmel)"
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
        />
        <input
          value={credit}
          onChange={(e) => setCredit(e.target.value)}
          placeholder="Credit (optional)"
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
        />
      </div>

      {status === "uploading" && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div className="bg-haiti-turquoise h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={status === "uploading" || status === "saving"}
        className="bg-haiti-turquoise text-white px-6 py-3 rounded-lg font-medium hover:bg-haiti-turquoise/80 transition-colors disabled:bg-gray-400"
      >
        {status === "uploading" ? `Uploading... ${progress}%` : status === "saving" ? "Saving..." : "Add to Gallery"}
      </button>
    </form>
  );
}

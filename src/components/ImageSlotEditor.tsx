"use client";

import { useState } from "react";
import Image from "next/image";
import { useCloudinaryUpload, cloudinaryConfigured } from "@/lib/useCloudinaryUpload";

interface ImageSlotEditorProps {
  label: string;
  currentUrl: string | null;
  onSave: (url: string) => Promise<void>;
}

export default function ImageSlotEditor({ label, currentUrl, onSave }: ImageSlotEditorProps) {
  const { upload, progress, uploading } = useCloudinaryUpload();
  const [preview, setPreview] = useState(currentUrl);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleFile = async (file: File) => {
    if (!cloudinaryConfigured) return;
    const result = await upload(file);
    setPreview(result.secure_url);
    setSaving(true);
    setSaved(false);
    try {
      await onSave(result.secure_url);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-4 py-2">
      <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-800">
        {preview && <Image src={preview} alt={label} fill className="object-cover" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{label}</p>
        <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} className="text-xs mt-1" />
        {uploading && <p className="text-xs sub">Uploading... {progress}%</p>}
        {saving && <p className="text-xs sub">Saving...</p>}
        {saved && <p className="text-xs text-green-600">Saved ✓</p>}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export const cloudinaryConfigured = !!CLOUD_NAME && !!UPLOAD_PRESET;

export function useCloudinaryUpload() {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const upload = (file: File): Promise<{ secure_url: string; resource_type: string }> => {
    setUploading(true);
    setProgress(0);
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET as string);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
      };
      xhr.onload = () => {
        setUploading(false);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error("Upload failed"));
        }
      };
      xhr.onerror = () => {
        setUploading(false);
        reject(new Error("Upload failed"));
      };
      xhr.send(formData);
    });
  };

  return { upload, progress, uploading };
}

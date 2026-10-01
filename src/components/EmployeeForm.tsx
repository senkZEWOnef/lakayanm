"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCloudinaryUpload, cloudinaryConfigured } from "@/lib/useCloudinaryUpload";

export default function EmployeeForm() {
  const router = useRouter();
  const { upload, progress } = useCloudinaryUpload();
  const [name, setName] = useState("");
  const [role, setRole] = useState("guide");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "saving" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let photoUrl: string | undefined;
      if (photo) {
        if (!cloudinaryConfigured) {
          setStatus("error");
          return;
        }
        setStatus("uploading");
        const result = await upload(photo);
        photoUrl = result.secure_url;
      }

      setStatus("saving");
      const res = await fetch("/api/admin/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, phone, email, photoUrl }),
      });
      if (!res.ok) throw new Error();

      setName("");
      setRole("guide");
      setPhone("");
      setEmail("");
      setPhoto(null);
      setStatus("idle");
      router.refresh();
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h2 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise">Add Employee</h2>
      <div className="grid md:grid-cols-2 gap-3">
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg" />
        <select value={role} onChange={(e) => setRole(e.target.value)} className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg">
          <option value="guide">Guide</option>
          <option value="driver">Driver</option>
          <option value="photographer">Photographer</option>
          <option value="other">Other</option>
        </select>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (needed for login access)" type="email" className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg" />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">Photo (optional)</label>
        <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg" />
      </div>
      {status === "uploading" && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div className="bg-haiti-turquoise h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}
      {status === "error" && <p className="text-red-500 text-sm">Something went wrong.</p>}
      <button type="submit" disabled={status === "uploading" || status === "saving"} className="bg-haiti-turquoise text-white px-6 py-3 rounded-lg font-medium hover:bg-haiti-turquoise/80 transition-colors disabled:bg-gray-400">
        {status === "uploading" ? `Uploading ${progress}%` : status === "saving" ? "Saving..." : "Add Employee"}
      </button>
    </form>
  );
}

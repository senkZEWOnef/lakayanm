"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Message {
  id: string;
  from_role: string;
  kind: string;
  body: string;
  created_at: string | Date;
}

export default function AdminMessageThread({ reservationId, messages }: { reservationId: string; messages: Message[] }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");

  const reply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch(`/api/admin/reservations/${reservationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      if (!res.ok) throw new Error();
      setBody("");
      setStatus("idle");
      router.refresh();
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="card">
      <h3 className="font-bold text-haiti-navy dark:text-haiti-turquoise mb-3">Messages</h3>

      {messages.length === 0 ? (
        <p className="sub text-sm mb-3">No messages from the traveler yet.</p>
      ) : (
        <div className="space-y-2 mb-3 max-h-72 overflow-y-auto">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`rounded-lg p-3 text-sm ${
                m.from_role === "admin" ? "bg-haiti-turquoise/10 border border-haiti-turquoise/20" : "bg-gray-50 dark:bg-gray-800"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-xs capitalize">
                  {m.from_role === "admin" ? "You" : "Traveler"}
                  {m.kind === "change_request" && <span className="ml-2 text-amber-600">· Change Request</span>}
                </span>
                <span className="text-xs sub">{new Date(m.created_at).toLocaleString()}</span>
              </div>
              <p>{m.body}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={reply} className="space-y-2">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={2}
          placeholder="Reply to the traveler..."
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="bg-haiti-turquoise text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-haiti-turquoise/80 transition-colors disabled:opacity-50"
        >
          {status === "sending" ? "Sending..." : "Reply"}
        </button>
        {status === "error" && <p className="text-xs text-red-500">Failed to send.</p>}
      </form>
    </div>
  );
}

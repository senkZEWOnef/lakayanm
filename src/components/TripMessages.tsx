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

export default function TripMessages({ code, messages }: { code: string; messages: Message[] }) {
  const router = useRouter();
  const [kind, setKind] = useState<"message" | "change_request">("message");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch(`/api/reservations/${code}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body, kind }),
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
    <div className="card space-y-4">
      <h3 className="font-bold text-haiti-navy dark:text-haiti-turquoise">Need Help or Want to Request a Change?</h3>

      {messages.length > 0 && (
        <div className="space-y-2 max-h-72 overflow-y-auto">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`rounded-lg p-3 text-sm ${
                m.from_role === "admin" ? "bg-haiti-turquoise/10 border border-haiti-turquoise/20" : "bg-gray-50 dark:bg-gray-800"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-xs">
                  {m.from_role === "admin" ? "Lakaya'm Team" : "You"}
                  {m.kind === "change_request" && <span className="ml-2 text-amber-600">· Change Request</span>}
                </span>
                <span className="text-xs sub">{new Date(m.created_at).toLocaleString()}</span>
              </div>
              <p>{m.body}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={send} className="space-y-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setKind("message")}
            className={`text-xs px-3 py-1.5 rounded-full font-medium ${kind === "message" ? "bg-haiti-turquoise text-white" : "bg-gray-200 dark:bg-gray-700"}`}
          >
            General Question
          </button>
          <button
            type="button"
            onClick={() => setKind("change_request")}
            className={`text-xs px-3 py-1.5 rounded-full font-medium ${kind === "change_request" ? "bg-amber-500 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
          >
            Request a Change
          </button>
        </div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          placeholder={kind === "change_request" ? "What would you like to change about your trip?" : "What can we help with?"}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="bg-haiti-navy text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-haiti-navy/80 transition-colors disabled:opacity-50"
        >
          {status === "sending" ? "Sending..." : "Send"}
        </button>
        {status === "error" && <p className="text-xs text-red-500">Something went wrong — try again.</p>}
      </form>
    </div>
  );
}

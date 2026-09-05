"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, AlertCircle } from "lucide-react";

export default function PortalLoginPage() {
  const router = useRouter();
  const [tagId, setTagId] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/portal/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tagId, accessCode }),
      });
      const data = await res.json();

      if (res.ok) {
        router.push(`/portal/${data.type}`);
        router.refresh();
      } else {
        setError(data.error ?? "Invalid TAG ID or access code");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-brand/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-brand/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-br from-navy to-blue-950 p-8 text-center">
            <div className="w-16 h-16 bg-orange-brand rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-orange-brand/30">
              <ShieldCheck size={30} className="text-white" />
            </div>
            <h1 className="text-2xl font-black text-white">Secure Portal</h1>
            <p className="text-blue-200/70 text-sm mt-1">Training Advantage Group</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">TAG ID</label>
              <input
                type="text"
                value={tagId}
                onChange={(e) => setTagId(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand transition-colors"
                placeholder="e.g. INS-0047"
                autoFocus
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Access Code</label>
              <input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand transition-colors tracking-widest"
                placeholder="Your private access code"
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <AlertCircle size={16} className="flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !tagId || !accessCode}
              className="w-full bg-orange-brand text-white font-bold py-3.5 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-brand/30"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>

            <p className="text-xs text-gray-400 text-center">
              Approved instructors, suppliers, staff and candidates only. Lost your access code?{" "}
              <a href="mailto:office@trainingadvantagegroup.co.uk" className="text-blue-brand font-semibold hover:underline">
                Contact TAG
              </a>
              .
            </p>
          </form>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          Training Advantage Group Ltd · Secure Portal
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, LogOut } from "lucide-react";

export default function PortalHeader({ title, tagId }: { title: string; tagId: string }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/portal/auth", { method: "DELETE" });
    router.push("/portal/login");
    router.refresh();
  }

  return (
    <div className="bg-navy">
      <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-orange-brand rounded-xl flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-black text-lg leading-tight">{title}</h1>
            <p className="text-blue-200/60 text-xs font-mono">{tagId}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-2 text-sm text-blue-100/70 hover:text-white hover:bg-white/10 px-3 py-2 rounded-xl transition-colors flex-shrink-0"
        >
          <LogOut size={15} />
          {loggingOut ? "Signing out…" : "Sign Out"}
        </button>
      </div>
    </div>
  );
}

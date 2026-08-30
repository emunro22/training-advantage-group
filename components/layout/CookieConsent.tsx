"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { getStoredConsent, setStoredConsent } from "@/lib/consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getStoredConsent() === null);
  }, []);

  if (!visible) return null;

  function choose(value: "accepted" | "rejected") {
    setStoredConsent(value);
    setVisible(false);
  }

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-navy text-white shadow-[0_-4px_20px_rgba(0,0,0,0.15)]">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center gap-4">
        <Cookie size={22} className="text-orange-brand flex-shrink-0 hidden sm:block" />
        <p className="text-sm text-blue-light/90 flex-1 text-center sm:text-left">
          We use cookies to understand site traffic and improve your experience. See our{" "}
          <Link href="/policies" className="underline text-white hover:text-orange-brand">
            Privacy Policy
          </Link>{" "}
          for details.
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={() => choose("rejected")}
            className="text-sm font-semibold px-4 py-2 rounded-lg border border-white/30 hover:bg-white/10 transition-colors"
          >
            Reject
          </button>
          <button
            onClick={() => choose("accepted")}
            className="text-sm font-semibold px-4 py-2 rounded-lg bg-orange-brand hover:bg-orange-brand/90 transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

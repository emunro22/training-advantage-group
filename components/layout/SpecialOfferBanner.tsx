"use client";

import { useEffect, useState } from "react";
import { Tag, X } from "lucide-react";

interface ActiveOffer {
  id: string;
  title: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  promoCode?: string;
  validUntil?: string;
}

const DISMISS_KEY_PREFIX = "tag-offer-dismissed-";

export default function SpecialOfferBanner() {
  const [offer, setOffer] = useState<ActiveOffer | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch("/api/offers/active")
      .then((r) => r.json())
      .then((d) => {
        if (d.offer && localStorage.getItem(DISMISS_KEY_PREFIX + d.offer.id) !== "1") {
          setOffer(d.offer);
        }
      })
      .catch(() => {});
  }, []);

  if (!offer || dismissed) return null;

  const discountLabel =
    offer.discountType === "percentage" ? `${offer.discountValue}% off` : `£${offer.discountValue} off`;

  function dismiss() {
    if (offer) localStorage.setItem(DISMISS_KEY_PREFIX + offer.id, "1");
    setDismissed(true);
  }

  return (
    <div className="relative bg-orange-brand text-white">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3 text-sm text-center flex-wrap">
        <Tag size={15} className="flex-shrink-0" />
        <span>
          <strong className="font-bold">{offer.title}</strong>: {discountLabel}
          {offer.description ? `: ${offer.description}` : ""}
          {offer.promoCode && (
            <>
              {" "}
              Use code <span className="font-mono font-bold bg-white/20 px-1.5 py-0.5 rounded">{offer.promoCode}</span>
            </>
          )}
        </span>
        <button
          onClick={dismiss}
          aria-label="Dismiss offer"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/20 transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { CONSENT_EVENT, type ConsentValue, getStoredConsent } from "@/lib/consent";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Loads Google Analytics (GA4) only once the visitor has accepted cookies — UK
 * GDPR/PECR require consent before non-essential tracking scripts run. Set
 * NEXT_PUBLIC_GA_MEASUREMENT_ID (e.g. "G-XXXXXXXXXX") to enable.
 */
export default function GoogleAnalytics() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    setConsented(getStoredConsent() === "accepted");

    function onConsentChange(e: Event) {
      const detail = (e as CustomEvent<ConsentValue>).detail;
      setConsented(detail === "accepted");
    }

    window.addEventListener(CONSENT_EVENT, onConsentChange);
    return () => window.removeEventListener(CONSENT_EVENT, onConsentChange);
  }, []);

  if (!GA_MEASUREMENT_ID || !consented) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}

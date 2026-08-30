import type { Metadata } from "next";
import { Suspense } from "react";
import SuccessPageClient from "./SuccessPageClient";

export const metadata: Metadata = {
  title: "Payment Confirmed",
  alternates: { canonical: "/booking/success" },
  robots: { index: false, follow: true },
};

export default function BookingSuccessPage() {
  // TAG-SEC-PROC-001 §6: the confirmation page issues the Jotform registration/update link,
  // carrying only the non-sensitive Order ID as a reference — never DOB, ID, signature etc.
  const registrationUrl = process.env.JOTFORM_REGISTRATION_URL;
  return (
    <Suspense>
      <SuccessPageClient registrationUrl={registrationUrl} />
    </Suspense>
  );
}

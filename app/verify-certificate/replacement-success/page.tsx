import type { Metadata } from "next";
import { Suspense } from "react";
import ReplacementSuccessClient from "./ReplacementSuccessClient";

export const metadata: Metadata = {
  title: "Payment Confirmed",
  alternates: { canonical: "/verify-certificate/replacement-success" },
  robots: { index: false, follow: true },
};

export default function ReplacementCertificateSuccessPage() {
  return (
    <Suspense>
      <ReplacementSuccessClient />
    </Suspense>
  );
}

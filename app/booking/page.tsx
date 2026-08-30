import type { Metadata } from "next";
import { Suspense } from "react";
import BookingPageClient from "./BookingPageClient";

export const metadata: Metadata = {
  alternates: { canonical: "/booking" },
  title: "Book Training | Training Advantage Group Ltd",
  description: "Book professional transport, logistics and industrial training with Training Advantage Group. Easy online booking with email confirmation.",
};

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-navy">Loading...</div></div>}>
      <BookingPageClient />
    </Suspense>
  );
}

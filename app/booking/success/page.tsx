import { Suspense } from "react";
import SuccessPageClient from "./SuccessPageClient";

export default function BookingSuccessPage() {
  return (
    <Suspense>
      <SuccessPageClient />
    </Suspense>
  );
}

import { NextResponse } from "next/server";
import { getGoogleReviews } from "@/lib/google-reviews";

// Public, thin wrapper — only exposes the rating summary (getGoogleReviews already caches
// the underlying Places API call for 24h via Next's fetch cache).
export async function GET() {
  const data = await getGoogleReviews();
  if (!data) return NextResponse.json({ available: false });
  return NextResponse.json({ available: true, rating: data.rating, totalReviews: data.totalReviews });
}

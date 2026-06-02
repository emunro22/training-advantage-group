export interface GoogleReview {
  authorName: string;
  authorPhotoUrl: string;
  profileUrl: string;
  rating: number;
  text: string;
  relativeTime: string;
}

export interface GoogleReviewsData {
  rating: number;
  totalReviews: number;
  placeUrl: string;
  reviews: GoogleReview[];
}

export async function getGoogleReviews(): Promise<GoogleReviewsData | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) return null;

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "rating,userRatingCount,reviews,googleMapsUri",
        },
        // Cache for 24 hours via Next.js / Vercel edge cache
        next: { revalidate: 86400 },
      }
    );

    if (!res.ok) {
      console.error("Google Places API error:", res.status, await res.text());
      return null;
    }

    const data = await res.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reviews: GoogleReview[] = (data.reviews ?? []).map((r: any) => ({
      authorName: r.authorAttribution?.displayName ?? "Google User",
      authorPhotoUrl: r.authorAttribution?.photoUri ?? "",
      profileUrl: r.authorAttribution?.uri ?? "",
      rating: r.rating ?? 5,
      text: r.text?.text ?? r.originalText?.text ?? "",
      relativeTime: r.relativePublishTimeDescription ?? "",
    }));

    return {
      rating: data.rating ?? 0,
      totalReviews: data.userRatingCount ?? 0,
      placeUrl:
        data.googleMapsUri ??
        `https://www.google.com/maps/place/?q=place_id:${placeId}`,
      reviews,
    };
  } catch (err) {
    console.error("Failed to fetch Google reviews:", err);
    return null;
  }
}

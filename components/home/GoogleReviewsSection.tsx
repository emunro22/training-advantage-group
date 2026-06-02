import { getGoogleReviews } from "@/lib/google-reviews";
import { ExternalLink } from "lucide-react";

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const cls = size === "lg" ? "w-6 h-6" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={cls}
          viewBox="0 0 24 24"
          fill={star <= rating ? "#FBBC04" : "#E5E7EB"}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function GoogleLogo() {
  return (
    <svg viewBox="0 0 74 24" className="h-5 w-auto" aria-label="Google">
      <path d="M9.24 8.19v2.46h5.88c-.18 1.38-.64 2.39-1.34 3.1-.86.86-2.2 1.8-4.54 1.8-3.62 0-6.45-2.92-6.45-6.54s2.83-6.54 6.45-6.54c1.95 0 3.38.77 4.43 1.76L15.4 2.5C13.94 1.08 11.98 0 9.24 0 4.28 0 .11 4.04.11 9s4.17 9 9.13 9c2.68 0 4.7-.88 6.28-2.52 1.62-1.62 2.13-3.91 2.13-5.75 0-.57-.04-1.1-.13-1.54H9.24z" fill="#4285F4"/>
      <path d="M25 6.19c-3.21 0-5.83 2.44-5.83 5.81 0 3.34 2.62 5.81 5.83 5.81s5.83-2.46 5.83-5.81c0-3.37-2.62-5.81-5.83-5.81zm0 9.33c-1.76 0-3.28-1.45-3.28-3.52s1.52-3.52 3.28-3.52 3.28 1.46 3.28 3.52-1.52 3.52-3.28 3.52z" fill="#EA4335"/>
      <path d="M53.58 7.49h-.09c-.57-.68-1.67-1.3-3.06-1.3C47.53 6.19 45 8.72 45 12c0 3.26 2.53 5.81 5.43 5.81 1.39 0 2.49-.62 3.06-1.32h.09v.81c0 2.22-1.19 3.41-3.1 3.41-1.56 0-2.53-1.12-2.93-2.07l-2.22.92c.64 1.54 2.33 3.43 5.15 3.43 2.99 0 5.52-1.76 5.52-6.05V6.49h-2.42v1zm-2.93 8.03c-1.76 0-3.1-1.5-3.1-3.52s1.34-3.52 3.1-3.52c1.74 0 3.1 1.52 3.1 3.54.01 2.01-1.36 3.5-3.1 3.5z" fill="#4285F4"/>
      <path d="M38 6.19c-3.21 0-5.83 2.44-5.83 5.81 0 3.34 2.62 5.81 5.83 5.81s5.83-2.46 5.83-5.81c0-3.37-2.62-5.81-5.83-5.81zm0 9.33c-1.76 0-3.28-1.45-3.28-3.52S36.24 8.48 38 8.48s3.28 1.46 3.28 3.52-1.52 3.52-3.28 3.52z" fill="#FBBC05"/>
      <path d="M58 .24h2.51v17.57H58z" fill="#34A853"/>
      <path d="M63.49 13.95c-.56 1.51-1.81 2.87-3.82 2.87-2.31 0-4.23-1.77-4.23-5.81 0-3.84 1.88-5.82 4.21-5.82 2.37 0 3.63 1.47 3.99 2.97l-2.31.96c-.2-.7-.76-1.66-1.68-1.66-1.42 0-1.9 1.45-1.9 3.55 0 2.17.5 3.55 1.88 3.55.96 0 1.54-.68 1.74-1.66l2.12.05z" fill="#EA4335"/>
    </svg>
  );
}

function ReviewCard({ review }: { review: { authorName: string; authorPhotoUrl: string; profileUrl: string; rating: number; text: string; relativeTime: string } }) {
  const initials = review.authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const truncated = review.text.length > 180
    ? review.text.slice(0, 180).trim() + "…"
    : review.text;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      {/* Author */}
      <div className="flex items-center gap-3">
        {review.authorPhotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={review.authorPhotoUrl}
            alt={review.authorName}
            className="w-10 h-10 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center text-navy font-bold text-sm flex-shrink-0">
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <a
            href={review.profileUrl || undefined}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-sm text-navy hover:underline leading-tight block truncate"
          >
            {review.authorName}
          </a>
          <div className="text-xs text-gray-400 mt-0.5">{review.relativeTime}</div>
        </div>
        <div className="ml-auto flex-shrink-0">
          <GoogleLogo />
        </div>
      </div>

      {/* Stars */}
      <StarRating rating={review.rating} />

      {/* Text */}
      {review.text ? (
        <p className="text-sm text-gray-700 leading-relaxed flex-1">{truncated}</p>
      ) : (
        <p className="text-sm text-gray-400 italic flex-1">No written review.</p>
      )}
    </div>
  );
}

export default async function GoogleReviewsSection() {
  const data = await getGoogleReviews();

  if (!data || data.reviews.length === 0) return null;

  const ratingDisplay = data.rating.toFixed(1);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 mb-5">
            <GoogleLogo />
            <div className="w-px h-5 bg-gray-200" />
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-gray-900">{ratingDisplay}</span>
              <StarRating rating={Math.round(data.rating)} size="lg" />
            </div>
            <div className="w-px h-5 bg-gray-200" />
            <span className="text-sm text-gray-500 font-medium">
              {data.totalReviews.toLocaleString()} review{data.totalReviews !== 1 ? "s" : ""}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-navy mb-2">
            What Our Customers Say
          </h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            Real reviews from verified Google customers who have trained with us.
          </p>
        </div>

        {/* Reviews grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          {data.reviews.map((review, i) => (
            <ReviewCard key={i} review={review} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href={data.placeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 hover:border-[#4285F4] text-gray-700 hover:text-[#4285F4] px-6 py-3 rounded-xl font-semibold text-sm transition-all"
          >
            <GoogleLogo />
            See all reviews on Google Maps
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}

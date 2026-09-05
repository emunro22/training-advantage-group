export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getPricingData } from "@/lib/storage";
import { isPromoApplicable, computePromoDiscountPence } from "@/lib/order-contract";

// Best-effort anti-abuse rate limit — same pattern as /api/certificates/verify.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX_REQUESTS;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many attempts. Please try again in a minute." }, { status: 429 });
  }

  try {
    const body = (await request.json()) as {
      code?: string;
      courseId?: string;
      courseName?: string;
      totalAmountPence?: number;
    };

    if (!body.code || !body.totalAmountPence) {
      return NextResponse.json({ valid: false, error: "Enter a promo code" }, { status: 400 });
    }

    const { specialOffers } = await getPricingData();
    const offer = specialOffers.find(
      (o) => o.promoCode && o.promoCode.toLowerCase() === body.code!.trim().toLowerCase()
    );

    if (!offer || !isPromoApplicable(offer, body.courseId ?? "", body.courseName ?? "")) {
      return NextResponse.json({ valid: false, error: "This code is not valid for this course, or has expired." });
    }

    const discountAmountPence = computePromoDiscountPence(offer, body.totalAmountPence);
    return NextResponse.json({
      valid: true,
      discountAmountPence,
      discountedTotalPence: body.totalAmountPence - discountAmountPence,
      offerTitle: offer.title,
    });
  } catch {
    return NextResponse.json({ valid: false, error: "Could not check that code. Please try again." }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getPricingData } from "@/lib/storage";

// Public, unauthenticated — only returns fields safe to show anyone (no internal admin data).
export async function GET() {
  const { specialOffers } = await getPricingData();
  const today = new Date().toISOString().split("T")[0];

  const active = specialOffers
    .filter((o) => o.active && (!o.validUntil || o.validUntil >= today))
    .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));

  const offer = active[0];
  if (!offer) return NextResponse.json({ offer: null });

  return NextResponse.json({
    offer: {
      id: offer.id,
      title: offer.title,
      description: offer.description,
      discountType: offer.discountType,
      discountValue: offer.discountValue,
      promoCode: offer.promoCode,
      validUntil: offer.validUntil,
    },
  });
}

export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { validateSessionToken, ADMIN_COOKIE } from "@/lib/admin-auth";
import { bulkImportWebsiteProducts } from "@/lib/storage";
import { PRICING_CATALOGUE_SEED } from "@/lib/pricing-catalogue-seed";
import { CATEGORY_TO_PAGE_SLUG } from "@/lib/order-contract";

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  return !!token && validateSessionToken(token);
}

// Explicit, admin-triggered only — loads the hand-transcribed sample rows described in
// lib/pricing-catalogue-seed.ts. Never runs automatically.
export async function POST() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await bulkImportWebsiteProducts(PRICING_CATALOGUE_SEED, "seed");

  const touchedSlugs = new Set(
    PRICING_CATALOGUE_SEED.map((r) => CATEGORY_TO_PAGE_SLUG[r.category]).filter((s): s is string => !!s)
  );
  for (const slug of touchedSlugs) {
    try { revalidatePath(slug); } catch { /* no-op outside Next.js context */ }
  }

  return NextResponse.json(result, { status: 200 });
}

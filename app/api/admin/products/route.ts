export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { validateSessionToken, ADMIN_COOKIE } from "@/lib/admin-auth";
import {
  getWebsiteProducts,
  addWebsiteProduct,
  updateWebsiteProduct,
  deleteWebsiteProduct,
  addPublicationLogEntry,
  type WebsiteProduct,
} from "@/lib/storage";
import { CATEGORY_TO_PAGE_SLUG } from "@/lib/order-contract";

// Course pages render published products from a build-time-static page (see
// lib/products-public.ts usage in app/*/page.tsx), so an admin approval must bust that
// page's cache to take effect immediately — mirrors the pattern already used for page-content
// edits in app/api/admin/content/route.ts.
function revalidateCategoryPage(category: string) {
  const slug = CATEGORY_TO_PAGE_SLUG[category];
  if (!slug) return;
  try {
    revalidatePath(slug);
  } catch {
    // no-op outside Next.js context (e.g. local dev)
  }
}

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  return !!token && validateSessionToken(token);
}

const WORKFLOW_ORDER: WebsiteProduct["publishDecision"][] = [
  "Review Required",
  "Director Approved",
  "Web Pending",
  "Published",
];

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const products = await getWebsiteProducts();
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as Partial<WebsiteProduct>;
    if (!body.priceId || !body.category || !body.courseService) {
      return NextResponse.json({ error: "priceId, category and courseService are required" }, { status: 400 });
    }
    const now = new Date().toISOString();
    const id = `wp-manual-${Date.now()}`;
    const product: WebsiteProduct = {
      id,
      publishDecision: "Review Required",
      priceId: body.priceId,
      websiteProductId: body.websiteProductId,
      category: body.category,
      courseService: body.courseService,
      variant: body.variant ?? "",
      accreditation: body.accreditation ?? "",
      delivery: body.delivery ?? "",
      durationRatio: body.durationRatio ?? "",
      maxCandidates: body.maxCandidates ?? "",
      pricingBasis: body.pricingBasis ?? "",
      priceIncVatPence: body.priceIncVatPence ?? 0,
      vatTreatment: body.vatTreatment ?? "Standard 20%",
      netExVatPence: body.netExVatPence ?? 0,
      vatAmountPence: body.vatAmountPence ?? 0,
      effectiveFrom: body.effectiveFrom,
      effectiveTo: body.effectiveTo,
      publicNote: body.publicNote ?? "",
      joiningPackCode: body.joiningPackCode,
      issuePackCode: body.issuePackCode,
      webSlug: body.webSlug,
      saleMode: body.saleMode ?? "enquire",
      needsVerification: true,
      source: "manual",
      createdAt: now,
      updatedAt: now,
    };
    await addWebsiteProduct(product);
    await addPublicationLogEntry({
      id: `log-${id}`,
      priceId: product.priceId,
      changeType: "Manual — new product",
      newValue: `${product.courseService} / ${product.variant} — £${(product.priceIncVatPence / 100).toFixed(2)} inc VAT`,
      requestedBy: "Admin (manual entry)",
      outcome: "Added as Review Required",
      createdAt: now,
    });
    revalidateCategoryPage(product.category);
    return NextResponse.json({ product }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as { id: string; action?: "advance" | "revert"; approvedBy?: string } & Partial<WebsiteProduct>;
    if (!body.id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    const products = await getWebsiteProducts();
    const current = products.find((p) => p.id === body.id);
    if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (body.action === "advance" || body.action === "revert") {
      const idx = WORKFLOW_ORDER.indexOf(current.publishDecision);
      const nextIdx = body.action === "advance" ? Math.min(idx + 1, WORKFLOW_ORDER.length - 1) : Math.max(idx - 1, 0);
      const nextDecision = WORKFLOW_ORDER[nextIdx];
      const now = new Date().toISOString();
      const update: Partial<WebsiteProduct> = { publishDecision: nextDecision };
      if (nextDecision === "Director Approved") {
        update.directorApprovedBy = body.approvedBy || "Admin";
        update.directorApprovedAt = now;
      }
      if (nextDecision === "Published") {
        update.independentCheckBy = body.approvedBy || "Admin";
        update.independentCheckAt = now;
        update.lastWebCheck = now;
      }
      const ok = await updateWebsiteProduct(body.id, update);
      if (!ok) return NextResponse.json({ error: "Update failed" }, { status: 500 });
      await addPublicationLogEntry({
        id: `log-${body.id}-${Date.now()}`,
        priceId: current.priceId,
        changeType: "Workflow transition",
        previousValue: current.publishDecision,
        newValue: nextDecision,
        approvedBy: body.approvedBy || "Admin",
        publishedAt: nextDecision === "Published" ? now : undefined,
        independentCheckBy: nextDecision === "Published" ? body.approvedBy || "Admin" : undefined,
        verifiedAt: nextDecision === "Published" ? now : undefined,
        outcome: `Moved from ${current.publishDecision} to ${nextDecision}`,
        createdAt: now,
      });
      revalidateCategoryPage(current.category);
      return NextResponse.json({ ok: true });
    }

    const { id, action: _action, approvedBy: _approvedBy, ...fields } = body;
    void _action;
    void _approvedBy;
    const ok = await updateWebsiteProduct(id, fields as Partial<WebsiteProduct>);
    if (!ok) return NextResponse.json({ error: "Update failed" }, { status: 500 });
    revalidateCategoryPage((fields.category as string | undefined) ?? current.category);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as { id: string };
    if (!body.id) return NextResponse.json({ error: "id is required" }, { status: 400 });
    const products = await getWebsiteProducts();
    const existing = products.find((p) => p.id === body.id);
    const ok = await deleteWebsiteProduct(body.id);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (existing) revalidateCategoryPage(existing.category);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

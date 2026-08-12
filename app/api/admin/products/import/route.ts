export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { validateSessionToken, ADMIN_COOKIE } from "@/lib/admin-auth";
import { bulkImportWebsiteProducts, type WebsiteProductImportRow } from "@/lib/storage";
import { splitVat, CATEGORY_TO_PAGE_SLUG } from "@/lib/order-contract";

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  return !!token && validateSessionToken(token);
}

// Matches the workbook's own columns / the TAG-WEB-SPEC-001 §3 Order Data Contract naming —
// TAG can export the Master Pricing / Website Product Publication Control sheet straight to CSV.
const HEADER_ALIASES: Record<string, keyof WebsiteProductImportRow | "priceIncVatPounds"> = {
  priceid: "priceId",
  category: "category",
  courseservice: "courseService",
  course: "courseService",
  variant: "variant",
  accreditation: "accreditation",
  delivery: "delivery",
  durationratio: "durationRatio",
  duration: "durationRatio",
  maxcandidates: "maxCandidates",
  pricingbasis: "pricingBasis",
  priceincvat: "priceIncVatPounds",
  price: "priceIncVatPounds",
  vattreatment: "vatTreatment",
  effectivefrom: "effectiveFrom",
  effectiveto: "effectiveTo",
  publicwebsitenote: "publicNote",
  publicnote: "publicNote",
  joiningpackcode: "joiningPackCode",
  issuepackcode: "issuePackCode",
  websiteproductid: "websiteProductId",
  webslug: "webSlug",
  webursslug: "webSlug",
  salemode: "saleMode",
};

function normaliseHeader(h: string): string {
  return h.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Minimal dependency-free CSV parser — handles quoted fields containing commas/newlines.
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else { inQuotes = false; }
      } else field += c;
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field); field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); field = "";
      if (row.some((v) => v.trim() !== "")) rows.push(row);
      row = [];
    } else field += c;
  }
  if (field !== "" || row.length > 0) { row.push(field); rows.push(row); }
  return rows;
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as { csv?: string };
    if (!body.csv || !body.csv.trim()) {
      return NextResponse.json({ error: "No CSV content provided" }, { status: 400 });
    }

    const table = parseCsv(body.csv);
    if (table.length < 2) {
      return NextResponse.json({ error: "CSV must have a header row and at least one data row" }, { status: 400 });
    }

    const headers = table[0].map(normaliseHeader);
    const rowErrors: { row: number; reason: string }[] = [];
    const rows: WebsiteProductImportRow[] = [];

    for (let r = 1; r < table.length; r++) {
      const raw = table[r];
      const record: Record<string, string> = {};
      headers.forEach((h, i) => {
        const key = HEADER_ALIASES[h];
        if (key) record[key] = (raw[i] ?? "").trim();
      });

      const priceId = record.priceId;
      const category = record.category;
      const courseService = record.courseService;
      const priceIncVatPounds = parseFloat(record.priceIncVatPounds ?? "");

      if (!priceId || !category || !courseService || Number.isNaN(priceIncVatPounds)) {
        rowErrors.push({
          row: r + 1,
          reason: "Missing PriceID, Category, Course/Service, or a valid Price Inc VAT — held for administrator review",
        });
        continue;
      }

      const priceIncVatPence = Math.round(priceIncVatPounds * 100);
      const vatTreatment = record.vatTreatment || "Standard 20%";
      const { netExVatPence, vatAmountPence } = splitVat(priceIncVatPence, vatTreatment);

      rows.push({
        priceId,
        category,
        courseService,
        variant: record.variant ?? "",
        accreditation: record.accreditation ?? "",
        delivery: record.delivery ?? "",
        durationRatio: record.durationRatio ?? "",
        maxCandidates: record.maxCandidates ?? "",
        pricingBasis: record.pricingBasis ?? "",
        priceIncVatPence,
        vatTreatment,
        netExVatPence,
        vatAmountPence,
        effectiveFrom: record.effectiveFrom || undefined,
        effectiveTo: record.effectiveTo || undefined,
        publicNote: record.publicNote ?? "",
        joiningPackCode: record.joiningPackCode || undefined,
        issuePackCode: record.issuePackCode || undefined,
        websiteProductId: record.websiteProductId || undefined,
        webSlug: record.webSlug || undefined,
        saleMode: (record.saleMode as WebsiteProductImportRow["saleMode"]) || "enquire",
      });
    }

    const result = rows.length > 0
      ? await bulkImportWebsiteProducts(rows, "csv_import")
      : { added: 0, updated: 0, unchanged: 0, errors: 0 };

    const touchedSlugs = new Set(
      rows.map((r) => CATEGORY_TO_PAGE_SLUG[r.category]).filter((s): s is string => !!s)
    );
    for (const slug of touchedSlugs) {
      try { revalidatePath(slug); } catch { /* no-op outside Next.js context */ }
    }

    return NextResponse.json({ ...result, rowErrors }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

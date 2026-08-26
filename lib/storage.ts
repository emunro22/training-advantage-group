// Storage layer: Neon PostgreSQL in production, JSON filesystem fallback in local dev.
// Neon is used when DATABASE_URL is set. Otherwise reads/writes data/*.json files.

import fs from "fs";
import path from "path";
import { getDb, ensureSchema } from "./db";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface Certificate {
  id: string;
  certificateNumber: string;
  holderFirstName: string;
  holderLastName: string;
  course: string;
  courseType: string;
  issueDate: string;
  expiryDate: string;
  status: "valid" | "expired" | "revoked" | "replaced";
  trainingCentre?: string;
  notes?: string;
  accreditedBy?: string[];
  accreditedRef?: string;
  createdAt: string;
}

export interface CustomPage {
  id: string;
  slug: string;
  title: string;
  navLabel: string;
  navCategory:
    | "standalone"
    | "transport"
    | "health-safety"
    | "plant"
    | "e-learning"
    | "consultancy"
    | "instructors"
    | "about"
    | "none";
  content: string;
  heroTitle?: string;
  heroSubtitle?: string;
  metaDescription?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SpecialOffer {
  id: string;
  title: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  courseId?: string;
  courseName?: string;
  validUntil?: string;
  active: boolean;
  promoCode?: string;
  createdAt: string;
}

export interface PriceOverride {
  id: string;
  courseId: string;
  courseName: string;
  originalPrice: string;
  overridePrice: string;
  label?: string;
  active: boolean;
}

export interface PricingStore {
  specialOffers: SpecialOffer[];
  priceOverrides: PriceOverride[];
}

export interface UpcomingCourse {
  id: string;
  courseId: string;
  courseName: string;
  date: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  location: string;
  spotsAvailable: number;
  totalSpots: number;
  price: string;
  vatStatus?: string;
  entryRequirements?: string;
  bookingUrl?: string;
  notes?: string;
  active: boolean;
  imageUrl?: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  role: string;
  text: string;
  rating: number;
  category?: string;
  active: boolean;
  featured: boolean;
  createdAt: string;
}

export interface WebsiteProduct {
  id: string;
  publishDecision: "Review Required" | "Director Approved" | "Web Pending" | "Published";
  priceId: string;
  websiteProductId?: string;
  category: string;
  courseService: string;
  variant: string;
  accreditation: string;
  delivery: string;
  durationRatio: string;
  maxCandidates: string;
  pricingBasis: string;
  priceIncVatPence: number;
  vatTreatment: string;
  netExVatPence: number;
  vatAmountPence: number;
  effectiveFrom?: string;
  effectiveTo?: string;
  publicNote: string;
  joiningPackCode?: string;
  issuePackCode?: string;
  webSlug?: string;
  saleMode: "book" | "enquire" | "quote";
  directorApprovedBy?: string;
  directorApprovedAt?: string;
  independentCheckBy?: string;
  independentCheckAt?: string;
  lastWebCheck?: string;
  needsVerification: boolean;
  source: "seed" | "csv_import" | "manual";
  createdAt: string;
  updatedAt: string;
}

export interface PublicationLogEntry {
  id: string;
  priceId?: string;
  changeType: string;
  previousValue?: string;
  newValue?: string;
  effectiveFrom?: string;
  requestedBy?: string;
  approvedBy?: string;
  webUpdatedBy?: string;
  publishedAt?: string;
  independentCheckBy?: string;
  verifiedAt?: string;
  evidenceTicket?: string;
  outcome?: string;
  createdAt: string;
}

export interface AccreditationLogo {
  id: string;
  name: string;
  typeLabel: string;
  logoUrl: string;
  linkUrl?: string;
  altText: string;
  placement: "footer" | "accreditations_page" | "both";
  sortOrder: number;
  active: boolean;
  createdAt: string;
}

export interface TagDocument {
  id: string;
  title: string;
  description: string;
  category: string;
  fileUrl: string;
  fileName: string;
  sortOrder: number;
  active: boolean;
  createdAt: string;
}

export interface PortalUser {
  id: string;
  tagId: string;
  name: string;
  type: "staff" | "instructor" | "supplier" | "candidate";
  accessCodeHash: string;
  accessCodeSalt: string;
  extraAreas: string[];
  active: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface PortalFormField {
  id: string;
  label: string;
  type: "text" | "textarea" | "date" | "email" | "tel" | "select";
  required: boolean;
  options?: string[];
}

export interface PortalResource {
  id: string;
  title: string;
  description: string;
  resourceType: "document" | "form_link" | "online_form";
  url: string;
  fileName?: string;
  area: string;
  sortOrder: number;
  active: boolean;
  createdAt: string;
  /** "online_form" only — the fields rendered by /portal/[type]/forms/[id]. */
  formFields?: PortalFormField[];
}

export interface PortalSubmission {
  id: string;
  kind: "form" | "upload";
  resourceId?: string;
  resourceTitle: string;
  portalUserId: string;
  tagId: string;
  userName: string;
  userType: string;
  area: string;
  courseRef?: string;
  answers: Record<string, string>;
  notes?: string;
  attachments: { fileName: string; url: string }[];
  status: "new" | "reviewed";
  submittedAt: string;
}

export interface ApprenticeshipPathway {
  id: string;
  icon: string;
  title: string;
  description: string;
  status: "developing" | "live";
  sortOrder: number;
  active: boolean;
  createdAt: string;
}

export interface JobVacancy {
  id: string;
  title: string;
  type: string;
  location: string;
  description: string;
  requirements: string[];
  icon: string;
  active: boolean;
  sortOrder: number;
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Backend detection
// ─────────────────────────────────────────────────────────────────────────────

const USE_NEON = !!process.env.DATABASE_URL;
const DATA_DIR = path.join(process.cwd(), "data");

// ─────────────────────────────────────────────────────────────────────────────
// Filesystem helpers (local dev fallback)
// ─────────────────────────────────────────────────────────────────────────────

function fsRead<T>(filename: string, defaultValue: T): T {
  try {
    const p = path.join(DATA_DIR, filename);
    if (!fs.existsSync(p)) return defaultValue;
    return JSON.parse(fs.readFileSync(p, "utf-8")) as T;
  } catch {
    return defaultValue;
  }
}

function fsWrite(filename: string, data: unknown): void {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("[storage] fsWrite error:", e);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Row → TypeScript mappers
// ─────────────────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToCert(r: any): Certificate {
  return {
    id: r.id,
    certificateNumber: r.certificate_number,
    holderFirstName: r.holder_first_name,
    holderLastName: r.holder_last_name,
    course: r.course,
    courseType: r.course_type,
    issueDate: r.issue_date,
    expiryDate: r.expiry_date,
    status: r.status,
    trainingCentre: r.training_centre ?? undefined,
    notes: r.notes ?? undefined,
    accreditedBy: Array.isArray(r.accredited_by) ? r.accredited_by : undefined,
    accreditedRef: r.accredited_ref ?? undefined,
    createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToPage(r: any): CustomPage {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    navLabel: r.nav_label,
    navCategory: r.nav_category,
    content: r.content,
    heroTitle: r.hero_title ?? undefined,
    heroSubtitle: r.hero_subtitle ?? undefined,
    metaDescription: r.meta_description ?? undefined,
    published: r.published,
    createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
    updatedAt: r.updated_at instanceof Date ? r.updated_at.toISOString() : String(r.updated_at),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToOffer(r: any): SpecialOffer {
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    discountType: r.discount_type,
    discountValue: Number(r.discount_value),
    courseId: r.course_id ?? undefined,
    courseName: r.course_name ?? undefined,
    validUntil: r.valid_until ?? undefined,
    active: r.active,
    promoCode: r.promo_code ?? undefined,
    createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToOverride(r: any): PriceOverride {
  return {
    id: r.id,
    courseId: r.course_id,
    courseName: r.course_name,
    originalPrice: r.original_price,
    overridePrice: r.override_price,
    label: r.label ?? undefined,
    active: r.active,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToCourse(r: any): UpcomingCourse {
  return {
    id: r.id,
    courseId: r.course_id,
    courseName: r.course_name,
    date: r.date,
    endDate: r.end_date ?? undefined,
    startTime: r.start_time ?? undefined,
    endTime: r.end_time ?? undefined,
    location: r.location,
    spotsAvailable: r.spots_available,
    totalSpots: r.total_spots,
    price: r.price,
    vatStatus: r.vat_status ?? undefined,
    entryRequirements: r.entry_requirements ?? undefined,
    bookingUrl: r.booking_url ?? undefined,
    notes: r.notes ?? undefined,
    active: r.active,
    imageUrl: r.image_url ?? undefined,
    createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Certificates
// ─────────────────────────────────────────────────────────────────────────────

export async function getCertificates(): Promise<Certificate[]> {
  if (USE_NEON) {
    await ensureSchema();
    const sql = getDb();
    const rows = await sql`SELECT * FROM certificates ORDER BY created_at DESC`;
    return rows.map(rowToCert);
  }
  const store = fsRead<{ certificates: Certificate[] }>("certificates.json", { certificates: [] });
  return store.certificates;
}

export async function verifyCertificate(
  certNumber: string,
  lastName?: string
): Promise<Certificate | null> {
  if (USE_NEON) {
    await ensureSchema();
    const sql = getDb();
    const rows = await sql`
      SELECT * FROM certificates
      WHERE LOWER(certificate_number) = LOWER(${certNumber.trim()})
      LIMIT 1
    `;
    if (rows.length === 0) return null;
    const cert = rowToCert(rows[0]);
    if (lastName && cert.holderLastName.toLowerCase() !== lastName.trim().toLowerCase()) return null;
    return cert;
  }
  const certs = await getCertificates();
  const cert = certs.find(
    (c) => c.certificateNumber.toLowerCase() === certNumber.trim().toLowerCase()
  );
  if (!cert) return null;
  if (lastName && cert.holderLastName.toLowerCase() !== lastName.trim().toLowerCase()) return null;
  return cert;
}

export async function addCertificate(c: Certificate): Promise<void> {
  if (USE_NEON) {
    await ensureSchema();
    const sql = getDb();
    await sql`
      INSERT INTO certificates
        (id, certificate_number, holder_first_name, holder_last_name, course, course_type,
         issue_date, expiry_date, status, training_centre, notes, accredited_by, accredited_ref)
      VALUES
        (${c.id}, ${c.certificateNumber}, ${c.holderFirstName}, ${c.holderLastName},
         ${c.course}, ${c.courseType}, ${c.issueDate}, ${c.expiryDate}, ${c.status},
         ${c.trainingCentre ?? null}, ${c.notes ?? null},
         ${JSON.stringify(c.accreditedBy ?? [])}, ${c.accreditedRef ?? null})
    `;
    return;
  }
  const store = fsRead<{ certificates: Certificate[] }>("certificates.json", { certificates: [] });
  store.certificates.push(c);
  fsWrite("certificates.json", store);
}

export async function updateCertificate(
  id: string,
  u: Partial<Certificate>
): Promise<boolean> {
  if (USE_NEON) {
    const sql = getDb();
    const result = await sql`
      UPDATE certificates SET
        certificate_number = COALESCE(${u.certificateNumber ?? null}, certificate_number),
        holder_first_name  = COALESCE(${u.holderFirstName ?? null}, holder_first_name),
        holder_last_name   = COALESCE(${u.holderLastName ?? null}, holder_last_name),
        course             = COALESCE(${u.course ?? null}, course),
        course_type        = COALESCE(${u.courseType ?? null}, course_type),
        issue_date         = COALESCE(${u.issueDate ?? null}, issue_date),
        expiry_date        = COALESCE(${u.expiryDate ?? null}, expiry_date),
        status             = COALESCE(${u.status ?? null}, status),
        training_centre    = COALESCE(${u.trainingCentre ?? null}, training_centre),
        notes              = COALESCE(${u.notes ?? null}, notes),
        accredited_by      = COALESCE(${u.accreditedBy != null ? JSON.stringify(u.accreditedBy) : null}, accredited_by),
        accredited_ref     = COALESCE(${u.accreditedRef ?? null}, accredited_ref)
      WHERE id = ${id}
      RETURNING id
    `;
    return result.length > 0;
  }
  const store = fsRead<{ certificates: Certificate[] }>("certificates.json", { certificates: [] });
  const idx = store.certificates.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  store.certificates[idx] = { ...store.certificates[idx], ...u };
  fsWrite("certificates.json", store);
  return true;
}

export async function deleteCertificate(id: string): Promise<boolean> {
  if (USE_NEON) {
    const sql = getDb();
    const result = await sql`DELETE FROM certificates WHERE id = ${id} RETURNING id`;
    return result.length > 0;
  }
  const store = fsRead<{ certificates: Certificate[] }>("certificates.json", { certificates: [] });
  const before = store.certificates.length;
  store.certificates = store.certificates.filter((c) => c.id !== id);
  fsWrite("certificates.json", store);
  return store.certificates.length < before;
}

// ─────────────────────────────────────────────────────────────────────────────
// Custom Pages
// ─────────────────────────────────────────────────────────────────────────────

export async function getCustomPages(publishedOnly = false): Promise<CustomPage[]> {
  if (USE_NEON) {
    await ensureSchema();
    const sql = getDb();
    const rows = publishedOnly
      ? await sql`SELECT * FROM custom_pages WHERE published = TRUE ORDER BY created_at DESC`
      : await sql`SELECT * FROM custom_pages ORDER BY created_at DESC`;
    return rows.map(rowToPage);
  }
  const store = fsRead<{ pages: CustomPage[] }>("custom-pages.json", { pages: [] });
  return publishedOnly ? store.pages.filter((p) => p.published) : store.pages;
}

export async function getCustomPageBySlug(slug: string): Promise<CustomPage | null> {
  if (USE_NEON) {
    await ensureSchema();
    const sql = getDb();
    const rows = await sql`SELECT * FROM custom_pages WHERE slug = ${slug} LIMIT 1`;
    return rows.length > 0 ? rowToPage(rows[0]) : null;
  }
  const pages = await getCustomPages();
  return pages.find((p) => p.slug === slug) ?? null;
}

export async function addCustomPage(p: CustomPage): Promise<void> {
  if (USE_NEON) {
    await ensureSchema();
    const sql = getDb();
    await sql`
      INSERT INTO custom_pages
        (id, slug, title, nav_label, nav_category, content, hero_title, hero_subtitle,
         meta_description, published)
      VALUES
        (${p.id}, ${p.slug}, ${p.title}, ${p.navLabel}, ${p.navCategory}, ${p.content},
         ${p.heroTitle ?? null}, ${p.heroSubtitle ?? null}, ${p.metaDescription ?? null},
         ${p.published})
    `;
    return;
  }
  const store = fsRead<{ pages: CustomPage[] }>("custom-pages.json", { pages: [] });
  store.pages.push(p);
  fsWrite("custom-pages.json", store);
}

export async function updateCustomPage(
  id: string,
  u: Partial<CustomPage>
): Promise<boolean> {
  if (USE_NEON) {
    const sql = getDb();
    const result = await sql`
      UPDATE custom_pages SET
        slug              = COALESCE(${u.slug ?? null}, slug),
        title             = COALESCE(${u.title ?? null}, title),
        nav_label         = COALESCE(${u.navLabel ?? null}, nav_label),
        nav_category      = COALESCE(${u.navCategory ?? null}, nav_category),
        content           = COALESCE(${u.content ?? null}, content),
        hero_title        = COALESCE(${u.heroTitle ?? null}, hero_title),
        hero_subtitle     = COALESCE(${u.heroSubtitle ?? null}, hero_subtitle),
        meta_description  = COALESCE(${u.metaDescription ?? null}, meta_description),
        published         = COALESCE(${u.published ?? null}, published),
        updated_at        = NOW()
      WHERE id = ${id}
      RETURNING id
    `;
    return result.length > 0;
  }
  const store = fsRead<{ pages: CustomPage[] }>("custom-pages.json", { pages: [] });
  const idx = store.pages.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  store.pages[idx] = { ...store.pages[idx], ...u, updatedAt: new Date().toISOString() };
  fsWrite("custom-pages.json", store);
  return true;
}

export async function deleteCustomPage(id: string): Promise<boolean> {
  if (USE_NEON) {
    const sql = getDb();
    const result = await sql`DELETE FROM custom_pages WHERE id = ${id} RETURNING id`;
    return result.length > 0;
  }
  const store = fsRead<{ pages: CustomPage[] }>("custom-pages.json", { pages: [] });
  const before = store.pages.length;
  store.pages = store.pages.filter((p) => p.id !== id);
  fsWrite("custom-pages.json", store);
  return store.pages.length < before;
}

// ─────────────────────────────────────────────────────────────────────────────
// Pricing & Offers
// ─────────────────────────────────────────────────────────────────────────────

export async function getPricingData(): Promise<PricingStore> {
  if (USE_NEON) {
    await ensureSchema();
    const sql = getDb();
    const [offerRows, overrideRows] = await Promise.all([
      sql`SELECT * FROM special_offers ORDER BY created_at DESC`,
      sql`SELECT * FROM price_overrides ORDER BY id`,
    ]);
    return {
      specialOffers: offerRows.map(rowToOffer),
      priceOverrides: overrideRows.map(rowToOverride),
    };
  }
  return fsRead<PricingStore>("pricing-offers.json", {
    specialOffers: [],
    priceOverrides: [],
  });
}

export async function addSpecialOffer(o: SpecialOffer): Promise<void> {
  if (USE_NEON) {
    await ensureSchema();
    const sql = getDb();
    await sql`
      INSERT INTO special_offers
        (id, title, description, discount_type, discount_value, course_id, course_name,
         valid_until, active, promo_code)
      VALUES
        (${o.id}, ${o.title}, ${o.description}, ${o.discountType}, ${o.discountValue},
         ${o.courseId ?? null}, ${o.courseName ?? null}, ${o.validUntil ?? null},
         ${o.active}, ${o.promoCode ?? null})
    `;
    return;
  }
  const data = await getPricingData();
  data.specialOffers.push(o);
  fsWrite("pricing-offers.json", data);
}

export async function updateSpecialOffer(
  id: string,
  u: Partial<SpecialOffer>
): Promise<boolean> {
  if (USE_NEON) {
    const sql = getDb();
    const result = await sql`
      UPDATE special_offers SET
        title          = COALESCE(${u.title ?? null}, title),
        description    = COALESCE(${u.description ?? null}, description),
        discount_type  = COALESCE(${u.discountType ?? null}, discount_type),
        discount_value = COALESCE(${u.discountValue ?? null}, discount_value),
        course_id      = COALESCE(${u.courseId ?? null}, course_id),
        course_name    = COALESCE(${u.courseName ?? null}, course_name),
        valid_until    = COALESCE(${u.validUntil ?? null}, valid_until),
        active         = COALESCE(${u.active ?? null}, active),
        promo_code     = COALESCE(${u.promoCode ?? null}, promo_code)
      WHERE id = ${id}
      RETURNING id
    `;
    return result.length > 0;
  }
  const data = await getPricingData();
  const idx = data.specialOffers.findIndex((o) => o.id === id);
  if (idx === -1) return false;
  data.specialOffers[idx] = { ...data.specialOffers[idx], ...u };
  fsWrite("pricing-offers.json", data);
  return true;
}

export async function deleteSpecialOffer(id: string): Promise<boolean> {
  if (USE_NEON) {
    const sql = getDb();
    const result = await sql`DELETE FROM special_offers WHERE id = ${id} RETURNING id`;
    return result.length > 0;
  }
  const data = await getPricingData();
  const before = data.specialOffers.length;
  data.specialOffers = data.specialOffers.filter((o) => o.id !== id);
  fsWrite("pricing-offers.json", data);
  return data.specialOffers.length < before;
}

export async function addPriceOverride(o: PriceOverride): Promise<void> {
  if (USE_NEON) {
    await ensureSchema();
    const sql = getDb();
    await sql`
      INSERT INTO price_overrides
        (id, course_id, course_name, original_price, override_price, label, active)
      VALUES
        (${o.id}, ${o.courseId}, ${o.courseName}, ${o.originalPrice}, ${o.overridePrice},
         ${o.label ?? null}, ${o.active})
    `;
    return;
  }
  const data = await getPricingData();
  data.priceOverrides.push(o);
  fsWrite("pricing-offers.json", data);
}

export async function updatePriceOverride(
  id: string,
  u: Partial<PriceOverride>
): Promise<boolean> {
  if (USE_NEON) {
    const sql = getDb();
    const result = await sql`
      UPDATE price_overrides SET
        course_id      = COALESCE(${u.courseId ?? null}, course_id),
        course_name    = COALESCE(${u.courseName ?? null}, course_name),
        original_price = COALESCE(${u.originalPrice ?? null}, original_price),
        override_price = COALESCE(${u.overridePrice ?? null}, override_price),
        label          = COALESCE(${u.label ?? null}, label),
        active         = COALESCE(${u.active ?? null}, active)
      WHERE id = ${id}
      RETURNING id
    `;
    return result.length > 0;
  }
  const data = await getPricingData();
  const idx = data.priceOverrides.findIndex((o) => o.id === id);
  if (idx === -1) return false;
  data.priceOverrides[idx] = { ...data.priceOverrides[idx], ...u };
  fsWrite("pricing-offers.json", data);
  return true;
}

export async function deletePriceOverride(id: string): Promise<boolean> {
  if (USE_NEON) {
    const sql = getDb();
    const result = await sql`DELETE FROM price_overrides WHERE id = ${id} RETURNING id`;
    return result.length > 0;
  }
  const data = await getPricingData();
  const before = data.priceOverrides.length;
  data.priceOverrides = data.priceOverrides.filter((o) => o.id !== id);
  fsWrite("pricing-offers.json", data);
  return data.priceOverrides.length < before;
}

// Keep the old savePricingData for API route backward compat (filesystem path only)
export async function savePricingData(data: PricingStore): Promise<void> {
  fsWrite("pricing-offers.json", data);
}

// ─────────────────────────────────────────────────────────────────────────────
// Testimonials
// ─────────────────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToTestimonial(r: any): Testimonial {
  return {
    id: r.id,
    name: r.name,
    company: r.company ?? "",
    role: r.role ?? "",
    text: r.text,
    rating: Number(r.rating),
    category: r.category ?? undefined,
    active: r.active,
    featured: r.featured,
    createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
  };
}

export async function getTestimonials(activeOnly = false): Promise<Testimonial[]> {
  if (USE_NEON) {
    await ensureSchema();
    const sql = getDb();
    const rows = activeOnly
      ? await sql`SELECT * FROM testimonials WHERE active = TRUE ORDER BY created_at ASC`
      : await sql`SELECT * FROM testimonials ORDER BY created_at ASC`;
    return rows.map(rowToTestimonial);
  }
  const store = fsRead<{ testimonials: Testimonial[] }>("testimonials.json", { testimonials: [] });
  return activeOnly ? store.testimonials.filter((t) => t.active) : store.testimonials;
}

export async function addTestimonial(t: Testimonial): Promise<void> {
  if (USE_NEON) {
    await ensureSchema();
    const sql = getDb();
    await sql`
      INSERT INTO testimonials (id, name, company, role, text, rating, category, active, featured)
      VALUES (${t.id}, ${t.name}, ${t.company}, ${t.role}, ${t.text}, ${t.rating},
              ${t.category ?? null}, ${t.active}, ${t.featured})
    `;
    return;
  }
  const store = fsRead<{ testimonials: Testimonial[] }>("testimonials.json", { testimonials: [] });
  store.testimonials.push(t);
  fsWrite("testimonials.json", store);
}

export async function updateTestimonial(id: string, u: Partial<Testimonial>): Promise<boolean> {
  if (USE_NEON) {
    const sql = getDb();
    const result = await sql`
      UPDATE testimonials SET
        name     = COALESCE(${u.name ?? null}, name),
        company  = COALESCE(${u.company ?? null}, company),
        role     = COALESCE(${u.role ?? null}, role),
        text     = COALESCE(${u.text ?? null}, text),
        rating   = COALESCE(${u.rating ?? null}, rating),
        category = COALESCE(${u.category ?? null}, category),
        active   = COALESCE(${u.active ?? null}, active),
        featured = COALESCE(${u.featured ?? null}, featured)
      WHERE id = ${id}
      RETURNING id
    `;
    return result.length > 0;
  }
  const store = fsRead<{ testimonials: Testimonial[] }>("testimonials.json", { testimonials: [] });
  const idx = store.testimonials.findIndex((t) => t.id === id);
  if (idx === -1) return false;
  store.testimonials[idx] = { ...store.testimonials[idx], ...u };
  fsWrite("testimonials.json", store);
  return true;
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  if (USE_NEON) {
    const sql = getDb();
    const result = await sql`DELETE FROM testimonials WHERE id = ${id} RETURNING id`;
    return result.length > 0;
  }
  const store = fsRead<{ testimonials: Testimonial[] }>("testimonials.json", { testimonials: [] });
  const before = store.testimonials.length;
  store.testimonials = store.testimonials.filter((t) => t.id !== id);
  fsWrite("testimonials.json", store);
  return store.testimonials.length < before;
}

// ─────────────────────────────────────────────────────────────────────────────
// Page Content Overrides
// ─────────────────────────────────────────────────────────────────────────────

export async function getPageContent(slug: string): Promise<Record<string, string>> {
  if (USE_NEON) {
    try {
      await ensureSchema();
      const sql = getDb();
      const rows = await sql`SELECT content FROM page_overrides WHERE slug = ${slug}`;
      return rows.length > 0 ? (rows[0].content as Record<string, string>) : {};
    } catch {
      return {};
    }
  }
  // Filesystem fallback: data/page-overrides/{slug}.json
  const dir = path.join(DATA_DIR, "page-overrides");
  const filePath = path.join(dir, `${slug}.json`);
  try {
    if (!fs.existsSync(filePath)) return {};
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as Record<string, string>;
  } catch {
    return {};
  }
}

export async function savePageContent(
  slug: string,
  content: Record<string, string>
): Promise<void> {
  if (USE_NEON) {
    await ensureSchema();
    const sql = getDb();
    await sql`
      INSERT INTO page_overrides (slug, content, updated_at)
      VALUES (${slug}, ${JSON.stringify(content)}, NOW())
      ON CONFLICT (slug) DO UPDATE SET
        content    = EXCLUDED.content,
        updated_at = NOW()
    `;
    return;
  }
  const dir = path.join(DATA_DIR, "page-overrides");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${slug}.json`), JSON.stringify(content, null, 2), "utf-8");
}

// ─────────────────────────────────────────────────────────────────────────────
// Upcoming Courses
// ─────────────────────────────────────────────────────────────────────────────

export async function getUpcomingCourses(activeOnly = false): Promise<UpcomingCourse[]> {
  if (USE_NEON) {
    await ensureSchema();
    const sql = getDb();
    const rows = activeOnly
      ? await sql`SELECT * FROM upcoming_courses WHERE active = TRUE AND date >= CURRENT_DATE::TEXT ORDER BY date ASC`
      : await sql`SELECT * FROM upcoming_courses ORDER BY date ASC`;
    return rows.map(rowToCourse);
  }
  const store = fsRead<{ courses: UpcomingCourse[] }>("upcoming-courses.json", { courses: [] });
  const today = new Date().toISOString().split("T")[0];
  return activeOnly
    ? store.courses.filter((c) => c.active && c.date >= today)
    : store.courses;
}

export async function deletePastUpcomingCourses(): Promise<number> {
  if (USE_NEON) {
    await ensureSchema();
    const sql = getDb();
    const result = await sql`
      DELETE FROM upcoming_courses WHERE date < CURRENT_DATE::TEXT RETURNING id
    `;
    return result.length;
  }
  const store = fsRead<{ courses: UpcomingCourse[] }>("upcoming-courses.json", { courses: [] });
  const today = new Date().toISOString().split("T")[0];
  const before = store.courses.length;
  store.courses = store.courses.filter((c) => c.date >= today);
  fsWrite("upcoming-courses.json", store);
  return before - store.courses.length;
}

export async function addUpcomingCourse(c: UpcomingCourse): Promise<void> {
  if (USE_NEON) {
    await ensureSchema();
    const sql = getDb();
    await sql`
      INSERT INTO upcoming_courses
        (id, course_id, course_name, date, end_date, start_time, end_time,
         location, spots_available, total_spots, price, vat_status, entry_requirements,
         booking_url, notes, active, image_url)
      VALUES
        (${c.id}, ${c.courseId}, ${c.courseName}, ${c.date}, ${c.endDate ?? null},
         ${c.startTime ?? null}, ${c.endTime ?? null},
         ${c.location}, ${c.spotsAvailable}, ${c.totalSpots}, ${c.price},
         ${c.vatStatus ?? null}, ${c.entryRequirements ?? null},
         ${c.bookingUrl ?? null}, ${c.notes ?? null}, ${c.active}, ${c.imageUrl ?? null})
    `;
    return;
  }
  const store = fsRead<{ courses: UpcomingCourse[] }>("upcoming-courses.json", { courses: [] });
  store.courses.push(c);
  fsWrite("upcoming-courses.json", store);
}

export async function updateUpcomingCourse(
  id: string,
  u: Partial<UpcomingCourse>
): Promise<boolean> {
  if (USE_NEON) {
    const sql = getDb();
    const result = await sql`
      UPDATE upcoming_courses SET
        course_id        = COALESCE(${u.courseId ?? null}, course_id),
        course_name      = COALESCE(${u.courseName ?? null}, course_name),
        date             = COALESCE(${u.date ?? null}, date),
        end_date         = COALESCE(${u.endDate ?? null}, end_date),
        start_time       = COALESCE(${u.startTime ?? null}, start_time),
        end_time         = COALESCE(${u.endTime ?? null}, end_time),
        location         = COALESCE(${u.location ?? null}, location),
        spots_available  = COALESCE(${u.spotsAvailable ?? null}, spots_available),
        total_spots      = COALESCE(${u.totalSpots ?? null}, total_spots),
        price            = COALESCE(${u.price ?? null}, price),
        vat_status        = COALESCE(${u.vatStatus ?? null}, vat_status),
        entry_requirements = COALESCE(${u.entryRequirements ?? null}, entry_requirements),
        booking_url      = COALESCE(${u.bookingUrl ?? null}, booking_url),
        notes            = COALESCE(${u.notes ?? null}, notes),
        active           = COALESCE(${u.active ?? null}, active),
        image_url        = COALESCE(${u.imageUrl ?? null}, image_url)
      WHERE id = ${id}
      RETURNING id
    `;
    return result.length > 0;
  }
  const store = fsRead<{ courses: UpcomingCourse[] }>("upcoming-courses.json", { courses: [] });
  const idx = store.courses.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  store.courses[idx] = { ...store.courses[idx], ...u };
  fsWrite("upcoming-courses.json", store);
  return true;
}

export async function deleteUpcomingCourse(id: string): Promise<boolean> {
  if (USE_NEON) {
    const sql = getDb();
    const result = await sql`DELETE FROM upcoming_courses WHERE id = ${id} RETURNING id`;
    return result.length > 0;
  }
  const store = fsRead<{ courses: UpcomingCourse[] }>("upcoming-courses.json", { courses: [] });
  const before = store.courses.length;
  store.courses = store.courses.filter((c) => c.id !== id);
  fsWrite("upcoming-courses.json", store);
  return store.courses.length < before;
}

// ─────────────────────────────────────────────────────────────────────────────
// Job Vacancies
// ─────────────────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToVacancy(r: any): JobVacancy {
  return {
    id: r.id,
    title: r.title,
    type: r.type,
    location: r.location,
    description: r.description,
    requirements: Array.isArray(r.requirements) ? r.requirements : [],
    icon: r.icon ?? "💼",
    active: r.active,
    sortOrder: Number(r.sort_order ?? 0),
    createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
  };
}

export async function getJobVacancies(activeOnly = false): Promise<JobVacancy[]> {
  if (USE_NEON) {
    await ensureSchema();
    const sql = getDb();
    const rows = activeOnly
      ? await sql`SELECT * FROM job_vacancies WHERE active = TRUE ORDER BY sort_order ASC, created_at ASC`
      : await sql`SELECT * FROM job_vacancies ORDER BY sort_order ASC, created_at ASC`;
    return rows.map(rowToVacancy);
  }
  const store = fsRead<{ vacancies: JobVacancy[] }>("job-vacancies.json", { vacancies: [] });
  return activeOnly ? store.vacancies.filter((v) => v.active) : store.vacancies;
}

export async function addJobVacancy(v: JobVacancy): Promise<void> {
  if (USE_NEON) {
    await ensureSchema();
    const sql = getDb();
    await sql`
      INSERT INTO job_vacancies
        (id, title, type, location, description, requirements, icon, active, sort_order)
      VALUES
        (${v.id}, ${v.title}, ${v.type}, ${v.location}, ${v.description},
         ${JSON.stringify(v.requirements)}, ${v.icon}, ${v.active}, ${v.sortOrder})
    `;
    return;
  }
  const store = fsRead<{ vacancies: JobVacancy[] }>("job-vacancies.json", { vacancies: [] });
  store.vacancies.push(v);
  fsWrite("job-vacancies.json", store);
}

export async function updateJobVacancy(id: string, u: Partial<JobVacancy>): Promise<boolean> {
  if (USE_NEON) {
    const sql = getDb();
    const result = await sql`
      UPDATE job_vacancies SET
        title       = COALESCE(${u.title ?? null}, title),
        type        = COALESCE(${u.type ?? null}, type),
        location    = COALESCE(${u.location ?? null}, location),
        description = COALESCE(${u.description ?? null}, description),
        requirements = COALESCE(${u.requirements != null ? JSON.stringify(u.requirements) : null}, requirements),
        icon        = COALESCE(${u.icon ?? null}, icon),
        active      = COALESCE(${u.active ?? null}, active),
        sort_order  = COALESCE(${u.sortOrder ?? null}, sort_order)
      WHERE id = ${id}
      RETURNING id
    `;
    return result.length > 0;
  }
  const store = fsRead<{ vacancies: JobVacancy[] }>("job-vacancies.json", { vacancies: [] });
  const idx = store.vacancies.findIndex((v) => v.id === id);
  if (idx === -1) return false;
  store.vacancies[idx] = { ...store.vacancies[idx], ...u };
  fsWrite("job-vacancies.json", store);
  return true;
}

export async function deleteJobVacancy(id: string): Promise<boolean> {
  if (USE_NEON) {
    const sql = getDb();
    const result = await sql`DELETE FROM job_vacancies WHERE id = ${id} RETURNING id`;
    return result.length > 0;
  }
  const store = fsRead<{ vacancies: JobVacancy[] }>("job-vacancies.json", { vacancies: [] });
  const before = store.vacancies.length;
  store.vacancies = store.vacancies.filter((v) => v.id !== id);
  fsWrite("job-vacancies.json", store);
  return store.vacancies.length < before;
}

// ─────────────────────────────────────────────────────────────────────────────
// Website Products (governed Master Pricing → Website catalogue)
// ─────────────────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToProduct(r: any): WebsiteProduct {
  return {
    id: r.id,
    publishDecision: r.publish_decision,
    priceId: r.price_id,
    websiteProductId: r.website_product_id ?? undefined,
    category: r.category,
    courseService: r.course_service,
    variant: r.variant ?? "",
    accreditation: r.accreditation ?? "",
    delivery: r.delivery ?? "",
    durationRatio: r.duration_ratio ?? "",
    maxCandidates: r.max_candidates ?? "",
    pricingBasis: r.pricing_basis ?? "",
    priceIncVatPence: Number(r.price_inc_vat_pence ?? 0),
    vatTreatment: r.vat_treatment ?? "Standard 20%",
    netExVatPence: Number(r.net_ex_vat_pence ?? 0),
    vatAmountPence: Number(r.vat_amount_pence ?? 0),
    effectiveFrom: r.effective_from ?? undefined,
    effectiveTo: r.effective_to ?? undefined,
    publicNote: r.public_note ?? "",
    joiningPackCode: r.joining_pack_code ?? undefined,
    issuePackCode: r.issue_pack_code ?? undefined,
    webSlug: r.web_slug ?? undefined,
    saleMode: r.sale_mode ?? "enquire",
    directorApprovedBy: r.director_approved_by ?? undefined,
    directorApprovedAt:
      r.director_approved_at instanceof Date ? r.director_approved_at.toISOString() : r.director_approved_at ?? undefined,
    independentCheckBy: r.independent_check_by ?? undefined,
    independentCheckAt:
      r.independent_check_at instanceof Date ? r.independent_check_at.toISOString() : r.independent_check_at ?? undefined,
    lastWebCheck: r.last_web_check ?? undefined,
    needsVerification: r.needs_verification,
    source: r.source,
    createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
    updatedAt: r.updated_at instanceof Date ? r.updated_at.toISOString() : String(r.updated_at),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToLogEntry(r: any): PublicationLogEntry {
  return {
    id: r.id,
    priceId: r.price_id ?? undefined,
    changeType: r.change_type,
    previousValue: r.previous_value ?? undefined,
    newValue: r.new_value ?? undefined,
    effectiveFrom: r.effective_from ?? undefined,
    requestedBy: r.requested_by ?? undefined,
    approvedBy: r.approved_by ?? undefined,
    webUpdatedBy: r.web_updated_by ?? undefined,
    publishedAt: r.published_at instanceof Date ? r.published_at.toISOString() : r.published_at ?? undefined,
    independentCheckBy: r.independent_check_by ?? undefined,
    verifiedAt: r.verified_at instanceof Date ? r.verified_at.toISOString() : r.verified_at ?? undefined,
    evidenceTicket: r.evidence_ticket ?? undefined,
    outcome: r.outcome ?? undefined,
    createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
  };
}

export async function getWebsiteProducts(): Promise<WebsiteProduct[]> {
  if (USE_NEON) {
    await ensureSchema();
    const sql = getDb();
    const rows = await sql`SELECT * FROM website_products ORDER BY category, course_service, variant`;
    return rows.map(rowToProduct);
  }
  const store = fsRead<{ products: WebsiteProduct[] }>("website-products.json", { products: [] });
  return store.products;
}

// Only rows an admin has explicitly moved to Published, and within their effective date window,
// may ever reach a public page — enforces TAG-WEB-REQ-001 §4 ("Review Required is not authority to publish").
export async function getPublishedWebsiteProducts(): Promise<WebsiteProduct[]> {
  const all = await getWebsiteProducts();
  const today = new Date().toISOString().split("T")[0];
  return all.filter((p) => {
    if (p.publishDecision !== "Published") return false;
    if (p.effectiveFrom && p.effectiveFrom > today) return false;
    if (p.effectiveTo && p.effectiveTo < today) return false;
    return true;
  });
}

export async function getWebsiteProductById(id: string): Promise<WebsiteProduct | null> {
  if (USE_NEON) {
    await ensureSchema();
    const sql = getDb();
    const rows = await sql`SELECT * FROM website_products WHERE id = ${id} LIMIT 1`;
    return rows.length > 0 ? rowToProduct(rows[0]) : null;
  }
  const products = await getWebsiteProducts();
  return products.find((p) => p.id === id) ?? null;
}

export async function addWebsiteProduct(p: WebsiteProduct): Promise<void> {
  if (USE_NEON) {
    await ensureSchema();
    const sql = getDb();
    await sql`
      INSERT INTO website_products
        (id, publish_decision, price_id, website_product_id, category, course_service, variant,
         accreditation, delivery, duration_ratio, max_candidates, pricing_basis,
         price_inc_vat_pence, vat_treatment, net_ex_vat_pence, vat_amount_pence,
         effective_from, effective_to, public_note, joining_pack_code, issue_pack_code,
         web_slug, sale_mode, needs_verification, source)
      VALUES
        (${p.id}, ${p.publishDecision}, ${p.priceId}, ${p.websiteProductId ?? null}, ${p.category},
         ${p.courseService}, ${p.variant}, ${p.accreditation}, ${p.delivery}, ${p.durationRatio},
         ${p.maxCandidates}, ${p.pricingBasis}, ${p.priceIncVatPence}, ${p.vatTreatment},
         ${p.netExVatPence}, ${p.vatAmountPence}, ${p.effectiveFrom ?? null}, ${p.effectiveTo ?? null},
         ${p.publicNote}, ${p.joiningPackCode ?? null}, ${p.issuePackCode ?? null}, ${p.webSlug ?? null},
         ${p.saleMode}, ${p.needsVerification}, ${p.source})
      ON CONFLICT (price_id) DO NOTHING
    `;
    return;
  }
  const store = fsRead<{ products: WebsiteProduct[] }>("website-products.json", { products: [] });
  if (store.products.some((x) => x.priceId === p.priceId)) return;
  store.products.push(p);
  fsWrite("website-products.json", store);
}

export async function updateWebsiteProduct(
  id: string,
  u: Partial<WebsiteProduct>
): Promise<boolean> {
  if (USE_NEON) {
    const sql = getDb();
    const result = await sql`
      UPDATE website_products SET
        publish_decision      = COALESCE(${u.publishDecision ?? null}, publish_decision),
        website_product_id    = COALESCE(${u.websiteProductId ?? null}, website_product_id),
        category               = COALESCE(${u.category ?? null}, category),
        course_service         = COALESCE(${u.courseService ?? null}, course_service),
        variant                = COALESCE(${u.variant ?? null}, variant),
        accreditation          = COALESCE(${u.accreditation ?? null}, accreditation),
        delivery               = COALESCE(${u.delivery ?? null}, delivery),
        duration_ratio         = COALESCE(${u.durationRatio ?? null}, duration_ratio),
        max_candidates         = COALESCE(${u.maxCandidates ?? null}, max_candidates),
        pricing_basis          = COALESCE(${u.pricingBasis ?? null}, pricing_basis),
        price_inc_vat_pence    = COALESCE(${u.priceIncVatPence ?? null}, price_inc_vat_pence),
        vat_treatment          = COALESCE(${u.vatTreatment ?? null}, vat_treatment),
        net_ex_vat_pence       = COALESCE(${u.netExVatPence ?? null}, net_ex_vat_pence),
        vat_amount_pence       = COALESCE(${u.vatAmountPence ?? null}, vat_amount_pence),
        effective_from         = COALESCE(${u.effectiveFrom ?? null}, effective_from),
        effective_to           = COALESCE(${u.effectiveTo ?? null}, effective_to),
        public_note            = COALESCE(${u.publicNote ?? null}, public_note),
        joining_pack_code      = COALESCE(${u.joiningPackCode ?? null}, joining_pack_code),
        issue_pack_code        = COALESCE(${u.issuePackCode ?? null}, issue_pack_code),
        web_slug               = COALESCE(${u.webSlug ?? null}, web_slug),
        sale_mode              = COALESCE(${u.saleMode ?? null}, sale_mode),
        director_approved_by   = COALESCE(${u.directorApprovedBy ?? null}, director_approved_by),
        director_approved_at   = COALESCE(${u.directorApprovedAt ?? null}, director_approved_at),
        independent_check_by   = COALESCE(${u.independentCheckBy ?? null}, independent_check_by),
        independent_check_at   = COALESCE(${u.independentCheckAt ?? null}, independent_check_at),
        last_web_check         = COALESCE(${u.lastWebCheck ?? null}, last_web_check),
        needs_verification     = COALESCE(${u.needsVerification ?? null}, needs_verification),
        updated_at             = NOW()
      WHERE id = ${id}
      RETURNING id
    `;
    return result.length > 0;
  }
  const store = fsRead<{ products: WebsiteProduct[] }>("website-products.json", { products: [] });
  const idx = store.products.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  store.products[idx] = { ...store.products[idx], ...u, updatedAt: new Date().toISOString() };
  fsWrite("website-products.json", store);
  return true;
}

export async function deleteWebsiteProduct(id: string): Promise<boolean> {
  if (USE_NEON) {
    const sql = getDb();
    const result = await sql`DELETE FROM website_products WHERE id = ${id} RETURNING id`;
    return result.length > 0;
  }
  const store = fsRead<{ products: WebsiteProduct[] }>("website-products.json", { products: [] });
  const before = store.products.length;
  store.products = store.products.filter((p) => p.id !== id);
  fsWrite("website-products.json", store);
  return store.products.length < before;
}

export async function addPublicationLogEntry(e: PublicationLogEntry): Promise<void> {
  if (USE_NEON) {
    await ensureSchema();
    const sql = getDb();
    await sql`
      INSERT INTO pricing_publication_log
        (id, price_id, change_type, previous_value, new_value, effective_from, requested_by,
         approved_by, web_updated_by, published_at, independent_check_by, verified_at,
         evidence_ticket, outcome)
      VALUES
        (${e.id}, ${e.priceId ?? null}, ${e.changeType}, ${e.previousValue ?? null}, ${e.newValue ?? null},
         ${e.effectiveFrom ?? null}, ${e.requestedBy ?? null}, ${e.approvedBy ?? null},
         ${e.webUpdatedBy ?? null}, ${e.publishedAt ?? null}, ${e.independentCheckBy ?? null},
         ${e.verifiedAt ?? null}, ${e.evidenceTicket ?? null}, ${e.outcome ?? null})
    `;
    return;
  }
  const store = fsRead<{ log: PublicationLogEntry[] }>("pricing-publication-log.json", { log: [] });
  store.log.push(e);
  fsWrite("pricing-publication-log.json", store);
}

export async function getPublicationLog(): Promise<PublicationLogEntry[]> {
  if (USE_NEON) {
    await ensureSchema();
    const sql = getDb();
    const rows = await sql`SELECT * FROM pricing_publication_log ORDER BY created_at DESC`;
    return rows.map(rowToLogEntry);
  }
  const store = fsRead<{ log: PublicationLogEntry[] }>("pricing-publication-log.json", { log: [] });
  return store.log;
}

// CSV/manual bulk import. Re-importing an existing Price ID updates only the catalogue fields
// (never publish state/approval metadata) and — if the price or course details actually changed —
// resets publish_decision back to "Review Required" so a changed price is never left live
// without fresh Director approval, and logs the change for audit.
export type WebsiteProductImportRow = Omit<
  WebsiteProduct,
  "id" | "createdAt" | "updatedAt" | "publishDecision" | "source" | "needsVerification"
> & { id?: string };

export async function bulkImportWebsiteProducts(
  rows: WebsiteProductImportRow[],
  source: WebsiteProduct["source"] = "csv_import"
): Promise<{ added: number; updated: number; unchanged: number; errors: number }> {
  const existing = await getWebsiteProducts();
  const existingByPriceId = new Map(existing.map((p) => [p.priceId, p]));
  let added = 0;
  let updated = 0;
  let unchanged = 0;
  let errors = 0;

  for (const row of rows as WebsiteProduct[]) {
    try {
      const current = existingByPriceId.get(row.priceId);
      if (!current) {
        const id = row.id ?? `wp-${row.priceId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const now = new Date().toISOString();
        await addWebsiteProduct({
          ...row,
          id,
          publishDecision: "Review Required",
          needsVerification: true,
          source,
          createdAt: now,
          updatedAt: now,
        });
        await addPublicationLogEntry({
          id: `log-${id}`,
          priceId: row.priceId,
          changeType: source === "seed" ? "Seed — new product" : "CSV import — new product",
          newValue: `${row.courseService} / ${row.variant} — £${(row.priceIncVatPence / 100).toFixed(2)} inc VAT`,
          requestedBy: source === "seed" ? "Sample seed" : "CSV import",
          outcome: "Added as Review Required",
          createdAt: now,
        });
        added++;
        continue;
      }

      const changed =
        current.priceIncVatPence !== row.priceIncVatPence ||
        current.vatTreatment !== row.vatTreatment ||
        current.courseService !== row.courseService ||
        current.variant !== row.variant;

      if (!changed) {
        unchanged++;
        continue;
      }

      const now = new Date().toISOString();
      await updateWebsiteProduct(current.id, {
        category: row.category,
        courseService: row.courseService,
        variant: row.variant,
        accreditation: row.accreditation,
        delivery: row.delivery,
        durationRatio: row.durationRatio,
        maxCandidates: row.maxCandidates,
        pricingBasis: row.pricingBasis,
        priceIncVatPence: row.priceIncVatPence,
        vatTreatment: row.vatTreatment,
        netExVatPence: row.netExVatPence,
        vatAmountPence: row.vatAmountPence,
        effectiveFrom: row.effectiveFrom,
        effectiveTo: row.effectiveTo,
        publicNote: row.publicNote,
        publishDecision: "Review Required",
        needsVerification: true,
      });
      await addPublicationLogEntry({
        id: `log-${current.id}-${Date.now()}`,
        priceId: row.priceId,
        changeType: "CSV import — price/detail change",
        previousValue: `£${(current.priceIncVatPence / 100).toFixed(2)} (${current.vatTreatment})`,
        newValue: `£${(row.priceIncVatPence / 100).toFixed(2)} (${row.vatTreatment})`,
        requestedBy: "CSV import",
        outcome: "Reset to Review Required — requires re-approval before publishing",
        createdAt: now,
      });
      updated++;
    } catch (e) {
      console.error("[storage] bulkImportWebsiteProducts row error:", e);
      errors++;
    }
  }

  return { added, updated, unchanged, errors };
}

export async function bulkAddCertificates(
  certs: Certificate[]
): Promise<{ added: number; skipped: number; errors: number }> {
  if (certs.length === 0) return { added: 0, skipped: 0, errors: 0 };

  if (USE_NEON) {
    await ensureSchema();
    const sql = getDb();
    const numbers = certs.map((c) => c.certificateNumber);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existing = await sql`SELECT certificate_number FROM certificates WHERE certificate_number = ANY(${numbers as any})`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existingSet = new Set((existing as Array<{ certificate_number: string }>).map((r) => r.certificate_number.toLowerCase()));
    const toInsert = certs.filter((c) => !existingSet.has(c.certificateNumber.toLowerCase()));
    let added = 0;
    let errors = 0;
    const batchSize = 50;
    for (let i = 0; i < toInsert.length; i += batchSize) {
      const batch = toInsert.slice(i, i + batchSize);
      const results = await Promise.all(
        batch.map(async (c) => {
          try {
            await sql`
              INSERT INTO certificates
                (id, certificate_number, holder_first_name, holder_last_name, course, course_type,
                 issue_date, expiry_date, status, training_centre, notes)
              VALUES
                (${c.id}, ${c.certificateNumber}, ${c.holderFirstName}, ${c.holderLastName},
                 ${c.course}, ${c.courseType}, ${c.issueDate}, ${c.expiryDate}, ${c.status},
                 ${c.trainingCentre ?? null}, ${c.notes ?? null})
              ON CONFLICT (certificate_number) DO NOTHING
            `;
            return true;
          } catch {
            return false;
          }
        })
      );
      added += results.filter(Boolean).length;
      errors += results.filter((r) => !r).length;
    }
    return { added, skipped: certs.length - toInsert.length, errors };
  }

  const store = fsRead<{ certificates: Certificate[] }>("certificates.json", { certificates: [] });
  const existingSet = new Set(store.certificates.map((c) => c.certificateNumber.toLowerCase()));
  let added = 0;
  let skipped = 0;
  for (const cert of certs) {
    if (existingSet.has(cert.certificateNumber.toLowerCase())) {
      skipped++;
    } else {
      store.certificates.push(cert);
      existingSet.add(cert.certificateNumber.toLowerCase());
      added++;
    }
  }
  if (added > 0) fsWrite("certificates.json", store);
  return { added, skipped, errors: 0 };
}

export async function bulkAddUpcomingCourses(
  courses: UpcomingCourse[]
): Promise<{ added: number; errors: number }> {
  if (courses.length === 0) return { added: 0, errors: 0 };

  if (USE_NEON) {
    await ensureSchema();
    const sql = getDb();
    let added = 0;
    let errors = 0;
    const batchSize = 50;
    for (let i = 0; i < courses.length; i += batchSize) {
      const batch = courses.slice(i, i + batchSize);
      const results = await Promise.all(
        batch.map(async (c) => {
          try {
            await sql`
              INSERT INTO upcoming_courses
                (id, course_id, course_name, date, end_date, start_time, end_time,
                 location, spots_available, total_spots, price, booking_url, notes, active, image_url)
              VALUES
                (${c.id}, ${c.courseId}, ${c.courseName}, ${c.date}, ${c.endDate ?? null},
                 ${c.startTime ?? null}, ${c.endTime ?? null},
                 ${c.location}, ${c.spotsAvailable}, ${c.totalSpots}, ${c.price},
                 ${c.bookingUrl ?? null}, ${c.notes ?? null}, ${c.active}, ${c.imageUrl ?? null})
            `;
            return true;
          } catch {
            return false;
          }
        })
      );
      added += results.filter(Boolean).length;
      errors += results.filter((r) => !r).length;
    }
    return { added, errors };
  }

  const store = fsRead<{ courses: UpcomingCourse[] }>("upcoming-courses.json", { courses: [] });
  for (const course of courses) store.courses.push(course);
  fsWrite("upcoming-courses.json", store);
  return { added: courses.length, errors: 0 };
}

// ─────────────────────────────────────────────────────────────────────────────
// Accreditation Logos
// ─────────────────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToAccreditationLogo(r: any): AccreditationLogo {
  return {
    id: r.id,
    name: r.name,
    typeLabel: r.type_label ?? "",
    logoUrl: r.logo_url,
    linkUrl: r.link_url ?? undefined,
    altText: r.alt_text ?? "",
    placement: r.placement ?? "both",
    sortOrder: Number(r.sort_order ?? 0),
    active: r.active,
    createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
  };
}

export async function getAccreditationLogos(activeOnly = false): Promise<AccreditationLogo[]> {
  if (USE_NEON) {
    await ensureSchema();
    const sql = getDb();
    const rows = activeOnly
      ? await sql`SELECT * FROM accreditation_logos WHERE active = TRUE ORDER BY sort_order ASC, created_at ASC`
      : await sql`SELECT * FROM accreditation_logos ORDER BY sort_order ASC, created_at ASC`;
    return rows.map(rowToAccreditationLogo);
  }
  const store = fsRead<{ logos: AccreditationLogo[] }>("accreditation-logos.json", { logos: [] });
  return activeOnly ? store.logos.filter((l) => l.active) : store.logos;
}

export async function addAccreditationLogo(l: AccreditationLogo): Promise<void> {
  if (USE_NEON) {
    await ensureSchema();
    const sql = getDb();
    await sql`
      INSERT INTO accreditation_logos
        (id, name, type_label, logo_url, link_url, alt_text, placement, sort_order, active)
      VALUES
        (${l.id}, ${l.name}, ${l.typeLabel}, ${l.logoUrl}, ${l.linkUrl ?? null}, ${l.altText},
         ${l.placement}, ${l.sortOrder}, ${l.active})
    `;
    return;
  }
  const store = fsRead<{ logos: AccreditationLogo[] }>("accreditation-logos.json", { logos: [] });
  store.logos.push(l);
  fsWrite("accreditation-logos.json", store);
}

export async function updateAccreditationLogo(id: string, u: Partial<AccreditationLogo>): Promise<boolean> {
  if (USE_NEON) {
    const sql = getDb();
    const result = await sql`
      UPDATE accreditation_logos SET
        name       = COALESCE(${u.name ?? null}, name),
        type_label = COALESCE(${u.typeLabel ?? null}, type_label),
        logo_url   = COALESCE(${u.logoUrl ?? null}, logo_url),
        link_url   = COALESCE(${u.linkUrl ?? null}, link_url),
        alt_text   = COALESCE(${u.altText ?? null}, alt_text),
        placement  = COALESCE(${u.placement ?? null}, placement),
        sort_order = COALESCE(${u.sortOrder ?? null}, sort_order),
        active     = COALESCE(${u.active ?? null}, active)
      WHERE id = ${id}
      RETURNING id
    `;
    return result.length > 0;
  }
  const store = fsRead<{ logos: AccreditationLogo[] }>("accreditation-logos.json", { logos: [] });
  const idx = store.logos.findIndex((l) => l.id === id);
  if (idx === -1) return false;
  store.logos[idx] = { ...store.logos[idx], ...u };
  fsWrite("accreditation-logos.json", store);
  return true;
}

export async function deleteAccreditationLogo(id: string): Promise<boolean> {
  if (USE_NEON) {
    const sql = getDb();
    const result = await sql`DELETE FROM accreditation_logos WHERE id = ${id} RETURNING id`;
    return result.length > 0;
  }
  const store = fsRead<{ logos: AccreditationLogo[] }>("accreditation-logos.json", { logos: [] });
  const before = store.logos.length;
  store.logos = store.logos.filter((l) => l.id !== id);
  fsWrite("accreditation-logos.json", store);
  return store.logos.length < before;
}

// ─────────────────────────────────────────────────────────────────────────────
// Documents (public downloads)
// ─────────────────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToDocument(r: any): TagDocument {
  return {
    id: r.id,
    title: r.title,
    description: r.description ?? "",
    category: r.category ?? "General",
    fileUrl: r.file_url,
    fileName: r.file_name ?? "",
    sortOrder: Number(r.sort_order ?? 0),
    active: r.active,
    createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
  };
}

export async function getDocuments(activeOnly = false): Promise<TagDocument[]> {
  if (USE_NEON) {
    await ensureSchema();
    const sql = getDb();
    const rows = activeOnly
      ? await sql`SELECT * FROM documents WHERE active = TRUE ORDER BY category ASC, sort_order ASC, created_at ASC`
      : await sql`SELECT * FROM documents ORDER BY category ASC, sort_order ASC, created_at ASC`;
    return rows.map(rowToDocument);
  }
  const store = fsRead<{ documents: TagDocument[] }>("documents.json", { documents: [] });
  return activeOnly ? store.documents.filter((d) => d.active) : store.documents;
}

export async function addDocument(d: TagDocument): Promise<void> {
  if (USE_NEON) {
    await ensureSchema();
    const sql = getDb();
    await sql`
      INSERT INTO documents (id, title, description, category, file_url, file_name, sort_order, active)
      VALUES (${d.id}, ${d.title}, ${d.description}, ${d.category}, ${d.fileUrl}, ${d.fileName},
              ${d.sortOrder}, ${d.active})
    `;
    return;
  }
  const store = fsRead<{ documents: TagDocument[] }>("documents.json", { documents: [] });
  store.documents.push(d);
  fsWrite("documents.json", store);
}

export async function updateDocument(id: string, u: Partial<TagDocument>): Promise<boolean> {
  if (USE_NEON) {
    const sql = getDb();
    const result = await sql`
      UPDATE documents SET
        title       = COALESCE(${u.title ?? null}, title),
        description = COALESCE(${u.description ?? null}, description),
        category    = COALESCE(${u.category ?? null}, category),
        file_url    = COALESCE(${u.fileUrl ?? null}, file_url),
        file_name   = COALESCE(${u.fileName ?? null}, file_name),
        sort_order  = COALESCE(${u.sortOrder ?? null}, sort_order),
        active      = COALESCE(${u.active ?? null}, active)
      WHERE id = ${id}
      RETURNING id
    `;
    return result.length > 0;
  }
  const store = fsRead<{ documents: TagDocument[] }>("documents.json", { documents: [] });
  const idx = store.documents.findIndex((d) => d.id === id);
  if (idx === -1) return false;
  store.documents[idx] = { ...store.documents[idx], ...u };
  fsWrite("documents.json", store);
  return true;
}

export async function deleteDocument(id: string): Promise<boolean> {
  if (USE_NEON) {
    const sql = getDb();
    const result = await sql`DELETE FROM documents WHERE id = ${id} RETURNING id`;
    return result.length > 0;
  }
  const store = fsRead<{ documents: TagDocument[] }>("documents.json", { documents: [] });
  const before = store.documents.length;
  store.documents = store.documents.filter((d) => d.id !== id);
  fsWrite("documents.json", store);
  return store.documents.length < before;
}

// ─────────────────────────────────────────────────────────────────────────────
// Secure Portal — Users
// ─────────────────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToPortalUser(r: any): PortalUser {
  return {
    id: r.id,
    tagId: r.tag_id,
    name: r.name ?? "",
    type: r.type,
    accessCodeHash: r.access_code_hash,
    accessCodeSalt: r.access_code_salt,
    extraAreas: Array.isArray(r.extra_areas) ? r.extra_areas : [],
    active: r.active,
    lastLoginAt: r.last_login_at
      ? r.last_login_at instanceof Date
        ? r.last_login_at.toISOString()
        : String(r.last_login_at)
      : undefined,
    createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
  };
}

export async function getPortalUsers(): Promise<PortalUser[]> {
  if (USE_NEON) {
    await ensureSchema();
    const sql = getDb();
    const rows = await sql`SELECT * FROM portal_users ORDER BY created_at DESC`;
    return rows.map(rowToPortalUser);
  }
  const store = fsRead<{ users: PortalUser[] }>("portal-users.json", { users: [] });
  return store.users;
}

export async function getPortalUserByTagId(tagId: string): Promise<PortalUser | null> {
  if (USE_NEON) {
    await ensureSchema();
    const sql = getDb();
    const rows = await sql`SELECT * FROM portal_users WHERE UPPER(tag_id) = UPPER(${tagId}) LIMIT 1`;
    return rows.length > 0 ? rowToPortalUser(rows[0]) : null;
  }
  const users = await getPortalUsers();
  return users.find((u) => u.tagId.toLowerCase() === tagId.toLowerCase()) ?? null;
}

export async function getPortalUserById(id: string): Promise<PortalUser | null> {
  if (USE_NEON) {
    await ensureSchema();
    const sql = getDb();
    const rows = await sql`SELECT * FROM portal_users WHERE id = ${id} LIMIT 1`;
    return rows.length > 0 ? rowToPortalUser(rows[0]) : null;
  }
  const users = await getPortalUsers();
  return users.find((u) => u.id === id) ?? null;
}

export async function addPortalUser(u: PortalUser): Promise<void> {
  if (USE_NEON) {
    await ensureSchema();
    const sql = getDb();
    await sql`
      INSERT INTO portal_users
        (id, tag_id, name, type, access_code_hash, access_code_salt, extra_areas, active)
      VALUES
        (${u.id}, ${u.tagId}, ${u.name}, ${u.type}, ${u.accessCodeHash}, ${u.accessCodeSalt},
         ${JSON.stringify(u.extraAreas)}, ${u.active})
    `;
    return;
  }
  const store = fsRead<{ users: PortalUser[] }>("portal-users.json", { users: [] });
  store.users.push(u);
  fsWrite("portal-users.json", store);
}

export async function updatePortalUser(id: string, u: Partial<PortalUser>): Promise<boolean> {
  if (USE_NEON) {
    const sql = getDb();
    const result = await sql`
      UPDATE portal_users SET
        tag_id            = COALESCE(${u.tagId ?? null}, tag_id),
        name              = COALESCE(${u.name ?? null}, name),
        type              = COALESCE(${u.type ?? null}, type),
        access_code_hash  = COALESCE(${u.accessCodeHash ?? null}, access_code_hash),
        access_code_salt  = COALESCE(${u.accessCodeSalt ?? null}, access_code_salt),
        extra_areas       = COALESCE(${u.extraAreas != null ? JSON.stringify(u.extraAreas) : null}, extra_areas),
        active            = COALESCE(${u.active ?? null}, active),
        last_login_at     = COALESCE(${u.lastLoginAt ?? null}, last_login_at)
      WHERE id = ${id}
      RETURNING id
    `;
    return result.length > 0;
  }
  const store = fsRead<{ users: PortalUser[] }>("portal-users.json", { users: [] });
  const idx = store.users.findIndex((x) => x.id === id);
  if (idx === -1) return false;
  store.users[idx] = { ...store.users[idx], ...u };
  fsWrite("portal-users.json", store);
  return true;
}

export async function deletePortalUser(id: string): Promise<boolean> {
  if (USE_NEON) {
    const sql = getDb();
    const result = await sql`DELETE FROM portal_users WHERE id = ${id} RETURNING id`;
    return result.length > 0;
  }
  const store = fsRead<{ users: PortalUser[] }>("portal-users.json", { users: [] });
  const before = store.users.length;
  store.users = store.users.filter((x) => x.id !== id);
  fsWrite("portal-users.json", store);
  return store.users.length < before;
}

// ─────────────────────────────────────────────────────────────────────────────
// Secure Portal — Resources
// ─────────────────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToPortalResource(r: any): PortalResource {
  return {
    id: r.id,
    title: r.title,
    description: r.description ?? "",
    resourceType: r.resource_type,
    url: r.url,
    fileName: r.file_name ?? undefined,
    area: r.area,
    sortOrder: Number(r.sort_order ?? 0),
    active: r.active,
    createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
    formFields: Array.isArray(r.form_fields) ? r.form_fields : undefined,
  };
}

export async function getPortalResources(activeOnly = false): Promise<PortalResource[]> {
  if (USE_NEON) {
    await ensureSchema();
    const sql = getDb();
    const rows = activeOnly
      ? await sql`SELECT * FROM portal_resources WHERE active = TRUE ORDER BY area ASC, sort_order ASC, created_at ASC`
      : await sql`SELECT * FROM portal_resources ORDER BY area ASC, sort_order ASC, created_at ASC`;
    return rows.map(rowToPortalResource);
  }
  const store = fsRead<{ resources: PortalResource[] }>("portal-resources.json", { resources: [] });
  return activeOnly ? store.resources.filter((r) => r.active) : store.resources;
}

export async function getPortalResourceById(id: string): Promise<PortalResource | null> {
  if (USE_NEON) {
    await ensureSchema();
    const sql = getDb();
    const rows = await sql`SELECT * FROM portal_resources WHERE id = ${id} LIMIT 1`;
    return rows.length > 0 ? rowToPortalResource(rows[0]) : null;
  }
  const resources = await getPortalResources();
  return resources.find((r) => r.id === id) ?? null;
}

export async function getPortalResourcesForAreas(areas: string[]): Promise<PortalResource[]> {
  const all = await getPortalResources(true);
  return all.filter((r) => areas.includes(r.area));
}

export async function getDistinctPortalAreas(): Promise<string[]> {
  const all = await getPortalResources();
  const areas = new Set<string>(["staff", "instructor", "supplier", "candidate"]);
  for (const r of all) areas.add(r.area);
  return Array.from(areas);
}

export async function addPortalResource(r: PortalResource): Promise<void> {
  if (USE_NEON) {
    await ensureSchema();
    const sql = getDb();
    await sql`
      INSERT INTO portal_resources
        (id, title, description, resource_type, url, file_name, area, sort_order, active, form_fields)
      VALUES
        (${r.id}, ${r.title}, ${r.description}, ${r.resourceType}, ${r.url}, ${r.fileName ?? null},
         ${r.area}, ${r.sortOrder}, ${r.active}, ${JSON.stringify(r.formFields ?? [])})
    `;
    return;
  }
  const store = fsRead<{ resources: PortalResource[] }>("portal-resources.json", { resources: [] });
  store.resources.push(r);
  fsWrite("portal-resources.json", store);
}

export async function updatePortalResource(id: string, u: Partial<PortalResource>): Promise<boolean> {
  if (USE_NEON) {
    const sql = getDb();
    const result = await sql`
      UPDATE portal_resources SET
        title         = COALESCE(${u.title ?? null}, title),
        description   = COALESCE(${u.description ?? null}, description),
        resource_type = COALESCE(${u.resourceType ?? null}, resource_type),
        url           = COALESCE(${u.url ?? null}, url),
        file_name     = COALESCE(${u.fileName ?? null}, file_name),
        area          = COALESCE(${u.area ?? null}, area),
        sort_order    = COALESCE(${u.sortOrder ?? null}, sort_order),
        active        = COALESCE(${u.active ?? null}, active),
        form_fields   = COALESCE(${u.formFields != null ? JSON.stringify(u.formFields) : null}, form_fields)
      WHERE id = ${id}
      RETURNING id
    `;
    return result.length > 0;
  }
  const store = fsRead<{ resources: PortalResource[] }>("portal-resources.json", { resources: [] });
  const idx = store.resources.findIndex((x) => x.id === id);
  if (idx === -1) return false;
  store.resources[idx] = { ...store.resources[idx], ...u };
  fsWrite("portal-resources.json", store);
  return true;
}

export async function deletePortalResource(id: string): Promise<boolean> {
  if (USE_NEON) {
    const sql = getDb();
    const result = await sql`DELETE FROM portal_resources WHERE id = ${id} RETURNING id`;
    return result.length > 0;
  }
  const store = fsRead<{ resources: PortalResource[] }>("portal-resources.json", { resources: [] });
  const before = store.resources.length;
  store.resources = store.resources.filter((x) => x.id !== id);
  fsWrite("portal-resources.json", store);
  return store.resources.length < before;
}

// ─────────────────────────────────────────────────────────────────────────────
// Secure Portal — Submissions (online forms + ad-hoc uploads from portal users)
// ─────────────────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToPortalSubmission(r: any): PortalSubmission {
  return {
    id: r.id,
    kind: r.kind,
    resourceId: r.resource_id ?? undefined,
    resourceTitle: r.resource_title ?? "",
    portalUserId: r.portal_user_id,
    tagId: r.tag_id,
    userName: r.user_name ?? "",
    userType: r.user_type,
    area: r.area,
    courseRef: r.course_ref ?? undefined,
    answers: r.answers && typeof r.answers === "object" ? r.answers : {},
    notes: r.notes ?? undefined,
    attachments: Array.isArray(r.attachments) ? r.attachments : [],
    status: r.status,
    submittedAt: r.submitted_at instanceof Date ? r.submitted_at.toISOString() : String(r.submitted_at),
  };
}

export async function getPortalSubmissions(): Promise<PortalSubmission[]> {
  if (USE_NEON) {
    await ensureSchema();
    const sql = getDb();
    const rows = await sql`SELECT * FROM portal_submissions ORDER BY submitted_at DESC`;
    return rows.map(rowToPortalSubmission);
  }
  const store = fsRead<{ submissions: PortalSubmission[] }>("portal-submissions.json", { submissions: [] });
  return store.submissions;
}

export async function addPortalSubmission(s: PortalSubmission): Promise<void> {
  if (USE_NEON) {
    await ensureSchema();
    const sql = getDb();
    await sql`
      INSERT INTO portal_submissions
        (id, kind, resource_id, resource_title, portal_user_id, tag_id, user_name, user_type, area,
         course_ref, answers, notes, attachments, status)
      VALUES
        (${s.id}, ${s.kind}, ${s.resourceId ?? null}, ${s.resourceTitle}, ${s.portalUserId}, ${s.tagId},
         ${s.userName}, ${s.userType}, ${s.area}, ${s.courseRef ?? null}, ${JSON.stringify(s.answers)},
         ${s.notes ?? null}, ${JSON.stringify(s.attachments)}, ${s.status})
    `;
    return;
  }
  const store = fsRead<{ submissions: PortalSubmission[] }>("portal-submissions.json", { submissions: [] });
  store.submissions.push(s);
  fsWrite("portal-submissions.json", store);
}

export async function updatePortalSubmission(id: string, u: Partial<PortalSubmission>): Promise<boolean> {
  if (USE_NEON) {
    const sql = getDb();
    const result = await sql`
      UPDATE portal_submissions SET
        status = COALESCE(${u.status ?? null}, status)
      WHERE id = ${id}
      RETURNING id
    `;
    return result.length > 0;
  }
  const store = fsRead<{ submissions: PortalSubmission[] }>("portal-submissions.json", { submissions: [] });
  const idx = store.submissions.findIndex((x) => x.id === id);
  if (idx === -1) return false;
  store.submissions[idx] = { ...store.submissions[idx], ...u };
  fsWrite("portal-submissions.json", store);
  return true;
}

export async function deletePortalSubmission(id: string): Promise<boolean> {
  if (USE_NEON) {
    const sql = getDb();
    const result = await sql`DELETE FROM portal_submissions WHERE id = ${id} RETURNING id`;
    return result.length > 0;
  }
  const store = fsRead<{ submissions: PortalSubmission[] }>("portal-submissions.json", { submissions: [] });
  const before = store.submissions.length;
  store.submissions = store.submissions.filter((x) => x.id !== id);
  fsWrite("portal-submissions.json", store);
  return store.submissions.length < before;
}

// ─────────────────────────────────────────────────────────────────────────────
// Apprenticeships & SVQ — Pathways
// ─────────────────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToApprenticeshipPathway(r: any): ApprenticeshipPathway {
  return {
    id: r.id,
    icon: r.icon ?? "🎓",
    title: r.title,
    description: r.description ?? "",
    status: r.status,
    sortOrder: Number(r.sort_order ?? 0),
    active: r.active,
    createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
  };
}

export async function getApprenticeshipPathways(activeOnly = false): Promise<ApprenticeshipPathway[]> {
  if (USE_NEON) {
    await ensureSchema();
    const sql = getDb();
    const rows = activeOnly
      ? await sql`SELECT * FROM apprenticeship_pathways WHERE active = TRUE ORDER BY sort_order ASC, created_at ASC`
      : await sql`SELECT * FROM apprenticeship_pathways ORDER BY sort_order ASC, created_at ASC`;
    return rows.map(rowToApprenticeshipPathway);
  }
  const store = fsRead<{ pathways: ApprenticeshipPathway[] }>("apprenticeship-pathways.json", { pathways: [] });
  return activeOnly ? store.pathways.filter((p) => p.active) : store.pathways;
}

export async function addApprenticeshipPathway(p: ApprenticeshipPathway): Promise<void> {
  if (USE_NEON) {
    await ensureSchema();
    const sql = getDb();
    await sql`
      INSERT INTO apprenticeship_pathways (id, icon, title, description, status, sort_order, active)
      VALUES (${p.id}, ${p.icon}, ${p.title}, ${p.description}, ${p.status}, ${p.sortOrder}, ${p.active})
    `;
    return;
  }
  const store = fsRead<{ pathways: ApprenticeshipPathway[] }>("apprenticeship-pathways.json", { pathways: [] });
  store.pathways.push(p);
  fsWrite("apprenticeship-pathways.json", store);
}

export async function updateApprenticeshipPathway(id: string, u: Partial<ApprenticeshipPathway>): Promise<boolean> {
  if (USE_NEON) {
    const sql = getDb();
    const result = await sql`
      UPDATE apprenticeship_pathways SET
        icon        = COALESCE(${u.icon ?? null}, icon),
        title       = COALESCE(${u.title ?? null}, title),
        description = COALESCE(${u.description ?? null}, description),
        status      = COALESCE(${u.status ?? null}, status),
        sort_order  = COALESCE(${u.sortOrder ?? null}, sort_order),
        active      = COALESCE(${u.active ?? null}, active)
      WHERE id = ${id}
      RETURNING id
    `;
    return result.length > 0;
  }
  const store = fsRead<{ pathways: ApprenticeshipPathway[] }>("apprenticeship-pathways.json", { pathways: [] });
  const idx = store.pathways.findIndex((x) => x.id === id);
  if (idx === -1) return false;
  store.pathways[idx] = { ...store.pathways[idx], ...u };
  fsWrite("apprenticeship-pathways.json", store);
  return true;
}

export async function deleteApprenticeshipPathway(id: string): Promise<boolean> {
  if (USE_NEON) {
    const sql = getDb();
    const result = await sql`DELETE FROM apprenticeship_pathways WHERE id = ${id} RETURNING id`;
    return result.length > 0;
  }
  const store = fsRead<{ pathways: ApprenticeshipPathway[] }>("apprenticeship-pathways.json", { pathways: [] });
  const before = store.pathways.length;
  store.pathways = store.pathways.filter((x) => x.id !== id);
  fsWrite("apprenticeship-pathways.json", store);
  return store.pathways.length < before;
}

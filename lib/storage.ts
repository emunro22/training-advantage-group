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
  status: "valid" | "expired" | "revoked";
  trainingCentre?: string;
  notes?: string;
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
  bookingUrl?: string;
  notes?: string;
  active: boolean;
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
    bookingUrl: r.booking_url ?? undefined,
    notes: r.notes ?? undefined,
    active: r.active,
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
         issue_date, expiry_date, status, training_centre, notes)
      VALUES
        (${c.id}, ${c.certificateNumber}, ${c.holderFirstName}, ${c.holderLastName},
         ${c.course}, ${c.courseType}, ${c.issueDate}, ${c.expiryDate}, ${c.status},
         ${c.trainingCentre ?? null}, ${c.notes ?? null})
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
        notes              = COALESCE(${u.notes ?? null}, notes)
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
      ? await sql`SELECT * FROM upcoming_courses WHERE active = TRUE ORDER BY date ASC`
      : await sql`SELECT * FROM upcoming_courses ORDER BY date ASC`;
    return rows.map(rowToCourse);
  }
  const store = fsRead<{ courses: UpcomingCourse[] }>("upcoming-courses.json", { courses: [] });
  return activeOnly ? store.courses.filter((c) => c.active) : store.courses;
}

export async function addUpcomingCourse(c: UpcomingCourse): Promise<void> {
  if (USE_NEON) {
    await ensureSchema();
    const sql = getDb();
    await sql`
      INSERT INTO upcoming_courses
        (id, course_id, course_name, date, end_date, start_time, end_time,
         location, spots_available, total_spots, price, booking_url, notes, active)
      VALUES
        (${c.id}, ${c.courseId}, ${c.courseName}, ${c.date}, ${c.endDate ?? null},
         ${c.startTime ?? null}, ${c.endTime ?? null},
         ${c.location}, ${c.spotsAvailable}, ${c.totalSpots}, ${c.price},
         ${c.bookingUrl ?? null}, ${c.notes ?? null}, ${c.active})
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
        booking_url      = COALESCE(${u.bookingUrl ?? null}, booking_url),
        notes            = COALESCE(${u.notes ?? null}, notes),
        active           = COALESCE(${u.active ?? null}, active)
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
                 location, spots_available, total_spots, price, booking_url, notes, active)
              VALUES
                (${c.id}, ${c.courseId}, ${c.courseName}, ${c.date}, ${c.endDate ?? null},
                 ${c.startTime ?? null}, ${c.endTime ?? null},
                 ${c.location}, ${c.spotsAvailable}, ${c.totalSpots}, ${c.price},
                 ${c.bookingUrl ?? null}, ${c.notes ?? null}, ${c.active})
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

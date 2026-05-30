import fs from "fs";
import path from "path";

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
  // 'standalone' = top-level nav item; any other value = added to that category dropdown
  navCategory: "standalone" | "transport" | "health-safety" | "plant" | "e-learning" | "consultancy" | "instructors" | "about" | "none";
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

export interface UpcomingCourse {
  id: string;
  courseId: string;
  courseName: string;
  date: string;
  endDate?: string;
  location: string;
  spotsAvailable: number;
  totalSpots: number;
  price: string;
  bookingUrl?: string;
  notes?: string;
  active: boolean;
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Backend detection
// Vercel KV: set KV_REST_API_URL + KV_REST_API_TOKEN in your Vercel dashboard.
// Otherwise defaults to filesystem (perfect for local dev / self-hosted).
// ─────────────────────────────────────────────────────────────────────────────

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const USE_KV = !!(KV_URL && KV_TOKEN);

const DATA_DIR = path.join(process.cwd(), "data");

// ─────────────────────────────────────────────────────────────────────────────
// Low-level helpers
// ─────────────────────────────────────────────────────────────────────────────

async function kvGet<T>(key: string): Promise<T | null> {
  try {
    const res = await fetch(`${KV_URL}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { result: string | null };
    return json.result ? (JSON.parse(json.result) as T) : null;
  } catch {
    return null;
  }
}

async function kvSet(key: string, value: unknown): Promise<void> {
  await fetch(`${KV_URL}/set/${encodeURIComponent(key)}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KV_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(JSON.stringify(value)),
  });
}

function fsRead<T>(filename: string, defaultValue: T): T {
  try {
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) return defaultValue;
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
  } catch {
    return defaultValue;
  }
}

function fsWrite(filename: string, data: unknown): void {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error(`[storage] Failed to write ${filename}:`, e);
  }
}

async function readStore<T>(key: string, filename: string, defaultValue: T): Promise<T> {
  if (USE_KV) {
    const result = await kvGet<T>(key);
    return result ?? defaultValue;
  }
  return fsRead<T>(filename, defaultValue);
}

async function writeStore(key: string, filename: string, value: unknown): Promise<void> {
  if (USE_KV) {
    await kvSet(key, value);
  } else {
    fsWrite(filename, value);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Certificates
// ─────────────────────────────────────────────────────────────────────────────

type CertStore = { certificates: Certificate[] };

export async function getCertificates(): Promise<Certificate[]> {
  const store = await readStore<CertStore>("tag:certificates", "certificates.json", { certificates: [] });
  return store.certificates;
}

export async function verifyCertificate(certNumber: string, lastName?: string): Promise<Certificate | null> {
  const certs = await getCertificates();
  const cert = certs.find((c) => c.certificateNumber.toLowerCase() === certNumber.toLowerCase().trim());
  if (!cert) return null;
  if (lastName && cert.holderLastName.toLowerCase() !== lastName.toLowerCase().trim()) return null;
  return cert;
}

export async function addCertificate(cert: Certificate): Promise<void> {
  const store = await readStore<CertStore>("tag:certificates", "certificates.json", { certificates: [] });
  store.certificates.push(cert);
  await writeStore("tag:certificates", "certificates.json", store);
}

export async function updateCertificate(id: string, updates: Partial<Certificate>): Promise<boolean> {
  const store = await readStore<CertStore>("tag:certificates", "certificates.json", { certificates: [] });
  const idx = store.certificates.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  store.certificates[idx] = { ...store.certificates[idx], ...updates };
  await writeStore("tag:certificates", "certificates.json", store);
  return true;
}

export async function deleteCertificate(id: string): Promise<boolean> {
  const store = await readStore<CertStore>("tag:certificates", "certificates.json", { certificates: [] });
  const before = store.certificates.length;
  store.certificates = store.certificates.filter((c) => c.id !== id);
  if (store.certificates.length === before) return false;
  await writeStore("tag:certificates", "certificates.json", store);
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// Custom Pages
// ─────────────────────────────────────────────────────────────────────────────

type PageStore = { pages: CustomPage[] };

export async function getCustomPages(publishedOnly = false): Promise<CustomPage[]> {
  const store = await readStore<PageStore>("tag:custom-pages", "custom-pages.json", { pages: [] });
  return publishedOnly ? store.pages.filter((p) => p.published) : store.pages;
}

export async function getCustomPageBySlug(slug: string): Promise<CustomPage | null> {
  const pages = await getCustomPages();
  return pages.find((p) => p.slug === slug) ?? null;
}

export async function addCustomPage(page: CustomPage): Promise<void> {
  const store = await readStore<PageStore>("tag:custom-pages", "custom-pages.json", { pages: [] });
  store.pages.push(page);
  await writeStore("tag:custom-pages", "custom-pages.json", store);
}

export async function updateCustomPage(id: string, updates: Partial<CustomPage>): Promise<boolean> {
  const store = await readStore<PageStore>("tag:custom-pages", "custom-pages.json", { pages: [] });
  const idx = store.pages.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  store.pages[idx] = { ...store.pages[idx], ...updates, updatedAt: new Date().toISOString() };
  await writeStore("tag:custom-pages", "custom-pages.json", store);
  return true;
}

export async function deleteCustomPage(id: string): Promise<boolean> {
  const store = await readStore<PageStore>("tag:custom-pages", "custom-pages.json", { pages: [] });
  const before = store.pages.length;
  store.pages = store.pages.filter((p) => p.id !== id);
  if (store.pages.length === before) return false;
  await writeStore("tag:custom-pages", "custom-pages.json", store);
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// Pricing & Offers
// ─────────────────────────────────────────────────────────────────────────────

export interface PricingStore {
  specialOffers: SpecialOffer[];
  priceOverrides: PriceOverride[];
}

export async function getPricingData(): Promise<PricingStore> {
  return readStore<PricingStore>("tag:pricing", "pricing-offers.json", {
    specialOffers: [],
    priceOverrides: [],
  });
}

export async function savePricingData(data: PricingStore): Promise<void> {
  await writeStore("tag:pricing", "pricing-offers.json", data);
}

// ─────────────────────────────────────────────────────────────────────────────
// Upcoming Courses
// ─────────────────────────────────────────────────────────────────────────────

type CourseStore = { courses: UpcomingCourse[] };

export async function getUpcomingCourses(activeOnly = false): Promise<UpcomingCourse[]> {
  const store = await readStore<CourseStore>("tag:upcoming-courses", "upcoming-courses.json", { courses: [] });
  return activeOnly ? store.courses.filter((c) => c.active) : store.courses;
}

export async function addUpcomingCourse(course: UpcomingCourse): Promise<void> {
  const store = await readStore<CourseStore>("tag:upcoming-courses", "upcoming-courses.json", { courses: [] });
  store.courses.push(course);
  await writeStore("tag:upcoming-courses", "upcoming-courses.json", store);
}

export async function updateUpcomingCourse(id: string, updates: Partial<UpcomingCourse>): Promise<boolean> {
  const store = await readStore<CourseStore>("tag:upcoming-courses", "upcoming-courses.json", { courses: [] });
  const idx = store.courses.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  store.courses[idx] = { ...store.courses[idx], ...updates };
  await writeStore("tag:upcoming-courses", "upcoming-courses.json", store);
  return true;
}

export async function deleteUpcomingCourse(id: string): Promise<boolean> {
  const store = await readStore<CourseStore>("tag:upcoming-courses", "upcoming-courses.json", { courses: [] });
  const before = store.courses.length;
  store.courses = store.courses.filter((c) => c.id !== id);
  if (store.courses.length === before) return false;
  await writeStore("tag:upcoming-courses", "upcoming-courses.json", store);
  return true;
}

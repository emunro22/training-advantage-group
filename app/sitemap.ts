import type { MetadataRoute } from "next";
import { getCustomPages } from "@/lib/storage";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.trainingadvantagegroup.co.uk";

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/upcoming-courses", priority: 0.9, changeFrequency: "daily" },
  { path: "/forms-portals-resources", priority: 0.8, changeFrequency: "monthly" },
  { path: "/verify-certificate", priority: 0.6, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/company-information", priority: 0.5, changeFrequency: "monthly" },
  { path: "/accreditations", priority: 0.6, changeFrequency: "monthly" },
  { path: "/training-centres", priority: 0.7, changeFrequency: "monthly" },
  { path: "/training-centres/bothwell", priority: 0.7, changeFrequency: "monthly" },
  { path: "/training-centres/motherwell", priority: 0.7, changeFrequency: "monthly" },
  { path: "/training-centres/glasgow", priority: 0.7, changeFrequency: "monthly" },
  { path: "/testimonials", priority: 0.5, changeFrequency: "monthly" },
  { path: "/news", priority: 0.5, changeFrequency: "weekly" },
  { path: "/careers", priority: 0.4, changeFrequency: "weekly" },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
  { path: "/booking", priority: 0.5, changeFrequency: "monthly" },
  { path: "/pricing", priority: 0.7, changeFrequency: "weekly" },
  { path: "/downloads", priority: 0.4, changeFrequency: "monthly" },
  { path: "/policies", priority: 0.3, changeFrequency: "yearly" },
  { path: "/learner-hub", priority: 0.6, changeFrequency: "monthly" },
  { path: "/driver-cpc", priority: 0.8, changeFrequency: "monthly" },
  { path: "/adr-training", priority: 0.8, changeFrequency: "monthly" },
  { path: "/hgv-training", priority: 0.8, changeFrequency: "monthly" },
  { path: "/pcv-training", priority: 0.7, changeFrequency: "monthly" },
  { path: "/driver-assessments", priority: 0.6, changeFrequency: "monthly" },
  { path: "/fleet-training", priority: 0.6, changeFrequency: "monthly" },
  { path: "/theory-hazard-perception", priority: 0.5, changeFrequency: "monthly" },
  { path: "/medicals", priority: 0.6, changeFrequency: "monthly" },
  { path: "/module-4-cpc", priority: 0.5, changeFrequency: "monthly" },
  { path: "/3a-manoeuvres", priority: 0.5, changeFrequency: "monthly" },
  { path: "/tm-cpc", priority: 0.8, changeFrequency: "monthly" },
  { path: "/plant-training", priority: 0.7, changeFrequency: "monthly" },
  { path: "/e-learning", priority: 0.6, changeFrequency: "monthly" },
  { path: "/consultancy", priority: 0.6, changeFrequency: "monthly" },
  { path: "/instructor-training", priority: 0.6, changeFrequency: "monthly" },
  { path: "/iosh-managing-safely", priority: 0.7, changeFrequency: "monthly" },
  { path: "/first-aid", priority: 0.7, changeFrequency: "monthly" },
  { path: "/mental-health-first-aid", priority: 0.6, changeFrequency: "monthly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  let customEntries: MetadataRoute.Sitemap = [];
  try {
    const pages = await getCustomPages(true);
    customEntries = pages.map((p) => ({
      url: `${SITE_URL}/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    }));
  } catch {
    // Neon tables may not exist yet on first deploy — sitemap still returns the static routes
  }

  return [...staticEntries, ...customEntries];
}

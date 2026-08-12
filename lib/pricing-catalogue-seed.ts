// Best-effort sample rows transcribed from the TAG Master Pricing Catalogue 2026 (WEB READY)
// screenshots, used ONLY to exercise the admin approval workflow and public product display
// while TAG prepares a real CSV export of the master workbook.
//
// These are NOT a substitute for the full 266-row catalogue. Every row here is seeded with
// needsVerification = true and publishDecision = "Review Required" — none can reach a public
// page until an admin in /admin/products checks it against the source workbook and explicitly
// approves + publishes it. The Premiums & Optional Charges rows come from the clearest, most
// legible source table (Pricing Rules & Premium Services) and closely match the equivalent
// figures already stated in TAG-WEB-REQ-001 §4, so confidence there is higher than for the
// course rows, which should still be independently checked before publishing.

import type { WebsiteProductImportRow } from "./storage";
import { splitVat } from "./order-contract";

function row(
  priceId: string,
  category: string,
  courseService: string,
  variant: string,
  accreditation: string,
  delivery: string,
  durationRatio: string,
  maxCandidates: string,
  pricingBasis: string,
  priceIncVat: number, // pounds
  vatTreatment: string,
  publicNote: string,
  saleMode: WebsiteProductImportRow["saleMode"] = "enquire"
): WebsiteProductImportRow {
  const priceIncVatPence = Math.round(priceIncVat * 100);
  const { netExVatPence, vatAmountPence } = splitVat(priceIncVatPence, vatTreatment);
  return {
    priceId,
    category,
    courseService,
    variant,
    accreditation,
    delivery,
    durationRatio,
    maxCandidates,
    pricingBasis,
    priceIncVatPence,
    vatTreatment,
    netExVatPence,
    vatAmountPence,
    publicNote,
    saleMode,
  };
}

export const PRICING_CATALOGUE_SEED: WebsiteProductImportRow[] = [
  // ── Driver CPC ────────────────────────────────────────────────────────────
  row("TAG-0030", "Driver CPC", "National Driver CPC", "3.5-hour module", "NLTC / DVSA", "Classroom", "3.5 hours", "20 per candidate", "Per candidate", 75, "Standard 20%", "Benchmarked against GTG and Logistics UK", "book"),

  // ── Transport Management ─────────────────────────────────────────────────
  row("TAG-0039", "Transport Management", "Transport Manager CPC", "Classroom including first exams", "NLTC", "Classroom", "Programme", "20 per candidate", "Per candidate", 1695, "Standard 20%", "Below RHA/Logistics UK, above GTG", "enquire"),
  row("TAG-0041", "Transport Management", "Transport Manager CPC", "Home study including first exams", "NLTC", "Distance learning", "Self-paced", "20 per candidate", "Per candidate", 1095, "Standard 20%", "Lower than Logistics UK, within market", "enquire"),

  // ── OLAT & Compliance ─────────────────────────────────────────────────────
  row("TAG-0050", "OLAT & Compliance", "Operator Licence Awareness Training", "Standard OLAT", "NLTC / TAG", "Classroom or remote", "1 day", "20 per candidate", "Per candidate", 395, "Standard 20%", "Below RHA member and non-member price", "book"),

  // ── ADR / DGDT ────────────────────────────────────────────────────────────
  row("TAG-0017", "ADR / DGDT", "ADR Initial", "Packages and Classes 2-6, 8 and 9", "DGDT / Qualifications Scotland", "Classroom + exam", "4 days plus exam", "20 per candidate", "Per candidate", 525, "Standard 20%", "TAG classroom premium vs Voyager", "quote"),
  row("TAG-0018", "ADR / DGDT", "ADR Initial", "Packages, tanks and Classes 2-6, 8 and 9", "DGDT / Qualifications Scotland", "Classroom + exam", "5 days plus exam", "20 per candidate", "Per candidate", 625, "Standard 20%", "TAG classroom premium vs Voyager", "quote"),

  // ── Forklift & MHE ────────────────────────────────────────────────────────
  row("TAG-0072", "Forklift & MHE", "Counterbalance Forklift", "Novice", "NPORS", "TAG / client site", "3 days", "1 total course – 1 candidate", "Per course", 695, "Standard 20%", "Commercial mid-range vs Move On / Cyrenians", "enquire"),

  // ── First Aid ─────────────────────────────────────────────────────────────
  row("TAG-0202", "First Aid", "First Aid at Work", "Open course", "NLTC / TAG as applicable", "Classroom / client site", "3 days", "12 per candidate", "Per private group", 295, "Standard 20%", "Below national charity (St Andrew's) price", "book"),
  row("TAG-0209", "First Aid", "Sports First Aid", "Open course", "NLTC / TAG as applicable", "Classroom / client site", "1 day", "12 per candidate", "Per private group", 95, "Standard 20%", "Upper-middle vs SYFA approved list", "book"),

  // ── Premiums & Optional Charges (Pricing Rules & Premium Services sheet — highest confidence) ─
  row("TAG-0247", "Premiums & Optional Charges", "Off-site classroom / theory premium", "Standard charge", "TAG", "As required", "As stated", "1 per instructor/day", "Per instructor/day", 105, "Standard 20%", "First 30 round-trip miles included", "quote"),
  row("TAG-0248", "Premiums & Optional Charges", "Additional mileage", "Standard charge", "TAG", "As required", "As stated", "1 per mile", "Per mile", 0.63, "Standard 20%", "After 30 round-trip miles", "quote"),
  row("TAG-0249", "Premiums & Optional Charges", "Additional travel time", "Standard charge", "TAG", "As required", "As stated", "1 per hour", "Per hour", 31.5, "Standard 20%", "After 2 total travel hours", "quote"),
  row("TAG-0250", "Premiums & Optional Charges", "Travel-time daily cap", "Standard charge", "TAG", "As required", "As stated", "1 per instructor/day", "Per instructor/day", 157.5, "Standard 20%", "Fixed cap", "quote"),
  row("TAG-0251", "Premiums & Optional Charges", "Customer supplies accommodation", "Standard charge", "TAG", "As required", "As stated", "1 per instructor/night", "Per instructor/night", 50, "Standard 20%", "Covers overnight/subsistence allowance", "quote"),
  row("TAG-0252", "Premiums & Optional Charges", "TAG arranges accommodation", "Standard charge", "TAG", "As required", "As stated", "1 per instructor/night", "Per instructor/night", 125, "Standard 20%", "Ferry/tolls/parking additionally charged at evidenced cost", "quote"),
  row("TAG-0253", "Premiums & Optional Charges", "Work continuing after 17:00", "Standard charge", "TAG", "As required", "As stated", "1 per instructor/session", "Per instructor/session", 75, "Standard 20%", "Not cumulative with after-22:00 charge", "quote"),
  row("TAG-0254", "Premiums & Optional Charges", "Work continuing after 22:00", "Standard charge", "TAG", "As required", "As stated", "1 per instructor/session", "Per instructor/session", 125, "Standard 20%", "Replaces after-17:00 charge", "quote"),
  row("TAG-0255", "Premiums & Optional Charges", "Saturday delivery premium", "Standard charge", "TAG", "As required", "As stated", "1 per instructor/day", "Per instructor/day", 105, "Standard 20%", "Weekend delivery", "quote"),
  row("TAG-0256", "Premiums & Optional Charges", "Sunday delivery premium", "Standard charge", "TAG", "As required", "As stated", "1 per instructor/day", "Per instructor/day", 175, "Standard 20%", "Weekend delivery", "quote"),
  row("TAG-0257", "Premiums & Optional Charges", "Scottish public-holiday delivery", "Standard charge", "TAG", "As required", "As stated", "1 per instructor/day", "Per instructor/day", 210, "Standard 20%", "Public-holiday delivery", "quote"),
  row("TAG-0258", "Premiums & Optional Charges", "Booking with 5-9 working days' notice", "Standard charge", "TAG", "As required", "As stated", "1 per booking", "Per booking", 70, "Standard 20%", "Subject to awarding-body deadlines", "quote"),
  row("TAG-0259", "Premiums & Optional Charges", "Booking with fewer than 5 working days' notice", "Standard charge", "TAG", "As required", "As stated", "1 per booking", "Per booking", 140, "Standard 20%", "Subject to awarding-body deadlines", "quote"),
  row("TAG-0260", "Premiums & Optional Charges", "Additional practical instructor", "Standard charge", "TAG", "As required", "As stated", "1 per day", "Per day", 420, "Standard 20%", "Practical / plant delivery", "quote"),
  row("TAG-0261", "Premiums & Optional Charges", "Additional classroom instructor", "Standard charge", "TAG", "As required", "As stated", "1 per day", "Per day", 315, "Standard 20%", "Classroom delivery", "quote"),
  row("TAG-0262", "Premiums & Optional Charges", "Additional invigilator", "Standard charge", "TAG", "As required", "As stated", "1 per exam session", "Per exam session", 175, "Standard 20%", "Examinations", "quote"),
  row("TAG-0263", "Premiums & Optional Charges", "Training-room sourcing and hire", "Standard charge", "TAG", "As required", "As stated", "1 per day", "Per day", 175, "Standard 20%", "External venue", "quote"),
  row("TAG-0264", "Premiums & Optional Charges", "Equipment sourcing administration", "Standard charge", "TAG", "As required", "As stated", "1 per machine", "Per machine", 65, "Standard 20%", "Hired equipment — supplier hire charged separately", "quote"),
  row("TAG-0265", "Premiums & Optional Charges", "Premium Managed Employer Service", "Standard charge", "TAG", "As required", "As stated", "1 per course", "Per course, up to 12 candidates", 245, "Standard 20%", "Document chasing, checks, reports and follow-up", "enquire"),
  row("TAG-0266", "Premiums & Optional Charges", "Premium Managed Service — additional candidate", "Standard charge", "TAG", "As required", "As stated", "1 per candidate", "Per candidate, over 12", 10.5, "Standard 20%", "Premium Managed Service add-on", "enquire"),
];

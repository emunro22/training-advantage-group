// TAG-WEB-REQ-001 §4 / TAG-WEB-SPEC-001 §3 & §6 — pure helpers implementing the
// controlled deposit tiering, OrderID format and course-family → issue/joining pack
// code mapping. No side effects: callers decide what to do with the result.

export interface DepositResult {
  depositPence: number;
  isFullPayment: boolean;
  reason: string;
}

/**
 * TAG-WEB-REQ-001 §4:
 * - Up to and including £250 gross: take £50, or the full amount if the total is below £50.
 * - Above £250 gross: take 20%.
 * - Within seven calendar days of the course: take full payment (corporate override is a manual
 *   admin process, not implemented here).
 */
export function computeDeposit(
  grossPence: number,
  courseDateISO?: string,
  now: Date = new Date()
): DepositResult {
  if (courseDateISO) {
    const courseDate = new Date(courseDateISO);
    if (!Number.isNaN(courseDate.getTime())) {
      const diffDays = (courseDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays <= 7) {
        return {
          depositPence: grossPence,
          isFullPayment: true,
          reason: "Within 7 calendar days of the course — full payment required",
        };
      }
    }
  }

  if (grossPence < 5000) {
    return {
      depositPence: grossPence,
      isFullPayment: true,
      reason: "Total below £50 — full payment required",
    };
  }

  if (grossPence <= 25000) {
    return {
      depositPence: 5000,
      isFullPayment: false,
      reason: "£50 deposit (total £250 or below)",
    };
  }

  return {
    depositPence: Math.round(grossPence * 0.2),
    isFullPayment: false,
    reason: "20% deposit (total above £250)",
  };
}

/** Public OrderID format: WEB-YYYY-NNNNNN. Must be unique — callers should retry on a DB conflict. */
export function generateOrderRef(now: Date = new Date()): string {
  const year = now.getFullYear();
  const seq = Math.floor(100000 + Math.random() * 900000);
  return `WEB-${year}-${seq}`;
}

export const VAT_TREATMENTS = ["Standard 20%", "Zero-rated", "Exempt", "Mixed"] as const;
export type VatTreatment = (typeof VAT_TREATMENTS)[number];

/** Splits a VAT-inclusive gross price into net + VAT amount for the given treatment. */
export function splitVat(grossPence: number, treatment: string): { netExVatPence: number; vatAmountPence: number } {
  if (treatment === "Zero-rated" || treatment === "Exempt") {
    return { netExVatPence: grossPence, vatAmountPence: 0 };
  }
  const netExVatPence = Math.round(grossPence / 1.2);
  return { netExVatPence, vatAmountPence: grossPence - netExVatPence };
}

/**
 * TAG-WEB-SPEC-001 §6 Course Document and Issue-Pack Matrix, keyed by the workbook's Category
 * column. Only the course families the matrix actually defines are mapped — HGV & PCV, Additional
 * / Future Courses and Premiums & Optional Charges are deliberately left unmapped because the
 * documents are explicit that TAG (not the developer) assigns pack codes to those.
 */
export const CATEGORY_ISSUE_PACK_CODE: Record<string, string> = {
  "ADR / DGDT": "IP-ADR-DGDT",
  "Driver CPC": "IP-DCPC",
  "Transport Management": "IP-TMCPC",
  "OLAT & Compliance": "IP-TMCPC",
  "Forklift & MHE": "IP-MHE",
  "Plant & MHE": "IP-MHE",
  "First Aid": "IP-FA",
};

/** Maps the workbook's Category column to the existing site section (used to route product tables to pages). */
export const CATEGORY_TO_PAGE_SLUG: Record<string, string> = {
  "HGV & PCV": "/hgv-training",
  "ADR / DGDT": "/adr-training",
  "Driver CPC": "/driver-cpc",
  "Transport Management": "/tm-cpc",
  "OLAT & Compliance": "/consultancy",
  "Forklift & MHE": "/plant-training",
  "Plant & MHE": "/plant-training",
  "First Aid": "/first-aid",
};

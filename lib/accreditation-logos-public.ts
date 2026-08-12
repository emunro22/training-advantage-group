import { getAccreditationLogos, type AccreditationLogo } from "./storage";

export interface PublicLogo {
  name: string;
  src: string;
  href?: string;
  alt: string;
}

// The site's original hardcoded logo sets — used as the fallback until the admin adds any
// entries for a placement, so nothing regresses visually on day one.
const DEFAULT_FOOTER_LOGOS: PublicLogo[] = [
  { name: "Qualifications Scotland Approved Centre", src: "/images/accreditations/qualifications-scotland.png", alt: "Qualifications Scotland Approved Centre" },
  { name: "NPORS Accredited Training Provider", src: "/images/accreditations/npors-provider.png", alt: "NPORS Accredited Training Provider" },
  { name: "NPORS Accredited", src: "/images/accreditations/npors-accredited.png", alt: "NPORS Accredited" },
  { name: "DVSA Approved ADR Training Body", src: "/images/accreditations/dvsa-adr.png", alt: "DVSA Approved ADR Training Body" },
  { name: "Driver CPC Approved Consortium Member", src: "/images/accreditations/driver-cpc.png", alt: "Driver CPC Approved Consortium Member" },
  { name: "NLTC Qualifications", src: "/images/accreditations/nltc.png", alt: "NLTC Qualifications" },
  { name: "Ofqual Department for Education", src: "/images/accreditations/ofqual.png", alt: "Ofqual Department for Education" },
  { name: "RADAT Register of Approved Driver Assessors & Trainers", src: "/images/accreditations/radat.png", alt: "RADAT Register of Approved Driver Assessors & Trainers" },
  { name: "Public Health Scotland Accredited Training Provider", src: "/images/accreditations/public-health-scotland.jpg", alt: "Public Health Scotland Accredited Training Provider" },
];

const DEFAULT_ACCREDITATIONS_PAGE_LOGOS: PublicLogo[] = [
  { name: "Qualifications Scotland", src: "/images/accreditations/qualifications-scotland.png", alt: "Qualifications Scotland" },
  { name: "NPORS Accredited Training Provider", src: "/images/accreditations/npors-provider.png", alt: "NPORS Accredited Training Provider" },
  { name: "NPORS Accredited", src: "/images/accreditations/npors-accredited.png", alt: "NPORS Accredited" },
  { name: "DVSA Approved ADR Training Body", src: "/images/accreditations/dvsa-adr.png", alt: "DVSA Approved ADR Training Body" },
  { name: "Driver CPC Consortium Member", src: "/images/accreditations/driver-cpc.png", alt: "Driver CPC Consortium Member" },
  { name: "NLTC Qualifications", src: "/images/accreditations/nltc.png", alt: "NLTC Qualifications" },
  { name: "Ofqual Department for Education", src: "/images/accreditations/ofqual.png", alt: "Ofqual Department for Education" },
  { name: "RADAT", src: "/images/accreditations/radat.png", alt: "RADAT" },
];

function toPublicLogo(l: AccreditationLogo): PublicLogo {
  return { name: l.name, src: l.logoUrl, href: l.linkUrl, alt: l.altText || l.name };
}

/**
 * Returns admin-managed logos for the given placement if any exist there; otherwise falls back
 * to the site's original hardcoded set so nothing regresses before the admin adds anything.
 */
export async function getPublicAccreditationLogos(
  placement: "footer" | "accreditations_page"
): Promise<PublicLogo[]> {
  const all = await getAccreditationLogos(true);
  const matching = all.filter((l) => l.placement === placement || l.placement === "both");
  if (matching.length > 0) return matching.map(toPublicLogo);
  return placement === "footer" ? DEFAULT_FOOTER_LOGOS : DEFAULT_ACCREDITATIONS_PAGE_LOGOS;
}

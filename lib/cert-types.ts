// All certificate types that Training Advantage Group issues or is accredited to deliver.

export interface CertType {
  id: string;
  label: string;
  shortLabel: string;
  prefix: string;
  exampleNumber: string;
  description: string;
  validity: string;
  issuedBy: string;
  color: string; // Tailwind bg class for the badge
  defaultAccreditedBy?: string[];
}

export const CERT_TYPES: CertType[] = [
  {
    id: "driver-cpc",
    label: "Driver CPC (DCPC)",
    shortLabel: "Driver CPC",
    prefix: "TAG-DCPC-",
    exampleNumber: "TAG-DCPC-2024-001",
    description: "Driver Certificate of Professional Competence — mandatory periodic training for HGV and PCV drivers. 35 hours required every 5 years.",
    validity: "5 years (35 hours)",
    issuedBy: "DVSA / JAUPT approved consortium",
    color: "bg-blue-100 text-blue-800",
    defaultAccreditedBy: ["DVSA"],
  },
  {
    id: "adr",
    label: "ADR Dangerous Goods",
    shortLabel: "ADR",
    prefix: "TAG-ADR-",
    exampleNumber: "TAG-ADR-2024-001",
    description: "Accord Dangereux Routier — required for drivers transporting hazardous materials by road. DVSA approved training body.",
    validity: "5 years",
    issuedBy: "DVSA approved ADR training body",
    color: "bg-red-100 text-red-800",
    defaultAccreditedBy: ["DVSA"],
  },
  {
    id: "npors",
    label: "NPORS Plant Operator",
    shortLabel: "NPORS",
    prefix: "TAG-NPORS-",
    exampleNumber: "TAG-NPORS-2024-001",
    description: "National Plant Operators Registration Scheme — covers forklift (counterbalance & reach), telehandler, MEWP, excavator and dumper operations.",
    validity: "5 years",
    issuedBy: "NPORS accredited training provider",
    color: "bg-orange-100 text-orange-800",
    defaultAccreditedBy: ["NPORS"],
  },
  {
    id: "forklift",
    label: "Forklift Operator Certificate",
    shortLabel: "Forklift",
    prefix: "TAG-FLT-",
    exampleNumber: "TAG-FLT-2024-001",
    description: "Counterbalance or reach truck forklift operator certificate — NPORS accredited.",
    validity: "5 years",
    issuedBy: "NPORS accredited",
    color: "bg-yellow-100 text-yellow-800",
    defaultAccreditedBy: ["NPORS"],
  },
  {
    id: "iosh",
    label: "IOSH Managing Safely®",
    shortLabel: "IOSH",
    prefix: "TAG-IOSH-",
    exampleNumber: "TAG-IOSH-2024-001",
    description: "IOSH approved Managing Safely qualification for managers and supervisors. Rated Outstanding by IOSH.",
    validity: "3 years",
    issuedBy: "IOSH approved training provider",
    color: "bg-green-100 text-green-800",
    defaultAccreditedBy: ["TAG IQA"],
  },
  {
    id: "tm-cpc",
    label: "Transport Manager CPC",
    shortLabel: "TM CPC",
    prefix: "TAG-TMCPC-",
    exampleNumber: "TAG-TMCPC-2024-001",
    description: "Transport Manager Certificate of Professional Competence — Road Haulage or PSV. NLTC qualification, no expiry.",
    validity: "No expiry",
    issuedBy: "NLTC / DVSA approved",
    color: "bg-navy/10 text-navy",
    defaultAccreditedBy: ["NLTC", "DVSA"],
  },
  {
    id: "radat",
    label: "RADAT Driver Assessor",
    shortLabel: "RADAT",
    prefix: "TAG-RADAT-",
    exampleNumber: "TAG-RADAT-2024-001",
    description: "Register of Approved Driver Assessors and Trainers — professional driving assessor qualification.",
    validity: "3 years",
    issuedBy: "RADAT register",
    color: "bg-purple-100 text-purple-800",
    defaultAccreditedBy: ["DVSA"],
  },
  {
    id: "first-aid",
    label: "Emergency First Aid at Work",
    shortLabel: "First Aid",
    prefix: "TAG-EFA-",
    exampleNumber: "TAG-EFA-2024-001",
    description: "HSE approved Emergency First Aid at Work (EFAW) — 1-day course.",
    validity: "3 years",
    issuedBy: "HSE approved",
    color: "bg-pink-100 text-pink-800",
    defaultAccreditedBy: ["NLTC", "OFQUAL"],
  },
  {
    id: "manual-handling",
    label: "Manual Handling",
    shortLabel: "Manual Handling",
    prefix: "TAG-MH-",
    exampleNumber: "TAG-MH-2024-001",
    description: "Safe manual handling techniques for the workplace.",
    validity: "3 years",
    issuedBy: "Training Advantage Group",
    color: "bg-teal-100 text-teal-800",
    defaultAccreditedBy: ["TAG IQA"],
  },
  {
    id: "health-safety",
    label: "Health & Safety (E-Learning)",
    shortLabel: "H&S",
    prefix: "TAG-HS-",
    exampleNumber: "TAG-HS-2024-001",
    description: "Online health and safety compliance training certificate.",
    validity: "1–3 years",
    issuedBy: "Training Advantage Group",
    color: "bg-lime-100 text-lime-800",
    defaultAccreditedBy: ["TAG IQA"],
  },
  {
    id: "efaw",
    label: "Emergency First Aid at Work (EFAW)",
    shortLabel: "EFAW",
    prefix: "TAG-EFAW-",
    exampleNumber: "TAG-EFAW-2024-001",
    description: "NLTC Level 3 Award in Emergency First Aid at Work — OFQUAL regulated. 1-day HSE approved qualification.",
    validity: "3 years",
    issuedBy: "NLTC / OFQUAL regulated",
    color: "bg-red-100 text-red-800",
    defaultAccreditedBy: ["NLTC", "NLTC QUALS", "OFQUAL"],
  },
  {
    id: "faw",
    label: "First Aid at Work (FAW)",
    shortLabel: "FAW",
    prefix: "TAG-FAW-",
    exampleNumber: "TAG-FAW-2024-001",
    description: "NLTC Level 3 Award in First Aid at Work — OFQUAL regulated. 3-day full qualification or 2-day refresher.",
    validity: "3 years",
    issuedBy: "NLTC / OFQUAL regulated",
    color: "bg-red-100 text-red-900",
    defaultAccreditedBy: ["NLTC", "NLTC QUALS", "OFQUAL"],
  },
  {
    id: "paediatric-fa",
    label: "Paediatric First Aid",
    shortLabel: "Paediatric FA",
    prefix: "TAG-PFA-",
    exampleNumber: "TAG-PFA-2024-001",
    description: "Paediatric First Aid certificate — specialist first aid for those working with children and infants.",
    validity: "3 years",
    issuedBy: "Training Advantage Group",
    color: "bg-pink-100 text-pink-800",
    defaultAccreditedBy: ["NLTC", "NLTC QUALS", "OFQUAL"],
  },
  {
    id: "mhfa",
    label: "Mental Health First Aid at Work",
    shortLabel: "MHFA",
    prefix: "TAG-MHFA-",
    exampleNumber: "TAG-MHFA-2024-001",
    description: "NLTC Level 3 Award in Mental Health First Aid at Work RQF. Qualifies you as a workplace Mental Health First Aider.",
    validity: "3 years",
    issuedBy: "NLTC accredited — RQF regulated",
    color: "bg-purple-100 text-purple-800",
    defaultAccreditedBy: ["NLTC", "NLTC QUALS"],
  },
  {
    id: "mh-awareness",
    label: "Mental Health Awareness (Managers)",
    shortLabel: "MH Awareness",
    prefix: "TAG-MHA-",
    exampleNumber: "TAG-MHA-2024-001",
    description: "Public Health Scotland accredited Mental Health Awareness for Managers course.",
    validity: "CPD — no fixed expiry",
    issuedBy: "Public Health Scotland accredited",
    color: "bg-purple-100 text-purple-700",
    defaultAccreditedBy: ["PUBLIC HEALTH SCOTLAND"],
  },
  {
    id: "other",
    label: "Other / General Certificate",
    shortLabel: "Other",
    prefix: "TAG-",
    exampleNumber: "TAG-2024-001",
    description: "Other TAG-issued training certificate.",
    validity: "As stated on certificate",
    issuedBy: "Training Advantage Group",
    color: "bg-gray-100 text-gray-700",
    defaultAccreditedBy: ["TAG IQA"],
  },
];

export function getCertTypeById(id: string): CertType | undefined {
  return CERT_TYPES.find((t) => t.id === id);
}

export function guessCertType(certNumber: string): CertType | undefined {
  // Try to match prefix, longest first to avoid false positives
  const sorted = [...CERT_TYPES].sort((a, b) => b.prefix.length - a.prefix.length);
  return sorted.find((t) => certNumber.toUpperCase().startsWith(t.prefix.toUpperCase()));
}

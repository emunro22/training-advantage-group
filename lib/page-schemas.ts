// Defines every editable field for each existing page.
// defaultValue is the value currently hardcoded in the component — shown as placeholder in the admin.

export type FieldType = "text" | "textarea" | "price" | "number";

export interface PageField {
  key: string;
  label: string;
  type: FieldType;
  defaultValue: string;
  hint?: string;
  section: string;
}

export interface PageSchema {
  label: string;
  url: string;
  category: string;
  fields: PageField[];
}

// Fields every page shares
const HERO_FIELDS = (title: string, subtitle: string): PageField[] => [
  { key: "heroTitle", label: "Hero Title", type: "text", defaultValue: title, section: "Hero" },
  { key: "heroSubtitle", label: "Hero Subtitle", type: "textarea", defaultValue: subtitle, section: "Hero" },
  { key: "metaTitle", label: "SEO Title", type: "text", defaultValue: title, hint: "Shown in Google results", section: "SEO" },
  { key: "metaDescription", label: "SEO Description", type: "textarea", defaultValue: subtitle, hint: "150–160 characters", section: "SEO" },
];

export const PAGE_SCHEMAS: Record<string, PageSchema> = {
  "driver-cpc": {
    label: "Driver CPC",
    url: "/driver-cpc",
    category: "Transport",
    fields: [
      ...HERO_FIELDS("Driver CPC Training", "DVSA & JAUPT approved Driver CPC periodic training across Scotland. Classroom sessions in Bothwell, Motherwell, Glasgow, or online remote delivery."),
      { key: "cpc35hrPrice", label: "3.5-Hour Session Price (£)", type: "price", defaultValue: "35", section: "Pricing" },
      { key: "cpc7hrPrice", label: "Full 7-Hour Session Price (£)", type: "price", defaultValue: "59", section: "Pricing" },
      { key: "cpcRemotePrice", label: "Remote Online CPC Price (£)", type: "price", defaultValue: "50", section: "Pricing" },
      { key: "jauptFee", label: "JAUPT Upload Fee (£)", type: "price", defaultValue: "8.75", hint: "Per candidate", section: "Pricing" },
    ],
  },

  "adr-training": {
    label: "ADR Dangerous Goods",
    url: "/adr-training",
    category: "Transport",
    fields: [
      ...HERO_FIELDS("ADR Dangerous Goods Training", "DVSA approved training for the carriage of dangerous goods by road. Initial courses, requalification and specialist class upgrades."),
      { key: "adrInitialPrice", label: "ADR Initial Packages Price (£)", type: "price", defaultValue: "395", section: "Pricing" },
      { key: "adrTanksPrice", label: "ADR Tanks & Packages Price (£)", type: "price", defaultValue: "495", section: "Pricing" },
      { key: "adrRequalPrice", label: "ADR Requalification Price (£)", type: "price", defaultValue: "325", section: "Pricing" },
      { key: "adrUpgradePrice", label: "Class 1 or 7 Upgrade Price (£)", type: "price", defaultValue: "95", section: "Pricing" },
      { key: "adrRetestPrice", label: "ADR Retest Price (£)", type: "price", defaultValue: "25", hint: "Per paper", section: "Extra Fees" },
      { key: "adrDuplicateCertPrice", label: "Duplicate Certificate Price (£)", type: "price", defaultValue: "25", section: "Extra Fees" },
      { key: "adrWeekendPrice", label: "Weekend Delivery Add-on (£)", type: "price", defaultValue: "150", section: "Extra Fees" },
    ],
  },

  "hgv-training": {
    label: "HGV & PCV Training",
    url: "/hgv-training",
    category: "Transport",
    fields: [
      ...HERO_FIELDS("HGV & PCV Driver Training", "Complete LGV and PCV training packages including DVLA medicals, theory tests, practical training, Module 4 CPC and fleet assessments."),
      { key: "catCPriceLabel", label: "Category C (Class 2) Price Label", type: "text", defaultValue: "From £1,495", section: "Pricing" },
      { key: "catCEPriceLabel", label: "Category C+E (Class 1) Price Label", type: "text", defaultValue: "From £2,695", section: "Pricing" },
      { key: "pcvPriceLabel", label: "PCV / Bus Category D Price Label", type: "text", defaultValue: "From £1,795", section: "Pricing" },
      { key: "medicalPrice", label: "Medical Assessment Price (£)", type: "price", defaultValue: "65", section: "Individual Services" },
      { key: "module4Price", label: "Module 4 CPC Price (£)", type: "price", defaultValue: "295", section: "Individual Services" },
      { key: "manoeuvres3aPrice", label: "3A Off-Road Manoeuvres Price (£)", type: "price", defaultValue: "250", section: "Individual Services" },
      { key: "practicalTestPrice", label: "3B Practical Driving Test Price (£)", type: "price", defaultValue: "450", section: "Individual Services" },
      { key: "fleetAssessmentLabel", label: "Fleet Driver Assessment Price Label", type: "text", defaultValue: "From £95", section: "Individual Services" },
      { key: "additionalDayPrice", label: "Additional Training Day Price (£)", type: "price", defaultValue: "350", section: "Individual Services" },
    ],
  },

  "plant-training": {
    label: "Plant & MHE Training",
    url: "/plant-training",
    category: "Plant",
    fields: [
      ...HERO_FIELDS("Plant & MHE Training", "NPORS accredited forklift, telehandler, reach truck and MEWP training. On-site or at our centres in Glasgow, Motherwell & Bothwell."),
      { key: "counterbalanceRefresherPrice", label: "Counterbalance Refresher Price", type: "text", defaultValue: "From £295", section: "Course Pricing" },
      { key: "counterbalanceNovicePrice", label: "Counterbalance Novice Price", type: "text", defaultValue: "From £595", section: "Course Pricing" },
      { key: "reachTruckPrice", label: "Reach Truck Training Price", type: "text", defaultValue: "From £595", section: "Course Pricing" },
      { key: "telehandlerPrice", label: "Telehandler Training Price", type: "text", defaultValue: "From £695", section: "Course Pricing" },
      { key: "mewpPrice", label: "MEWP Training Price", type: "text", defaultValue: "From £495", section: "Course Pricing" },
      { key: "excavatorPrice", label: "Excavator / Dumper Price", type: "text", defaultValue: "From £695", section: "Course Pricing" },
      { key: "nporsRegFee", label: "NPORS Registration Fee (£)", type: "price", defaultValue: "50", section: "NPORS Fees" },
      { key: "nporsDuplicateCard", label: "NPORS Duplicate Card Fee (£)", type: "price", defaultValue: "30", section: "NPORS Fees" },
      { key: "nporsAdditionalCandidate", label: "NPORS Additional Candidate Label", type: "text", defaultValue: "From £65", section: "NPORS Fees" },
      { key: "nporsRetestLabel", label: "NPORS Retest / Reassessment Label", type: "text", defaultValue: "From £85", section: "NPORS Fees" },
    ],
  },

  "tm-cpc": {
    label: "Transport Manager CPC",
    url: "/tm-cpc",
    category: "TM CPC",
    fields: [
      ...HERO_FIELDS("Transport Manager CPC", "Full TM CPC classroom training for Road Haulage and PSV. NLTC exam fees included."),
      { key: "roadHaulagePrice", label: "Road Haulage TM CPC Price (£)", type: "price", defaultValue: "1195", hint: "NLTC exam fees included", section: "Pricing" },
      { key: "psvPrice", label: "PSV / Bus TM CPC Price (£)", type: "price", defaultValue: "1195", hint: "NLTC exam fees included", section: "Pricing" },
      { key: "elearningAddOnPrice", label: "E-Learning Add-On Price (£)", type: "price", defaultValue: "129", hint: "TM App e-learning", section: "Add-ons" },
    ],
  },

  "medicals": {
    label: "Medicals",
    url: "/medicals",
    category: "Transport",
    fields: [
      ...HERO_FIELDS("DVLA Group 2 Medical Assessments", "Professional DVLA Group 2 medicals for HGV, PCV and taxi licence applications."),
      { key: "medicalPrice", label: "Medical Assessment Price (£)", type: "price", defaultValue: "65", section: "Pricing" },
    ],
  },

  "module-4-cpc": {
    label: "Module 4 CPC",
    url: "/module-4-cpc",
    category: "Transport",
    fields: [
      ...HERO_FIELDS("Module 4 CPC Practical Test", "Practical CPC test preparation and coaching."),
      { key: "module4Price", label: "Module 4 CPC Price (£)", type: "price", defaultValue: "295", section: "Pricing" },
    ],
  },

  "iosh-managing-safely": {
    label: "IOSH Managing Safely®",
    url: "/iosh-managing-safely",
    category: "Health & Safety",
    fields: [
      ...HERO_FIELDS("IOSH Managing Safely®", "The internationally recognised health and safety qualification for managers and supervisors — rated Outstanding by IOSH and delivered 100% online."),
      { key: "accessPeriod", label: "Course Access Period", type: "text", defaultValue: "190 days", section: "Course Details" },
      { key: "completionTime", label: "Typical Completion Time", type: "text", defaultValue: "16–24 hours", section: "Course Details" },
    ],
  },

  "driver-assessments": {
    label: "Driver Assessments",
    url: "/driver-assessments",
    category: "Transport",
    fields: [
      ...HERO_FIELDS("Driver Assessments", "Fleet and individual driver assessments across Scotland."),
      { key: "individualAssessmentLabel", label: "Individual Assessment Price Label", type: "text", defaultValue: "From £95", section: "Pricing" },
      { key: "fleetAssessmentLabel", label: "Fleet Programme Price Label", type: "text", defaultValue: "POA", section: "Pricing" },
    ],
  },

  "fleet-training": {
    label: "Fleet Training",
    url: "/fleet-training",
    category: "Transport",
    fields: [
      ...HERO_FIELDS("Fleet Driver Training", "Corporate fleet training programmes tailored to your business."),
      { key: "fleetPriceLabel", label: "Fleet Training Price Label", type: "text", defaultValue: "POA", section: "Pricing" },
    ],
  },

  "consultancy": {
    label: "Consultancy",
    url: "/consultancy",
    category: "Consultancy",
    fields: [
      ...HERO_FIELDS("Fleet & Transport Consultancy", "External TM services, operator licence support and fleet compliance."),
      { key: "externalTmPriceLabel", label: "External TM Service Price Label", type: "text", defaultValue: "POA", section: "Pricing" },
      { key: "fleetAuditPriceLabel", label: "Fleet Compliance Audit Price Label", type: "text", defaultValue: "From £250", section: "Pricing" },
      { key: "taachoPriceLabel", label: "Tachograph Analysis Price Label", type: "text", defaultValue: "From £295", section: "Pricing" },
      { key: "olatPriceLabel", label: "OLAT Price Label", type: "text", defaultValue: "From £495", section: "Pricing" },
    ],
  },

  "about": {
    label: "About TAG",
    url: "/about",
    category: "Company",
    fields: HERO_FIELDS("About Training Advantage Group", "Scotland's leading transport and industrial training provider, based in Bothwell, Motherwell and Glasgow."),
  },

  "news": {
    label: "News & Updates",
    url: "/news",
    category: "Company",
    fields: HERO_FIELDS("News & Updates", "The latest news from Training Advantage Group."),
  },

  "careers": {
    label: "Careers",
    url: "/careers",
    category: "Company",
    fields: HERO_FIELDS("Careers at TAG", "Join Scotland's leading transport training provider."),
  },

  "contact": {
    label: "Contact",
    url: "/contact",
    category: "Company",
    fields: HERO_FIELDS("Contact Us", "Get in touch with Training Advantage Group. We're here to help."),
  },

  "training-centres": {
    label: "Training Centres",
    url: "/training-centres",
    category: "Company",
    fields: HERO_FIELDS("Our Training Centres", "Based across central Scotland — Bothwell, Motherwell and Glasgow."),
  },

  "accreditations": {
    label: "Accreditations",
    url: "/accreditations",
    category: "Company",
    fields: HERO_FIELDS("Our Accreditations", "Training Advantage Group holds the highest industry accreditations."),
  },

  "testimonials": {
    label: "Testimonials",
    url: "/testimonials",
    category: "Company",
    fields: HERO_FIELDS("What Our Clients Say", "Read reviews and testimonials from our learners and customers."),
  },

  "e-learning": {
    label: "E-Learning",
    url: "/e-learning",
    category: "E-Learning",
    fields: [
      ...HERO_FIELDS("E-Learning Academy", "Online courses for health & safety, business skills, social care and more."),
      { key: "businessPackagePriceLabel", label: "Business Package Price Label", type: "text", defaultValue: "POA", section: "Pricing" },
    ],
  },

  "learner-hub": {
    label: "Learner Hub",
    url: "/learner-hub",
    category: "Learner",
    fields: HERO_FIELDS("Learner Hub", "Everything you need before, during and after your training."),
  },

  "pcv-training": {
    label: "PCV / Bus Training",
    url: "/pcv-training",
    category: "Transport",
    fields: [
      ...HERO_FIELDS("PCV / Bus Training", "Professional passenger vehicle training — Category D licence."),
      { key: "pcvPriceLabel", label: "PCV Full Package Price Label", type: "text", defaultValue: "From £1,795", section: "Pricing" },
    ],
  },

  "3a-manoeuvres": {
    label: "3A Manoeuvres",
    url: "/3a-manoeuvres",
    category: "Transport",
    fields: [
      ...HERO_FIELDS("3A Off-Road Manoeuvres", "Off-road reversing and manoeuvrability test preparation."),
      { key: "manoeuvresPrice", label: "3A Manoeuvres Price (£)", type: "price", defaultValue: "250", section: "Pricing" },
    ],
  },

  "theory-hazard-perception": {
    label: "Theory & Hazard Perception",
    url: "/theory-hazard-perception",
    category: "Transport",
    fields: HERO_FIELDS("Theory & Hazard Perception", "LGV and PCV theory test preparation and hazard perception coaching."),
  },

  "instructor-training": {
    label: "Instructor Training",
    url: "/instructor-training",
    category: "Instructors",
    fields: HERO_FIELDS("Instructor Training", "Become an approved Driver CPC, RADAT or ADR instructor with TAG."),
  },

  "first-aid": {
    label: "First Aid Training",
    url: "/first-aid",
    category: "Health & Safety",
    fields: [
      ...HERO_FIELDS("First Aid Training", "Accredited first aid courses — EFAW, FAW & Paediatric. NLTC Level 3 OFQUAL regulated."),
      { key: "efawPriceLabel", label: "EFAW Price Label", type: "text", defaultValue: "POA", section: "Pricing" },
      { key: "fawInitialPriceLabel", label: "FAW Initial Price Label", type: "text", defaultValue: "POA", section: "Pricing" },
      { key: "fawRefresherPriceLabel", label: "FAW Refresher Price Label", type: "text", defaultValue: "POA", section: "Pricing" },
      { key: "paediatricPriceLabel", label: "Paediatric First Aid Price Label", type: "text", defaultValue: "POA", section: "Pricing" },
    ],
  },

  "mental-health-first-aid": {
    label: "Mental Health First Aid",
    url: "/mental-health-first-aid",
    category: "Health & Safety",
    fields: [
      ...HERO_FIELDS("Mental Health First Aid Training", "Public Health Scotland accredited manager awareness training and the NLTC Level 3 Mental Health First Aid at Work qualification."),
      { key: "mhManagersPriceLabel", label: "Mental Health Awareness (Managers) Price Label", type: "text", defaultValue: "POA", section: "Pricing" },
      { key: "mhfaNltcPriceLabel", label: "NLTC Level 3 MHFA Price Label", type: "text", defaultValue: "POA", section: "Pricing" },
    ],
  },

  "verify-certificate": {
    label: "Verify Certificate",
    url: "/verify-certificate",
    category: "Company",
    fields: HERO_FIELDS("Verify a Certificate", "Instantly check the authenticity of any certificate issued by Training Advantage Group Ltd."),
  },
};

export function getPageSchema(slug: string): PageSchema | null {
  return PAGE_SCHEMAS[slug] ?? null;
}

export function getAllPageSchemaSlugs(): string[] {
  return Object.keys(PAGE_SCHEMAS);
}

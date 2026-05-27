import type { Course } from "./types";

export const COURSES: Course[] = [
  // Driver CPC
  { id: "dcpc-classroom", name: "Driver CPC Classroom (3.5hr)", category: "driver-cpc", price: 55, duration: "3.5 hours", url: "/driver-cpc" },
  { id: "dcpc-classroom-full", name: "Driver CPC Classroom (7hr)", category: "driver-cpc", price: 59, duration: "7 hours", url: "/driver-cpc" },
  { id: "dcpc-remote", name: "Driver CPC Remote / Online", category: "driver-cpc", price: 50, duration: "7 hours", url: "/driver-cpc" },

  // TM CPC
  { id: "tm-road-haulage", name: "Transport Manager CPC – Road Haulage", category: "tm-cpc", price: 1195, duration: "Intensive classroom", url: "/tm-cpc" },
  { id: "tm-psv", name: "Transport Manager CPC – PSV/Bus", category: "tm-cpc", price: 1195, duration: "Intensive classroom", url: "/tm-cpc" },
  { id: "tm-refresher", name: "TM CPC Refresher Training", category: "tm-cpc", url: "/tm-cpc" },

  // HGV Training
  { id: "hgv-class2", name: "HGV Class 2 (Cat C) Full Package", category: "hgv-training", priceLabel: "From £1,495", url: "/hgv-training" },
  { id: "hgv-class1", name: "HGV Class 1 (Cat C+E) Upgrade", category: "hgv-training", priceLabel: "From £2,695", url: "/hgv-training" },
  { id: "pcv-catd", name: "PCV / Bus Category D", category: "hgv-training", priceLabel: "From £1,795", url: "/hgv-training" },
  { id: "module4", name: "Module 4 CPC Practical", category: "hgv-training", price: 295, url: "/hgv-training" },
  { id: "medical", name: "Medical Assessment", category: "hgv-training", price: 65, url: "/hgv-training" },
  { id: "fleet-assessment", name: "Fleet Driver Assessment", category: "hgv-training", priceLabel: "From £95", url: "/hgv-training" },
  { id: "manoeuvres-3a", name: "3A Off Road Manoeuvres", category: "hgv-training", price: 250, url: "/hgv-training" },

  // ADR
  { id: "adr-initial", name: "ADR Dangerous Goods Initial", category: "adr", price: 395, url: "/adr-training" },
  { id: "adr-tanks", name: "ADR Tanks & Packages", category: "adr", price: 495, url: "/adr-training" },
  { id: "adr-requalification", name: "ADR Requalification", category: "adr", price: 325, url: "/adr-training" },
  { id: "adr-class1-7", name: "ADR Class 1 or 7 Upgrade", category: "adr", price: 95, url: "/adr-training" },

  // Plant Training
  { id: "counterbalance-refresher", name: "Counterbalance Forklift Refresher", category: "plant-training", priceLabel: "From £295", url: "/plant-training" },
  { id: "counterbalance-novice", name: "Counterbalance Forklift Novice", category: "plant-training", priceLabel: "From £595", url: "/plant-training" },
  { id: "reach-truck", name: "Reach Truck Training", category: "plant-training", priceLabel: "From £595", url: "/plant-training" },
  { id: "telehandler", name: "Telehandler Training", category: "plant-training", priceLabel: "From £695", url: "/plant-training" },
  { id: "mewp", name: "MEWP Training", category: "plant-training", priceLabel: "From £495", url: "/plant-training" },

  // Consultancy
  { id: "fleet-audit", name: "Fleet Compliance Audit", category: "consultancy", priceLabel: "From £250", url: "/consultancy" },
  { id: "external-tm", name: "External Transport Manager Service", category: "consultancy", url: "/consultancy" },
  { id: "olat", name: "Operator Licence Application Training (OLAT)", category: "consultancy", priceLabel: "From £495", url: "/consultancy" },
  { id: "tacho-analysis", name: "Digital Tachograph Analysis", category: "consultancy", priceLabel: "From £295", url: "/consultancy" },

  // Instructor Training
  { id: "dcpc-instructor", name: "Driver CPC Instructor Training", category: "instructor-training", url: "/instructor-training" },
  { id: "radat-instructor", name: "RADAT Instructor Training", category: "instructor-training", url: "/instructor-training" },
  { id: "adr-instructor", name: "ADR Instructor Mentoring", category: "instructor-training", url: "/instructor-training" },
];

export const getCourseById = (id: string): Course | undefined =>
  COURSES.find((c) => c.id === id);

export const getCoursesByCategory = (category: Course["category"]): Course[] =>
  COURSES.filter((c) => c.category === category);

export const LOCATIONS = [
  { value: "bothwell", label: "Bothwell HQ Exam Suite – G71 8DA" },
  { value: "motherwell", label: "Motherwell Training Centre – ML1 1TA" },
  { value: "glasgow", label: "Glasgow Training Centre – G14 0BX" },
  { value: "remote", label: "Remote / Online" },
  { value: "onsite", label: "On-site at my premises" },
];

export const COURSE_CATEGORIES = [
  { value: "driver-cpc", label: "Driver CPC" },
  { value: "tm-cpc", label: "Transport Manager CPC" },
  { value: "hgv-training", label: "HGV / PCV Training" },
  { value: "adr", label: "ADR Dangerous Goods" },
  { value: "plant-training", label: "Plant & MHE Training" },
  { value: "consultancy", label: "Consultancy & Compliance" },
  { value: "instructor-training", label: "Instructor Training" },
  { value: "e-learning", label: "E-Learning Academy" },
];

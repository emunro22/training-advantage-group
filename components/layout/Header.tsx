"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Mail,
  Menu,
  X,
  ChevronDown,
  MapPin,
  ArrowRight,
  Truck,
  GraduationCap,
  HardHat,
  Monitor,
  FileCheck,
  Users2,
  AlertTriangle,
  BookOpen,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";

const STATIC_NAV = [
  {
    label: "Transport",
    href: "/driver-cpc",
    icon: Truck,
    color: "text-blue-brand",
    items: [
      { label: "Driver CPC", href: "/driver-cpc", desc: "Periodic & Initial CPC training" },
      { label: "ADR Dangerous Goods", href: "/adr-training", desc: "Carriage of dangerous goods" },
      { label: "HGV Training", href: "/hgv-training", desc: "Cat C, C+E licence packages" },
      { label: "PCV / Bus Training", href: "/pcv-training", desc: "Category D passenger vehicles" },
      { label: "Driver Assessments", href: "/driver-assessments", desc: "Fleet & individual evaluation" },
      { label: "Fleet Driver Training", href: "/fleet-training", desc: "Corporate fleet programmes" },
      { label: "Theory & Hazard Perception", href: "/theory-hazard-perception", desc: "LGV/PCV test preparation" },
      { label: "Medicals", href: "/medicals", desc: "DVLA Group 2 medicals" },
      { label: "Module 4 CPC", href: "/module-4-cpc", desc: "Practical CPC test" },
      { label: "3a Manoeuvres", href: "/3a-manoeuvres", desc: "Off-road reversing & control" },
    ],
  },
  {
    label: "TM CPC",
    href: "/tm-cpc",
    icon: FileCheck,
    color: "text-navy",
    items: [
      { label: "Road Haulage TM CPC", href: "/tm-cpc", desc: "Full classroom intensive" },
      { label: "PSV / Bus TM CPC", href: "/tm-cpc#psv", desc: "Passenger vehicle operators" },
      { label: "Refresher Training", href: "/tm-cpc#refresher", desc: "CMP renewal support" },
      { label: "E-learning Support", href: "/tm-cpc#elearning", desc: "Online revision access" },
      { label: "Exam Preparation", href: "/tm-cpc#exams", desc: "NLTC exam guidance" },
      { label: "Study Materials", href: "/tm-cpc#materials", desc: "Revision resources" },
    ],
  },
  {
    label: "Plant & MHE",
    href: "/plant-training",
    icon: HardHat,
    color: "text-orange-brand",
    items: [
      { label: "Forklift Training", href: "/plant-training", desc: "Counterbalance & reach truck" },
      { label: "Reach Truck", href: "/plant-training#reach", desc: "Narrow aisle operations" },
      { label: "Telehandler", href: "/plant-training#telehandler", desc: "All terrain operations" },
      { label: "MEWP Training", href: "/plant-training#mewp", desc: "Powered access equipment" },
      { label: "NPORS Plant", href: "/plant-training#npors", desc: "Nationally recognised cards" },
      { label: "First Aid", href: "/plant-training#firstaid", desc: "Emergency first response" },
      { label: "Manual Handling", href: "/plant-training#manual", desc: "Workplace safety" },
    ],
  },
  {
    label: "E-Learning",
    href: "/e-learning",
    icon: Monitor,
    color: "text-teal-600",
    items: [
      { label: "Access E-Learning Platform", href: "https://videotilehost.com/trainingadvantagegroup/", desc: "Login or register for courses" },
      { label: "Health & Safety (81)", href: "/e-learning#health-safety", desc: "Online compliance courses" },
      { label: "Business Skills (54)", href: "/e-learning#business", desc: "Leadership & development" },
      { label: "Health & Social Care (40)", href: "/e-learning#social-care", desc: "Care sector training" },
      { label: "Mental Health (12)", href: "/e-learning#mental-health", desc: "Wellbeing awareness" },
      { label: "Hospitality (21)", href: "/e-learning#hospitality", desc: "Food & service training" },
      { label: "Business Packages", href: "/e-learning#business-packages", desc: "Multi-user accounts" },
      { label: "Free Trial", href: "/e-learning#free-trial", desc: "Try before you buy" },
    ],
  },
  {
    label: "Consultancy",
    href: "/consultancy",
    icon: GraduationCap,
    color: "text-purple-600",
    items: [
      { label: "External TM Services", href: "/consultancy", desc: "Outsourced TM support" },
      { label: "Operator Licence Support", href: "/consultancy#licence", desc: "Application & compliance" },
      { label: "Fleet Compliance Audit", href: "/consultancy#audit", desc: "OCRS improvement" },
      { label: "Tachograph Analysis", href: "/consultancy#tacho", desc: "Driver hours analysis" },
      { label: "FORS Support", href: "/consultancy#fors", desc: "Fleet operator recognition" },
      { label: "Earned Recognition", href: "/consultancy#earned-recognition", desc: "DVSA scheme support" },
    ],
  },
  {
    label: "Instructors",
    href: "/instructor-training",
    icon: Users2,
    color: "text-red-brand",
    items: [
      { label: "Driver CPC Instructor", href: "/instructor-training", desc: "Deliver CPC training" },
      { label: "RADAT Development", href: "/instructor-training#radat", desc: "Registered assessor training" },
      { label: "ADR Instructor Mentoring", href: "/instructor-training#adr", desc: "Dangerous goods instructors" },
      { label: "Fleet Assessor Training", href: "/instructor-training#fleet", desc: "Driver assessment skills" },
      { label: "TM Tutor Support", href: "/instructor-training#tm", desc: "Transport Manager tutoring" },
    ],
  },
  {
    label: "Health & Safety",
    href: "/iosh-managing-safely",
    icon: ShieldCheck,
    color: "text-green-600",
    items: [
      { label: "IOSH Managing Safely®", href: "/iosh-managing-safely", desc: "IOSH Approved — rated Outstanding" },
      { label: "First Aid Training", href: "/first-aid", desc: "EFAW, FAW & Paediatric — NLTC OFQUAL qualified" },
      { label: "Mental Health First Aid", href: "/mental-health-first-aid", desc: "Public Health Scotland & NLTC Level 3" },
    ],
  },
  {
    label: "Verify Certificate",
    href: "/verify-certificate",
    icon: BadgeCheck,
    color: "text-blue-brand",
    items: [],
  },
  {
    label: "Learner Hub",
    href: "/learner-hub",
    icon: BookOpen,
    color: "text-teal-600",
    items: [
      { label: "Joining Instructions", href: "/learner-hub", desc: "Before you arrive" },
      { label: "Downloads & Resources", href: "/learner-hub#downloads", desc: "Forms and documents" },
      { label: "Course FAQs", href: "/learner-hub#faqs", desc: "Common questions answered" },
      { label: "Funding Information", href: "/learner-hub#funding", desc: "Grants and support" },
      { label: "Accommodation", href: "/learner-hub#accommodation", desc: "Nearby hotels" },
    ],
  },
  {
    label: "About",
    href: "/about",
    icon: AlertTriangle,
    color: "text-gray-500",
    items: [
      { label: "About TAG", href: "/about", desc: "Our story & team" },
      { label: "Accreditations", href: "/accreditations", desc: "Our approvals & standards" },
      { label: "Training Centres", href: "/training-centres", desc: "Bothwell, Motherwell, Glasgow" },
      { label: "Testimonials", href: "/testimonials", desc: "What learners say" },
      { label: "News & Updates", href: "/news", desc: "Latest from TAG" },
      { label: "Careers", href: "/careers", desc: "Join our team" },
      { label: "Contact Us", href: "/contact", desc: "Get in touch" },
    ],
  },
];

interface CustomNavPage {
  slug: string;
  navLabel: string;
  navCategory: string;
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [customPages, setCustomPages] = useState<CustomNavPage[]>([]);
  const pathname = usePathname();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load custom pages for nav (published only, no auth needed)
  useEffect(() => {
    fetch("/api/nav")
      .then((r) => r.json())
      .then((d) => setCustomPages(d.pages ?? []))
      .catch(() => {});
  }, []);

  // Build the final nav: inject custom pages into their categories or as standalone items
  const NAV = (() => {
    const base = STATIC_NAV.map((section) => {
      const injected = customPages.filter((p) => p.navCategory === section.label.toLowerCase().replace(/[^a-z]/g, "-") || p.navCategory === section.label.toLowerCase());
      if (injected.length === 0) return section;
      return {
        ...section,
        items: [
          ...section.items,
          ...injected.map((p) => ({ label: p.navLabel, href: `/${p.slug}`, desc: "Custom page" })),
        ],
      };
    });

    // Add standalone custom pages as top-level nav items
    const standalones = customPages.filter((p) => p.navCategory === "standalone");
    const standaloneItems = standalones.map((p) => ({
      label: p.navLabel,
      href: `/${p.slug}`,
      icon: BookOpen,
      color: "text-gray-600",
      items: [] as { label: string; href: string; desc: string }[],
    }));

    return [...base, ...standaloneItems];
  })();

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 20);
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docH > 0 ? (scrollY / docH) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveMenu(null);
  }, [pathname]);

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(label);
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveMenu(null), 120);
  };

  const isActive = (href: string) =>
    href !== "#" && (pathname === href || pathname.startsWith(href + "/"));

  return (
    <>
      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-transparent pointer-events-none">
        <motion.div
          className="h-full bg-gradient-to-r from-orange-brand via-red-brand to-orange-brand origin-left"
          style={{ scaleX: scrollProgress / 100 }}
          transition={{ ease: "linear" }}
        />
      </div>

      {/* Top bar */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-navy text-white text-sm py-2 hidden md:block"
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="tel:01412582024" className="flex items-center gap-1.5 hover:text-orange-brand transition-colors group">
              <Phone size={13} className="group-hover:scale-110 transition-transform" />
              0141 258 2024
            </a>
            <a href="mailto:office@trainingadvantagegroup.co.uk" className="flex items-center gap-1.5 hover:text-orange-brand transition-colors">
              <Mail size={13} />
              office@trainingadvantagegroup.co.uk
            </a>
          </div>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1 text-gray-400 text-xs">
              <MapPin size={12} />
              Bothwell · Motherwell · Glasgow
            </span>
            <Link href="/booking" className="flex items-center gap-1.5 bg-orange-brand/20 border border-orange-brand/30 text-orange-brand px-3 py-1 rounded-full text-xs font-semibold hover:bg-orange-brand hover:text-white transition-all">
              Quick Booking
              <ArrowRight size={11} />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Main header */}
      <motion.header
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
          scrolled ? "shadow-lg shadow-navy/10" : "shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-[88px]">
            {/* Logo */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link href="/" className="flex-shrink-0 group">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className="relative h-16 w-16"
                >
                  <Image
                    src="/images/logo.png"
                    alt="Training Advantage Group Ltd"
                    fill
                    sizes="64px"
                    className="object-contain mix-blend-multiply"
                    priority
                  />
                </motion.div>
              </Link>
              <div className="hidden sm:block">
                <Link href="/" className="block group">
                  <div className="font-black text-navy leading-none text-lg">
                    TRAINING <span className="text-blue-brand">ADVANTAGE</span>
                  </div>
                  <div className="font-black text-navy text-lg leading-none mt-0.5">GROUP LTD</div>
                  <div className="text-orange-brand text-[9px] font-bold tracking-[0.18em] mt-1 uppercase">
                    Training for the Future
                  </div>
                </Link>
                <a
                  href="tel:01412582024"
                  className="flex items-center gap-1 text-navy text-sm font-semibold mt-1 hover:text-orange-brand transition-colors"
                >
                  <Phone size={13} />
                  0141 258 2024
                </a>
              </div>
            </div>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-px">
              {NAV.map((item) => {
                const active = isActive(item.href);
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(item.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      href={item.href}
                      className={`relative flex items-center gap-0.5 px-3 py-2 text-[13px] font-semibold rounded-lg transition-all duration-200 whitespace-nowrap ${
                        active
                          ? "text-blue-brand bg-blue-50"
                          : activeMenu === item.label
                          ? "text-navy bg-gray-light"
                          : "text-gray-700 hover:text-navy hover:bg-gray-light"
                      }`}
                    >
                      {item.label}
                      {item.items && item.items.length > 0 && (
                        <ChevronDown
                          size={13}
                          className={`transition-transform duration-200 ${activeMenu === item.label ? "rotate-180 text-orange-brand" : ""}`}
                        />
                      )}
                      {active && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute bottom-0 left-3 right-3 h-0.5 bg-orange-brand rounded-full"
                        />
                      )}
                    </Link>

                    <AnimatePresence>
                      {activeMenu === item.label && item.items && item.items.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.97 }}
                          transition={{ duration: 0.18, ease: "easeOut" }}
                          className={`absolute top-full left-0 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 mt-1 ${item.items.length > 7 ? "w-80" : "w-72"}`}
                          onMouseEnter={() => handleMouseEnter(item.label)}
                          onMouseLeave={handleMouseLeave}
                        >
                          {/* Header */}
                          <div className="px-3 py-2 mb-1 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                              <item.icon size={15} className={item.color} />
                              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.label}</span>
                            </div>
                          </div>
                          {item.items.map((sub, i) => (
                            <motion.div
                              key={sub.href + sub.label}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.04 }}
                            >
                              <Link
                                href={sub.href}
                                className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-light transition-colors group"
                                onClick={() => setActiveMenu(null)}
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-brand/50 flex-shrink-0 mt-1.5 group-hover:bg-orange-brand transition-colors" />
                                <div>
                                  <span className="text-sm font-semibold text-navy group-hover:text-blue-brand transition-colors block leading-tight">
                                    {sub.label}
                                  </span>
                                  <span className="text-xs text-gray-400 mt-0.5 block">{sub.desc}</span>
                                </div>
                              </Link>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            {/* CTA buttons */}
            <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
              <Link href="/contact" className="text-[12px] font-semibold text-gray-500 hover:text-navy transition-colors px-2.5 py-1.5 whitespace-nowrap">
                Contact
              </Link>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link href="/booking" className="btn-primary text-[12px] px-4 py-2 whitespace-nowrap">
                  Book Training
                </Link>
              </motion.div>
            </div>

            {/* Mobile toggle */}
            <motion.button
              className="lg:hidden p-2 rounded-xl hover:bg-gray-light transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              whileTap={{ scale: 0.92 }}
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X size={22} className="text-navy" />
                  </motion.div>
                ) : (
                  <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu size={22} className="text-navy" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden border-t border-gray-100 bg-white overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
                {/* Contact info */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="bg-navy rounded-xl p-4 mb-4 space-y-2"
                >
                  <a href="tel:01412582024" className="flex items-center gap-2 text-white text-sm">
                    <Phone size={14} className="text-orange-brand" /> 0141 258 2024
                  </a>
                  <a href="mailto:office@trainingadvantagegroup.co.uk" className="flex items-center gap-2 text-gray-300 text-xs">
                    <Mail size={14} className="text-orange-brand" /> office@trainingadvantagegroup.co.uk
                  </a>
                </motion.div>

                {NAV.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04 }}
                  >
                    <MobileNavItem item={item} onClose={() => setMobileOpen(false)} isActive={isActive(item.href)} />
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="pt-3 border-t border-gray-100"
                >
                  <Link href="/booking" className="btn-primary w-full justify-center" onClick={() => setMobileOpen(false)}>
                    Book Training Now
                    <ArrowRight size={16} />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}

function MobileNavItem({
  item,
  onClose,
  isActive,
}: {
  item: (typeof STATIC_NAV)[0];
  onClose: () => void;
  isActive: boolean;
}) {
  const [open, setOpen] = useState(false);

  // If no sub-items, render as a plain Link instead of an accordion button
  if (!item.items || item.items.length === 0) {
    return (
      <Link
        href={item.href}
        className={`flex items-center gap-2 w-full px-3 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
          isActive ? "bg-blue-50 text-blue-brand" : "text-navy hover:bg-gray-light"
        }`}
        onClick={onClose}
      >
        <item.icon size={15} className={item.color} />
        {item.label}
      </Link>
    );
  }

  return (
    <div>
      <button
        className={`flex items-center justify-between w-full px-3 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
          isActive ? "bg-blue-50 text-blue-brand" : "text-navy hover:bg-gray-light"
        }`}
        onClick={() => setOpen(!open)}
      >
        <span className="flex items-center gap-2">
          <item.icon size={15} className={item.color} />
          {item.label}
        </span>
        {item.items && item.items.length > 0 && (
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={15} />
          </motion.span>
        )}
      </button>
      <AnimatePresence>
        {open && item.items && item.items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="ml-4 border-l-2 border-orange-brand/30 pl-3 overflow-hidden"
          >
            {item.items.map((sub) => (
              <Link
                key={sub.href + sub.label}
                href={sub.href}
                className="block py-2 text-sm text-gray-600 hover:text-navy transition-colors"
                onClick={onClose}
              >
                {sub.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

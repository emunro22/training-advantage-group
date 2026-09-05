"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Truck, GraduationCap, HardHat, Monitor, FileCheck, Users2, AlertTriangle } from "lucide-react";

const SERVICES = [
  { id: "driver-cpc",    icon: Truck,        title: "Driver CPC",              desc: "DVSA & JAUPT approved periodic and initial Driver CPC, classroom or online.",   href: "/driver-cpc",         price: "From £50",    accent: "#0066cc", tags: ["Classroom", "Online", "JAUPT"] },
  { id: "tm-cpc",        icon: FileCheck,    title: "Transport Manager CPC",   desc: "Road Haulage & PSV TM CPC intensive training. NLTC exam fees included.",          href: "/tm-cpc",             price: "From £1,195", accent: "#0d1b4b", tags: ["Road Haulage", "PSV", "NLTC Incl."] },
  { id: "hgv-training",  icon: Truck,        title: "HGV & PCV Training",      desc: "Complete LGV and PCV packages including medicals, theory and practical tests.",   href: "/hgv-training",       price: "From £1,495", accent: "#ff6600", tags: ["Cat C", "Cat C+E", "Cat D"] },
  { id: "adr",           icon: AlertTriangle,title: "ADR Dangerous Goods",     desc: "DVSA approved ADR training. Initial, requalification and specialist upgrades.",   href: "/adr-training",       price: "From £325",   accent: "#cc0000", tags: ["Initial", "Requalification", "DVSA"] },
  { id: "plant",         icon: HardHat,      title: "Plant & MHE Training",    desc: "NPORS accredited forklift, telehandler, MEWP and plant machinery training.",      href: "/plant-training",     price: "From £295",   accent: "#ff6600", tags: ["NPORS", "Forklift", "Telehandler"] },
  { id: "e-learning",    icon: Monitor,      title: "E-Learning Academy",      desc: "200+ online CPD certified courses. Health & safety, business skills and more.",   href: "/e-learning",         price: "From £15",    accent: "#0d9488", tags: ["200+ Courses", "CPD", "Instant"] },
  { id: "consultancy",   icon: GraduationCap,title: "Consultancy & Compliance",desc: "External TM services, operator licence support, fleet audits and OCRS help.",     href: "/consultancy",        price: "POA",         accent: "#7c3aed", tags: ["Ext. TM", "Fleet Audit", "OCRS"] },
  { id: "instructor",    icon: Users2,       title: "Instructor Training",     desc: "RADAT approved instructor and assessor development for all transport sectors.",    href: "/instructor-training",price: "POA",         accent: "#0d1b4b", tags: ["RADAT", "CPC Instructor", "ADR"] },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] } },
};

export default function ServiceCards() {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-4 py-1 bg-orange-brand/10 text-orange-brand text-xs font-bold uppercase tracking-widest rounded-full mb-3">
            Our Training Services
          </span>
          <h2 className="section-heading">Everything You Need to Stay Compliant &amp; Progress</h2>
          <p className="section-subheading mx-auto mt-3 text-center">
            From Driver CPC to Transport Manager qualifications: complete solutions for individuals and fleets.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {SERVICES.map((svc) => {
            const Icon = svc.icon;
            return (
              <motion.div key={svc.id} variants={item}>
                <Link
                  href={svc.href}
                  className="group flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300"
                >
                  {/* Accent bar */}
                  <div
                    className="h-1 w-full transition-all duration-300 group-hover:h-1.5"
                    style={{ background: svc.accent }}
                  />

                  {/* Icon area */}
                  <div
                    className="p-5 transition-colors duration-300"
                    style={{ background: `${svc.accent}0d` }}
                  >
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.4 }}
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ background: `${svc.accent}20` }}
                    >
                      <Icon size={22} style={{ color: svc.accent }} />
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-navy text-[15px] leading-tight">{svc.title}</h3>
                      <span className="text-xs font-bold whitespace-nowrap" style={{ color: svc.accent }}>
                        {svc.price}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1">{svc.desc}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {svc.tags.map((tag) => (
                        <span key={tag} className="text-[11px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div
                      className="flex items-center gap-1.5 text-sm font-semibold group-hover:gap-3 transition-all duration-200"
                      style={{ color: svc.accent }}
                    >
                      Learn more
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

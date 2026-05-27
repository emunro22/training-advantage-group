"use client";

import { motion } from "framer-motion";

const ACCREDITATIONS = [
  { name: "Qualifications Scotland", sub: "Approved Centre", emoji: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-900" },
  { name: "Driver CPC", sub: "JAUPT Approved — AC00591", emoji: "🚛", bg: "bg-slate-50", border: "border-slate-200", text: "text-slate-900" },
  { name: "DVSA", sub: "Approved ADR Training Body", emoji: "⚠️", bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-900" },
  { name: "NPORS", sub: "Accredited", emoji: "🏗️", bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-900" },
  { name: "NLTC Qualifications", sub: "Official Regulated Qualification", emoji: "🎓", bg: "bg-red-50", border: "border-red-200", text: "text-red-900" },
  { name: "JAUPT Approved", sub: "Driver CPC Training", emoji: "✅", bg: "bg-green-50", border: "border-green-200", text: "text-green-900" },
];

export default function AccreditationsSection() {
  return (
    <section className="py-16 bg-gray-light">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="inline-block px-4 py-1 bg-navy/10 text-navy text-xs font-bold uppercase tracking-widest rounded-full mb-3">
            Accreditations
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-2">Fully Approved &amp; Accredited</h2>
          <p className="text-gray-dark text-sm max-w-xl mx-auto">
            Guaranteed quality, compliance and nationally recognised qualifications — backed by the leading industry bodies.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {ACCREDITATIONS.map((acc, i) => (
            <motion.div
              key={acc.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}
              className={`rounded-2xl border-2 p-4 text-center cursor-default transition-all duration-200 ${acc.bg} ${acc.border}`}
            >
              <div className="text-2xl mb-2">{acc.emoji}</div>
              <div className={`text-xs font-black ${acc.text}`}>{acc.name}</div>
              <div className="text-[10px] text-gray-500 mt-0.5 leading-tight">{acc.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Registration */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center text-xs text-gray-400"
        >
          Training Advantage Group Ltd | Registered in Scotland No. SC765674 | VAT Registration No. 446609573
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, Award, Headphones, Globe, BadgePoundSterling } from "lucide-react";

const REASONS = [
  {
    icon: Award,
    title: "Fully Accredited",
    desc: "Qualifications Scotland, DVSA, JAUPT, NPORS and NLTC approved. Your certifications are nationally recognised.",
    color: "bg-blue-50 text-blue-brand",
    ring: "ring-blue-200",
  },
  {
    icon: CheckCircle2,
    title: "Industry Experts",
    desc: "All training delivered by qualified, experienced transport and logistics professionals, not just educators.",
    color: "bg-orange-50 text-orange-brand",
    ring: "ring-orange-200",
  },
  {
    icon: Globe,
    title: "Flexible Delivery",
    desc: "Classroom, remote online and on-site training options. We work around your schedule and operations.",
    color: "bg-green-50 text-green-700",
    ring: "ring-green-200",
  },
  {
    icon: Clock,
    title: "Fast Results",
    desc: "Efficient, focused training that gets your drivers and managers qualified and compliant quickly.",
    color: "bg-purple-50 text-purple-700",
    ring: "ring-purple-200",
  },
  {
    icon: Headphones,
    title: "Ongoing Support",
    desc: "We don't disappear after training. Our team is available for compliance queries and ongoing guidance.",
    color: "bg-teal-50 text-teal-700",
    ring: "ring-teal-200",
  },
  {
    icon: BadgePoundSterling,
    title: "Competitive Pricing",
    desc: "Premium training at fair prices. Volume discounts available for fleets and corporate accounts.",
    color: "bg-yellow-50 text-yellow-700",
    ring: "ring-yellow-200",
  },
];

const STATS = [
  { value: "15+", label: "Years experience" },
  { value: "3",   label: "Training centres" },
  { value: "10k+", label: "Annual learners" },
  { value: "6",   label: "Accreditations" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.25, 0.4, 0.25, 1] },
  }),
};

export default function WhyChooseSection() {
  return (
    <section className="py-20 bg-gray-light">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <span className="inline-block px-4 py-1 bg-orange-brand/10 text-orange-brand text-xs font-bold uppercase tracking-widest rounded-full mb-4">
              Why Training Advantage Group?
            </span>
            <h2 className="section-heading mb-4">
              Scotland&apos;s Most Trusted Transport Training Partner
            </h2>
            <p className="text-gray-600 leading-relaxed mb-5">
              From single driver licences to complete fleet compliance programmes, TAG delivers consistent, high-quality training that keeps your business moving, compliant and ahead of the curve.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              With over 15 years in transport training and thousands of successful candidates every year, we understand what operators and drivers really need.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, scale: 0.88 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.2 + i * 0.07 }}
                  whileHover={{ y: -3, boxShadow: "0 6px 20px rgba(0,0,0,0.08)" }}
                  className="bg-white rounded-xl p-4 text-center shadow-sm transition-all duration-200"
                >
                  <div className="text-2xl font-black text-navy mb-1">{s.value}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right column — reason cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {REASONS.map((r, i) => {
              const Icon = r.icon;
              return (
                <motion.div
                  key={r.title}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group"
                >
                  <motion.div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ring-2 ring-transparent group-hover:${r.ring} ${r.color} transition-all duration-200`}
                    whileHover={{ rotate: [0, -8, 8, 0], transition: { duration: 0.4 } }}
                  >
                    <Icon size={20} />
                  </motion.div>
                  <h3 className="font-bold text-navy text-sm mb-1.5">{r.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{r.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { MapPin, Car, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const LOCATIONS = [
  {
    id: "bothwell",
    name: "Bothwell HQ",
    subtitle: "Exam Suite",
    address: ["1st Floor Training Suite", "APC Depot, Coalburn Road", "Bothwell, G71 8DA"],
    features: ["Main Headquarters", "Exam Suite", "Free Visitor Parking", "Candidate Shuttle Service"],
    gradient: "from-navy to-navy-light",
    accent: "bg-orange-brand",
    flag: "🏢",
  },
  {
    id: "motherwell",
    name: "Motherwell",
    subtitle: "Training Centre",
    address: ["28 Hope Street", "Motherwell", "ML1 1TA"],
    features: ["Full Training Facilities", "Modern Classrooms", "Central Location"],
    gradient: "from-blue-brand to-blue-dark",
    accent: "bg-white",
    flag: "🏫",
  },
  {
    id: "glasgow",
    name: "Glasgow",
    subtitle: "Training Centre",
    address: ["South Street", "Glasgow", "G14 0BX"],
    features: ["West Glasgow Location", "Transport Links", "Modern Facilities"],
    gradient: "from-orange-dark to-red-brand",
    accent: "bg-white",
    flag: "🏙️",
  },
];

export default function LocationsSection() {
  return (
    <section className="py-20 bg-gray-light">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1 bg-orange-brand/10 text-orange-brand text-xs font-bold uppercase tracking-widest rounded-full mb-3">
            Our Training Centres
          </span>
          <h2 className="section-heading">Training Across Scotland</h2>
          <p className="section-subheading mx-auto text-center mt-3">
            Three fully-equipped professional training centres across central Scotland, plus remote and on-site delivery nationwide.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {LOCATIONS.map((loc, i) => (
            <motion.div
              key={loc.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-2xl shadow-card overflow-hidden group cursor-default"
            >
              {/* Header */}
              <div className={`bg-gradient-to-br ${loc.gradient} p-5 relative overflow-hidden`}>
                <div className="absolute -right-4 -top-4 text-6xl opacity-20">{loc.flag}</div>
                <div className="flex items-center gap-2 relative">
                  <div className={`w-2 h-2 rounded-full ${loc.accent}`} />
                  <div>
                    <h3 className="font-black text-white text-lg leading-none">{loc.name}</h3>
                    <div className="text-white/60 text-xs mt-0.5">{loc.subtitle}</div>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-5">
                <div className="flex items-start gap-2 mb-4">
                  <MapPin size={14} className="text-orange-brand flex-shrink-0 mt-0.5" />
                  <address className="not-italic text-sm text-gray-600 leading-relaxed">
                    {loc.address.map((line, j) => (
                      <span key={j} className="block">{line}</span>
                    ))}
                  </address>
                </div>

                <ul className="space-y-1.5">
                  {loc.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-xs text-gray-600">
                      <CheckCircle2 size={12} className="text-blue-brand flex-shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Remote + on-site banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-5 shadow-card border border-gray-100"
        >
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-2xl bg-navy/10 flex items-center justify-center flex-shrink-0">
                <Car size={22} className="text-navy" />
              </div>
              <div>
                <h3 className="font-bold text-navy">Can&apos;t travel? We come to you.</h3>
                <p className="text-sm text-gray-500">On-site training and remote delivery available nationwide. Contact us to discuss your requirements.</p>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link href="/contact" className="btn-primary flex-shrink-0">Enquire Now</Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Shuttle note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500"
        >
          <Clock size={12} className="text-orange-brand" />
          <span>Free shuttle service at Bothwell HQ, every 10 minutes from St Bride&apos;s Church, Fallside Road.</span>
        </motion.div>
      </div>
    </section>
  );
}

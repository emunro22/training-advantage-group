"use client";

import { useSearchParams } from "next/navigation";
import BookingForm from "@/components/booking/BookingForm";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, CheckCircle2 } from "lucide-react";

export default function BookingPageClient() {
  const params = useSearchParams();
  const defaultCourse = params.get("course") ?? undefined;

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-hero py-16 md:py-20 overflow-hidden pattern-bg">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-brand via-red-brand to-orange-brand" />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 bg-orange-brand/20 border border-orange-brand/30 text-orange-brand text-xs font-bold uppercase tracking-widest rounded-full mb-4">
              Online Booking
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Book Your Training</h1>
            <p className="text-lg text-blue-light/90 max-w-2xl mx-auto">
              Complete the form below and we&apos;ll confirm your booking within 24 hours. All enquiries are responded to by a real member of our team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main */}
      <section className="py-16 bg-gray-light">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-2xl shadow-card p-6 md:p-8"
              >
                <BookingForm defaultCourse={defaultCourse} />
              </motion.div>
            </div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-5"
            >
              {/* Contact card */}
              <div className="bg-navy rounded-2xl p-5 text-white">
                <h3 className="font-bold mb-4">Prefer to Call?</h3>
                <div className="space-y-3">
                  <a href="tel:01412582024" className="flex items-center gap-2 hover:text-orange-brand transition-colors text-sm">
                    <Phone size={14} className="text-orange-brand" />
                    0141 258 2024
                  </a>
                  <a href="mailto:office@trainingadvantagegroup.co.uk" className="flex items-center gap-2 hover:text-orange-brand transition-colors text-xs">
                    <Mail size={14} className="text-orange-brand" />
                    office@trainingadvantagegroup.co.uk
                  </a>
                </div>
              </div>

              {/* What happens next */}
              <div className="bg-white rounded-2xl p-5 shadow-card">
                <h3 className="font-bold text-navy mb-4">What Happens Next?</h3>
                <div className="space-y-3">
                  {[
                    "We receive your booking request",
                    "Our team reviews availability",
                    "You receive email confirmation within 24hrs",
                    "Joining instructions sent before your course",
                    "Attend your training",
                    "Certificates issued on completion",
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <div className="w-5 h-5 rounded-full bg-navy/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-navy mt-0.5">
                        {i + 1}
                      </div>
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              {/* Locations */}
              <div className="bg-white rounded-2xl p-5 shadow-card">
                <h3 className="font-bold text-navy mb-4">Training Locations</h3>
                <div className="space-y-2.5">
                  {[
                    { name: "Bothwell HQ", post: "G71 8DA" },
                    { name: "Motherwell Centre", post: "ML1 1TA" },
                    { name: "Glasgow Centre", post: "G14 0BX" },
                    { name: "Remote / Online", post: "Nationwide" },
                  ].map(({ name, post }) => (
                    <div key={name} className="flex items-center gap-2 text-sm text-gray-700">
                      <MapPin size={13} className="text-orange-brand flex-shrink-0" />
                      <span>{name}</span>
                      <span className="text-gray-400 ml-auto text-xs">{post}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assurances */}
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
                <h3 className="font-bold text-navy mb-3">Our Promise</h3>
                {["No spam, we only contact you about your booking", "Response within 24 business hours", "No payment taken until confirmed"].map((item) => (
                  <div key={item} className="flex items-start gap-2 text-xs text-gray-700 mb-2">
                    <CheckCircle2 size={13} className="text-green-600 flex-shrink-0 mt-0.5" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

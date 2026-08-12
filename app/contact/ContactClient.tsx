"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Phone, Mail, MapPin, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";

const schema = z.object({
  firstName: z.string().min(2, "First name required"),
  lastName: z.string().min(2, "Last name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  consent: z.boolean().refine((v) => v === true, "Please accept the Terms and Privacy Notice"),
});

type FormValues = z.infer<typeof schema>;

const SUBJECTS = [
  "General Enquiry",
  "Driver CPC Booking",
  "Transport Manager CPC",
  "HGV / PCV Training",
  "ADR Training",
  "Plant & MHE Training",
  "E-Learning Academy",
  "Consultancy / Compliance",
  "Instructor Training",
  "External TM Services",
  "Fleet Booking",
  "Other",
];

export default function ContactClient() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          sourcePage: typeof window !== "undefined" ? window.location.pathname : undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try calling us on 0141 258 2024.");
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-hero py-20 pattern-bg overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-brand via-red-brand to-orange-brand" />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-4 py-1.5 bg-orange-brand/20 border border-orange-brand/30 text-orange-brand text-xs font-bold uppercase tracking-widest rounded-full mb-4">
              We&apos;re Here to Help
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Contact Us</h1>
            <p className="text-lg text-blue-light/90 max-w-xl mx-auto">
              Questions about training? Ready to book? Our friendly team is here to help Monday–Friday, 8am–5pm.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick contact strip */}
      <section className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Phone, label: "Call Us", value: "0141 258 2024", href: "tel:01412582024", sub: "Mon–Fri 8am–5pm" },
            { icon: Mail, label: "Email Us", value: "office@trainingadvantagegroup.co.uk", href: "mailto:office@trainingadvantagegroup.co.uk", sub: "Reply within 24hrs" },
            { icon: MapPin, label: "Visit Us", value: "Bothwell HQ, G71 8DA", href: "/about#locations", sub: "3 centres across Scotland" },
          ].map(({ icon: Icon, label, value, href, sub }) => (
            <a key={label} href={href} className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-light transition-colors group">
              <div className="w-10 h-10 rounded-xl bg-navy/10 flex items-center justify-center group-hover:bg-navy group-hover:text-white transition-colors">
                <Icon size={18} className="text-navy group-hover:text-white transition-colors" />
              </div>
              <div>
                <div className="text-xs text-gray-500">{label}</div>
                <div className="text-sm font-semibold text-navy">{value}</div>
                <div className="text-xs text-gray-400">{sub}</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Form + details */}
      <section className="py-16 bg-gray-light">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-10">
          {/* Form */}
          <AnimatedSection direction="left">
            <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
              {sent ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={28} className="text-green-600" />
                  </div>
                  <h3 className="text-xl font-black text-navy mb-2">Message Sent!</h3>
                  <p className="text-gray-600 text-sm">Thanks {watch("firstName")}, we&apos;ve received your message and will respond within 24 hours.</p>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-navy mb-6">Send Us a Message</h2>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="label">First Name *</label>
                        <input {...register("firstName")} className="input-field" placeholder="John" />
                        {errors.firstName && <p className="text-xs text-red-600 mt-1">{errors.firstName.message}</p>}
                      </div>
                      <div>
                        <label className="label">Last Name *</label>
                        <input {...register("lastName")} className="input-field" placeholder="Smith" />
                        {errors.lastName && <p className="text-xs text-red-600 mt-1">{errors.lastName.message}</p>}
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Email *</label>
                        <input {...register("email")} type="email" className="input-field" placeholder="john@company.co.uk" />
                        {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
                      </div>
                      <div>
                        <label className="label">Phone</label>
                        <input {...register("phone")} type="tel" className="input-field" placeholder="0141 258 2024" />
                      </div>
                    </div>
                    <div>
                      <label className="label">Company</label>
                      <input {...register("company")} className="input-field" placeholder="Optional" />
                    </div>
                    <div>
                      <label className="label">Subject *</label>
                      <select {...register("subject")} className="input-field">
                        <option value="">Select subject…</option>
                        {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {errors.subject && <p className="text-xs text-red-600 mt-1">{errors.subject.message}</p>}
                    </div>
                    <div>
                      <label className="label">Message *</label>
                      <textarea {...register("message")} rows={5} className="input-field resize-none" placeholder="Tell us what you need…" />
                      {errors.message && <p className="text-xs text-red-600 mt-1">{errors.message.message}</p>}
                    </div>

                    <div>
                      <label className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer">
                        <input type="checkbox" {...register("consent")} className="mt-0.5 w-4 h-4 rounded flex-shrink-0" />
                        <span>
                          I agree to the{" "}
                          <Link href="/policies#terms" className="text-blue-brand hover:underline">Terms</Link> and{" "}
                          <Link href="/policies#privacy" className="text-blue-brand hover:underline">Privacy Notice</Link>. *
                        </span>
                      </label>
                      {errors.consent && <p className="text-xs text-red-600 mt-1">{errors.consent.message}</p>}
                    </div>

                    {error && (
                      <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                        <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                        {error}
                      </div>
                    )}

                    <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center">
                      {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Sending…</> : "Send Message"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </AnimatedSection>

          {/* Details */}
          <AnimatedSection direction="right" className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-navy mb-5">Our Training Centres</h2>
              {[
                {
                  name: "Bothwell HQ & Exam Suite",
                  address: "1st Floor Training Suite, APC Depot, Coalburn Road, Bothwell, G71 8DA",
                  note: "Main headquarters with exam suite. Free shuttle service from St Bride's Church.",
                  color: "border-navy",
                },
                {
                  name: "Motherwell Training Centre",
                  address: "28 Hope Street, Motherwell, ML1 1TA",
                  note: "Fully equipped training rooms in central Motherwell.",
                  color: "border-blue-brand",
                },
                {
                  name: "Glasgow Training Centre",
                  address: "South Street, Glasgow, G14 0BX",
                  note: "West Glasgow centre with modern training facilities.",
                  color: "border-orange-brand",
                },
              ].map(({ name, address, note, color }) => (
                <div key={name} className={`bg-white rounded-xl p-4 shadow-sm border-l-4 mb-3 ${color}`}>
                  <h3 className="font-bold text-navy text-sm mb-1">{name}</h3>
                  <p className="text-xs text-gray-600 mb-1">{address}</p>
                  <p className="text-xs text-gray-400">{note}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={16} className="text-orange-brand" />
                <h3 className="font-bold text-navy">Opening Hours</h3>
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-700"><span>Monday – Friday</span><span className="font-semibold">8:00am – 5:30pm</span></div>
                <div className="flex justify-between text-gray-500"><span>Saturday</span><span>By appointment</span></div>
                <div className="flex justify-between text-gray-400"><span>Sunday</span><span>Closed</span></div>
              </div>
            </div>

            <div className="bg-navy rounded-xl p-5 text-white">
              <h3 className="font-bold mb-2">Prefer to Book Directly?</h3>
              <p className="text-sm text-white/80 mb-4">Use our online booking system to request a training place in minutes.</p>
              <Link href="/booking" className="btn-primary w-full justify-center text-sm">Book Training Now</Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}

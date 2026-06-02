"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Star, Quote } from "lucide-react";

interface TestimonialItem {
  name: string;
  company: string;
  role: string;
  text: string;
  rating: number;
  initial: string;
}

const FALLBACK_TESTIMONIALS: TestimonialItem[] = [
  {
    name: "Derek Morrison",
    company: "Morrison Haulage Ltd",
    role: "Transport Manager",
    text: "Excellent TM CPC training. The instructors are highly experienced and really know their stuff. Passed my exams first time and the support throughout was outstanding.",
    rating: 5,
    initial: "D",
  },
  {
    name: "Sarah McAllister",
    company: "West Coast Logistics",
    role: "Fleet Manager",
    text: "We've used TAG for all our driver CPC training for the past three years. Always professional, flexible around our operations, and our drivers consistently enjoy the sessions.",
    rating: 5,
    initial: "S",
  },
  {
    name: "Jamie Henderson",
    company: "Individual Learner",
    role: "HGV Driver",
    text: "Got my Class 1 licence through TAG. The instructors are patient and knowledgeable. Passed my test first time and couldn't be happier. Highly recommend to anyone looking to progress.",
    rating: 5,
    initial: "J",
  },
  {
    name: "Craig Watson",
    company: "Watson Plant Hire",
    role: "Operations Director",
    text: "Booked our whole team in for forklift refresher training. TAG came on-site to us which was ideal. Professional delivery, NPORS cards issued promptly. Will definitely use again.",
    rating: 5,
    initial: "C",
  },
];

const COLORS = ["bg-blue-600", "bg-orange-500", "bg-purple-600", "bg-green-600", "bg-red-500", "bg-teal-600", "bg-indigo-600", "bg-yellow-600"];

export default function TestimonialsSection({ testimonials: propTestimonials }: { testimonials?: TestimonialItem[] }) {
  const testimonials = propTestimonials && propTestimonials.length > 0 ? propTestimonials : FALLBACK_TESTIMONIALS;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <section ref={ref} className="py-20 bg-navy relative overflow-hidden">
      <div className="absolute inset-0 pattern-bg opacity-40" />
      <motion.div
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #ff6600 0%, transparent 70%)" }}
      />

      <div className="relative max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1 bg-orange-brand/20 text-orange-brand text-xs font-bold uppercase tracking-widest rounded-full mb-3">
            What Our Learners Say
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
            Trusted By Thousands Across Scotland
          </h2>
          <div className="flex items-center justify-center gap-1 mt-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={18} className="text-orange-brand fill-orange-brand" />
            ))}
            <span className="text-white/60 text-sm ml-2">5.0 average rating</span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="bg-white/8 backdrop-blur-sm border border-white/15 rounded-2xl p-5 flex flex-col"
            >
              {/* Quote icon */}
              <Quote size={20} className="text-orange-brand mb-3 opacity-80" />

              {/* Text */}
              <p className="text-sm text-white/85 leading-relaxed mb-4 flex-1">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={12} className="text-orange-brand fill-orange-brand" />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full ${COLORS[i]} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                  {t.initial}
                </div>
                <div>
                  <div className="font-bold text-white text-sm leading-tight">{t.name}</div>
                  <div className="text-[11px] text-blue-light/70">{t.role}</div>
                  <div className="text-[11px] text-orange-brand/80">{t.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

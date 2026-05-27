"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { ArrowRight, Shield, Award, Users, MapPin, ChevronRight, Play } from "lucide-react";

const HERO_SLIDES = [
  { src: "/images/hero-1.png", alt: "Professional HGV Training" },
  { src: "/images/hero-2.png", alt: "Transport Training Scotland" },
  { src: "/images/hero-3.png", alt: "Fleet Driver Training" },
];

const SERVICES_TICKER = [
  "Driver CPC", "Transport Manager CPC", "HGV Training", "ADR Dangerous Goods",
  "Forklift Training", "NPORS Plant", "E-Learning Academy", "Fleet Compliance",
  "Instructor Training", "External TM Services",
];

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 600], [0, 80]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [ticker, setTicker] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActiveSlide((p) => (p + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTicker((p) => (p + 1) % SERVICES_TICKER.length), 2500);
    return () => clearInterval(id);
  }, []);

  return (
    <section ref={ref} className="relative min-h-[92vh] bg-gradient-hero overflow-hidden flex items-center">
      {/* Animated background circles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,102,204,0.15) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,102,0,0.1) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }}
        />
      </div>

      {/* Orange top bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-brand via-red-brand to-orange-brand" />

      {/* Hero image slideshow (right side background) */}
      <motion.div
        className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block"
        style={{ y: yParallax }}
      >
        {HERO_SLIDES.map((slide, i) => (
          <motion.div
            key={slide.src}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: i === activeSlide ? 1 : 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="50vw"
              className="object-cover"
              priority={i === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
          </motion.div>
        ))}
        {/* Slide dots */}
        <div className="absolute bottom-8 right-8 flex gap-2 z-10">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              className={`rounded-full transition-all duration-300 ${i === activeSlide ? "w-6 h-2 bg-orange-brand" : "w-2 h-2 bg-white/40 hover:bg-white/70"}`}
            />
          ))}
        </div>
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-4 py-24 lg:py-32 w-full">
        <div className="max-w-2xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange-brand/15 border border-orange-brand/25 text-orange-brand text-xs font-bold uppercase tracking-widest rounded-full backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-brand animate-pulse" />
              Scotland&apos;s Premier Training Provider
            </span>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {["EXPERT", "TRAINING.", "DELIVERING", "FUTURES."].map((word, i) => (
              <motion.div
                key={word}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
                className={`text-5xl md:text-6xl xl:text-7xl font-black leading-none ${
                  i === 1 ? "text-orange-brand" : i === 2 ? "gradient-text" : "text-white"
                }`}
              >
                {word}
              </motion.div>
            ))}
          </motion.div>

          {/* Ticker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-5 flex items-center gap-2 overflow-hidden"
          >
            <span className="text-gray-400 text-sm flex-shrink-0">Specialist in:</span>
            <div className="h-6 overflow-hidden flex-1">
              <motion.div
                key={ticker}
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -24, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-orange-brand font-bold text-sm"
              >
                {SERVICES_TICKER[ticker]}
              </motion.div>
            </div>
          </motion.div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="mt-5 text-base md:text-lg text-blue-light/80 max-w-lg leading-relaxed"
          >
            Industry-leading transport, logistics, compliance and industrial training
            delivered across Scotland and the UK. Professional, accredited, results-driven.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link href="/booking" className="btn-primary group text-base px-7 py-3.5 shadow-lg shadow-orange-brand/25">
                Book a Course
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link href="#services" className="btn-secondary text-base px-7 py-3.5">
                Explore Training
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link href="/e-learning" className="inline-flex items-center gap-2 px-5 py-3.5 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-xl hover:bg-white/20 transition-all text-sm font-semibold">
                <Play size={14} className="fill-white" />
                Free E-Learning Trial
              </Link>
            </motion.div>
          </motion.div>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            {[
              { icon: Users, value: "10k+", label: "Trained annually" },
              { icon: Award, value: "6+", label: "Accreditations" },
              { icon: MapPin, value: "3", label: "Training centres" },
              { icon: Shield, value: "100%", label: "Compliance focused" },
            ].map(({ icon: Icon, value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.85 + i * 0.08 }}
                className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-3 text-center hover:bg-white/15 transition-colors"
              >
                <Icon size={16} className="text-orange-brand mx-auto mb-1" />
                <div className="text-lg font-black text-white">{value}</div>
                <div className="text-[10px] text-blue-light/70 leading-tight">{label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Breadcrumb navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-8 flex flex-wrap items-center gap-1 text-xs text-white/50"
          >
            {["Driver CPC", "TM CPC", "HGV Training", "Plant Training", "E-Learning"].map((s, i) => (
              <span key={s} className="flex items-center gap-1">
                {i > 0 && <ChevronRight size={10} />}
                <Link href={`/${s.toLowerCase().replace(/\s+/g, "-")}`} className="hover:text-orange-brand transition-colors">
                  {s}
                </Link>
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <motion.div className="absolute bottom-0 left-0 right-0" style={{ opacity }}>
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
          <path d="M0 60L1440 60L1440 30C1440 30 1080 0 720 0C360 0 0 30 0 30L0 60Z" fill="white" />
        </svg>
      </motion.div>
    </section>
  );
}

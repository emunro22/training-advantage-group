"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Phone, Mail, Sparkles } from "lucide-react";
import { useRef } from "react";

const FLOATING_ORBS = [
  { size: 320, top: "-10%", left: "-5%", delay: 0 },
  { size: 240, top: "60%", right: "-8%", delay: 1.5 },
  { size: 160, top: "30%", left: "60%", delay: 0.8 },
];

export default function CTASection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };
  const item = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] } },
  };

  return (
    <section ref={ref} className="py-24 bg-gradient-hero relative overflow-hidden">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-brand via-red-brand to-orange-brand" />

      {/* Animated background pattern */}
      <div className="absolute inset-0 pattern-bg opacity-30" />

      {/* Floating orbs */}
      {FLOATING_ORBS.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: orb.size,
            height: orb.size,
            top: orb.top,
            left: (orb as { left?: string }).left,
            right: (orb as { right?: string }).right,
            background: "radial-gradient(circle, rgba(255,102,0,0.12) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 5 + i, repeat: Infinity, delay: orb.delay }}
        />
      ))}

      {/* Parallax grid lines */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 opacity-5"
        aria-hidden
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute border-t border-white"
            style={{ top: `${i * 14}%`, left: 0, right: 0 }}
          />
        ))}
      </motion.div>

      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Badge */}
          <motion.div variants={item}>
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-orange-brand/20 text-orange-brand text-xs font-bold uppercase tracking-widest rounded-full mb-5">
              <Sparkles size={12} />
              Ready to Get Started?
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            variants={item}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-5 leading-tight"
          >
            Invest in Training.
            <motion.span
              className="block text-orange-brand"
              animate={{ opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Invest in Success.
            </motion.span>
          </motion.h2>

          {/* Sub copy */}
          <motion.p
            variants={item}
            className="text-lg text-blue-light/90 max-w-xl mx-auto mb-10"
          >
            Get in touch today and one of our training advisors will help you find the right course for your needs and budget.
          </motion.p>

          {/* Buttons */}
          <motion.div
            variants={item}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link href="/booking" className="btn-primary group text-base px-8 py-4">
                Book Training Now
                <motion.span
                  className="inline-block"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight size={20} />
                </motion.span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link href="/contact" className="btn-secondary text-base px-8 py-4">
                Contact Us
              </Link>
            </motion.div>
          </motion.div>

          {/* Contact details */}
          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <motion.a
              href="tel:01412582024"
              className="flex items-center gap-3 text-white hover:text-orange-brand transition-colors group"
              whileHover={{ scale: 1.03 }}
            >
              <div className="w-11 h-11 rounded-full bg-white/10 group-hover:bg-orange-brand/20 flex items-center justify-center transition-colors">
                <Phone size={18} />
              </div>
              <div className="text-left">
                <div className="text-xs text-blue-light/60">Call us on</div>
                <div className="font-bold">0141 258 2024</div>
              </div>
            </motion.a>

            <div className="w-px h-8 bg-white/20 hidden sm:block" />

            <motion.a
              href="mailto:office@trainingadvantagegroup.co.uk"
              className="flex items-center gap-3 text-white hover:text-orange-brand transition-colors group"
              whileHover={{ scale: 1.03 }}
            >
              <div className="w-11 h-11 rounded-full bg-white/10 group-hover:bg-orange-brand/20 flex items-center justify-center transition-colors">
                <Mail size={18} />
              </div>
              <div className="text-left">
                <div className="text-xs text-blue-light/60">Email us at</div>
                <div className="font-bold text-sm">office@trainingadvantagegroup.co.uk</div>
              </div>
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-navy/60 to-transparent pointer-events-none" />
    </section>
  );
}

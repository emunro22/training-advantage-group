"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

const STATS = [
  { value: 10000, suffix: "+", label: "Learners trained annually", icon: "👥" },
  { value: 99,    suffix: "%", label: "Exam pass rate",             icon: "🏆" },
  { value: 15,    suffix: "+", label: "Years of experience",         icon: "📅" },
  { value: 200,   suffix: "+", label: "E-learning courses",          icon: "💻" },
];

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString() + suffix);

  useEffect(() => {
    if (inView) {
      animate(count, value, { duration: 2.2, ease: "easeOut" });
    }
  }, [inView, count, value]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

export default function StatsSection() {
  return (
    <section className="py-16 bg-navy relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pattern-bg opacity-30" />
      <motion.div
        className="absolute top-0 left-1/2 w-[800px] h-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,102,0,0.08) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
              className="text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
              >
                <div className="text-3xl mb-3">{stat.icon}</div>
                <div className="text-4xl md:text-5xl font-black text-orange-brand mb-2 tabular-nums">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-blue-light/70 font-medium leading-tight">{stat.label}</div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  accentColor?: string;
  tag?: string;
  cta?: { label: string; href: string };
}

export default function PageHero({
  title,
  subtitle,
  breadcrumbs,
  tag,
  cta,
}: PageHeroProps) {
  return (
    <section className="relative bg-gradient-hero overflow-hidden py-20 md:py-28 pattern-bg">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-brand/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-brand/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Orange accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-brand via-red-brand to-orange-brand" />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-1.5 text-sm text-blue-light/80 mb-6"
          >
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            {breadcrumbs.map((bc, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <ChevronRight size={14} />
                {bc.href ? (
                  <Link href={bc.href} className="hover:text-white transition-colors">{bc.label}</Link>
                ) : (
                  <span className="text-white font-medium">{bc.label}</span>
                )}
              </span>
            ))}
          </motion.nav>
        )}

        {/* Tag */}
        {tag && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-4"
          >
            <span className="inline-block px-4 py-1.5 bg-orange-brand/20 border border-orange-brand/30 text-orange-brand text-xs font-bold uppercase tracking-widest rounded-full">
              {tag}
            </span>
          </motion.div>
        )}

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight max-w-3xl"
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-4 text-lg md:text-xl text-blue-light/90 max-w-2xl leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}

        {/* CTA */}
        {cta && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link href={cta.href} className="btn-primary">
              {cta.label}
            </Link>
            <Link href="/contact" className="btn-secondary">
              Enquire Now
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}

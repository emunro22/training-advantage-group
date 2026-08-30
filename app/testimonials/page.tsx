export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";
import CTASection from "@/components/home/CTASection";
import GoogleReviewsSection from "@/components/home/GoogleReviewsSection";
import { Star, Quote } from "lucide-react";
import Link from "next/link";
import { getTestimonials } from "@/lib/storage";

export const metadata: Metadata = {
  alternates: { canonical: "/testimonials" },
  title: "Testimonials & Reviews | Training Advantage Group Ltd",
  description:
    "Read reviews and testimonials from thousands of satisfied learners and fleet operators who have trained with Training Advantage Group across Scotland.",
};

const FALLBACK_TESTIMONIALS = [
  {
    name: "Derek Morrison",
    company: "Morrison Haulage Ltd",
    role: "Transport Manager",
    text: "Excellent TM CPC training. The instructors are highly experienced and really know their stuff. Passed my exams first time and the support throughout was outstanding.",
    rating: 5,
    category: "TM CPC",
  },
  {
    name: "Sarah McAllister",
    company: "West Coast Logistics",
    role: "Fleet Manager",
    text: "We've used TAG for all our driver CPC training for the past three years. Always professional, flexible around our operations, and our drivers consistently enjoy the sessions.",
    rating: 5,
    category: "Driver CPC",
  },
  {
    name: "Jamie Henderson",
    company: "Individual Learner",
    role: "HGV Driver",
    text: "Got my Class 1 licence through TAG. The instructors are patient and knowledgeable. Passed my test first time and couldn't be happier. Highly recommend to anyone looking to progress.",
    rating: 5,
    category: "HGV Training",
  },
  {
    name: "Craig Watson",
    company: "Watson Plant Hire",
    role: "Operations Director",
    text: "Booked our whole team in for forklift refresher training. TAG came on-site to us which was ideal. Professional delivery, NPORS cards issued promptly. Will definitely use again.",
    rating: 5,
    category: "Plant Training",
  },
  {
    name: "Gillian Fraser",
    company: "Stagecoach",
    role: "Training Coordinator",
    text: "We needed ADR requalification for a large number of drivers at short notice. TAG scheduled multiple sessions efficiently and all delegates passed. Exceptional service.",
    rating: 5,
    category: "ADR Training",
  },
  {
    name: "Robert Campbell",
    company: "Campbell Transport Ltd",
    role: "Managing Director",
    text: "Used TAG for our entire fleet driver CPC programme. Having a dedicated account manager and the flexibility to schedule around our operations made a huge difference.",
    rating: 5,
    category: "Fleet Training",
  },
  {
    name: "Angela Brennan",
    company: "Individual Learner",
    role: "TM CPC Candidate",
    text: "I was nervous about the TM CPC exams but the tutors really put me at ease. The study materials were excellent and I passed all four modules. Very grateful to the TAG team.",
    rating: 5,
    category: "TM CPC",
  },
  {
    name: "Paul Stewart",
    company: "Stewart Logistics",
    role: "Transport Manager",
    text: "The consultancy service is genuinely valuable. After our DVSA visit, the team helped us improve our OCRS and implement proper compliance systems. Cannot recommend highly enough.",
    rating: 5,
    category: "Consultancy",
  },
];

const COLORS = [
  "bg-blue-600", "bg-orange-500", "bg-purple-600", "bg-green-600",
  "bg-red-500", "bg-teal-600", "bg-indigo-600", "bg-yellow-600",
];

const STATS = [
  { value: "5.0", label: "Average Rating" },
  { value: "10,000+", label: "Annual Learners" },
  { value: "99%", label: "Pass Rate" },
  { value: "15+", label: "Years Experience" },
];

export default async function TestimonialsPage() {
  const dbTestimonials = await getTestimonials(true);

  const testimonials =
    dbTestimonials.length > 0
      ? dbTestimonials.map((t) => ({
          name: t.name,
          company: t.company,
          role: t.role,
          text: t.text,
          rating: t.rating,
          category: t.category ?? "",
        }))
      : FALLBACK_TESTIMONIALS;

  return (
    <>
      <PageHero
        title="What Our Learners Say"
        subtitle="Trusted by thousands of drivers, fleet operators and transport managers across Scotland and the UK. Here's what they have to say about training with TAG."
        tag="Testimonials"
        breadcrumbs={[{ label: "About TAG", href: "/about" }, { label: "Testimonials" }]}
      />

      {/* Stats */}
      <section className="py-12 bg-navy">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <AnimatedSection key={stat.label} delay={i * 0.1}>
                <div className="text-center">
                  <div className="text-3xl font-black text-orange-brand mb-1">{stat.value}</div>
                  <div className="flex justify-center gap-0.5 mb-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} size={10} className="text-orange-brand fill-orange-brand" />
                    ))}
                  </div>
                  <div className="text-xs text-blue-light/70">{stat.label}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials grid */}
      <section className="py-20 bg-gray-light">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <AnimatedSection key={`${t.name}-${i}`} delay={i * 0.06}>
                <div className="bg-white rounded-2xl p-6 shadow-card h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <Quote size={18} className="text-orange-brand" />
                    {t.category && (
                      <span className="text-xs bg-blue-50 text-blue-brand px-2 py-1 rounded-full font-semibold">
                        {t.category}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4 flex-1">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-0.5 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={12} className="text-orange-brand fill-orange-brand" />
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${COLORS[i % COLORS.length]} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                      {t.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-navy text-sm">{t.name}</div>
                      <div className="text-xs text-gray-500">{t.role}</div>
                      <div className="text-xs text-orange-brand/80">{t.company}</div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Google Reviews */}
      <GoogleReviewsSection />

      {/* CTA for more reviews */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-2xl font-bold text-navy mb-4">Leave Us a Review</h2>
            <p className="text-gray-600 mb-6">
              Did you train with TAG? We&apos;d love to hear how you got on. Leave a review on Google to help other learners find us.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/booking" className="btn-primary">
                Book Your Training
              </Link>
              <Link href="/contact" className="btn-outline">
                Get in Touch
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <CTASection />
    </>
  );
}

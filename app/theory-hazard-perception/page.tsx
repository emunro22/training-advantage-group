import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";
import PriceCard from "@/components/ui/PriceCard";
import CTASection from "@/components/home/CTASection";
import { CheckCircle2, BookOpen, Monitor, Target } from "lucide-react";
import Link from "next/link";
import StructuredData from "@/components/seo/StructuredData";
import { buildFAQSchema } from "@/lib/schema";

export const metadata: Metadata = {
  alternates: { canonical: "/theory-hazard-perception" },
  title: "LGV & PCV Theory Test Preparation Scotland | Hazard Perception",
  description:
    "Theory test preparation for LGV and PCV licence applicants. Mock tests, hazard perception training and fast-track support. Nationwide. From £95.",
};

const THEORY_TOPICS = [
  "Road signs and markings",
  "Drivers' hours and tachograph rules",
  "Vehicle safety and maintenance",
  "Braking distances and physics",
  "Motorway and dual carriageway rules",
  "Load safety and restraint",
  "Environmental responsibilities",
  "Emergency situations",
  "Vehicle documentation and licensing",
  "Vulnerable road users",
];

const FAQS = [
  {
    q: "What is the LGV theory test?",
    a: "The LGV (Large Goods Vehicle) theory test consists of a multiple-choice section and a hazard perception section. You must pass both parts on the same day. The test is taken at an approved DVSA test centre.",
  },
  {
    q: "How many questions are in the multiple choice section?",
    a: "The LGV/PCV theory test multiple choice section contains 100 questions. You have 115 minutes to complete it and must score 85 or more to pass.",
  },
  {
    q: "What is the hazard perception test?",
    a: "The hazard perception test shows you 19 video clips of real driving situations. You must click when you see a developing hazard. You need to score 67 out of 100 to pass.",
  },
  {
    q: "Do I need theory support if I already hold a car licence?",
    a: "Many LGV questions are different from Category B questions, particularly around tachographs, drivers' hours and large vehicle handling. Theory support is strongly recommended for all candidates.",
  },
  {
    q: "How soon can I take the theory test after applying?",
    a: "DVSA theory tests can usually be booked within 1–3 weeks. We recommend booking early and using our theory support materials to prepare thoroughly beforehand.",
  },
];

export default function TheoryHazardPerceptionPage() {
  return (
    <>
      <StructuredData data={buildFAQSchema(FAQS)} />
      <PageHero
        title="Theory & Hazard Perception"
        subtitle="LGV and PCV theory test preparation. Mock tests, question banks, hazard perception practice and fast-track support for all HGV licence categories."
        tag="Theory Tests"
        breadcrumbs={[{ label: "Transport Training", href: "/driver-cpc" }, { label: "Theory & Hazard Perception" }]}
        cta={{ label: "Book Theory Support", href: "/booking?course=theory-support" }}
      />

      {/* Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection direction="left">
            <span className="tag bg-blue-50 text-blue-brand mb-4">LGV & PCV Theory Preparation</span>
            <h2 className="section-heading mb-4">Pass Your Theory Test First Time</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The LGV theory test is a significant hurdle for many candidates, particularly the specialist drivers&apos; hours, tachograph and vehicle safety sections that differ greatly from Category B tests.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Our theory support packages give you access to over 1,000 practice questions, hazard perception clips and guided study materials to help you pass confidently first time.
            </p>
            <Link href="/booking?course=theory-support" className="btn-primary">
              Access Theory Support: £95
            </Link>
          </AnimatedSection>

          <AnimatedSection direction="right">
            <div className="bg-gray-light rounded-2xl p-6">
              <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                <BookOpen size={18} className="text-orange-brand" />
                Theory Test Topics Covered
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {THEORY_TOPICS.map((topic) => (
                  <div key={topic} className="flex items-start gap-1.5 text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-brand flex-shrink-0 mt-1.5" />
                    {topic}
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Packages */}
      <section className="py-20 bg-gray-light">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="section-heading">Theory Support Packages</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <PriceCard
              title="Self-Study Package"
              price={45}
              priceNote="excl. VAT"
              features={["Online question bank access", "1,000+ practice questions", "Hazard perception clips", "Progress tracking", "Category-specific content"]}
              cta={{ label: "Get Access", href: "/booking?course=theory-self-study" }}
            />
            <PriceCard
              title="Fast-Track Support"
              price={95}
              priceNote="excl. VAT"
              highlighted
              features={["Guided study plan", "Mock test sessions", "Hazard perception coaching", "Weak area identification", "Tutor support available", "Unlimited practice access"]}
              cta={{ label: "Book Now", href: "/booking?course=theory-support" }}
            />
            <PriceCard
              title="Theory Test Day"
              price={0}
              priceNote="DVSA fee applies"
              features={["DVSA test booking guidance", "Test centre location support", "Last-minute revision tips", "Post-test debrief if needed", "Retest support"]}
              cta={{ label: "Contact Us", href: "/contact" }}
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="section-heading">Theory Test Process</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", icon: BookOpen, title: "Study Materials", desc: "Access our online question bank and category-specific study resources." },
              { step: "02", icon: Monitor, title: "Mock Tests", desc: "Take timed mock tests under exam conditions to identify areas for improvement." },
              { step: "03", icon: Target, title: "Hazard Perception", desc: "Practice with real video clips to develop your hazard identification skills." },
              { step: "04", icon: CheckCircle2, title: "Book & Pass", desc: "Book your DVSA theory test with confidence and achieve a first-time pass." },
            ].map(({ step, title, desc, icon: Icon }) => (
              <AnimatedSection key={step}>
                <div className="text-center p-4">
                  <div className="relative inline-flex mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-navy flex items-center justify-center">
                      <Icon size={22} className="text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-orange-brand flex items-center justify-center text-white text-xs font-bold">
                      {step}
                    </div>
                  </div>
                  <h3 className="font-bold text-navy mb-2 text-sm">{title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-gray-light">
        <div className="max-w-3xl mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="section-heading">Frequently Asked Questions</h2>
          </AnimatedSection>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <AnimatedSection key={faq.q} delay={i * 0.05}>
                <details className="group bg-white rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-navy hover:bg-gray-light transition-colors">
                    {faq.q}
                    <span className="text-xl text-orange-brand group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed">{faq.a}</div>
                </details>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}

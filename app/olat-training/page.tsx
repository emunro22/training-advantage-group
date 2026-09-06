import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";
import CourseProductTable from "@/components/ui/CourseProductTable";
import StructuredData from "@/components/seo/StructuredData";
import CTASection from "@/components/home/CTASection";
import { CheckCircle2, GraduationCap, Users, Monitor, ClipboardCheck } from "lucide-react";
import Link from "next/link";
import { getPublishedProductsByCategory } from "@/lib/products-public";
import { buildFAQSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/olat-training" },
  title: "Operator Licence Awareness Training (OLAT) | TAG",
  description:
    "One-day Operator Licence Awareness Training (OLAT) for operators, directors and nominated Transport Managers. Classroom or remote delivery, from £495. Scotland.",
};

const WHO_FOR = [
  "Directors and business owners who hold, or are named on, an operator licence",
  "Nominated Transport Managers who need a practical grounding in their legal duties",
  "New operators applying for a Standard National or International licence",
  "Anyone required by DVSA, a Traffic Commissioner or an undertaking to complete awareness training",
];

const TOPICS = [
  "Operator licence conditions and undertakings",
  "The role and legal duties of a Transport Manager",
  "Drivers' hours and tachograph rules",
  "Vehicle maintenance and roadworthiness standards",
  "Driver licensing and eligibility checks",
  "Working Time Regulations for transport",
  "DVSA enforcement, OCRS and Traffic Commissioner powers",
  "Record keeping and evidencing compliance",
];

const FAQS = [
  {
    q: "Who needs Operator Licence Awareness Training?",
    a: "OLAT is aimed at operators, company directors and nominated Transport Managers who need a practical understanding of their obligations under a Standard National or International Operator Licence — including anyone directed to complete it following a Traffic Commissioner hearing or DVSA intervention.",
  },
  {
    q: "How long is the course and how is it delivered?",
    a: "OLAT is a one-day course, delivered either in the classroom at one of our training centres or remotely — whichever suits your business best.",
  },
  {
    q: "Is OLAT the same as the Transport Manager CPC?",
    a: "No. OLAT is an awareness course covering the practical duties of holding an operator licence, while the Transport Manager CPC is the full mandatory qualification required to act as a professional Transport Manager. See our Transport Manager CPC page for the full qualification.",
  },
  {
    q: "How much does OLAT cost?",
    a: "OLAT starts from £495 per candidate. Contact us for group booking rates.",
  },
];

export default async function OLATPage() {
  const approvedProducts = await getPublishedProductsByCategory("OLAT & Compliance");
  return (
    <>
      <StructuredData data={buildFAQSchema(FAQS)} />
      <PageHero
        title="Operator Licence Awareness Training (OLAT)"
        subtitle="A practical one-day course for operators, directors and nominated Transport Managers who need a clear grounding in operator licence obligations."
        tag="OLAT"
        breadcrumbs={[{ label: "Consultancy & Compliance", href: "/consultancy" }, { label: "OLAT" }]}
        cta={{ label: "Book OLAT Training", href: "/booking?course=olat" }}
      />

      {/* Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-start">
          <AnimatedSection direction="left">
            <span className="tag bg-navy/10 text-navy mb-4">About OLAT</span>
            <h2 className="section-heading mb-4">Understand Your Operator Licence Obligations</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Operator Licence Awareness Training gives directors, operators and nominated Transport Managers a
              practical, plain-English grounding in what holding a Standard National or International Operator
              Licence actually requires day to day.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              It&apos;s often required following a Traffic Commissioner hearing or DVSA intervention, but is
              equally valuable for any business that wants to strengthen its compliance culture before problems
              arise.
            </p>
            <ul className="space-y-2 mb-8">
              {[
                "One-day course",
                "Classroom or remote delivery",
                "Booked per candidate",
                "Delivered by experienced transport compliance tutors",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 size={16} className="text-blue-brand flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </AnimatedSection>

          <AnimatedSection direction="right">
            <div className="bg-gray-light rounded-2xl p-6 mb-6">
              <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                <GraduationCap size={18} className="text-orange-brand" />
                Who Should Attend
              </h3>
              <ul className="space-y-2.5">
                {WHO_FOR.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                    <Users size={14} className="text-blue-brand flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-navy rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Monitor size={18} className="text-orange-brand" />
                <span className="font-bold">Classroom or Remote</span>
              </div>
              <p className="text-sm text-blue-light/80 mb-4">From £495 per candidate</p>
              <Link href="/booking?course=olat" className="btn-primary w-full justify-center text-sm">
                Book OLAT Training
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Topics covered */}
      <section className="py-16 bg-gray-light">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-10">
            <h2 className="section-heading flex items-center justify-center gap-2">
              <ClipboardCheck size={26} className="text-orange-brand" />
              What the Course Covers
            </h2>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TOPICS.map((topic) => (
              <AnimatedSection key={topic}>
                <div className="bg-white rounded-xl p-5 shadow-sm h-full flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-brand flex-shrink-0 mt-2" />
                  <span className="text-sm text-gray-700">{topic}</span>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Related compliance support */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="section-heading mb-3">Need Ongoing Compliance Support Too?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              OLAT gives you the grounding — our Consultancy & Compliance team can also act as your External
              Transport Manager, run a fleet compliance audit, or support an operator licence application or
              renewal.
            </p>
            <Link href="/consultancy" className="btn-outline">
              View Compliance Services
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-gray-light">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="section-heading">Frequently Asked Questions</h2>
          </div>
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

      {approvedProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <AnimatedSection className="text-center mb-8">
              <h2 className="section-heading">TAG-Approved Website Pricing</h2>
              <p className="section-subheading mx-auto text-center mt-3">
                Director-approved products from the current TAG Master Pricing catalogue.
              </p>
            </AnimatedSection>
            <CourseProductTable products={approvedProducts} />
          </div>
        </section>
      )}

      <CTASection />
    </>
  );
}

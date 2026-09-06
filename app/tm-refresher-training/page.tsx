import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";
import CourseProductTable from "@/components/ui/CourseProductTable";
import StructuredData from "@/components/seo/StructuredData";
import CTASection from "@/components/home/CTASection";
import { CheckCircle2, RefreshCw, Users, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { getPublishedProductsByCategory } from "@/lib/products-public";
import { buildFAQSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/tm-refresher-training" },
  title: "Transport Manager CPC Refresher Training | TAG",
  description:
    "Transport Manager CPC Refresher Training for working TMs — stay current on operator licensing, drivers' hours, vehicle maintenance and fleet compliance. Scotland.",
};

const TOPICS = [
  "Operator licensing & compliance updates",
  "Drivers' hours & tachograph rule changes",
  "Vehicle maintenance & roadworthiness standards",
  "Fleet compliance & OCRS best practice",
  "Recent DVSA enforcement trends",
  "Continuous Professional Development evidence",
];

const WHO_FOR = [
  "Working Transport Managers who already hold their CPC",
  "TMs preparing for a DVSA audit or Traffic Commissioner review",
  "Anyone renewing their Continuous Professional Development record",
];

const FAQS = [
  {
    q: "Who is Transport Manager CPC Refresher Training for?",
    a: "It's for working Transport Managers who already hold their Certificate of Professional Competence and want to stay current on operator licensing, drivers' hours, vehicle maintenance and fleet compliance — or evidence Continuous Professional Development ahead of a DVSA audit.",
  },
  {
    q: "Is this the same as the full Transport Manager CPC qualification?",
    a: "No. This refresher is for TMs who already hold their CPC. If you don't yet hold the qualification, see our full Transport Manager CPC course covering Road Haulage and PSV.",
  },
  {
    q: "Who delivers the refresher training?",
    a: "The same experienced TM tutors who deliver our full CPC course, with the same small class sizes and practical, real-world focus.",
  },
];

export default async function TMRefresherPage() {
  const approvedProducts = await getPublishedProductsByCategory("Transport Management");
  return (
    <>
      <StructuredData data={buildFAQSchema(FAQS)} />
      <PageHero
        title="Transport Manager CPC Refresher Training"
        subtitle="Stay current on operator licensing, drivers' hours, vehicle maintenance and fleet compliance — ideal for CPD renewal or ahead of a DVSA audit."
        tag="CPD Renewal"
        breadcrumbs={[{ label: "TM CPC", href: "/tm-cpc" }, { label: "Refresher Training" }]}
        cta={{ label: "Enquire About Refresher Training", href: "/contact?subject=tm-refresher" }}
      />

      {/* Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-start">
          <AnimatedSection direction="left">
            <span className="tag bg-orange-brand/10 text-orange-brand mb-4">CMP Renewal</span>
            <h2 className="section-heading mb-4">Keep Your TM Knowledge Current</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Already hold your Certificate of Professional Competence? Our TM CPC Refresher Training keeps
              working Transport Managers current on operator licensing, drivers&apos; hours, vehicle maintenance
              and fleet compliance — ideal for renewing your Continuous Professional Development or refreshing
              your knowledge ahead of a DVSA audit.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Delivered by the same experienced TM tutors as our full CPC course, with the same small class
              sizes and practical, real-world focus.
            </p>
            <Link href="/contact?subject=tm-refresher" className="btn-primary">
              Enquire About Refresher Training
            </Link>
          </AnimatedSection>

          <AnimatedSection direction="right">
            <div className="bg-gray-light rounded-2xl p-6 mb-6">
              <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                <RefreshCw size={18} className="text-orange-brand" />
                What&apos;s Covered
              </h3>
              <ul className="space-y-2.5">
                {TOPICS.map((topic) => (
                  <li key={topic} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 size={16} className="text-blue-brand flex-shrink-0" />
                    {topic}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-navy rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck size={18} className="text-orange-brand" />
                <span className="font-bold">Who Should Attend</span>
              </div>
              <ul className="space-y-1.5 text-sm text-blue-light/90">
                {WHO_FOR.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Users size={13} className="text-orange-brand flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Not yet CPC qualified? */}
      <section className="py-16 bg-gray-light">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="section-heading mb-3">Don&apos;t Yet Hold Your TM CPC?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              This refresher is for TMs who already hold their qualification. If you&apos;re working towards it,
              see our full Road Haulage and PSV Transport Manager CPC course, NLTC exam fees included.
            </p>
            <Link href="/tm-cpc" className="btn-outline">
              View Full TM CPC Course
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="section-heading">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <AnimatedSection key={faq.q} delay={i * 0.05}>
                <details className="group bg-gray-light rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-navy hover:bg-white transition-colors">
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
        <section className="py-16 bg-gray-light">
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

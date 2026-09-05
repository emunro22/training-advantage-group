import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";
import PriceCard from "@/components/ui/PriceCard";
import CTASection from "@/components/home/CTASection";
import { CheckCircle2, ClipboardList, MapPin } from "lucide-react";
import Link from "next/link";
import StructuredData from "@/components/seo/StructuredData";
import { buildFAQSchema } from "@/lib/schema";

export const metadata: Metadata = {
  alternates: { canonical: "/module-4-cpc" },
  title: "Module 4 CPC Practical Test Scotland | Case Study Preparation",
  description:
    "Module 4 CPC practical test preparation and examination at TAG's approved centres. Thorough preparation, DVSA approved. £295 excl. VAT.",
};

const WHAT_COVERED = [
  "Vehicle safety checks (walkaround)",
  "Load security assessment",
  "Documentation review",
  "Tachograph and drivers' hours questions",
  "Emergency procedures",
  "Mechanical component identification",
  "Coupling and uncoupling (where applicable)",
  "Safety equipment and PPE",
];

const FAQS = [
  {
    q: "What is the Module 4 CPC test?",
    a: "Module 4 is the practical demonstration test element of the Driver CPC Initial qualification. It involves demonstrating your ability to carry out a vehicle safety check, answer safety questions and demonstrate knowledge of relevant topics.",
  },
  {
    q: "Do I need Module 4 to get my HGV licence?",
    a: "Yes. Module 4 is a mandatory requirement for the full Driver CPC Initial qualification, which is needed alongside your licence to drive professionally. Without it you cannot complete your initial CPC.",
  },
  {
    q: "How long does the Module 4 test take?",
    a: "The Module 4 test takes approximately 30 minutes. It is conducted at a DVSA approved test centre by a qualified examiner.",
  },
  {
    q: "What happens if I fail Module 4?",
    a: "If you do not pass Module 4, you can rebook the test. We offer retest preparation to help you identify exactly what went wrong and ensure a successful outcome on your next attempt.",
  },
];

export default function Module4CPCPage() {
  return (
    <>
      <StructuredData data={buildFAQSchema(FAQS)} />
      <PageHero
        title="Module 4 CPC Practical Test"
        subtitle="DVSA approved Module 4 CPC practical test preparation and examination. Part of the Driver CPC Initial qualification for all new licence holders."
        tag="Module 4 CPC"
        breadcrumbs={[{ label: "Transport Training", href: "/driver-cpc" }, { label: "Module 4 CPC" }]}
        cta={{ label: "Book Module 4", href: "/booking?course=module4" }}
      />

      {/* Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection direction="left">
            <span className="tag bg-blue-50 text-blue-brand mb-4">Driver CPC Initial: Practical Test</span>
            <h2 className="section-heading mb-4">Complete Your CPC Initial Qualification</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Module 4 is the final step in the Driver CPC Initial qualification process. It is a practical demonstration test that assesses your ability to carry out safety checks and demonstrate knowledge of key professional driver responsibilities.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Our preparation programme ensures you arrive at your Module 4 test fully confident and ready to pass first time.
            </p>
            <Link href="/booking?course=module4" className="btn-primary">
              Book Module 4: £295
            </Link>
          </AnimatedSection>

          <AnimatedSection direction="right">
            <div className="bg-gray-light rounded-2xl p-6">
              <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                <ClipboardList size={18} className="text-orange-brand" />
                What&apos;s Covered in Module 4
              </h3>
              <div className="space-y-2">
                {WHAT_COVERED.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 size={14} className="text-blue-brand flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-light">
        <div className="max-w-3xl mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="section-heading">Module 4 Pricing</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-6">
            <PriceCard
              title="Module 4 Test Package"
              price={295}
              priceNote="excl. VAT"
              highlighted
              features={["Thorough test preparation", "Walkaround check training", "Mock examination", "DVSA test booking guidance", "Examiner feedback debrief"]}
              cta={{ label: "Book Now", href: "/booking?course=module4" }}
            />
            <div className="bg-white rounded-2xl p-6 shadow-card flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-navy text-lg mb-2">Module 4 as Part of a Package</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Module 4 is included in all our full HGV and PCV training packages. If you are completing a full licence programme with TAG, your Module 4 is already covered.
                </p>
                <ul className="space-y-2">
                  {["Included in Cat C Full Package", "Included in Cat C+E Package", "Included in Cat D Package", "Can be booked standalone"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 size={13} className="text-orange-brand flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/hgv-training" className="btn-outline mt-6 text-center">
                View Full Packages
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-8">
            <h2 className="text-2xl font-bold text-navy">Test Locations</h2>
          </AnimatedSection>
          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { name: "Bothwell HQ", detail: "APC Depot, Coalburn Road, G71 8DA" },
              { name: "Motherwell", detail: "28 Hope Street, ML1 1TA" },
              { name: "Glasgow", detail: "South Street, G14 0BX" },
            ].map((loc) => (
              <div key={loc.name} className="bg-gray-light rounded-xl p-4 flex items-start gap-3">
                <MapPin size={16} className="text-orange-brand flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-navy text-sm">{loc.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{loc.detail}</div>
                </div>
              </div>
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

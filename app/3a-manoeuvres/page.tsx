import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";
import PriceCard from "@/components/ui/PriceCard";
import CTASection from "@/components/home/CTASection";
import { CheckCircle2, MapPin } from "lucide-react";
import Link from "next/link";
import StructuredData from "@/components/seo/StructuredData";
import { buildFAQSchema } from "@/lib/schema";

export const metadata: Metadata = {
  alternates: { canonical: "/3a-manoeuvres" },
  title: "3a Off-Road Manoeuvres Scotland | HGV Reversing & Manoeuvre Training",
  description:
    "3a off-road manoeuvre training for HGV licence candidates across Scotland. Reversing, coupling/uncoupling and vehicle control. £250 excl. VAT.",
};

const MANOEUVRES = [
  "Reversing in a straight line",
  "Reversing to a bay",
  "Reversing around a corner",
  "Uncoupling and re-coupling (articulated)",
  "Turning in the road",
  "Precise vehicle placement",
  "Vehicle observation techniques",
  "Mirrors and camera use",
];

const FAQS = [
  {
    q: "What are 3a manoeuvres?",
    a: "The 3a off-road test element assesses your ability to carry out a series of manoeuvres in a controlled off-road environment. It forms part of the Category C or C+E practical driving test.",
  },
  {
    q: "Is the 3a test separate from the main driving test?",
    a: "Yes — the off-road 3a element is conducted separately from the on-road driving test (3b). Both must be passed to gain your licence category.",
  },
  {
    q: "How long does 3a training take?",
    a: "Most candidates require between half a day and a full day of 3a manoeuvre practice before the test, depending on their prior experience and vehicle familiarity.",
  },
  {
    q: "Is coupling included in 3a for articulated vehicles?",
    a: "Yes. For Category C+E (articulated) candidates, uncoupling and re-coupling the trailer is included as part of the 3a off-road assessment.",
  },
];

export default function ManoeuvresPage() {
  return (
    <>
      <StructuredData data={buildFAQSchema(FAQS)} />
      <PageHero
        title="3a Off-Road Manoeuvres"
        subtitle="Comprehensive off-road manoeuvre training for HGV licence candidates. Reversing, coupling and precise vehicle control in a safe, controlled environment."
        tag="3a Manoeuvres"
        breadcrumbs={[{ label: "Transport Training", href: "/driver-cpc" }, { label: "3a Manoeuvres" }]}
        cta={{ label: "Book Manoeuvre Training", href: "/booking?course=manoeuvres" }}
      />

      {/* Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection direction="left">
            <span className="tag bg-orange-50 text-orange-brand mb-4">Off-Road Test Element</span>
            <h2 className="section-heading mb-4">Master Your Vehicle Before the Test</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The 3a off-road manoeuvre section catches many candidates by surprise. Precise reversing, tight vehicle placement and correct coupling procedures all need to be performed accurately under test conditions.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Our manoeuvre training sessions take place in our dedicated off-road areas, giving you the time and repetition needed to build genuine confidence before your official test.
            </p>
            <Link href="/booking?course=manoeuvres" className="btn-primary">
              Book Manoeuvre Training — £250
            </Link>
          </AnimatedSection>

          <AnimatedSection direction="right">
            <div className="bg-gray-light rounded-2xl p-6">
              <h3 className="font-bold text-navy mb-4">Manoeuvres Covered</h3>
              <div className="space-y-2">
                {MANOEUVRES.map((item) => (
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
            <h2 className="section-heading">Manoeuvre Training Pricing</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-6">
            <PriceCard
              title="3a Manoeuvre Session"
              price={250}
              priceNote="excl. VAT"
              highlighted
              features={["Half or full day session", "Off-road training area", "All manoeuvres covered", "Instructor guidance throughout", "Mock test included"]}
              cta={{ label: "Book Now", href: "/booking?course=manoeuvres" }}
            />
            <div className="bg-white rounded-2xl p-6 shadow-card flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-navy text-lg mb-2">Included in Full Packages</h3>
                <p className="text-sm text-gray-600 mb-4">
                  3a manoeuvre training is included as standard in all our full HGV training packages. Book standalone if you just need the manoeuvre element.
                </p>
                <ul className="space-y-2">
                  {["Included in Cat C Full Package", "Included in Cat C+E Package", "Available as standalone session", "Retest preparation available (£85)"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 size={13} className="text-orange-brand flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/hgv-training" className="btn-outline mt-6 text-center">
                View Full HGV Packages
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-8">
            <h2 className="text-2xl font-bold text-navy">Training Locations</h2>
          </AnimatedSection>
          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { name: "Bothwell HQ", detail: "APC Depot — dedicated manoeuvre area" },
              { name: "Motherwell", detail: "ML1 1TA Training Centre" },
              { name: "Glasgow", detail: "G14 0BX Training Centre" },
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

import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";
import PriceCard from "@/components/ui/PriceCard";
import CTASection from "@/components/home/CTASection";
import { CheckCircle2, Clock, MapPin, AlertCircle } from "lucide-react";
import Link from "next/link";
import { getPricingData } from "@/lib/storage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "DVLA Group 2 Medical Assessment Scotland | HGV & PCV Medicals",
  description:
    "DVLA Group 2 medical assessments for HGV, PCV and LGV licence applicants across Scotland. In-house at our training centres. £80 per assessment.",
};

const WHAT_INVOLVED = [
  "Visual acuity (eyesight) test",
  "Blood pressure measurement",
  "Urine test",
  "Height and weight recording",
  "Medical history review",
  "Cardiovascular assessment",
  "D4 medical form completion",
  "DVLA declaration signing",
];

const FAQS = [
  {
    q: "Do I need a Group 2 medical?",
    a: "Yes. All applicants for a Category C, C+E, D or D+E licence must hold a valid DVLA Group 2 medical (D4 form). This is also required for licence renewals at age 45 and every 5 years thereafter.",
  },
  {
    q: "What do I need to bring to my medical?",
    a: "Bring a completed D4 form (we can supply one), your driving licence, any prescription glasses or contact lenses you normally wear, and a list of any current medications.",
  },
  {
    q: "How long does the medical take?",
    a: "Most Group 2 medicals take approximately 30–45 minutes at our centres.",
  },
  {
    q: "What happens if I fail my medical?",
    a: "If you do not pass, we will advise you on the reasons and whether there are any steps you can take. In some cases, DVLA may require additional specialist reports before a licence can be issued.",
  },
  {
    q: "Can you send the completed D4 form to DVLA directly?",
    a: "The completed D4 form must be submitted by you to DVLA with your licence application. We will provide the completed and signed form after your assessment.",
  },
];

export default async function MedicalsPage() {
  const pricingData = await getPricingData();
  const medicalOverride = pricingData.priceOverrides.find(
    (o) => o.active && (o.courseId === "medical" || o.courseName.toLowerCase().includes("medical"))
  );
  const DEFAULT_PRICE = 80;
  const price = medicalOverride
    ? parseInt(medicalOverride.overridePrice.replace(/[^0-9]/g, ""), 10) || DEFAULT_PRICE
    : DEFAULT_PRICE;

  return (
    <>
      <PageHero
        title="DVLA Group 2 Medical Assessments"
        subtitle="In-house DVLA Group 2 medicals for HGV and PCV licence applicants and renewals. Quick appointments, professional service, D4 forms completed same day."
        tag="Medicals"
        breadcrumbs={[{ label: "Transport Training", href: "/driver-cpc" }, { label: "Medicals" }]}
        cta={{ label: "Book Your Medical", href: "/booking?course=medical" }}
      />

      {/* Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection direction="left">
            <span className="tag bg-orange-50 text-orange-brand mb-4">DVLA Group 2 Medical</span>
            <h2 className="section-heading mb-4">Fast, Professional Medical Assessments</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              A DVLA Group 2 medical (D4 form) is a mandatory requirement for all HGV and PCV licence applications and renewals. Our in-house medical assessments are conducted at our training centres for your convenience.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              We offer quick appointment turnaround times to ensure your licence application or training programme is not delayed. The completed D4 form is provided to you the same day.
            </p>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex items-start gap-3">
              <AlertCircle size={18} className="text-orange-brand flex-shrink-0 mt-0.5" />
              <p className="text-sm text-orange-900">
                A Group 2 medical is required before you can apply for a provisional HGV or PCV licence. Book your medical early to avoid delaying your training.
              </p>
            </div>
            <Link href="/booking?course=medical" className="btn-primary">
              Book Your Medical — £{price}
            </Link>
          </AnimatedSection>

          <AnimatedSection direction="right">
            <div className="bg-gray-light rounded-2xl p-6">
              <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-orange-brand" />
                What&apos;s Involved
              </h3>
              <div className="space-y-2">
                {WHAT_INVOLVED.map((item, i) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="w-6 h-6 rounded-full bg-navy/10 flex items-center justify-center text-navy text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-2 text-sm text-gray-600">
                <Clock size={14} className="text-orange-brand" />
                Approx. 30–45 minutes per assessment
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-light">
        <div className="max-w-4xl mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="section-heading">Medical Assessment Pricing</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-6">
            <PriceCard
              title="Group 2 Medical Assessment"
              price={price}
              priceNote="per candidate, excl. VAT"
              highlighted
              features={[
                "Full DVLA Group 2 medical",
                "D4 form completion",
                "In-house at our centres",
                "Same-day form provided",
                "Experienced medical practitioners",
              ]}
              cta={{ label: "Book Now", href: "/booking?course=medical" }}
            />
            <div className="bg-white rounded-2xl p-6 shadow-card flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-navy text-lg mb-3">When Do I Need a Medical?</h3>
                <ul className="space-y-2">
                  {[
                    "First HGV/PCV licence application",
                    "Licence renewal at age 45",
                    "Licence renewal at age 65",
                    "Every 5 years after age 65",
                    "Following a medical condition notification",
                    "Return after long absence from driving",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 size={13} className="text-orange-brand flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/contact" className="btn-outline mt-6 text-center">
                Ask a Question
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-8">
            <h2 className="text-2xl font-bold text-navy">Medical Assessment Locations</h2>
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

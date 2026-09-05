import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";
import PriceCard from "@/components/ui/PriceCard";
import CTASection from "@/components/home/CTASection";
import { CheckCircle2, MapPin, Users, FileText, Star } from "lucide-react";
import Link from "next/link";
import StructuredData from "@/components/seo/StructuredData";
import { buildFAQSchema } from "@/lib/schema";

export const metadata: Metadata = {
  alternates: { canonical: "/pcv-training" },
  title: "PCV / Bus Driver Training Scotland | Category D Licence",
  description:
    "Professional PCV and bus driver training in Scotland. Category D licence packages including DVLA medicals, theory, practical training and Module 4 CPC. From £1,795.",
};

const INCLUDES = [
  "DVLA Group 2 Medical Assessment",
  "Theory & Hazard Perception Test Preparation",
  "Category D Practical Training",
  "Module 4 CPC Practical Test",
  "DVSA Driving Test",
  "Provisional Licence Application Guidance",
];

const FAQS = [
  {
    q: "What is a Category D licence?",
    a: "A Category D licence allows you to drive buses and coaches with more than 8 passenger seats. It is required by all professional PSV (Passenger Service Vehicle) drivers.",
  },
  {
    q: "Do I need a DVLA medical for my PCV licence?",
    a: "Yes. All applicants for a Group 2 (PCV/LGV) licence must pass a DVLA Group 2 medical examination. We offer in-house medical assessments at our centres.",
  },
  {
    q: "How long does PCV training take?",
    a: "Duration depends on your experience and the training package selected. Most candidates complete their training within 4–8 weeks from initial enrolment.",
  },
  {
    q: "Is Module 4 included in the package price?",
    a: "Yes, all our full Category D packages include the Module 4 CPC practical test as standard.",
  },
];

export default function PCVTrainingPage() {
  return (
    <>
      <StructuredData data={buildFAQSchema(FAQS)} />
      <PageHero
        title="PCV / Bus Driver Training"
        subtitle="Professional Category D passenger vehicle training packages. From DVLA medicals to your driving test, we handle everything."
        tag="PCV Training"
        breadcrumbs={[{ label: "PCV / Bus Training" }]}
        cta={{ label: "Book PCV Training", href: "/booking?course=pcv-catd" }}
      />

      {/* Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection direction="left">
            <span className="tag bg-blue-50 text-blue-brand mb-4">Category D: PSV Licence</span>
            <h2 className="section-heading mb-4">Professional Bus & Coach Driver Training</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our Category D PCV training packages are designed for candidates looking to enter the passenger transport industry as a professional bus or coach driver. We deliver full end-to-end training from initial medical to final driving test.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              All training is delivered by experienced PSV instructors with real industry backgrounds, giving you practical skills alongside the knowledge needed to pass your tests first time.
            </p>
            <ul className="space-y-2 mb-8">
              {INCLUDES.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 size={16} className="text-blue-brand flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/booking?course=pcv-catd" className="btn-primary">
              Book PCV Training
            </Link>
          </AnimatedSection>

          <AnimatedSection direction="right">
            <div className="space-y-4">
              {[
                { icon: "🚌", title: "Category D (Bus/Coach)", desc: "Full PSV licence for buses and coaches with more than 8 passenger seats.", price: "From £1,795" },
                { icon: "🚐", title: "Category D1 (Minibus)", desc: "Minibus licence for vehicles with 9–16 passenger seats.", price: "POA" },
                { icon: "⬆️", title: "Category D Upgrade", desc: "Already hold a Group 2 licence? Upgrade to Category D more efficiently.", price: "POA" },
              ].map((pkg) => (
                <div key={pkg.title} className="bg-gray-light rounded-2xl p-5 flex gap-4 items-start">
                  <div className="text-3xl">{pkg.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-navy">{pkg.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{pkg.desc}</p>
                    <div className="text-orange-brand font-bold text-sm mt-2">{pkg.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-light">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="section-heading">PCV Training Pricing</h2>
            <p className="section-subheading mx-auto text-center mt-3">All prices exclude VAT. Contact us for group and operator pricing.</p>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <PriceCard
              title="Category D Full Package"
              price={1795}
              priceNote="from, excl. VAT"
              features={["DVLA Group 2 Medical", "Theory & Hazard Perception", "Practical Training", "DVSA Driving Test", "Module 4 CPC Included"]}
              cta={{ label: "Enquire Now", href: "/contact" }}
            />
            <PriceCard
              title="Medical Assessment"
              price={65}
              priceNote="excl. VAT"
              highlighted
              features={["DVLA Group 2 Medical", "In-house at our centres", "D4 Medical Form Completion", "Fast Turnaround", "Experienced Medical Practitioners"]}
              cta={{ label: "Book Medical", href: "/booking?course=medical" }}
            />
            <PriceCard
              title="Module 4 CPC Test"
              price={295}
              priceNote="excl. VAT"
              features={["Practical Demonstration Test", "DVSA Approved", "Thorough Preparation", "Covers all required elements", "Certificate Issued"]}
              cta={{ label: "Book Module 4", href: "/booking?course=module4" }}
            />
          </div>
        </div>
      </section>

      {/* Why choose */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="section-heading">Why Train With TAG?</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Star, title: "Experienced PSV Instructors", desc: "All our PCV instructors hold real industry experience in passenger transport operations." },
              { icon: Users, title: "Small Class Sizes", desc: "Focused individual attention means better pass rates and faster progression through training." },
              { icon: FileText, title: "Full Admin Support", desc: "We handle all the paperwork: DVSA applications, medical forms and test bookings." },
            ].map(({ icon: Icon, title, desc }) => (
              <AnimatedSection key={title}>
                <div className="bg-gray-light rounded-2xl p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-blue-brand/10 flex items-center justify-center mx-auto mb-4">
                    <Icon size={24} className="text-blue-brand" />
                  </div>
                  <h3 className="font-bold text-navy mb-2">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-12 bg-gray-light">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-8">
            <h2 className="text-2xl font-bold text-navy">Training Locations</h2>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Bothwell HQ", detail: "G71 8DA – Exam Suite" },
              { name: "Motherwell", detail: "ML1 1TA – Training Centre" },
              { name: "Glasgow", detail: "G14 0BX – Training Centre" },
              { name: "On-Site Delivery", detail: "We come to your depot" },
            ].map((loc) => (
              <div key={loc.name} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
                <MapPin size={16} className="text-orange-brand flex-shrink-0" />
                <div>
                  <div className="font-semibold text-navy text-sm">{loc.name}</div>
                  <div className="text-xs text-gray-500">{loc.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="section-heading">Frequently Asked Questions</h2>
          </AnimatedSection>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <AnimatedSection key={faq.q} delay={i * 0.05}>
                <details className="group bg-gray-light rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-navy hover:bg-gray-200/50 transition-colors">
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

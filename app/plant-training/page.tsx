export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";
import CourseProductTable from "@/components/ui/CourseProductTable";
import CTASection from "@/components/home/CTASection";
import { CheckCircle2 } from "lucide-react";
import { getPageContent } from "@/lib/storage";
import { getPublishedProductsByCategories } from "@/lib/products-public";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getPageContent("plant-training");
  return {
    alternates: { canonical: "/plant-training" },
    title: c.metaTitle || "Plant & MHE Training Scotland | Forklift, NPORS, Telehandler",
    description: c.metaDescription || "NPORS accredited forklift, telehandler, reach truck and MEWP training. On-site or at our centres. From £295. Glasgow, Motherwell & Bothwell.",
  };
}

const SAFETY_COURSES = [
  { name: "Emergency First Aid at Work", price: "POA", desc: "1-day HSE approved first aid course." },
  { name: "Fire Safety Awareness", price: "POA", desc: "Workplace fire safety and evacuation." },
  { name: "Manual Handling", price: "POA", desc: "Safe manual handling techniques." },
  { name: "Health & Safety Awareness", price: "POA", desc: "Workplace health & safety fundamentals." },
];

export default async function PlantTrainingPage() {
  const c = await getPageContent("plant-training");
  const approvedProducts = await getPublishedProductsByCategories(["Forklift & MHE", "Plant & MHE"]);
  const COURSES = [
    { name: "Counterbalance Forklift – Refresher", price: c.counterbalanceRefresherPrice || "From £295", desc: "For operators with prior experience requiring renewal.", id: "counterbalance-refresher" },
    { name: "Counterbalance Forklift – Novice", price: c.counterbalanceNovicePrice || "From £595", desc: "Full novice course for new operators.", id: "counterbalance-novice" },
    { name: "Reach Truck Training", price: c.reachTruckPrice || "From £595", desc: "Narrow aisle reach truck operation and safety.", id: "reach-truck" },
    { name: "Telehandler Training", price: c.telehandlerPrice || "From £695", desc: "All-terrain telescopic handler operation.", id: "telehandler" },
    { name: "MEWP Training", price: c.mewpPrice || "From £495", desc: "Mobile elevated work platforms — all categories.", id: "mewp" },
    { name: "Excavator / Dumper", price: c.excavatorPrice || "From £695", desc: "Plant machinery including 360 excavator and dumper.", id: "excavator" },
  ];
  return (
    <>
      <PageHero
        title={c.heroTitle || "Plant & Industrial Training"}
        subtitle={c.heroSubtitle || "NPORS accredited forklift, plant machinery and workplace safety training delivered on-site or at our professional training centres."}
        tag="Plant & MHE Training"
        breadcrumbs={[{ label: "Plant & Industrial Training" }]}
        cta={{ label: "Book Plant Training", href: "/booking?course=counterbalance-novice" }}
      />

      {/* NPORS info */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection direction="left">
            <span className="tag bg-orange-50 text-orange-brand mb-4">NPORS Accredited</span>
            <h2 className="section-heading mb-4">Nationally Recognised Plant Training</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              All our plant and MHE training is delivered by NPORS accredited trainers and assessors. NPORS operator cards are recognised across the UK construction and industrial sectors.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Whether you need a single operator trained or an entire team refreshed, we offer flexible on-site and centre-based delivery to minimise operational disruption.
            </p>
            <ul className="space-y-2 mb-8">
              {["NPORS accredited training and assessment", "Operator cards issued upon completion", "On-site training at your premises", "Novice and refresher courses available", "Group booking discounts", "Industry-experienced instructors"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 size={16} className="text-orange-brand flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </AnimatedSection>

          <AnimatedSection direction="right">
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
              <h3 className="font-bold text-navy mb-4">About NPORS</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                NPORS (National Plant Operators Registration Scheme) is one of the UK&apos;s leading plant operator training and registration schemes. NPORS cards are widely recognised and accepted across the UK.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Registration Fee", value: `£${c.nporsRegFee ?? "50"}` },
                  { label: "Duplicate Card", value: `£${c.nporsDuplicateCard ?? "30"}` },
                  { label: "Additional Candidate", value: c.nporsAdditionalCandidate || "From £65" },
                  { label: "Retest/Reassessment", value: c.nporsRetestLabel || "From £85" },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white rounded-lg p-3 text-center">
                    <div className="text-lg font-black text-orange-brand">{value}</div>
                    <div className="text-xs text-gray-500">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* MHE Courses */}
      <section className="py-16 bg-gray-light">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="section-heading">Plant & MHE Courses</h2>
            <p className="section-subheading mx-auto text-center mt-3">
              From forklift novice to telehandler specialist — all NPORS accredited.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {COURSES.map(({ name, price, desc, id }, i) => (
              <AnimatedSection key={id} delay={i * 0.05}>
                <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-navy">{name}</h3>
                    <span className="text-orange-brand font-black text-sm whitespace-nowrap">{price}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{desc}</p>
                  <a href={`/booking?course=${id}`} className="text-sm font-semibold text-orange-brand hover:text-orange-dark transition-colors">
                    Book Course →
                  </a>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Safety courses */}
      <section id="firstaid" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-10">
            <h2 className="section-heading">Safety & Compliance Courses</h2>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SAFETY_COURSES.map(({ name, price, desc }) => (
              <AnimatedSection key={name}>
                <div className="bg-gray-light rounded-xl p-5 border border-gray-200">
                  <h3 className="font-bold text-navy text-sm mb-2">{name}</h3>
                  <p className="text-xs text-gray-600 mb-3">{desc}</p>
                  <div className="text-orange-brand font-bold text-sm">{price}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection className="mt-6 text-center">
            <p className="text-sm text-gray-500">Contact us for group pricing and on-site delivery quotes.</p>
          </AnimatedSection>
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

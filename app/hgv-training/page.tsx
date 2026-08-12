export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";
import CourseProductTable from "@/components/ui/CourseProductTable";
import CTASection from "@/components/home/CTASection";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { getPageContent } from "@/lib/storage";
import { getPublishedProductsByCategory } from "@/lib/products-public";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getPageContent("hgv-training");
  return {
    title: c.metaTitle || "HGV & PCV Driver Training Scotland | Class 1, 2 & Bus Licence",
    description: c.metaDescription || "Complete HGV and PCV driver training packages in Scotland. Cat C, Cat C+E and Category D. Includes medicals, theory, practical training and Module 4 CPC.",
  };
}

export default async function HGVTrainingPage() {
  const c = await getPageContent("hgv-training");
  const approvedProducts = await getPublishedProductsByCategory("HGV & PCV");
  return (
    <>
      <PageHero
        title={c.heroTitle || "HGV & PCV Driver Training"}
        subtitle={c.heroSubtitle || "Complete LGV and PCV training packages including DVLA medicals, theory tests, practical training, Module 4 CPC and fleet assessments."}
        tag="HGV & PCV Training"
        breadcrumbs={[{ label: "HGV & PCV Training" }]}
        cta={{ label: "Book Your Training", href: "/booking?course=hgv-class2" }}
      />

      {/* Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="section-heading">Training Categories</h2>
            <p className="section-subheading mx-auto text-center mt-3">
              Full training packages for every licence category. We handle everything from your medical to your practical test.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                category: "Category C (Class 2)",
                icon: "🚛",
                desc: "Rigid vehicle licence up to 32 tonnes. Perfect for local delivery and fleet operations.",
                includes: ["DVLA Group 2 Medical", "Theory & Hazard Perception", "Practical Training", "Driving Test", "Module 4 CPC"],
                price: c.catCPriceLabel || "From £1,495",
                courseId: "hgv-class2",
              },
              {
                category: "Category C+E (Class 1)",
                icon: "🚚",
                desc: "Articulated vehicle licence. The most in-demand heavy goods vehicle qualification.",
                includes: ["Medical (if required)", "Theory Support", "Practical Training", "Driving Test", "Module 4 CPC"],
                price: c.catCEPriceLabel || "From £2,695",
                courseId: "hgv-class1",
                highlighted: true,
              },
              {
                category: "Category D (Bus/Coach)",
                icon: "🚌",
                desc: "Professional passenger-carrying vehicle licence for bus and coach operators.",
                includes: ["DVLA Group 2 Medical", "Theory & Hazard Perception", "Practical Training", "Driving Test", "Module 4 CPC"],
                price: c.pcvPriceLabel || "From £1,795",
                courseId: "pcv-catd",
              },
            ].map(({ category, icon, desc, includes, price, courseId, highlighted }) => (
              <AnimatedSection key={category}>
                <div className={`rounded-2xl overflow-hidden shadow-card h-full flex flex-col ${highlighted ? "ring-2 ring-orange-brand" : ""}`}>
                  {highlighted && (
                    <div className="bg-orange-brand text-white text-center text-xs font-bold py-2 uppercase tracking-wider">
                      Most Popular
                    </div>
                  )}
                  <div className="bg-navy p-5 text-white">
                    <div className="text-3xl mb-2">{icon}</div>
                    <h3 className="font-black text-lg">{category}</h3>
                    <div className="text-orange-brand font-bold mt-1">{price}</div>
                  </div>
                  <div className="p-5 bg-white flex-1 flex flex-col">
                    <p className="text-sm text-gray-600 mb-4">{desc}</p>
                    <ul className="space-y-1.5 mb-6 flex-1">
                      {includes.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle2 size={14} className="text-blue-brand flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <a href={`/booking?course=${courseId}`} className={`text-center py-2.5 rounded-lg font-semibold text-sm transition-all ${highlighted ? "bg-orange-brand text-white hover:bg-orange-dark" : "bg-navy text-white hover:bg-navy-light"}`}>
                      Book This Package
                    </a>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Individual services */}
      <section id="module4" className="py-20 bg-gray-light">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="section-heading">Individual Services & Add-ons</h2>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: "Medical Assessment", price: `£${c.medicalPrice ?? "65"}`, desc: "DVLA Group 2 medical conducted by approved practitioners.", id: "medical" },
              { title: "Module 4 CPC Practical", price: `£${c.module4Price ?? "295"}`, desc: "Practical CPC test — demonstration of professional competence.", id: "module4" },
              { title: "3A Off-Road Manoeuvres", price: `£${c.manoeuvres3aPrice ?? "250"}`, desc: "Off-road manoeuvrability test at our dedicated test area.", id: "manoeuvres-3a" },
              { title: "3B Practical Driving Test", price: `£${c.practicalTestPrice ?? "450"}`, desc: "On-road practical test with experienced driving examiner.", id: "test-3b" },
              { title: "Fleet Driver Assessment", priceLabel: c.fleetAssessmentLabel || "From £95", desc: "Professional assessment of your drivers' on-road skills and compliance.", id: "fleet-assessment" },
              { title: "Additional Training Day", price: `£${c.additionalDayPrice ?? "350"}`, desc: "Extra training sessions if more practice is required before test.", id: "extra-day" },
            ].map(({ title, price, priceLabel, desc, id }) => (
              <AnimatedSection key={id}>
                <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-navy">{title}</h3>
                    <span className="text-blue-brand font-black text-sm whitespace-nowrap">{price || priceLabel}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{desc}</p>
                  <a href={`/booking?course=${id}`} className="text-sm font-semibold text-blue-brand hover:text-blue-dark transition-colors">
                    Book →
                  </a>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Medicals section */}
      <section id="medicals" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection direction="left">
            <span className="tag bg-blue-50 text-blue-brand mb-4">DVLA Medicals</span>
            <h2 className="section-heading mb-4">Group 2 Medical Assessments</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              A DVLA Group 2 medical is required for all Category C and D licence applications. Our approved medical practitioners conduct thorough assessments quickly and professionally.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              We can arrange your medical as part of your training package or as a standalone appointment. Results are typically provided on the same day.
            </p>
            <Link href="/booking?course=medical" className="btn-navy">Book a Medical – £{c.medicalPrice ?? "65"}</Link>
          </AnimatedSection>
          <AnimatedSection direction="right">
            <div className="bg-gray-light rounded-2xl p-6">
              <h3 className="font-bold text-navy mb-4">What the Medical Covers</h3>
              <ul className="space-y-2">
                {["Vision check", "Blood pressure", "Diabetes screening", "Cardiovascular assessment", "General health review", "DVLA D4 form completion"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 size={14} className="text-blue-brand" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
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

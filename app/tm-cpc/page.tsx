export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";
import PriceCard from "@/components/ui/PriceCard";
import CourseProductTable from "@/components/ui/CourseProductTable";
import CTASection from "@/components/home/CTASection";
import { CheckCircle2, BookOpen, Award, Calendar } from "lucide-react";
import Link from "next/link";
import { getPageContent } from "@/lib/storage";
import { getPublishedProductsByCategory } from "@/lib/products-public";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getPageContent("tm-cpc");
  return {
    alternates: { canonical: "/tm-cpc" },
    title: c.metaTitle || "Transport Manager CPC Training Scotland | Road Haulage & PSV",
    description: c.metaDescription || "Full Transport Manager CPC classroom training for Road Haulage and PSV. NLTC exam fees included. From £1,195 excl. VAT. Scotland's leading TM CPC provider.",
  };
}

const TM_TOPICS = [
  "Operator Licensing",
  "Drivers' Hours & Tachographs",
  "Vehicle Maintenance & Roadworthiness",
  "Health & Safety",
  "Transport Operations",
  "Financial Standing",
  "Employment Law",
  "Fleet Compliance",
  "Loading & Security",
  "International Transport Operations",
];

export default async function TMCPCPage() {
  const c = await getPageContent("tm-cpc");
  const approvedProducts = await getPublishedProductsByCategory("Transport Management");
  return (
    <>
      <PageHero
        title={c.heroTitle || "Transport Manager CPC Training"}
        subtitle={c.heroSubtitle || "Full Road Haulage and PSV TM CPC classroom intensive training. NLTC exam fees included. Delivered by experienced transport professionals."}
        tag="Transport Manager CPC"
        breadcrumbs={[{ label: "TM CPC" }]}
        cta={{ label: "Book TM CPC Course", href: "/booking?course=tm-road-haulage" }}
      />

      {/* Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-start">
          <AnimatedSection direction="left">
            <span className="tag bg-navy/10 text-navy mb-4">About TM CPC</span>
            <h2 className="section-heading mb-4">Your Route to Transport Manager Status</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The Transport Manager CPC (Certificate of Professional Competence) is the mandatory qualification required to become a professional Transport Manager or to hold a Standard National or International Operator Licence.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              TAG is one of the UK&apos;s largest trainers of Transport Managers. Our intensive classroom programme covers all four DVSA modules, and our NLTC examination fees are included in the course price.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Whether you&apos;re new to transport management or renewing your CMP status, our expert tutors will guide you through everything you need to succeed.
            </p>
            <ul className="space-y-2 mb-8">
              {[
                "NLTC qualifications exam fees included",
                "Delivered by experienced TM professionals",
                "Small class sizes for focused learning",
                "12-month EOS e-learning access",
                "1,000+ practice question bank",
                "Online video library included",
                "Full study manual provided",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 size={16} className="text-blue-brand flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </AnimatedSection>

          <AnimatedSection direction="right">
            {/* Course topics */}
            <div className="bg-gray-light rounded-2xl p-6 mb-6">
              <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                <BookOpen size={18} className="text-orange-brand" />
                Course Topics
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {TM_TOPICS.map((topic) => (
                  <div key={topic} className="flex items-start gap-1.5 text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-brand flex-shrink-0 mt-1.5" />
                    {topic}
                  </div>
                ))}
              </div>
            </div>

            {/* Next course date */}
            <div className="bg-navy rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={18} className="text-orange-brand" />
                <span className="font-bold">Next Course Date</span>
              </div>
              <div className="text-2xl font-black text-orange-brand mb-1">11th May 2026</div>
              <p className="text-sm text-blue-light/80 mb-4">Bothwell HQ – Limited places available</p>
              <Link href="/booking?course=tm-road-haulage" className="btn-primary w-full justify-center text-sm">
                Reserve Your Place
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* What&apos;s included */}
      <section className="py-16 bg-gray-light">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-10">
            <h2 className="section-heading">What&apos;s Included in Your Course</h2>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: BookOpen, title: "Bespoke Study Manual", desc: "Comprehensive reference guide covering all CPC modules." },
              { icon: Award, title: "NLTC Exam Fees", desc: "All four NLTC examination fees included in the price." },
              { icon: CheckCircle2, title: "E-Learning Access", desc: "12 months access to EOS e-learning platform post-course." },
              { icon: BookOpen, title: "1,000+ Practice Questions", desc: "Extensive question bank to prepare you for exams." },
            ].map(({ icon: Icon, title, desc }) => (
              <AnimatedSection key={title}>
                <div className="bg-white rounded-xl p-5 shadow-sm h-full">
                  <div className="w-10 h-10 rounded-lg bg-navy/10 flex items-center justify-center mb-3">
                    <Icon size={20} className="text-navy" />
                  </div>
                  <h3 className="font-bold text-navy text-sm mb-1.5">{title}</h3>
                  <p className="text-xs text-gray-600">{desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="section-heading">Course Pricing</h2>
            <p className="section-subheading mx-auto text-center mt-3">NLTC exam fees included. All prices exclude VAT.</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <PriceCard
              title="Road Haulage Transport Manager CPC"
              price={Number(c.roadHaulagePrice ?? "1195")}
              priceNote="NLTC exam fees included, excl. VAT"
              features={[
                "Full TM CPC qualification",
                "All 4 DVSA modules covered",
                "NLTC exam fees included",
                "Study manual & materials",
                "E-learning access (12 months)",
                "1,000+ practice questions",
                "Expert TM instructors",
                "Small class sizes",
              ]}
              highlighted
              cta={{ label: "Book Road Haulage TM CPC", href: "/booking?course=tm-road-haulage" }}
            />
            <PriceCard
              title="PSV / Bus Transport Manager CPC"
              price={Number(c.psvPrice ?? "1195")}
              priceNote="NLTC exam fees included, excl. VAT"
              features={[
                "Full PSV TM CPC qualification",
                "All 4 DVSA modules covered",
                "NLTC exam fees included",
                "Study manual & materials",
                "E-learning access (12 months)",
                "1,000+ practice questions",
                "PSV specialist instructors",
                "Small class sizes",
              ]}
              cta={{ label: "Book PSV TM CPC", href: "/booking?course=tm-psv" }}
            />
          </div>

          <AnimatedSection className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Optional: TM App e-learning add-on available at £{c.elearningAddOnPrice ?? "129"}.
              Remote e-learning tests can be arranged nationwide.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Refresher Training */}
      <section id="refresher" className="py-16 bg-gray-light scroll-mt-24">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
          <AnimatedSection direction="left">
            <span className="tag bg-orange-brand/10 text-orange-brand mb-4">CMP Renewal</span>
            <h2 className="section-heading mb-4">Transport Manager CPC Refresher Training</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Already hold your Certificate of Professional Competence? Our TM CPC Refresher
              Training keeps working Transport Managers current on operator licensing, drivers&apos;
              hours, vehicle maintenance and fleet compliance, ideal for renewing your Continuous
              Professional Development or refreshing your knowledge ahead of a DVSA audit.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Delivered by the same experienced TM tutors as our full CPC course, with the same
              small class sizes and practical, real-world focus.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/tm-refresher-training" className="btn-primary">
                Learn More About Refresher Training
              </Link>
              <Link href="/contact?subject=tm-refresher" className="btn-outline">
                Enquire Now
              </Link>
            </div>
          </AnimatedSection>
          <AnimatedSection direction="right">
            <ul className="space-y-2 bg-white rounded-2xl border border-gray-100 shadow-card p-6">
              {[
                "Operator licensing & compliance updates",
                "Drivers' hours & tachograph rule changes",
                "Vehicle maintenance & roadworthiness standards",
                "Fleet compliance & OCRS best practice",
                "Delivered by experienced TM tutors",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 size={16} className="text-blue-brand flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
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

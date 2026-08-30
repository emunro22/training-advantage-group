export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";
import CourseProductTable from "@/components/ui/CourseProductTable";
import CTASection from "@/components/home/CTASection";
import { CheckCircle2, FileText, BarChart2, Shield, Truck, HelpCircle, GraduationCap } from "lucide-react";
import Link from "next/link";
import { getPublishedProductsByCategory } from "@/lib/products-public";

export const metadata: Metadata = {
  alternates: { canonical: "/consultancy" },
  title: "Transport Compliance & Consultancy | External TM Services | TAG",
  description:
    "Professional transport compliance consultancy. External TM services, operator licence support, fleet audits, OCRS improvement, tachograph analysis. Scotland.",
};

const SERVICES = [
  {
    id: "external-tm",
    icon: FileText,
    title: "External Transport Manager Services",
    desc: "We act as your nominated Transport Manager, providing full legal compliance without the overhead of a full-time TM employee.",
    features: ["Operator licence compliance", "Driver hours monitoring", "Fleet maintenance oversight", "CPC training coordination", "DVSA correspondence"],
    href: "/contact?subject=external-tm",
    price: "POA",
  },
  {
    id: "olat",
    icon: GraduationCap,
    title: "Operator Licence Awareness Training (OLAT)",
    desc: "A one-day course for operators, directors and nominated Transport Managers who need a practical grounding in operator licence obligations — classroom or remote.",
    features: ["1-day course", "Classroom or remote delivery", "Operator licence obligations", "Nominated person training", "Booked per candidate"],
    href: "/booking?course=olat",
    price: "From £495",
  },
  {
    id: "licence",
    icon: Shield,
    title: "Operator Licence Support",
    desc: "Comprehensive guidance for new applications and renewals of Standard National and International Operator Licences.",
    features: ["Application assistance", "OCRS improvement planning", "Undertakings compliance", "Disciplinary hearing support", "Licence variation requests"],
    href: "/contact?subject=operator-licence",
    price: "POA",
  },
  {
    id: "audit",
    icon: BarChart2,
    title: "Fleet Compliance Audit",
    desc: "Detailed inspection of your transport operation against DVSA standards to identify risks and improvement areas.",
    features: ["Full compliance review", "Tachograph analysis", "Driver file checks", "Maintenance record audit", "Written action plan"],
    href: "/booking?course=fleet-audit",
    price: "From £250",
  },
  {
    id: "ocrs",
    icon: Truck,
    title: "OCRS Improvement",
    desc: "Targeted support to improve your Operator Compliance Risk Score and maintain a green DVSA status.",
    features: ["Current OCRS assessment", "Driver coaching plan", "Maintenance improvements", "Tachograph compliance", "Ongoing monitoring"],
    href: "/contact?subject=ocrs",
    price: "POA",
  },
  {
    id: "tacho",
    icon: BarChart2,
    title: "Tachograph Analysis",
    desc: "Professional analysis of digital and analogue tachograph data to ensure driver hours compliance.",
    features: ["Regular data downloads", "Infringement reporting", "Driver debriefs", "Management reports", "DVSA download compliance"],
    href: "/booking?course=tacho-analysis",
    price: "From £295",
  },
  {
    id: "fors",
    icon: HelpCircle,
    title: "FORS Support",
    desc: "Guidance and support for Fleet Operator Recognition Scheme accreditation and maintenance.",
    features: ["Bronze, Silver & Gold support", "FORS audit preparation", "Policy documentation", "Driver training coordination", "Renewal assistance"],
    href: "/contact?subject=fors",
    price: "POA",
  },
];

export default async function ConsultancyPage() {
  const approvedProducts = await getPublishedProductsByCategory("OLAT & Compliance");
  return (
    <>
      <PageHero
        title="Transport Compliance & Consultancy"
        subtitle="Professional compliance support for operators, transport managers and fleet businesses. Keep your operation legal, safe and efficient."
        tag="Consultancy & Compliance"
        breadcrumbs={[{ label: "Consultancy & Compliance" }]}
        cta={{ label: "Get a Consultation", href: "/contact" }}
      />

      {/* Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-14">
            <h2 className="section-heading">Our Compliance Services</h2>
            <p className="section-subheading mx-auto text-center mt-3">
              From external TM support to full fleet audits — comprehensive compliance solutions for transport operators.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {SERVICES.map(({ id, icon: Icon, title, desc, features, href, price }, i) => (
              <AnimatedSection key={title} delay={i * 0.06}>
                <div id={id} className="bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover transition-all duration-300 p-6 h-full flex flex-col hover:-translate-y-1 scroll-mt-24">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-11 h-11 rounded-xl bg-navy/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={22} className="text-navy" />
                    </div>
                    <span className="text-sm font-bold text-blue-brand">{price}</span>
                  </div>
                  <h3 className="font-bold text-navy mb-2">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">{desc}</p>
                  <ul className="space-y-1.5 mb-6 flex-1">
                    {features.map((f) => (
                      <li key={f} className="flex items-center gap-1.5 text-xs text-gray-600">
                        <CheckCircle2 size={13} className="text-blue-brand flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href={href} className="text-sm font-semibold text-navy border border-navy/20 rounded-lg px-4 py-2.5 text-center hover:bg-navy hover:text-white transition-all">
                    Enquire Now
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose TAG */}
      <section className="py-16 bg-navy relative overflow-hidden pattern-bg">
        <div className="relative max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-10">
            <h2 className="text-3xl font-black text-white">Why Choose TAG for Compliance Support?</h2>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { value: "15+", label: "Years transport experience" },
              { value: "DVSA", label: "Approved ADR training body" },
              { value: "Scottish", label: "Based operators specialists" },
              { value: "24/7", label: "Support when you need it" },
            ].map(({ value, label }) => (
              <AnimatedSection key={label}>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 text-center">
                  <div className="text-2xl font-black text-orange-brand mb-1">{value}</div>
                  <div className="text-sm text-white/80">{label}</div>
                </div>
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

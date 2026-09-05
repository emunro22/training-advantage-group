import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";
import CTASection from "@/components/home/CTASection";
import { CheckCircle2, ClipboardList, BarChart3, FileText, MapPin } from "lucide-react";
import Link from "next/link";
import StructuredData from "@/components/seo/StructuredData";
import { buildFAQSchema } from "@/lib/schema";

export const metadata: Metadata = {
  alternates: { canonical: "/driver-assessments" },
  title: "Driver Assessments Scotland | Fleet & Individual Driver Evaluation",
  description:
    "Professional driver assessment services across Scotland. Fleet driver evaluations, individual assessments and safety audits. Detailed reports and improvement plans. From £95.",
};

const WHAT_WE_ASSESS = [
  "Pre-drive checks and vehicle safety",
  "Mirrors and observation",
  "Speed management and hazard response",
  "Following distance and motorway driving",
  "Tachograph and hours compliance awareness",
  "Load awareness and vehicle handling",
  "Fuel-efficient driving techniques",
  "Professional attitude and customer interaction",
];

const ASSESSMENT_TYPES = [
  {
    icon: "🚛",
    title: "Individual Driver Assessment",
    desc: "A comprehensive on-road assessment for individual drivers. Ideal for new starters, returning drivers, or as part of a personal development plan.",
    price: "From £95",
    features: ["1–2 hour on-road evaluation", "Comprehensive written report", "Risk scoring", "Personal improvement plan"],
    href: "/booking?course=driver-assessment-individual",
  },
  {
    icon: "🏭",
    title: "Fleet Driver Assessment",
    desc: "Systematic assessment of your entire driver workforce. Identifies at-risk drivers, reduces insurance costs and demonstrates duty of care compliance.",
    price: "POA",
    features: ["Multiple driver scheduling", "Consistent scoring matrix", "Fleet risk overview report", "Prioritised action plan", "OCRS compliance support"],
    href: "/contact",
    highlighted: true,
  },
  {
    icon: "📋",
    title: "Return to Work Assessment",
    desc: "Specifically designed for drivers returning after an incident, long absence, or following a complaint. Documents competence and safe return to operations.",
    price: "From £95",
    features: ["Focused evaluation", "Written competency sign-off", "Incident follow-up format", "Management report"],
    href: "/booking?course=driver-assessment-rtw",
  },
];

const FAQS = [
  {
    q: "Who conducts the driver assessments?",
    a: "All assessments are conducted by qualified driver assessors with real transport industry experience and professional assessment qualifications.",
  },
  {
    q: "Can assessments be done at our depot?",
    a: "Yes, we can conduct assessments from your depot or operating centre using your own vehicles. This is the most common approach for fleet operators.",
  },
  {
    q: "What report will we receive?",
    a: "Every assessment produces a detailed written report covering each area of evaluation, an overall risk score, specific observations and a prioritised action plan.",
  },
  {
    q: "How does a driver assessment help with OCRS?",
    a: "Proactively assessing drivers demonstrates duty of care to DVSA and insurers. It identifies risk before incidents occur and supports your Operator Compliance Risk Score.",
  },
];

export default function DriverAssessmentsPage() {
  return (
    <>
      <StructuredData data={buildFAQSchema(FAQS)} />
      <PageHero
        title="Driver Assessments"
        subtitle="Professional on-road driver evaluations for individual drivers and entire fleets. Detailed reports, risk scoring and improvement plans."
        tag="Driver Assessments"
        breadcrumbs={[{ label: "Transport Training", href: "/driver-cpc" }, { label: "Driver Assessments" }]}
        cta={{ label: "Book an Assessment", href: "/contact" }}
      />

      {/* Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection direction="left">
            <span className="tag bg-blue-50 text-blue-brand mb-4">Professional Driver Evaluation</span>
            <h2 className="section-heading mb-4">Know Your Drivers. Reduce Your Risk.</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              A professional driver assessment gives operators the evidence they need to demonstrate duty of care, identify at-risk drivers and reduce the likelihood of costly road incidents.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Our qualified assessors deliver consistent, thorough evaluations using a standardised scoring matrix, giving you objective, defensible reports that stand up to DVSA scrutiny.
            </p>
            <Link href="/contact" className="btn-primary">
              Discuss Fleet Assessment
            </Link>
          </AnimatedSection>

          <AnimatedSection direction="right">
            <div className="bg-gray-light rounded-2xl p-6">
              <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                <ClipboardList size={18} className="text-orange-brand" />
                What We Assess
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {WHAT_WE_ASSESS.map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 size={14} className="text-blue-brand flex-shrink-0 mt-0.5" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Assessment types */}
      <section className="py-20 bg-gray-light">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="section-heading">Assessment Packages</h2>
            <p className="section-subheading mx-auto text-center mt-3">From single-driver evaluations to full fleet programmes.</p>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {ASSESSMENT_TYPES.map((type, i) => (
              <AnimatedSection key={type.title} delay={i * 0.1}>
                <div className={`bg-white rounded-2xl overflow-hidden shadow-card h-full flex flex-col ${type.highlighted ? "ring-2 ring-orange-brand" : ""}`}>
                  {type.highlighted && (
                    <div className="bg-orange-brand text-white text-center text-xs font-bold py-2 uppercase tracking-wider">
                      Most Popular
                    </div>
                  )}
                  <div className="bg-navy p-5 text-white">
                    <div className="text-3xl mb-2">{type.icon}</div>
                    <h3 className="font-black text-lg">{type.title}</h3>
                    <div className="text-orange-brand font-bold mt-1">{type.price}</div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <p className="text-sm text-gray-600 mb-4">{type.desc}</p>
                    <ul className="space-y-1.5 mb-6 flex-1">
                      {type.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle2 size={14} className="text-blue-brand flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link href={type.href} className="btn-navy w-full justify-center text-sm">
                      Enquire Now
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="section-heading">Why Assess Your Drivers?</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: BarChart3, title: "Reduce Risk", desc: "Identify at-risk drivers before incidents happen. Reduce collision frequency and associated costs." },
              { icon: FileText, title: "Compliance Evidence", desc: "Demonstrate duty of care and OCRS compliance to DVSA, insurers and traffic commissioners." },
              { icon: CheckCircle2, title: "Improve Standards", desc: "Targeted training recommendations make every assessment dollar count by focusing improvement where needed most." },
              { icon: ClipboardList, title: "Insurance Benefits", desc: "Fleet assessment programmes can support insurance premium reduction discussions with your insurer." },
            ].map(({ icon: Icon, title, desc }) => (
              <AnimatedSection key={title}>
                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-2xl bg-navy/10 flex items-center justify-center mx-auto mb-3">
                    <Icon size={20} className="text-navy" />
                  </div>
                  <h3 className="font-bold text-navy text-sm mb-2">{title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
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
            <h2 className="text-2xl font-bold text-navy">Assessment Coverage</h2>
            <p className="text-gray-500 mt-2 text-sm">We conduct assessments from your depot or at any of our training centres.</p>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Bothwell HQ", detail: "G71 8DA" },
              { name: "Motherwell", detail: "ML1 1TA" },
              { name: "Glasgow", detail: "G14 0BX" },
              { name: "Your Depot", detail: "Nationwide on-site" },
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

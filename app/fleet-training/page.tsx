import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";
import CTASection from "@/components/home/CTASection";
import { CheckCircle2, Truck, Shield, BarChart3, Users } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  alternates: { canonical: "/fleet-training" },
  title: "Fleet Driver Training Scotland | Corporate CPC & Driver Development",
  description:
    "Comprehensive fleet driver training programmes across Scotland. Corporate Driver CPC, bespoke fleet programmes, onsite delivery and compliance support.",
};

const SERVICES = [
  {
    icon: "📋",
    title: "Fleet Driver CPC",
    desc: "Managed Driver CPC programmes for your entire fleet. We schedule, deliver and upload hours — reducing your admin burden.",
    features: ["Flexible scheduling around operations", "Onsite or centre-based", "Hours uploaded to DVSA", "Fleet management reporting"],
  },
  {
    icon: "🚛",
    title: "Bespoke Fleet Training",
    desc: "Custom training programmes built around your fleet's specific operational risks, vehicle types and compliance requirements.",
    features: ["Tailored course content", "Your vehicles, your routes", "Operational risk focus", "Branded materials available"],
  },
  {
    icon: "📊",
    title: "Fleet Assessment Programme",
    desc: "Systematic assessment of all drivers to identify risk, prioritise training and demonstrate duty of care.",
    features: ["Standardised scoring", "Fleet risk overview", "Priority action plan", "Insurer-accepted reports"],
  },
  {
    icon: "🏭",
    title: "Onsite Training Delivery",
    desc: "We come to your depot or site. Minimise driver downtime and operational disruption with on-site course delivery.",
    features: ["Nationwide delivery", "Any size fleet", "Flexible dates", "Dedicated fleet coordinator"],
  },
];

const SECTORS = [
  { name: "Road Haulage", icon: "🚚" },
  { name: "Distribution", icon: "📦" },
  { name: "Construction", icon: "🏗️" },
  { name: "Utilities", icon: "⚡" },
  { name: "Local Authorities", icon: "🏛️" },
  { name: "Passenger Transport", icon: "🚌" },
  { name: "Waste Management", icon: "♻️" },
  { name: "Emergency Services", icon: "🚨" },
];

export default function FleetTrainingPage() {
  return (
    <>
      <PageHero
        title="Fleet Driver Training"
        subtitle="Comprehensive training programmes for transport operators and fleet managers. Onsite delivery, managed CPC programmes and bespoke driver development."
        tag="Fleet Training"
        breadcrumbs={[{ label: "Transport Training", href: "/driver-cpc" }, { label: "Fleet Driver Training" }]}
        cta={{ label: "Request Fleet Quotation", href: "/contact" }}
      />

      {/* Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection direction="left">
            <span className="tag bg-blue-50 text-blue-brand mb-4">Corporate Fleet Solutions</span>
            <h2 className="section-heading mb-4">Training That Works Around Your Operations</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Running a fleet means keeping drivers trained, compliant and productive — often with minimal operational disruption. TAG specialises in managed fleet training programmes that do exactly that.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              From small independent hauliers to large national operators, we build training programmes around your specific fleet, your drivers and your compliance requirements.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { value: "10k+", label: "Drivers trained/year" },
                { value: "3", label: "Training centres" },
                { value: "15+", label: "Years experience" },
                { value: "UK", label: "Nationwide delivery" },
              ].map((s) => (
                <div key={s.label} className="bg-gray-light rounded-xl p-3 text-center">
                  <div className="text-xl font-black text-navy">{s.value}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>
            <Link href="/contact" className="btn-primary">
              Request Fleet Quotation
            </Link>
          </AnimatedSection>

          <AnimatedSection direction="right">
            <div className="bg-navy rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-4">Why Fleet Managers Choose TAG</h3>
              <ul className="space-y-3">
                {[
                  "Single point of contact for all training needs",
                  "Flexible scheduling around shift patterns",
                  "Nationwide on-site delivery capability",
                  "DVSA hours uploaded automatically",
                  "Compliance reporting and fleet dashboards",
                  "Volume pricing for large driver pools",
                  "Emergency training slots available",
                  "Dedicated fleet account manager",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-blue-100">
                    <CheckCircle2 size={14} className="text-orange-brand flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-gray-light">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="section-heading">Fleet Training Services</h2>
            <p className="section-subheading mx-auto text-center mt-3">
              Every service can be delivered on-site at your premises or at any of our three training centres.
            </p>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-6">
            {SERVICES.map((svc, i) => (
              <AnimatedSection key={svc.title} delay={i * 0.1}>
                <div className="bg-white rounded-2xl p-6 shadow-card h-full">
                  <div className="text-3xl mb-3">{svc.icon}</div>
                  <h3 className="font-bold text-navy text-lg mb-2">{svc.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{svc.desc}</p>
                  <ul className="space-y-1.5">
                    {svc.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle2 size={13} className="text-blue-brand flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="section-heading">Sectors We Support</h2>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SECTORS.map((sector, i) => (
              <AnimatedSection key={sector.name} delay={i * 0.06}>
                <div className="bg-gray-light rounded-2xl p-4 text-center">
                  <div className="text-3xl mb-2">{sector.icon}</div>
                  <div className="font-semibold text-navy text-sm">{sector.name}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-light">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="section-heading">How It Works</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", icon: Users, title: "Initial Consultation", desc: "We review your fleet size, driver pool, current compliance status and operational requirements." },
              { step: "02", icon: BarChart3, title: "Training Plan", desc: "We design a training programme around your drivers, schedules and specific compliance needs." },
              { step: "03", icon: Truck, title: "Delivery", desc: "Training delivered on-site or at our centres — around your operations, not the other way round." },
              { step: "04", icon: Shield, title: "Reporting", desc: "Detailed completion reports, DVSA uploads and compliance documentation provided to you." },
            ].map(({ step, title, desc, icon: Icon }) => (
              <AnimatedSection key={step}>
                <div className="text-center p-4">
                  <div className="relative inline-flex mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-navy flex items-center justify-center">
                      <Icon size={22} className="text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-orange-brand flex items-center justify-center text-white text-xs font-bold">
                      {step}
                    </div>
                  </div>
                  <h3 className="font-bold text-navy mb-2 text-sm">{title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}

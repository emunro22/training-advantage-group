import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";
import PriceCard from "@/components/ui/PriceCard";
import CTASection from "@/components/home/CTASection";
import { CheckCircle2, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "ADR Dangerous Goods Training Scotland | Initial & Requalification",
  description:
    "DVSA approved ADR training for the carriage of dangerous goods by road. Initial packages, requalification, tanks and specialist classes. Scotland.",
};

export default function ADRTrainingPage() {
  return (
    <>
      <PageHero
        title="ADR Dangerous Goods Training"
        subtitle="DVSA approved training for the carriage of dangerous goods by road. Initial courses, requalification and specialist class upgrades."
        tag="ADR Training"
        breadcrumbs={[{ label: "ADR Training" }]}
        cta={{ label: "Book ADR Training", href: "/booking?course=adr-initial" }}
      />

      {/* Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection direction="left">
            <span className="tag bg-red-50 text-red-brand mb-4">What is ADR?</span>
            <h2 className="section-heading mb-4">Carriage of Dangerous Goods</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              ADR (Accord Dangereux Routier) certification is required for drivers transporting hazardous materials by road. The qualification must be renewed every 5 years.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Training Advantage Group is a DVSA approved ADR training body. Our experienced instructors deliver comprehensive, practical training that prepares drivers for the written examination.
            </p>
            <ul className="space-y-2 mb-8">
              {["DVSA approved ADR training body", "Written examination included", "Certificate valid 5 years", "All hazard class options available", "Core and specialist modules"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 size={16} className="text-red-brand flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </AnimatedSection>

          <AnimatedSection direction="right">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={20} className="text-red-brand" />
                <h3 className="font-bold text-navy">ADR Classes Available</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Class 2 – Gases",
                  "Class 3 – Flammable Liquids",
                  "Class 4 – Flammable Solids",
                  "Class 5 – Oxidising Substances",
                  "Class 6 – Toxic Substances",
                  "Class 8 – Corrosive Substances",
                  "Class 9 – Misc. Dangerous Goods",
                  "Class 1 – Explosives (specialist)",
                  "Class 7 – Radioactive (specialist)",
                  "Tank Training Available",
                ].map((cls) => (
                  <div key={cls} className="flex items-start gap-1.5 text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-brand flex-shrink-0 mt-1.5" />
                    {cls}
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-light">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="section-heading">ADR Course Pricing</h2>
            <p className="section-subheading mx-auto text-center mt-3">All prices exclude VAT. Weekend delivery available from £150.</p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            <PriceCard
              title="ADR Initial Packages"
              price={395}
              features={["Core training included", "All standard classes", "Written examination", "Certificate on pass", "5-year validity"]}
              cta={{ label: "Book Initial", href: "/booking?course=adr-initial" }}
            />
            <PriceCard
              title="ADR Tanks & Packages"
              price={495}
              highlighted
              features={["Core training + tanks module", "Bulk transport focus", "Written examination", "Certificate on pass", "5-year validity"]}
              cta={{ label: "Book Tanks", href: "/booking?course=adr-tanks" }}
            />
            <PriceCard
              title="ADR Requalification"
              price={325}
              features={["Renewal before expiry", "Updated knowledge", "Written examination", "Certificate on pass", "5-year extension"]}
              cta={{ label: "Book Requalification", href: "/booking?course=adr-requalification" }}
            />
            <PriceCard
              title="Class 1 or 7 Upgrade"
              price={95}
              features={["Specialist class add-on", "Explosives or Radioactive", "Written examination", "Certificate on pass", "Added to existing ADR"]}
              cta={{ label: "Book Upgrade", href: "/booking?course=adr-class1-7" }}
            />
          </div>

          <AnimatedSection className="mt-8 text-center">
            <div className="inline-flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <span className="bg-white rounded-lg px-4 py-2 shadow-sm">ADR Retest: £25 per paper</span>
              <span className="bg-white rounded-lg px-4 py-2 shadow-sm">Duplicate Certificate: £25</span>
              <span className="bg-white rounded-lg px-4 py-2 shadow-sm">DCPC Upload: £8.75</span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <CTASection />
    </>
  );
}

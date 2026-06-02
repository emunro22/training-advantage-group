import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";
import AccreditationsSection from "@/components/home/AccreditationsSection";
import CTASection from "@/components/home/CTASection";
import { CheckCircle2, MapPin, Phone, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "About Training Advantage Group | Scotland's Transport Training Specialists",
  description:
    "Learn about Training Advantage Group Ltd — Scotland's premier transport, logistics and industrial training provider. DVSA approved, Qualifications Scotland accredited.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Training Advantage Group"
        subtitle="Scotland's leading professional training provider for transport, logistics, compliance and industrial sectors."
        tag="About TAG"
        breadcrumbs={[{ label: "About Us" }]}
      />

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection direction="left">
            <span className="tag bg-navy/10 text-navy mb-4">Our Story</span>
            <h2 className="section-heading mb-4">Training For The Future</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Training Advantage Group Ltd was founded with a clear mission: to provide the highest quality professional training to Scotland&apos;s transport and logistics industry. From our headquarters in Bothwell to centres in Motherwell and Glasgow, we have grown into one of Scotland&apos;s most trusted training providers.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Every year, thousands of professional drivers, transport managers, plant operators and fleet professionals choose TAG to advance their careers, maintain compliance and develop their skills.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Our instructors are industry professionals with real-world experience — not just educators. This means our training is practical, relevant and genuinely useful in the real world of transport and logistics.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "10,000+", label: "Learners annually" },
                { value: "15+", label: "Years in business" },
                { value: "3", label: "Training centres" },
                { value: "6+", label: "Accreditations" },
              ].map(({ value, label }) => (
                <div key={label} className="bg-gray-light rounded-xl p-4 text-center">
                  <div className="text-2xl font-black text-navy mb-1">{value}</div>
                  <div className="text-xs text-gray-dark">{label}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection direction="right">
            <div className="bg-navy rounded-2xl p-6 text-white mb-5">
              <h3 className="font-bold text-xl mb-4">Our Values</h3>
              <div className="space-y-3">
                {[
                  { title: "Professional", desc: "We deliver high standards in everything we do." },
                  { title: "Respectful", desc: "We treat everyone with respect and fairness." },
                  { title: "Safe", desc: "We prioritise safety for our learners, team and communities." },
                  { title: "Inclusive", desc: "We embrace diversity and create equal opportunities." },
                  { title: "Accountable", desc: "We take responsibility and do the right thing." },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-orange-brand flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">{title}</span>
                      <span className="text-white/70 text-sm"> — {desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
              <p className="text-sm font-semibold text-navy mb-1">Our Tagline</p>
              <p className="text-2xl font-black text-orange-brand">&ldquo;Training For The Future&rdquo;</p>
              <p className="text-sm text-gray-600 mt-2">Professional training that keeps industry moving, careers advancing and communities safe.</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Accreditations */}
      <section id="accreditations">
        <AccreditationsSection />
      </section>

      {/* Locations */}
      <section id="locations" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="section-heading">Our Training Centres</h2>
            <p className="section-subheading mx-auto text-center mt-3">
              Three fully-equipped professional training centres across central Scotland.
            </p>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Bothwell HQ & Exam Suite",
                address: "1st Floor Training Suite\nAPC Depot, Coalburn Road\nBothwell, G71 8DA",
                tag: "Headquarters",
                color: "bg-navy",
              },
              {
                name: "Motherwell Training Centre",
                address: "28 Hope Street\nMotherwell\nML1 1TA",
                tag: "Training Centre",
                color: "bg-blue-brand",
              },
              {
                name: "Glasgow Training Centre",
                address: "South Street\nGlasgow\nG14 0BX",
                tag: "Training Centre",
                color: "bg-orange-brand",
              },
            ].map(({ name, address, tag, color }) => (
              <AnimatedSection key={name}>
                <div className="bg-white rounded-2xl shadow-card overflow-hidden h-full">
                  <div className={`${color} text-white px-5 py-4`}>
                    <div className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">{tag}</div>
                    <h3 className="font-bold">{name}</h3>
                  </div>
                  <div className="p-5 flex items-start gap-2">
                    <MapPin size={15} className="text-orange-brand flex-shrink-0 mt-0.5" />
                    <address className="not-italic text-sm text-gray-600 whitespace-pre-line">{address}</address>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Registered details */}
      <section className="py-10 bg-gray-light">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <AnimatedSection>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-navy mb-3">Company Information</h3>
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-gray-600">
                <span>Training Advantage Group Ltd</span>
                <span>Registered in Scotland No. SC765674</span>
                <span>VAT Registration No. 446609573</span>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
                <a href="tel:01412582024" className="flex items-center gap-1.5 text-blue-brand hover:text-blue-dark">
                  <Phone size={13} /> 0141 258 2024
                </a>
                <a href="mailto:office@trainingadvantagegroup.co.uk" className="flex items-center gap-1.5 text-blue-brand hover:text-blue-dark">
                  <Mail size={13} /> office@trainingadvantagegroup.co.uk
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <CTASection />
    </>
  );
}

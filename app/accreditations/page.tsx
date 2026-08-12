import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/ui/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";
import CTASection from "@/components/home/CTASection";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { getPublicAccreditationLogos } from "@/lib/accreditation-logos-public";

export const metadata: Metadata = {
  title: "Accreditations & Approvals | Training Advantage Group Ltd",
  description:
    "Training Advantage Group Ltd is fully accredited by Qualifications Scotland, DVSA, JAUPT, NPORS and NLTC. All qualifications are nationally recognised.",
};

const ACCREDITATIONS = [
  {
    name: "Qualifications Scotland",
    type: "Approved Centre",
    emoji: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    color: "bg-blue-50 border-blue-200",
    textColor: "text-blue-900",
    description:
      "As a Qualifications Scotland Approved Centre, TAG delivers nationally recognised qualifications across transport, compliance and vocational training. All qualifications meet Scottish and UK regulatory standards.",
    what: ["Nationally recognised qualifications", "Regulated assessment standards", "Scottish qualification framework", "Quality-assured delivery"],
  },
  {
    name: "DVSA / JAUPT",
    type: "Driver CPC Approved — AC00591",
    emoji: "🚛",
    color: "bg-slate-50 border-slate-200",
    textColor: "text-slate-900",
    description:
      "JAUPT (Joint Approvals Unit for Periodic Training) approval under reference AC00591 authorises TAG to deliver DVSA-approved Driver CPC periodic training. Hours are uploaded directly to the DVSA database.",
    what: ["JAUPT Approved Centre AC00591", "Direct DVSA hours upload", "Periodic and Initial CPC", "Approved modules delivered"],
  },
  {
    name: "DVSA",
    type: "Approved ADR Training Body",
    emoji: "⚠️",
    color: "bg-yellow-50 border-yellow-200",
    textColor: "text-yellow-900",
    description:
      "TAG is approved by the Driver & Vehicle Standards Agency (DVSA) to deliver ADR (Carriage of Dangerous Goods) training. All ADR programmes meet the strict requirements of the ADR regulations.",
    what: ["DVSA approved ADR trainer", "Initial and requalification courses", "All ADR classes available", "Certificates issued in compliance with ADR regulations"],
  },
  {
    name: "NPORS",
    type: "Accredited Training Provider",
    emoji: "🏗️",
    color: "bg-orange-50 border-orange-200",
    textColor: "text-orange-900",
    description:
      "National Plant Operators Registration Scheme (NPORS) accreditation allows TAG to deliver and assess plant and MHE operator training. NPORS cards are nationally recognised across the construction and industrial sectors.",
    what: ["Accredited NPORS assessment centre", "NPORS Trained Operator cards", "Counterbalance, reach truck, telehandler and more", "Recognised by major construction sector bodies"],
  },
  {
    name: "NLTC Qualifications",
    type: "Official Regulated Qualification",
    emoji: "🎓",
    color: "bg-red-50 border-red-200",
    textColor: "text-red-900",
    description:
      "NLTC Qualifications approval covers the delivery of Transport Manager CPC qualifications. TAG exam fees are included in TM CPC packages — a significant cost saving for candidates.",
    what: ["TM CPC examination delivery", "Exam fees included in packages", "Official NLTC certification", "Road Haulage and PSV streams"],
  },
  {
    name: "JAUPT Approved",
    type: "Driver CPC Consortium Member",
    emoji: "✅",
    color: "bg-green-50 border-green-200",
    textColor: "text-green-900",
    description:
      "TAG's JAUPT Consortium membership (AC00591) ensures all Driver CPC training meets the national standards for professional driver development as set by the DVSA.",
    what: ["Consortium member AC00591", "Approved module content", "Hours uploaded to DVSA", "Attendance-based assessment"],
  },
  {
    name: "RADAT",
    type: "Register of Approved Driver Assessors & Trainers",
    emoji: "🚗",
    color: "bg-blue-50 border-blue-200",
    textColor: "text-blue-900",
    description:
      "TAG instructors are registered with RADAT (Register of Approved Driver Assessors & Trainers), the independent register for professional driver assessors and trainers in the UK.",
    what: ["Registered driver assessors", "Independent professional register", "Validated training delivery", "Fleet & individual assessments"],
  },
  {
    name: "Ofqual / Department for Education",
    type: "Regulated Qualification Authority",
    emoji: "🎓",
    color: "bg-teal-50 border-teal-200",
    textColor: "text-teal-900",
    description:
      "Ofqual regulates qualifications, examinations and assessments in England. Our qualifications that fall under the Ofqual framework meet the highest standards of regulated education and are recognised by the Department for Education.",
    what: ["Ofqual regulated qualifications", "Department for Education recognised", "Quality assured assessment", "Nationally accepted standards"],
  },
];

export default async function AccreditationsPage() {
  const logoStrip = await getPublicAccreditationLogos("accreditations_page");
  return (
    <>
      <PageHero
        title="Accreditations & Approvals"
        subtitle="Training Advantage Group Ltd is fully approved and accredited by the leading transport and training industry bodies. Every qualification you earn with us is nationally recognised."
        tag="Accreditations"
        breadcrumbs={[{ label: "About TAG", href: "/about" }, { label: "Accreditations" }]}
      />

      {/* Intro */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <AnimatedSection>
            <ShieldCheck size={40} className="text-orange-brand mx-auto mb-4" />
            <h2 className="section-heading mb-4">Why Accreditation Matters</h2>
            <p className="text-gray-600 leading-relaxed">
              When you train with an accredited provider, you know that your qualifications are genuine, nationally recognised and accepted by employers, regulators and enforcement authorities. TAG&apos;s accreditations are not just logos — they represent real quality assurance and regulatory compliance.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Logo strip */}
      <section className="py-10 bg-gray-light border-b border-gray-mid">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {logoStrip.map((logo) => (
                <div key={logo.name} className="relative h-16 w-[150px] flex-shrink-0 bg-white rounded-xl p-3 shadow-sm">
                  <Image src={logo.src} alt={logo.alt} fill sizes="150px" className="object-contain p-2" />
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Accreditations grid */}
      <section className="py-16 bg-gray-light">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            {ACCREDITATIONS.map((acc, i) => (
              <AnimatedSection key={acc.name} delay={i * 0.08}>
                <div className={`rounded-2xl border-2 p-6 ${acc.color}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">{acc.emoji}</div>
                    <div>
                      <h3 className={`font-black text-lg ${acc.textColor}`}>{acc.name}</h3>
                      <div className="text-xs text-gray-500">{acc.type}</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">{acc.description}</p>
                  <ul className="space-y-1.5">
                    {acc.what.map((w) => (
                      <li key={w} className="flex items-center gap-2 text-xs text-gray-600">
                        <CheckCircle2 size={12} className="text-blue-brand flex-shrink-0" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Registration */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <AnimatedSection>
            <div className="bg-navy rounded-2xl p-6 text-center text-white">
              <h3 className="font-bold text-lg mb-2">Company Registration</h3>
              <p className="text-blue-light/80 text-sm">
                Training Advantage Group Ltd | Registered in Scotland No. SC765674<br />
                VAT Registration No. 446609573<br />
                Registered Office: 1st Floor Training Suite, APC Depot, Coalburn Road, Bothwell, G71 8DA
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <CTASection />
    </>
  );
}

import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";
import CTASection from "@/components/home/CTASection";
import { CheckCircle2, Users2, Award } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Instructor & Assessor Training | RADAT, CPC, ADR | TAG Scotland",
  description:
    "Professional instructor and assessor training for Driver CPC, HGV, fleet assessments and ADR. RADAT approved. Scotland's leading instructor development provider.",
};

const PROGRAMMES = [
  {
    title: "Driver CPC Instructor Training",
    desc: "Qualify to deliver Driver CPC periodic training. Gain JAUPT approved instructor status and support professional drivers in staying compliant.",
    features: ["JAUPT instructor approval pathway", "CPC module delivery skills", "Assessment techniques", "Course design support", "Ongoing CPD guidance"],
    href: "/booking?course=dcpc-instructor",
  },
  {
    title: "RADAT Instructor Training",
    desc: "Nationally recognised RADAT accreditation for car, van, LGV and PCV driving instructors and assessors.",
    features: ["RADAT national recognition", "Vehicle category specific", "Driver coaching techniques", "Assessment standards", "Professional register"],
    href: "/booking?course=radat-instructor",
  },
  {
    title: "ADR Instructor Mentoring Programme",
    desc: "Specialist development for experienced ADR practitioners wishing to qualify as ADR instructors.",
    features: ["DVSA ADR instructor pathway", "Specialist class coverage", "Mentoring and observation", "Examination preparation", "DVSA approval support"],
    href: "/booking?course=adr-instructor",
  },
  {
    title: "Fleet Instructor & Assessor Training",
    desc: "Develop your in-house fleet instructors and assessors to maintain consistent driver standards across your operation.",
    features: ["Fleet assessment standards", "On-road assessment skills", "Feedback and coaching", "Report writing", "In-house programme design"],
    href: "/contact?subject=fleet-instructor",
  },
  {
    title: "Van & Car Instructor Training",
    desc: "Instructor training for car and van sectors, covering both business and commercial fleet training delivery.",
    features: ["Category B & B+E coverage", "Van fleet instructor skills", "Corporate training design", "Passenger safety", "Fleet compliance integration"],
    href: "/booking?course=van-instructor",
  },
  {
    title: "Internal IQA Training",
    desc: "Internal Quality Assurance training for organisations delivering accredited qualifications.",
    features: ["IQA roles and responsibilities", "Sampling strategies", "Standardisation processes", "Assessment quality checks", "Documentation requirements"],
    href: "/contact?subject=iqa",
  },
];

export default function InstructorTrainingPage() {
  return (
    <>
      <PageHero
        title="Instructor & Assessor Development"
        subtitle="Turn your transport expertise into a rewarding career. RADAT approved instructor and assessor training for the road transport industry."
        tag="Instructor Training"
        breadcrumbs={[{ label: "Instructor Training" }]}
        cta={{ label: "Enquire About Instructor Training", href: "/contact?subject=instructor-training" }}
      />

      {/* Intro */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection direction="left">
            <span className="tag bg-navy/10 text-navy mb-4">Build a Career That Makes a Difference</span>
            <h2 className="section-heading mb-4">Turn Experience Into Qualification</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              If you have professional transport experience, TAG can help you become a qualified instructor or assessor. We support drivers, transport managers and compliance professionals in making the transition to training delivery.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Our instructor development programmes are approved by RADAT (Register of Approved Driver Assessors and Trainers) and DVSA, ensuring your qualification is nationally recognised and professionally respected.
            </p>
            <ul className="space-y-2 mb-8">
              {[
                "RADAT nationally recognised accreditation",
                "DVSA approved for ADR instructors",
                "Qualifications Scotland approved centre",
                "In-house or at our training centres",
                "Ongoing mentoring and CPD support",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 size={16} className="text-navy flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </AnimatedSection>

          <AnimatedSection direction="right">
            <div className="bg-navy rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-4">
                <Award size={20} className="text-orange-brand" />
                <h3 className="font-bold">Accredited By</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {["RADAT Register", "DVSA Approved", "Qualifications Scotland", "Driver CPC JAUPT"].map((acc) => (
                  <div key={acc} className="bg-white/10 rounded-xl p-3 text-center text-sm font-medium">{acc}</div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-white/20">
                <p className="text-sm text-white/80 mb-4">
                  &ldquo;You have the experience. We will provide the skills, qualifications and support.&rdquo;
                </p>
                <Link href="/contact?subject=instructor-training" className="btn-primary w-full justify-center text-sm">
                  Get in Touch Today
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Programmes */}
      <section className="py-20 bg-gray-light">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="section-heading">Training Programmes</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {PROGRAMMES.map(({ title, desc, features, href }, i) => (
              <AnimatedSection key={title} delay={i * 0.05}>
                <div className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all h-full flex flex-col">
                  <div className="w-10 h-10 rounded-xl bg-navy/10 flex items-center justify-center mb-3">
                    <Users2 size={20} className="text-navy" />
                  </div>
                  <h3 className="font-bold text-navy mb-2">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">{desc}</p>
                  <ul className="space-y-1.5 mb-6 flex-1">
                    {features.map((f) => (
                      <li key={f} className="flex items-center gap-1.5 text-xs text-gray-600">
                        <CheckCircle2 size={12} className="text-navy flex-shrink-0" />
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

      <CTASection />
    </>
  );
}

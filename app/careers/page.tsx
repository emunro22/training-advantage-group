import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";
import CTASection from "@/components/home/CTASection";
import { CheckCircle2, Mail, Briefcase, GraduationCap, Users, Heart } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Careers at Training Advantage Group | Join Our Team",
  description:
    "Join the team at Training Advantage Group Ltd. We're always looking for passionate instructors, assessors and training professionals to help deliver Scotland's best transport training.",
};

const ROLES = [
  {
    title: "Driver CPC Instructor",
    type: "Full-time / Part-time",
    location: "Bothwell / Motherwell / Glasgow",
    desc: "Deliver engaging Driver CPC periodic training sessions across our Scottish training centres. JAUPT approved content, professional facilities.",
    requirements: ["Current Driver CPC qualification", "Strong communication skills", "Transport industry background preferred"],
    icon: "🚛",
  },
  {
    title: "Transport Manager CPC Tutor",
    type: "Full-time / Freelance",
    location: "Bothwell HQ + Remote",
    desc: "Teach Transport Manager CPC classroom intensive courses. Thorough knowledge of the TM CPC syllabus and NLTC qualification framework required.",
    requirements: ["Transport Manager CPC qualification", "Teaching experience preferred", "Real TM operational experience"],
    icon: "📋",
  },
  {
    title: "ADR Instructor",
    type: "Full-time / Freelance",
    location: "Central Scotland",
    desc: "Deliver DVSA-approved ADR (Dangerous Goods) training across initial and requalification programmes.",
    requirements: ["DVSA approved ADR instructor status", "ADR all classes experience", "Excellent presentation skills"],
    icon: "⚠️",
  },
  {
    title: "Plant / NPORS Assessor",
    type: "Full-time",
    location: "Central Scotland",
    desc: "Deliver and assess counterbalance, reach truck, telehandler and plant operator training. Onsite and centre-based delivery.",
    requirements: ["NPORS registration or equivalent", "Relevant plant operator experience", "Assessor qualification"],
    icon: "🏗️",
  },
];

const BENEFITS = [
  { icon: Heart, text: "Supportive, professional working environment" },
  { icon: GraduationCap, text: "CPD and ongoing development opportunities" },
  { icon: Users, text: "Collaborative, experienced team" },
  { icon: Briefcase, text: "Competitive remuneration" },
  { icon: CheckCircle2, text: "Flexible working arrangements considered" },
  { icon: CheckCircle2, text: "Modern, well-equipped training facilities" },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        title="Work With Us"
        subtitle="Join Scotland's most trusted transport training organisation. We're always looking for experienced instructors, assessors and training professionals."
        tag="Careers"
        breadcrumbs={[{ label: "About TAG", href: "/about" }, { label: "Careers" }]}
        cta={{ label: "Send Your CV", href: "mailto:office@trainingadvantagegroup.co.uk" }}
      />

      {/* Why TAG */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection direction="left">
            <span className="tag bg-orange-50 text-orange-brand mb-4">Why Join TAG?</span>
            <h2 className="section-heading mb-4">A Career That Makes a Difference</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              At Training Advantage Group, we believe that excellent training saves lives. Every instructor, assessor and support professional at TAG plays a direct role in making Scotland&apos;s roads safer and supporting people in building rewarding careers.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              We&apos;re a growing organisation with ambitious plans, and we&apos;re always looking for talented people to help us deliver on our promise of Scotland&apos;s best transport training.
            </p>
            <ul className="space-y-3">
              {BENEFITS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm text-gray-700">
                  <Icon size={16} className="text-orange-brand flex-shrink-0" />
                  {text}
                </li>
              ))}
            </ul>
          </AnimatedSection>

          <AnimatedSection direction="right">
            <div className="bg-navy rounded-2xl p-6 text-white">
              <h3 className="font-bold text-xl mb-2">YOUR EXPERIENCE.</h3>
              <p className="text-orange-brand font-black text-lg mb-4">WE WILL PROVIDE THE SKILLS, QUALIFICATIONS & SUPPORT.</p>
              <p className="text-blue-light/80 text-sm leading-relaxed mb-6">
                If you have real industry experience and a genuine passion for helping others develop, we want to hear from you. We support our instructors with RADAT training, CPD programmes and ongoing mentoring.
              </p>
              <Link
                href="mailto:office@trainingadvantagegroup.co.uk"
                className="flex items-center gap-2 bg-orange-brand hover:bg-orange-600 text-white px-5 py-3 rounded-xl font-semibold text-sm transition-colors"
              >
                <Mail size={16} />
                Send Your CV Now
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Current roles */}
      <section className="py-20 bg-gray-light">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="section-heading">Current Opportunities</h2>
            <p className="section-subheading mx-auto text-center mt-3">
              We regularly recruit across all training disciplines. If you don&apos;t see the exact role you&apos;re looking for, send us your CV — we keep all applications on file.
            </p>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-6">
            {ROLES.map((role, i) => (
              <AnimatedSection key={role.title} delay={i * 0.08}>
                <div className="bg-white rounded-2xl p-6 shadow-card h-full flex flex-col">
                  <div className="text-3xl mb-3">{role.icon}</div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-navy text-lg">{role.title}</h3>
                    <span className="text-xs bg-blue-50 text-blue-brand px-2 py-1 rounded-full font-semibold flex-shrink-0">{role.type}</span>
                  </div>
                  <div className="text-xs text-gray-400 mb-3">{role.location}</div>
                  <p className="text-sm text-gray-600 mb-4 flex-1">{role.desc}</p>
                  <div className="space-y-1 mb-5">
                    {role.requirements.map((req) => (
                      <div key={req} className="flex items-center gap-2 text-xs text-gray-600">
                        <CheckCircle2 size={12} className="text-blue-brand flex-shrink-0" />
                        {req}
                      </div>
                    ))}
                  </div>
                  <Link
                    href="mailto:office@trainingadvantagegroup.co.uk"
                    className="btn-navy text-sm w-full justify-center"
                  >
                    Apply for This Role
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Speculative */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-2xl font-bold text-navy mb-4">Don&apos;t See Your Role?</h2>
            <p className="text-gray-600 mb-6">
              We welcome speculative applications from experienced transport training professionals. Send your CV and a short covering letter to the email below and we&apos;ll be in touch.
            </p>
            <a
              href="mailto:office@trainingadvantagegroup.co.uk"
              className="btn-primary inline-flex"
            >
              <Mail size={16} />
              office@trainingadvantagegroup.co.uk
            </a>
          </AnimatedSection>
        </div>
      </section>

      <CTASection />
    </>
  );
}

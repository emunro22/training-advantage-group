import type { Metadata } from "next";
import Link from "next/link";
import {
  GraduationCap,
  Briefcase,
  BadgeCheck,
  ClipboardCheck,
  TrendingUp,
  ArrowRight,
  Award,
  Users2,
  HeartHandshake,
  LifeBuoy,
  ShieldCheck,
  Scale,
  Sparkles,
} from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { getApprenticeshipPathways } from "@/lib/storage";

export const metadata: Metadata = {
  alternates: { canonical: "/apprenticeships-svq" },
  title: "Apprenticeships & SVQ Pathways | Training Advantage Group",
  description:
    "Training Advantage Group is developing Modern Apprenticeship and work-based SVQ provision across Scotland — transport, logistics, plant, safety and professional training pathways.",
  keywords: ["Modern Apprenticeship Scotland", "SVQ Scotland", "work-based qualifications", "SDS apprenticeship", "TAG apprenticeships"],
};

const CONTACT_HREF = "/contact?course=apprenticeships-svq";

const JOURNEY_STEPS = ["Employment", "Learning", "Workplace Assessment", "Qualification", "Progression"];
const EMPLOYER_STEPS = ["Identify Need", "Select Pathway", "Enrol", "Train & Assess", "Review Progress", "Achieve"];

const SVQ_BOXES = [
  { icon: Briefcase, label: "Work-Based" },
  { icon: Award, label: "Recognised Qualifications" },
  { icon: ClipboardCheck, label: "Workplace Assessment" },
  { icon: TrendingUp, label: "Career Progression" },
];

const SCQF_LEVELS = [
  { level: 5, label: "SVQ 2" },
  { level: 6, label: "SVQ 3" },
  { level: 7, label: "SVQ 3/4" },
  { level: 8, label: "SVQ 4" },
  { level: 9, label: "SVQ 4/5" },
];

const LEARNER_POINTS = [
  "Gain recognised qualifications",
  "Develop skills in a real workplace",
  "Receive structured training and assessment",
  "Build evidence of occupational competence",
  "Progress their career",
];

const APPRENTICE_JOURNEY = [
  "Enquire",
  "Eligibility / Initial Assessment",
  "Employer & Job Role",
  "Select Approved Framework",
  "Training Agreement / Individual Plan",
  "Learning & Workplace Evidence",
  "Assessment",
  "Progress Reviews",
  "Qualification Achievement",
  "Progression",
];

const QUALITY_BOXES = [
  { icon: ShieldCheck, label: "Quality Assured Training" },
  { icon: Users2, label: "Experienced Trainers & Assessors" },
  { icon: HeartHandshake, label: "Employer Partnership" },
  { icon: LifeBuoy, label: "Learner Support" },
];

const QUALITY_TAGS = ["Equality", "Diversity", "Safeguarding", "Reasonable Adjustments", "Data Protection"];

const CANDIDATE_PORTAL_ITEMS = [
  "My programme",
  "Learning resources",
  "Forms & declarations",
  "Upload evidence",
  "Assessment activity",
  "Progress reviews",
  "Action plans",
  "Qualification/unit progress",
  "Messages",
  "Results/certificates",
];

export default async function ApprenticeshipsSVQPage() {
  const pathways = await getApprenticeshipPathways(true);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-hero overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 pattern-bg pointer-events-none" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-brand/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-brand/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-brand via-red-brand to-orange-brand" />

        <div className="relative max-w-7xl mx-auto px-4">
          <span className="inline-block px-4 py-1.5 bg-orange-brand/20 border border-orange-brand/30 text-orange-brand text-xs font-bold uppercase tracking-widest rounded-full mb-4">
            Apprenticeships &amp; SVQ Pathways
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight max-w-3xl">
            Build Skills. Gain Qualifications. Grow Your Future.
          </h1>
          <p className="mt-4 text-lg md:text-xl text-blue-light/90 max-w-2xl leading-relaxed">
            Training Advantage Group is developing its Apprenticeship and work-based SVQ provision in Scotland,
            building on our experience in vocational, transport, logistics, plant, safety and professional training.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#for-learners" className="btn-primary">I&apos;m a Learner</a>
            <a href="#for-employers" className="btn-secondary">I&apos;m an Employer</a>
            <Link href={CONTACT_HREF} className="btn-secondary">Register Interest</Link>
          </div>
        </div>
      </section>

      {/* What is a Modern Apprenticeship */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="section-heading mb-4">What Is a Modern Apprenticeship?</h2>
            <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto mb-4">
              Modern Apprenticeships combine employment with structured learning and workplace assessment.
            </p>
            <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto mb-12">
              The apprentice is employed and earning while developing the knowledge, skills and competence required
              for their chosen occupation.
            </p>
          </AnimatedSection>
          <AnimatedSection direction="scale" delay={0.1}>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {JOURNEY_STEPS.map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <div className="bg-gray-light border border-gray-mid rounded-xl px-4 py-3">
                    <span className="text-navy font-bold text-sm">{step}</span>
                  </div>
                  {i < JOURNEY_STEPS.length - 1 && <ArrowRight size={16} className="text-orange-brand flex-shrink-0" />}
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* SVQ Qualifications */}
      <section className="py-20 bg-gray-light">
        <div className="max-w-6xl mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="section-heading mb-4">SVQ Qualifications</h2>
            <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Scottish Vocational Qualifications (SVQs) recognise occupational competence demonstrated in the workplace.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
            {SVQ_BOXES.map(({ icon: Icon, label }, i) => (
              <AnimatedSection key={label} delay={i * 0.06} direction="scale">
                <div className="bg-white rounded-2xl shadow-sm p-6 text-center h-full">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Icon size={22} className="text-blue-brand" />
                  </div>
                  <span className="text-navy font-bold text-sm">{label}</span>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection>
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <h3 className="text-navy font-bold text-sm uppercase tracking-wide mb-1">SCQF Levels</h3>
              <p className="text-gray-500 text-sm mb-6">
                SVQs sit at different levels on the Scottish Credit and Qualifications Framework — not every framework is the same level.
              </p>
              <div className="flex flex-wrap gap-3">
                {SCQF_LEVELS.map((l) => (
                  <div key={l.level} className="flex-1 min-w-[110px] bg-gray-light rounded-xl p-4 text-center">
                    <div className="text-2xl font-black text-orange-brand">{l.level}</div>
                    <div className="text-xs text-gray-500 font-semibold mt-1">SCQF Level</div>
                    <div className="text-xs text-navy font-bold mt-2">{l.label}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-4">
                Illustrative only — the exact SCQF level and qualification depend on the approved framework selected.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Planned / Developing Pathways */}
      <section id="pathways" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="section-heading mb-4">Planned &amp; Developing Pathways</h2>
            <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
              We&apos;re building Apprenticeship and SVQ provision across the sectors below. A pathway only becomes
              available once it is approved — until then, register your interest and we&apos;ll keep you updated.
            </p>
          </AnimatedSection>

          {pathways.length === 0 ? (
            <p className="text-center text-gray-400 text-sm">Pathway details coming soon.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {pathways.map((p, i) => (
                <AnimatedSection key={p.id} delay={i * 0.05} direction="scale">
                  <div className="bg-gray-light rounded-2xl p-6 h-full flex flex-col">
                    <div className="text-3xl mb-3">{p.icon}</div>
                    <h3 className="text-navy font-bold text-sm mb-2">{p.title}</h3>
                    {p.description && <p className="text-xs text-gray-500 mb-3 flex-1">{p.description}</p>}
                    {p.status === "live" ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full w-fit">
                        <BadgeCheck size={12} /> Available Now
                      </span>
                    ) : (
                      <span className="inline-block text-xs font-semibold text-amber-800 bg-amber-100 px-2.5 py-1.5 rounded-lg w-fit leading-snug">
                        Provision currently in development — register your interest
                      </span>
                    )}
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}

          <div className="text-center">
            <Link href={CONTACT_HREF} className="btn-primary">Explore Pathways</Link>
          </div>
        </div>
      </section>

      {/* For Learners */}
      <section id="for-learners" className="py-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 pattern-bg opacity-10 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <AnimatedSection>
            <span className="inline-block px-4 py-1.5 bg-orange-brand/20 border border-orange-brand/30 text-orange-brand text-xs font-bold uppercase tracking-widest rounded-full mb-4">
              For Learners
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-8">Earn. Learn. Achieve.</h2>
            <div className="grid sm:grid-cols-2 gap-3 text-left max-w-xl mx-auto mb-8">
              {LEARNER_POINTS.map((point) => (
                <div key={point} className="flex items-start gap-2.5 bg-white/5 rounded-xl px-4 py-3">
                  <BadgeCheck size={16} className="text-orange-brand flex-shrink-0 mt-0.5" />
                  <span className="text-blue-100 text-sm">{point}</span>
                </div>
              ))}
            </div>
            <Link href={CONTACT_HREF} className="btn-primary">Register Your Interest</Link>
          </AnimatedSection>
        </div>
      </section>

      {/* For Employers */}
      <section id="for-employers" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <AnimatedSection>
            <span className="tag bg-blue-50 text-blue-brand mb-4 inline-block">For Employers</span>
            <h2 className="section-heading mb-4">Develop Your Workforce</h2>
            <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto mb-10">
              Training Advantage Group can work with employers to identify suitable work-based training and
              qualification pathways for new and existing employees.
            </p>
          </AnimatedSection>
          <AnimatedSection direction="scale" delay={0.1}>
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
              {EMPLOYER_STEPS.map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <div className="bg-gray-light border border-gray-mid rounded-xl px-4 py-3">
                    <span className="text-navy font-bold text-sm">{step}</span>
                  </div>
                  {i < EMPLOYER_STEPS.length - 1 && <ArrowRight size={16} className="text-orange-brand flex-shrink-0" />}
                </div>
              ))}
            </div>
          </AnimatedSection>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href={CONTACT_HREF} className="btn-primary">Employer Enquiry</Link>
            <Link href={CONTACT_HREF} className="btn-outline">Discuss Your Workforce</Link>
          </div>
        </div>
      </section>

      {/* Apprentice Journey */}
      <section className="py-20 bg-gray-light">
        <div className="max-w-4xl mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="section-heading">Apprentice Journey</h2>
          </AnimatedSection>
          <div className="space-y-3">
            {APPRENTICE_JOURNEY.map((step, i) => (
              <AnimatedSection key={step} delay={i * 0.04} direction="left">
                <div className="flex items-center gap-4 bg-white rounded-2xl shadow-sm p-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-sm text-white ${i % 2 === 0 ? "bg-navy" : "bg-orange-brand"}`}>
                    {i + 1}
                  </div>
                  <span className="text-navy font-semibold text-sm">{step}</span>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Funding */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <AnimatedSection>
            <Scale size={32} className="text-orange-brand mx-auto mb-4" />
            <h2 className="section-heading mb-4">Scottish Apprenticeship Funding</h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              Funding and support depend on the approved framework, qualification, the apprentice&apos;s circumstances,
              and current Skills Development Scotland arrangements. Get in touch and we&apos;ll talk you through what
              applies to your situation.
            </p>
            <Link href={CONTACT_HREF} className="btn-primary">Ask About Funding</Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Quality & Support */}
      <section className="py-20 bg-gray-light">
        <div className="max-w-6xl mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="section-heading">Quality &amp; Support</h2>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {QUALITY_BOXES.map(({ icon: Icon, label }, i) => (
              <AnimatedSection key={label} delay={i * 0.06} direction="scale">
                <div className="bg-white rounded-2xl shadow-sm p-6 text-center h-full">
                  <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Icon size={22} className="text-orange-brand" />
                  </div>
                  <span className="text-navy font-bold text-sm">{label}</span>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection className="flex flex-wrap justify-center gap-2">
            {QUALITY_TAGS.map((t) => (
              <span key={t} className="tag bg-white text-gray-600 border border-gray-mid">{t}</span>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* Candidate Portal teaser */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <AnimatedSection>
            <div className="bg-navy rounded-2xl p-8 md:p-10 relative overflow-hidden">
              <div className="absolute inset-0 pattern-bg opacity-10 pointer-events-none" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 bg-orange-brand rounded-xl flex items-center justify-center flex-shrink-0">
                    <GraduationCap size={20} className="text-white" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-white">My Apprenticeship / SVQ — In Your Secure Portal</h2>
                </div>
                <p className="text-blue-100/80 text-sm leading-relaxed mb-6 max-w-2xl">
                  Existing TAG portal users will be able to track their programme, submit forms and evidence, and see
                  their progress — all from the same secure portal used for other TAG documents. This appears
                  automatically once an apprenticeship or SVQ programme has been allocated to your TAG ID.
                </p>
                <div className="grid sm:grid-cols-2 gap-2 mb-6">
                  {CANDIDATE_PORTAL_ITEMS.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-blue-100/70 text-xs">
                      <span className="w-1 h-1 rounded-full bg-orange-brand flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
                <Link href="/portal/login" className="btn-secondary">Go to Secure Portal</Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-brand via-red-brand to-orange-brand" />
        <div className="absolute inset-0 pattern-bg opacity-20 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <AnimatedSection>
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-orange-brand/20 text-orange-brand text-xs font-bold uppercase tracking-widest rounded-full mb-5">
              <Sparkles size={12} /> Ready To Take the Next Step?
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-5">
              Whether you&apos;re an individual or an employer, let&apos;s talk.
            </h2>
            <p className="text-blue-light/90 max-w-xl mx-auto mb-8">
              Whether you&apos;re an individual looking to develop your career or an employer planning your future
              workforce, speak to Training Advantage Group.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href={CONTACT_HREF} className="btn-primary">Register Interest</Link>
              <Link href={CONTACT_HREF} className="btn-secondary">Employer Enquiry</Link>
              <Link href="/contact" className="btn-secondary">Contact TAG</Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}

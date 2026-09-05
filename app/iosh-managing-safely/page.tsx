import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";
import CTASection from "@/components/home/CTASection";
import { CheckCircle2, Award, Clock, BookOpen, Shield, Users, Laptop, Star, AlertTriangle } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  alternates: { canonical: "/iosh-managing-safely" },
  title: "IOSH Managing Safely® Online Course | Training Advantage Group",
  description:
    "IOSH Approved Managing Safely® online training course, rated Outstanding by IOSH. 100% online, 190-day access. Ideal for supervisors, managers and team leaders. Enrol today.",
  keywords: [
    "IOSH Managing Safely",
    "IOSH Managing Safely online",
    "IOSH course Scotland",
    "Health and Safety Management course",
    "IOSH approved training",
    "Managing Safely certificate",
  ],
};

const HIGHLIGHTS = [
  { icon: Star, text: "Rated Outstanding by IOSH" },
  { icon: Users, text: "Ideal for Supervisors, Managers & Team Leaders" },
  { icon: Laptop, text: "100% Online: study at your own pace" },
  { icon: Shield, text: "Full support from IOSH-approved tutors" },
];

const INCLUDES = [
  "Highly engaging video-based e-learning",
  "No classroom attendance required: 100% online",
  "Unlimited access on an award-winning Learning Management System",
  "All IOSH Managing Safely® training materials included",
  "Most learners complete the course in 16–24 hours",
  "Dedicated tutor and technical support team",
  "Final examination and assignment completed online",
  "IOSH course registration fee and certificate fully included",
  "190-day access from the date of enrolment",
  "Immediate enrolment and course access",
  "No hidden costs",
  "Official IOSH Managing Safely® Digital Certificate on success",
];

const MODULES = [
  { num: 1, title: "Introduction", desc: "Overview of health and safety management, legal context, and management responsibilities." },
  { num: 2, title: "Assessing Risks", desc: "Understanding hazards and how to carry out effective risk assessments in the workplace." },
  { num: 3, title: "Controlling Risks", desc: "Hierarchy of controls, selecting and implementing appropriate control measures." },
  { num: 4, title: "Understanding Responsibilities", desc: "Legal duties, organisational responsibilities, and the role of managers and supervisors." },
  { num: 5, title: "Understanding Hazards", desc: "Common workplace hazards including physical, chemical, biological and ergonomic risks." },
  { num: 6, title: "Investigating Incidents", desc: "Incident reporting, root cause analysis, and learning from accidents to prevent recurrence." },
  { num: 7, title: "Measuring Performance", desc: "Monitoring and reviewing health and safety performance, proactive and reactive measures." },
];

const WHO_IS_IT_FOR = [
  "Supervisors and team leaders responsible for staff",
  "Managers at any level in any industry",
  "Business owners and directors",
  "Those transitioning into management roles",
  "HR and facilities professionals",
  "Anyone requiring a recognised health & safety qualification",
];

export default function IOSHManagingSafelyPage() {
  return (
    <>
      <PageHero
        title="IOSH Managing Safely®"
        subtitle="The internationally recognised health and safety qualification for managers and supervisors, rated Outstanding by IOSH and delivered 100% online."
        tag="Health & Safety"
        breadcrumbs={[{ label: "Health & Safety" }, { label: "IOSH Managing Safely®" }]}
        cta={{ label: "Enquire Now", href: "/contact?course=iosh-managing-safely" }}
      />

      {/* Key highlights */}
      <section className="py-10 bg-orange-brand">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
                <Icon size={20} className="text-white flex-shrink-0" />
                <span className="text-white font-semibold text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About the course */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-14 items-start">
          <AnimatedSection direction="left">
            <span className="tag bg-green-50 text-green-700 mb-4 inline-block">IOSH Approved</span>
            <h2 className="section-heading mb-4">What is IOSH Managing Safely®?</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our IOSH Approved Managing Safely® online training course is fully approved by IOSH and has been
              independently rated as <strong>&lsquo;Outstanding&rsquo;</strong>, the highest possible grade. This is a
              benchmark qualification for managers and supervisors in every industry.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Designed to equip managers with essential health and safety skills to promote safer workplaces, the course
              covers hazard identification, risk assessments, incident investigation, and adherence to safety regulations.
              Delivered entirely online with flexible, self-paced learning, perfect for professionals with busy schedules.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Upon completion, participants receive the internationally recognised <strong>IOSH Managing Safely® Digital
              Certificate</strong> issued directly by IOSH.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/contact?course=iosh-managing-safely" className="btn-primary">
                Enquire & Enrol
              </Link>
              <Link href="/booking?course=iosh-managing-safely" className="btn-outline">
                Book Now
              </Link>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="right">
            <div className="bg-gray-light rounded-2xl p-6">
              <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-green-600" />
                What&apos;s Included
              </h3>
              <ul className="space-y-2">
                {INCLUDES.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <CheckCircle2 size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Course modules */}
      <section className="py-20 bg-gray-light">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <span className="tag bg-blue-50 text-blue-brand mb-4">Course Content</span>
            <h2 className="section-heading">Course Modules</h2>
            <p className="section-subheading mx-auto mt-3">
              Seven comprehensive modules covering all essential aspects of health and safety management.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MODULES.map(({ num, title, desc }) => (
              <AnimatedSection key={num}>
                <div className="bg-white rounded-2xl p-5 shadow-sm h-full flex gap-4">
                  <div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                    {num}
                  </div>
                  <div>
                    <h3 className="font-bold text-navy mb-1.5 text-sm">{title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
            {/* Assessment card */}
            <AnimatedSection>
              <div className="bg-orange-brand rounded-2xl p-5 shadow-sm h-full flex gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                  <BookOpen size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1.5 text-sm">Online Assessment</h3>
                  <p className="text-xs text-orange-100 leading-relaxed">
                    30 online interactive questions + a work-based practical risk assessment task.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Assessment detail */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection direction="left">
            <span className="tag bg-amber-50 text-amber-700 mb-4 inline-block">Assessment & Certificate</span>
            <h2 className="section-heading mb-4">How You&apos;re Assessed</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              The IOSH Managing Safely® course is assessed in two parts, both completed conveniently online upon finishing
              the course modules.
            </p>

            <div className="space-y-4">
              <div className="bg-gray-light rounded-xl p-4 flex gap-4">
                <div className="w-9 h-9 bg-navy rounded-lg flex items-center justify-center text-white font-black text-sm flex-shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-navy text-sm mb-1">Multiple Choice Examination</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    30 online interactive questions designed to test knowledge and understanding of the course material.
                  </p>
                </div>
              </div>
              <div className="bg-gray-light rounded-xl p-4 flex gap-4">
                <div className="w-9 h-9 bg-orange-brand rounded-lg flex items-center justify-center text-white font-black text-sm flex-shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-navy text-sm mb-1">Practical Work-Based Assessment</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Conduct a real work-based risk assessment, demonstrating your ability to apply knowledge to actual
                    workplace situations.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-green-50 border border-green-200/70 rounded-xl p-4 flex gap-3">
              <Award size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-green-800 text-sm mb-0.5">Official IOSH Digital Certificate</p>
                <p className="text-xs text-green-700">
                  Successful candidates receive an official IOSH Managing Safely® Digital Certificate issued directly by
                  IOSH, the internationally recognised professional body for health and safety.
                </p>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="right">
            <div className="bg-navy rounded-2xl p-7 text-white">
              <h3 className="font-black text-xl mb-5">Course at a Glance</h3>
              <div className="space-y-4">
                {[
                  { icon: Clock, label: "Duration", value: "16–24 hours (self-paced)" },
                  { icon: Laptop, label: "Study Method", value: "100% Online" },
                  { icon: BookOpen, label: "Access Period", value: "190 days from enrolment" },
                  { icon: Users, label: "Suitable For", value: "Managers, supervisors, team leaders" },
                  { icon: Shield, label: "Accreditation", value: "IOSH Approved, rated Outstanding" },
                  { icon: Award, label: "Certificate", value: "IOSH Managing Safely® Digital" },
                  { icon: AlertTriangle, label: "Prerequisites", value: "No prior qualifications required" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon size={15} className="text-orange-brand" />
                    </div>
                    <div>
                      <div className="text-xs text-blue-200/60 font-semibold uppercase tracking-wide">{label}</div>
                      <div className="text-sm font-semibold text-white">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-7 pt-5 border-t border-white/10">
                <Link href="/contact?course=iosh-managing-safely" className="btn-primary w-full justify-center">
                  Enquire About This Course
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Who is it for */}
      <section className="py-16 bg-gray-light">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-10">
            <h2 className="section-heading">Who Is This Course For?</h2>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
            {WHO_IS_IT_FOR.map((item) => (
              <AnimatedSection key={item}>
                <div className="bg-white rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm">
                  <CheckCircle2 size={16} className="text-orange-brand flex-shrink-0" />
                  <span className="text-sm font-semibold text-navy">{item}</span>
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

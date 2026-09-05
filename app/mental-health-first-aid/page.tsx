import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";
import CTASection from "@/components/home/CTASection";
import { CheckCircle2, Award, Clock, Users, Shield, Heart, Brain } from "lucide-react";
import Link from "next/link";
import { getPageContent } from "@/lib/storage";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getPageContent("mental-health-first-aid");
  return {
    alternates: { canonical: "/mental-health-first-aid" },
    title: c.metaTitle || "Mental Health First Aid Training Scotland | Public Health Scotland & NLTC | Training Advantage Group",
    description: c.metaDescription || "Mental health first aid training for the workplace. Public Health Scotland accredited manager awareness sessions and NLTC Level 3 Award in Mental Health First Aid at Work RQF. Scotland.",
    keywords: ["Mental Health First Aid Scotland", "MHFA Scotland", "Mental Health Awareness Training", "Public Health Scotland Mental Health", "NLTC Mental Health First Aid", "Workplace Mental Health"],
  };
}

const COURSES = [
  {
    title: "Mental Health Awareness for Managers",
    qualification: "Mental Health Awareness Certificate",
    accreditation: "Public Health Scotland accredited",
    duration: "Half day or full day",
    icon: "🧠",
    audience: "Managers, supervisors & team leaders",
    desc: "Developed in partnership with Public Health Scotland, this course gives managers and supervisors the awareness and confidence to support mental health in the workplace. Practical, non-clinical and immediately applicable.",
    includes: [
      "Understanding mental health and common conditions",
      "Recognising signs of poor mental health in team members",
      "How to have a supportive conversation",
      "Signposting to professional support services",
      "Workplace stress, burnout and resilience",
      "Creating a mentally healthy team culture",
      "Manager self-care and boundaries",
      "Public Health Scotland accredited certificate",
    ],
    suitableFor: "All levels of management and supervision in any sector",
    validity: "No fixed expiry, CPD recognised",
    highlight: "Public Health Scotland accredited",
    highlightColor: "bg-blue-100 text-blue-800",
    cardColor: "bg-blue-50 border-blue-200",
    highlighted: true,
    courseId: "mh-managers",
  },
  {
    title: "NLTC Level 3 Award in Mental Health First Aid at Work",
    qualification: "NLTC Level 3 Award in Mental Health First Aid at Work RQF",
    accreditation: "NLTC accredited, RQF regulated",
    duration: "2 days",
    icon: "💚",
    audience: "Mental Health First Aiders",
    desc: "The nationally recognised Mental Health First Aid qualification. Qualifies you as a workplace Mental Health First Aider: the mental health equivalent of a physical first aider. NLTC accredited and on the Regulated Qualifications Framework.",
    includes: [
      "Mental health first aid action plan (ALGEE)",
      "Depression and anxiety in the workplace",
      "Self-harm and suicidal crisis management",
      "Psychosis and severe mental illness",
      "Substance use and dual diagnosis",
      "Personality disorders awareness",
      "Post-traumatic stress disorder (PTSD)",
      "NLTC Level 3 Award certificate on successful completion",
    ],
    suitableFor: "Designated mental health first aiders, HR, wellbeing leads, pastoral staff",
    validity: "3 years",
    highlight: "NLTC / RQF regulated",
    highlightColor: "bg-green-100 text-green-800",
    cardColor: "bg-green-50 border-green-200",
    highlighted: false,
    courseId: "mhfa-nltc",
  },
];

const WHY_MENTAL_HEALTH = [
  { stat: "1 in 4", label: "people in the UK experience a mental health problem each year" },
  { stat: "£57bn", label: "estimated annual cost to UK employers from poor mental health" },
  { stat: "12.7%", label: "of all sick days in the UK are attributed to mental health conditions" },
  { stat: "300k", label: "people with a long-term mental health problem lose their jobs each year" },
];

export default async function MentalHealthFirstAidPage() {
  const c = await getPageContent("mental-health-first-aid");

  return (
    <>
      <PageHero
        title={c.heroTitle || "Mental Health First Aid Training"}
        subtitle={c.heroSubtitle || "Public Health Scotland accredited manager awareness training and the nationally recognised NLTC Level 3 Mental Health First Aid at Work qualification, for a mentally healthy workplace."}
        tag="Mental Health"
        breadcrumbs={[{ label: "Health & Safety", href: "/iosh-managing-safely" }, { label: "Mental Health First Aid" }]}
        cta={{ label: "Enquire About Mental Health Training", href: "/contact?course=mental-health" }}
      />

      {/* Stats banner */}
      <section className="py-10 bg-navy">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {WHY_MENTAL_HEALTH.map(({ stat, label }) => (
              <div key={stat} className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-3xl font-black text-orange-brand mb-1">{stat}</div>
                <div className="text-xs text-blue-200/80 leading-relaxed">{label}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-blue-200/50 text-center mt-4">Sources: Mind, Deloitte, Health Foundation</p>
        </div>
      </section>

      {/* Accreditation badges */}
      <section className="py-8 bg-gray-light border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: Shield, text: "Public Health Scotland Accredited", color: "text-blue-brand" },
              { icon: Award, text: "NLTC Level 3 Award", color: "text-orange-brand" },
              { icon: Award, text: "RQF Regulated Qualification", color: "text-green-600" },
              { icon: Users, text: "In-House Delivery Available", color: "text-purple-600" },
            ].map(({ icon: Icon, text, color }) => (
              <div key={text} className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-100 text-sm font-semibold text-gray-700">
                <Icon size={15} className={color} />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <AnimatedSection className="text-center mb-14">
            <h2 className="section-heading">Our Mental Health Courses</h2>
            <p className="section-subheading mx-auto mt-3">
              From awareness training for managers to the full Mental Health First Aider qualification, we have the right course for your organisation.
            </p>
          </AnimatedSection>

          <div className="grid lg:grid-cols-2 gap-8">
            {COURSES.map(({ title, qualification, accreditation, duration, icon, audience, desc, includes, suitableFor, validity, highlight, highlightColor, cardColor, highlighted, courseId }) => (
              <AnimatedSection key={courseId}>
                <div className={`rounded-2xl border-2 overflow-hidden h-full flex flex-col ${highlighted ? "ring-2 ring-orange-brand shadow-xl" : "shadow-sm"} ${cardColor}`}>
                  {highlighted && (
                    <div className="bg-orange-brand text-white text-center text-xs font-bold py-2 uppercase tracking-wider">
                      Recommended for Managers
                    </div>
                  )}
                  <div className="bg-navy p-6 text-white">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-3xl mb-3">{icon}</div>
                        <h3 className="font-black text-xl leading-tight">{title}</h3>
                        <p className="text-blue-200/60 text-xs mt-1.5">{qualification}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold whitespace-nowrap ${highlightColor}`}>
                          {highlight}
                        </span>
                        <span className="text-xs text-blue-200/60 flex items-center gap-1">
                          <Clock size={11} /> {duration}
                        </span>
                        <span className="text-xs text-blue-200/60 flex items-center gap-1">
                          <Users size={11} /> {audience}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white flex-1 flex flex-col">
                    <p className="text-sm text-gray-600 mb-5 leading-relaxed">{desc}</p>

                    <h4 className="font-bold text-navy text-xs uppercase tracking-wide mb-3">What&apos;s covered</h4>
                    <ul className="space-y-2 mb-6 flex-1">
                      {includes.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                          <Heart size={13} className="text-pink-500 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div className="border-t border-gray-100 pt-4 mb-5">
                      <div className="grid grid-cols-2 gap-3 text-center">
                        <div>
                          <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Certificate Validity</div>
                          <div className="text-sm font-bold text-navy">{validity}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Accreditation</div>
                          <div className="text-sm font-bold text-navy">{accreditation.split(", ")[0]}</div>
                        </div>
                      </div>
                      <div className="mt-3 bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Suitable for</div>
                        <div className="text-xs font-semibold text-gray-700">{suitableFor}</div>
                      </div>
                    </div>

                    <Link
                      href={`/contact?course=${courseId}`}
                      className={`text-center py-3 rounded-xl font-semibold text-sm transition-all ${highlighted ? "bg-orange-brand text-white hover:bg-orange-600 shadow-md" : "bg-navy text-white hover:bg-navy-light"}`}
                    >
                      Enquire About This Course
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Why it matters */}
      <section className="py-16 bg-gray-light">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-start">
          <AnimatedSection direction="left">
            <span className="tag bg-purple-50 text-purple-700 mb-4 inline-block">Why It Matters</span>
            <h2 className="section-heading mb-4">Mental Health in the Workplace</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Mental health problems are the leading cause of workplace absence in the UK. Having trained managers and designated Mental Health First Aiders creates a psychologically safe environment where people feel able to seek support early.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Our training equips your team with the knowledge, skills and confidence to recognise the signs of poor mental health, have supportive conversations, and point colleagues towards appropriate help before a crisis develops.
            </p>
            <div className="space-y-3">
              {[
                "Reduces absenteeism and presenteeism",
                "Improves employee retention and engagement",
                "Demonstrates your duty of care as an employer",
                "Creates a culture of openness around mental health",
                "Legally compliant with HSE guidance on workplace wellbeing",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 bg-white rounded-xl px-4 py-2.5 shadow-sm">
                  <Brain size={16} className="text-purple-600 flex-shrink-0" />
                  <span className="text-sm font-semibold text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection direction="right">
            <div className="bg-navy rounded-2xl p-7 text-white">
              <h3 className="font-black text-lg mb-2">Public Health Scotland Accredited</h3>
              <p className="text-blue-200/80 text-sm leading-relaxed mb-5">
                Our Mental Health Awareness for Managers course is formally accredited by Public Health Scotland: a mark of quality and evidence-based content you can trust.
              </p>
              <div className="space-y-3 mb-6">
                {[
                  { label: "Who delivers it?", value: "TAG trained facilitators, experienced in workplace wellbeing" },
                  { label: "Group size?", value: "Up to 16 delegates per session" },
                  { label: "Where?", value: "At your premises (recommended) or our training centres" },
                  { label: "CPD recognised?", value: "Yes, counts towards CPD hours" },
                  { label: "Sector?", value: "Suitable for all industries" },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white/10 rounded-xl p-3">
                    <div className="text-xs text-blue-200/60 mb-0.5">{label}</div>
                    <div className="text-sm font-semibold text-white">{value}</div>
                  </div>
                ))}
              </div>
              <Link href="/contact?course=mh-managers" className="btn-primary w-full justify-center">
                Book Manager Awareness Training
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <CTASection />
    </>
  );
}

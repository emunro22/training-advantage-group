export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";
import CourseProductTable from "@/components/ui/CourseProductTable";
import CTASection from "@/components/home/CTASection";
import { CheckCircle2, Award, Clock, Users, Shield, BookOpen } from "lucide-react";
import Link from "next/link";
import { getPageContent } from "@/lib/storage";
import { getPublishedProductsByCategory } from "@/lib/products-public";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getPageContent("first-aid");
  return {
    alternates: { canonical: "/first-aid" },
    title: c.metaTitle || "First Aid Training Scotland | EFAW, FAW & Paediatric | Training Advantage Group",
    description: c.metaDescription || "Accredited first aid training in Scotland. Emergency First Aid at Work, First Aid at Work, Paediatric First Aid. NLTC Level 3 OFQUAL regulated qualifications. On-site or at our centres.",
    keywords: ["First Aid Training Scotland", "Emergency First Aid at Work", "EFAW Scotland", "FAW Scotland", "Paediatric First Aid", "NLTC First Aid", "OFQUAL First Aid"],
  };
}

const COURSES = [
  {
    title: "Emergency First Aid at Work (EFAW)",
    qualification: "NLTC Level 3 Award in Emergency First Aid at Work",
    regulation: "OFQUAL regulated",
    duration: "1 day",
    icon: "🚑",
    desc: "The most widely held first aid at work qualification. Covers core emergency response skills including CPR, choking, bleeding and shock. Ideal for lower-risk workplaces.",
    includes: [
      "Assessing an incident & managing a casualty",
      "CPR and use of an AED",
      "Choking (adults, children, infants)",
      "Severe bleeding and wound management",
      "Shock and unconsciousness",
      "Burns, fractures and minor injuries",
      "NLTC Level 3 Award certificate on pass",
    ],
    suitableFor: "All industries — particularly lower-risk workplaces",
    validity: "3 years",
    accreditation: "NLTC / OFQUAL",
    courseId: "efaw",
    color: "bg-red-50 border-red-200",
    tagColor: "bg-red-100 text-red-800",
    highlighted: true,
  },
  {
    title: "First Aid at Work (FAW) — Initial",
    qualification: "NLTC Level 3 Award in First Aid at Work",
    regulation: "OFQUAL regulated",
    duration: "3 days",
    icon: "🏥",
    desc: "The full First Aid at Work qualification. Comprehensive training for workplace first aiders in higher-risk environments. Covers all EFAW content plus advanced casualty management.",
    includes: [
      "All EFAW content (CPR, AED, choking, bleeding)",
      "Head, neck and spinal injuries",
      "Chest injuries and breathing difficulties",
      "Eye injuries and poisoning",
      "Anaphylaxis and allergic reactions",
      "Multiple casualty management",
      "NLTC Level 3 Award certificate on pass",
    ],
    suitableFor: "Higher-risk workplaces, construction, manufacturing, warehousing",
    validity: "3 years",
    accreditation: "NLTC / OFQUAL",
    courseId: "faw-initial",
    color: "bg-blue-50 border-blue-200",
    tagColor: "bg-blue-100 text-blue-800",
    highlighted: false,
  },
  {
    title: "First Aid at Work (FAW) — Refresher",
    qualification: "FAW Renewal",
    regulation: "OFQUAL regulated",
    duration: "2 days",
    icon: "🔄",
    desc: "For qualified first aiders renewing their First Aid at Work certificate before it expires. Refreshes and updates skills to maintain your FAW qualification.",
    includes: [
      "Refreshed CPR and AED skills",
      "Updated best practice guidelines",
      "Scenario-based practical exercises",
      "Advanced casualty management revision",
      "Certificate renewal on successful completion",
    ],
    suitableFor: "Existing FAW certificate holders — must renew before certificate expires",
    validity: "3 years (renewed)",
    accreditation: "NLTC / OFQUAL",
    courseId: "faw-refresher",
    color: "bg-purple-50 border-purple-200",
    tagColor: "bg-purple-100 text-purple-800",
    highlighted: false,
  },
  {
    title: "Paediatric First Aid",
    qualification: "Paediatric First Aid Certificate",
    regulation: "In-house accredited",
    duration: "1–2 days",
    icon: "👶",
    desc: "Specialist first aid training for those working with children and infants. Essential for childcare settings, early years, schools and anyone looking after young people.",
    includes: [
      "CPR for infants, toddlers and children",
      "Choking management in young children",
      "Febrile convulsions and seizures",
      "Head injuries and meningitis awareness",
      "Allergic reactions and anaphylaxis",
      "Burns, fractures and bleeding in children",
      "Paediatric First Aid certificate on pass",
    ],
    suitableFor: "Nurseries, childminders, schools, sports coaches, youth workers",
    validity: "3 years",
    accreditation: "Training Advantage Group",
    courseId: "paediatric-fa",
    color: "bg-pink-50 border-pink-200",
    tagColor: "bg-pink-100 text-pink-800",
    highlighted: false,
  },
];

export default async function FirstAidPage() {
  const c = await getPageContent("first-aid");
  const approvedProducts = await getPublishedProductsByCategory("First Aid");

  return (
    <>
      <PageHero
        title={c.heroTitle || "First Aid Training"}
        subtitle={c.heroSubtitle || "Accredited first aid courses for the workplace — from Emergency First Aid at Work to the full First Aid at Work qualification. NLTC Level 3 OFQUAL regulated."}
        tag="First Aid"
        breadcrumbs={[{ label: "Health & Safety", href: "/iosh-managing-safely" }, { label: "First Aid" }]}
        cta={{ label: "Enquire About First Aid", href: "/contact?course=first-aid" }}
      />

      {/* Accreditation banner */}
      <section className="py-8 bg-green-600">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 text-white text-sm font-semibold">
            {[
              { icon: Award, text: "NLTC Level 3 OFQUAL regulated qualifications" },
              { icon: Shield, text: "In-house delivery at your premises" },
              { icon: Users, text: "All industries & sectors" },
              { icon: Clock, text: "Certificates valid 3 years" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 bg-white/15 rounded-full px-4 py-2">
                <Icon size={16} className="flex-shrink-0" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-14">
            <h2 className="section-heading">Our First Aid Courses</h2>
            <p className="section-subheading mx-auto mt-3">
              All courses available at our training centres or delivered on-site at your premises. Group bookings available.
            </p>
          </AnimatedSection>

          <div className="grid lg:grid-cols-2 gap-6">
            {COURSES.map(({ title, qualification, regulation, duration, icon, desc, includes, suitableFor, validity, accreditation, courseId, color, tagColor, highlighted }) => (
              <AnimatedSection key={courseId}>
                <div className={`rounded-2xl border-2 overflow-hidden h-full flex flex-col ${highlighted ? "ring-2 ring-orange-brand" : ""} ${color}`}>
                  {highlighted && (
                    <div className="bg-orange-brand text-white text-center text-xs font-bold py-2 uppercase tracking-wider">
                      Most Common
                    </div>
                  )}
                  <div className="bg-navy p-5 text-white">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-2xl mb-2">{icon}</div>
                        <h3 className="font-black text-lg">{title}</h3>
                        <p className="text-blue-200/70 text-xs mt-1">{qualification}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${tagColor}`}>{regulation}</span>
                        <span className="text-xs text-blue-200/70 flex items-center gap-1">
                          <Clock size={11} /> {duration}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-white flex-1 flex flex-col">
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">{desc}</p>

                    <h4 className="font-bold text-navy text-xs uppercase tracking-wide mb-2.5">What&apos;s covered</h4>
                    <ul className="space-y-1.5 mb-5 flex-1">
                      {includes.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle2 size={13} className="text-green-600 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div className="border-t border-gray-100 pt-4 mb-4">
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                          <div className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Validity</div>
                          <div className="text-xs font-bold text-navy">{validity}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Accredited</div>
                          <div className="text-xs font-bold text-navy">{accreditation}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Suitable for</div>
                          <div className="text-xs font-bold text-navy leading-tight">{suitableFor.split(",")[0]}</div>
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/contact?course=${courseId}`}
                      className={`text-center py-2.5 rounded-lg font-semibold text-sm transition-all ${highlighted ? "bg-orange-brand text-white hover:bg-orange-600" : "bg-navy text-white hover:bg-navy-light"}`}
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

      {/* On-site delivery */}
      <section className="py-16 bg-gray-light">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection direction="left">
            <span className="tag bg-green-50 text-green-700 mb-4 inline-block">On-Site Delivery</span>
            <h2 className="section-heading mb-4">Training at Your Workplace</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              All our first aid courses can be delivered on-site at your premises. This is often the most cost-effective option for groups — we bring all the equipment and materials to you.
            </p>
            <ul className="space-y-2 mb-6">
              {[
                "No travel time or cost for your team",
                "Training tailored to your specific workplace hazards",
                "Flexible scheduling — mornings, evenings, weekends",
                "Group bookings from 4+ delegates",
                "All equipment and manikins provided",
                "Certificates issued on the day",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 size={14} className="text-green-600 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/contact?subject=first-aid-onsite" className="btn-navy">
              Get a Group Booking Quote
            </Link>
          </AnimatedSection>

          <AnimatedSection direction="right">
            <div className="bg-navy rounded-2xl p-7 text-white">
              <h3 className="font-black text-lg mb-5">Which course is right for you?</h3>
              <div className="space-y-4">
                {[
                  { q: "Low-risk office / retail environment", a: "Emergency First Aid at Work (EFAW) — 1 day" },
                  { q: "Higher-risk workplace (construction, warehousing)", a: "First Aid at Work (FAW) — 3 days" },
                  { q: "Your current FAW certificate is expiring", a: "First Aid at Work Refresher — 2 days" },
                  { q: "Working with children / childcare setting", a: "Paediatric First Aid — 1–2 days" },
                ].map(({ q, a }) => (
                  <div key={q} className="bg-white/10 rounded-xl p-4">
                    <div className="text-xs text-blue-200/70 mb-1">If you&apos;re in a...</div>
                    <div className="text-sm font-semibold text-white mb-1">{q}</div>
                    <div className="text-xs text-orange-brand font-bold">→ {a}</div>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-white/10">
                <Link href="/contact?subject=first-aid-advice" className="btn-primary w-full justify-center text-sm">
                  Ask Us Which Course You Need
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* NLTC / OFQUAL info */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <AnimatedSection>
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 flex gap-4">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <BookOpen size={22} className="text-white" />
              </div>
              <div>
                <h3 className="font-black text-navy mb-1">NLTC Level 3 OFQUAL Regulated Qualifications</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Our Emergency First Aid at Work and First Aid at Work courses award the{" "}
                  <strong>NLTC Level 3 Award</strong>, which is regulated by{" "}
                  <strong>Ofqual</strong> (Office of Qualifications and Examinations Regulation) and listed on the{" "}
                  Regulated Qualifications Framework (RQF). These qualifications are widely recognised and legally
                  compliant with the Health and Safety (First Aid) Regulations 1981.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {approvedProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <AnimatedSection className="text-center mb-8">
              <h2 className="section-heading">TAG-Approved Website Pricing</h2>
              <p className="section-subheading mx-auto text-center mt-3">
                Director-approved products from the current TAG Master Pricing catalogue.
              </p>
            </AnimatedSection>
            <CourseProductTable products={approvedProducts} />
          </div>
        </section>
      )}

      <CTASection />
    </>
  );
}

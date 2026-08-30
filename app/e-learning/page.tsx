import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";
import CTASection from "@/components/home/CTASection";
import { Monitor, CheckCircle2, Users2, Award, Clock, ExternalLink } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  alternates: { canonical: "/e-learning" },
  title: "E-Learning Academy | Online Training Courses Scotland | TAG",
  description:
    "200+ CPD certified online courses covering health & safety, business skills, health & social care, mental health and hospitality. Instant access. From £15.",
};

const CATEGORIES = [
  {
    id: "health-safety",
    title: "Health & Safety",
    count: 81,
    color: "bg-blue-50 border-blue-200 text-blue-800",
    iconColor: "text-blue-brand",
    courses: ["Working at Height", "COSHH", "Fire Safety", "Manual Handling", "PPE", "Risk Assessment", "Abrasive Wheels", "Display Screen Equipment"],
    priceFrom: "£15",
  },
  {
    id: "business",
    title: "Business Skills",
    count: 54,
    color: "bg-navy/5 border-navy/20 text-navy",
    iconColor: "text-navy",
    courses: ["Leadership", "Customer Service", "Communication Skills", "Equality & Diversity", "GDPR", "HR Essentials", "Time Management", "Conflict Resolution"],
    priceFrom: "£15",
  },
  {
    id: "social-care",
    title: "Health & Social Care",
    count: 40,
    color: "bg-green-50 border-green-200 text-green-800",
    iconColor: "text-green-700",
    courses: ["Safeguarding", "Infection Prevention", "Medication Awareness", "Dementia Awareness", "Duty of Care", "Care Certificate", "Mental Capacity", "Moving & Handling"],
    priceFrom: "£15",
  },
  {
    id: "mental-health",
    title: "Mental Health & Wellbeing",
    count: 12,
    color: "bg-purple-50 border-purple-200 text-purple-800",
    iconColor: "text-purple-600",
    courses: ["Stress Management", "Mental Health Awareness", "Suicide Awareness", "Anxiety Awareness", "Depression Awareness", "Workplace Wellbeing"],
    priceFrom: "£15",
  },
  {
    id: "hospitality",
    title: "Hospitality",
    count: 21,
    color: "bg-orange-50 border-orange-200 text-orange-800",
    iconColor: "text-orange-brand",
    courses: ["Food Safety", "Allergen Awareness", "Licensing", "Customer Service", "Kitchen Safety", "Hospitality Health & Safety"],
    priceFrom: "£15",
  },
];

export default function ELearningPage() {
  return (
    <>
      <PageHero
        title="TAG Digital Learning Academy"
        subtitle="Access 200+ CPD certified online courses covering health & safety, business skills, social care and hospitality. Instant access, flexible learning."
        tag="E-Learning Academy"
        breadcrumbs={[{ label: "E-Learning Academy" }]}
        cta={{ label: "Browse Courses", href: "#categories" }}
      />

      {/* Platform access banner */}
      <section className="bg-navy py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-bold text-lg">Ready to start learning?</p>
            <p className="text-blue-light/80 text-sm">Log in or register on the TAG e-learning platform to access your courses.</p>
          </div>
          <a
            href="https://videotilehost.com/trainingadvantagegroup/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-orange-brand hover:bg-orange-dark text-white font-bold px-6 py-3 rounded-lg transition-colors whitespace-nowrap shadow-lg"
          >
            Access E-Learning Platform
            <ExternalLink size={16} />
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Monitor, title: "200+ Online Courses", desc: "Covering 5 key learning categories" },
              { icon: Award, title: "CPD Certified", desc: "Recognised certificates on completion" },
              { icon: Clock, title: "Instant Access", desc: "Start learning immediately after purchase" },
              { icon: Users2, title: "Business Packages", desc: "Multi-user accounts for teams" },
            ].map(({ icon: Icon, title, desc }) => (
              <AnimatedSection key={title}>
                <div className="text-center p-5">
                  <div className="w-12 h-12 rounded-2xl bg-navy/10 flex items-center justify-center mx-auto mb-3">
                    <Icon size={22} className="text-navy" />
                  </div>
                  <h3 className="font-bold text-navy mb-1">{title}</h3>
                  <p className="text-sm text-gray-600">{desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-20 bg-gray-light">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-14">
            <h2 className="section-heading">Browse Course Categories</h2>
            <p className="section-subheading mx-auto text-center mt-3">
              All courses are CPD certified and can be completed at your own pace, on any device.
            </p>
          </AnimatedSection>

          <div className="space-y-6">
            {CATEGORIES.map((cat, i) => (
              <AnimatedSection key={cat.id} delay={i * 0.05}>
                <div className={`rounded-2xl border p-6 ${cat.color} hover:shadow-md transition-shadow`} id={cat.id}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-black text-xl">{cat.title}</h3>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/70">
                          {cat.count} courses
                        </span>
                      </div>
                      <p className="text-sm opacity-80">From {cat.priceFrom} per course</p>
                    </div>
                    <a
                      href="https://videotilehost.com/trainingadvantagegroup/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-navy flex-shrink-0 text-sm flex items-center gap-1.5"
                    >
                      View Courses
                      <ExternalLink size={13} />
                    </a>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {cat.courses.map((course) => (
                      <span key={course} className="text-xs px-3 py-1.5 bg-white/60 rounded-full font-medium">
                        {course}
                      </span>
                    ))}
                    <span className="text-xs px-3 py-1.5 bg-white/60 rounded-full font-medium opacity-60">
                      + more
                    </span>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Business packages */}
      <section id="business-packages" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection direction="left">
            <span className="tag bg-navy/10 text-navy mb-4">For Businesses</span>
            <h2 className="section-heading mb-4">Corporate E-Learning Packages</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Save money and simplify compliance management with our business learning packages. Set up a multi-user account and manage your entire team&apos;s training from one dashboard.
            </p>
            <ul className="space-y-2 mb-8">
              {[
                "Volume pricing for 5+ users",
                "Single dashboard for all staff",
                "Progress tracking and reporting",
                "Compliance certificate management",
                "Renewal reminders",
                "Dedicated account manager",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 size={16} className="text-blue-brand flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/contact" className="btn-primary">Get a Business Quote</Link>
          </AnimatedSection>

          <AnimatedSection direction="right">
            <div className="bg-navy rounded-2xl p-6 text-white">
              <h3 className="font-bold text-xl mb-4">Free Trial Available</h3>
              <p className="text-blue-light/80 text-sm leading-relaxed mb-6">
                Not sure if our e-learning platform is right for you? Try a free course before committing. No credit card required.
              </p>
              <ul className="space-y-2 mb-6">
                {["Access to a free sample course", "See the platform interface", "Test on any device", "No commitment required"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-white/80">
                    <CheckCircle2 size={14} className="text-orange-brand" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/contact?subject=free-trial" className="w-full flex items-center justify-center py-3 bg-orange-brand rounded-lg font-bold hover:bg-orange-dark transition-colors">
                Start Free Trial
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <CTASection />
    </>
  );
}

import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import ServiceCards from "@/components/home/ServiceCards";
import StatsSection from "@/components/home/StatsSection";
import LocationsSection from "@/components/home/LocationsSection";
import GoogleReviewsSection from "@/components/home/GoogleReviewsSection";
import CTASection from "@/components/home/CTASection";
import WhyChooseSection from "@/components/home/WhyChooseSection";
import UpcomingCoursesSection from "@/components/home/UpcomingCoursesSection";
import AnimatedSection from "@/components/ui/AnimatedSection";
import StructuredData from "@/components/seo/StructuredData";
import { buildFAQSchema } from "@/lib/schema";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const FAQS = [
  {
    q: "What training does Training Advantage Group provide?",
    a: "We deliver HGV and PCV driver training, Driver CPC and Transport Manager CPC, ADR/dangerous goods training, plant and forklift training, IOSH courses, first aid, and a range of transport compliance and consultancy services across Scotland.",
  },
  {
    q: "How do I book a course?",
    a: "You can view live availability and book directly on our Upcoming Courses page, or contact our office and a member of the team will confirm dates, pricing and delegate numbers with you.",
  },
  {
    q: "How do I check if a certificate is genuine?",
    a: "Use our free Certificate Checker: enter the certificate number (and optionally the holder's last name) to instantly verify status, course and issue details against our official registry.",
  },
  {
    q: "Do you deliver training on-site or at your own centres?",
    a: "Both. We run courses at our training centres and can also deliver on-site at your premises for group bookings, depending on the course and equipment required.",
  },
  {
    q: "How quickly are certificates issued after a course?",
    a: "Certificates are issued automatically once a course is marked complete. If you need an electronic copy or a replacement, you can request one from the Certificate Checker page.",
  },
];

export default async function HomePage() {
  return (
    <>
      <StructuredData data={buildFAQSchema(FAQS)} />
      <HeroSection />
      <ServiceCards />
      <UpcomingCoursesSection />
      <StatsSection />
      <GoogleReviewsSection />
      <WhyChooseSection />
      <LocationsSection />

      {/* FAQs */}
      <section className="py-20 bg-gray-light">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-navy">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <AnimatedSection key={faq.q} delay={i * 0.05}>
                <details className="group bg-white rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-navy hover:bg-gray-light transition-colors">
                    {faq.q}
                    <span className="text-xl text-orange-brand group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed">{faq.a}</div>
                </details>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}

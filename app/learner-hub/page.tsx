import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { CheckCircle2, Download, HelpCircle, FileText, MapPin, Bed, Award, Phone } from "lucide-react";
import Link from "next/link";
import StructuredData from "@/components/seo/StructuredData";
import { buildFAQSchema } from "@/lib/schema";

export const metadata: Metadata = {
  alternates: { canonical: "/learner-hub" },
  title: "Learner Hub | Information & Support | Training Advantage Group",
  description:
    "Everything learners need before, during and after training with TAG. Joining instructions, FAQs, downloads, directions and support information.",
};

const FAQS = [
  { q: "What should I bring to my training?", a: "Photographic ID (passport or driving licence), proof of address (dated within 3 months), National Insurance number, PPE if applicable (safety boots, high vis, gloves), and comfortable clothing suitable for training. A pen and notebook are optional but useful." },
  { q: "What time should I arrive?", a: "Please arrive at least 15 minutes before your course start time. For Bothwell HQ, candidates must use the shuttle service from St Bride's Church — allow an extra 20 minutes." },
  { q: "What happens if I'm late or can't attend?", a: "If you're running late, please call us immediately on 0141 258 2024. If you need to cancel or rearrange, please give us as much notice as possible. Cancellation policies vary by course — please see your booking confirmation." },
  { q: "How do I check how many CPC hours I have?", a: "You can check your Driver Qualification Card hours on the DVSA website using your driver number. Our team can also help if you need guidance." },
  { q: "Are there refreshments available?", a: "Refreshments (tea, coffee, water) are provided throughout the day on full-day courses. For half-day sessions, vending machines are available. Bothwell HQ has a break area." },
  { q: "Is parking available?", a: "Visitors are welcome to park on site at Bothwell HQ. Candidates must use the free shuttle service from St Bride's Church, Fallside Road during peak times. Our other centres have parking available nearby." },
  { q: "Can I get funding for my training?", a: "Funding may be available through Skills Development Scotland (SDS), your employer, or sector-specific schemes. Contact us to discuss your situation and we'll help identify any available support." },
  { q: "How do I receive my certificate?", a: "Certificates are issued on the day of training where possible, or sent by email within 3–5 working days. Driver CPC hours are uploaded to DVSA within 3 working days of course completion." },
];

export default function LearnerHubPage() {
  return (
    <>
      <StructuredData data={buildFAQSchema(FAQS)} />
      <PageHero
        title="Learner Information & Support Centre"
        subtitle="Everything you need before, during and after your training with Training Advantage Group."
        tag="Learner Hub"
        breadcrumbs={[{ label: "Learner Hub" }]}
      />

      {/* Quick links */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { icon: FileText, label: "Joining Instructions", href: "#joining" },
              { icon: Download, label: "Downloads", href: "#downloads" },
              { icon: HelpCircle, label: "FAQs", href: "#faqs" },
              { icon: Award, label: "Certificate Info", href: "#certificates" },
              { icon: MapPin, label: "Getting Here", href: "#directions" },
              { icon: Bed, label: "Accommodation", href: "#accommodation" },
            ].map(({ icon: Icon, label, href }) => (
              <a key={label} href={href} className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-light transition-colors text-center group">
                <div className="w-10 h-10 rounded-xl bg-navy/10 flex items-center justify-center group-hover:bg-navy group-hover:text-white transition-colors">
                  <Icon size={18} className="text-navy group-hover:text-white transition-colors" />
                </div>
                <span className="text-xs font-medium text-gray-700 group-hover:text-navy transition-colors">{label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Joining Instructions */}
      <section id="joining" className="py-20 bg-gray-light">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="mb-10">
            <h2 className="section-heading mb-3">Getting Started at TAG</h2>
            <p className="text-gray-600 max-w-2xl">The first steps to becoming part of the TAG training community.</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { step: "01", icon: CheckCircle2, title: "Accept Your Offer", desc: "Review and sign your training agreement and return any required documents." },
              { step: "02", icon: FileText, title: "Complete Pre-checks", desc: "We'll arrange your medical, driver licence check, right to work and reference checks as required." },
              { step: "03", icon: Award, title: "Attend Induction", desc: "Learn about TAG, our policies, safety rules, values and your training plan." },
              { step: "04", icon: CheckCircle2, title: "Meet Your Team", desc: "You'll be introduced to your Trainer, Instructors and the wider team." },
              { step: "05", icon: Download, title: "Receive Your Equipment", desc: "ID card, uniform (if applicable), PPE and any required training materials." },
            ].map(({ step, title, desc }) => (
              <AnimatedSection key={step}>
                <div className="bg-white rounded-xl p-5 shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {step}
                  </div>
                  <div>
                    <h3 className="font-bold text-navy mb-1">{title}</h3>
                    <p className="text-sm text-gray-600">{desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* What to bring */}
      <section id="downloads" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12">
          <AnimatedSection direction="left">
            <h2 className="text-2xl font-bold text-navy mb-6">What to Bring</h2>
            <ul className="space-y-3">
              {[
                "Photographic ID (Passport or Driving Licence)",
                "Proof of address (dated within 3 months)",
                "National Insurance Number",
                "PPE: safety boots, high vis, gloves (if required for your course)",
                "Comfortable clothing suitable for training",
                "Pen and notebook (optional)",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 size={16} className="text-blue-brand flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </AnimatedSection>

          <AnimatedSection direction="right">
            <h2 className="text-2xl font-bold text-navy mb-6">What to Expect</h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                "Safe & supportive environment",
                "Clear communication from day one",
                "Structured training and guidance",
                "Practical, real-world training",
                "Regular feedback and support",
                "Opportunities to grow and progress",
              ].map((item) => (
                <div key={item} className="bg-gray-light rounded-xl p-3 text-center text-xs font-medium text-navy">
                  {item}
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQs */}
      <section id="faqs" className="py-20 bg-gray-light">
        <div className="max-w-3xl mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="section-heading">Frequently Asked Questions</h2>
          </AnimatedSection>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <AnimatedSection key={faq.q} delay={i * 0.03}>
                <details className="group bg-white rounded-xl overflow-hidden shadow-sm">
                  <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-navy hover:bg-gray-light transition-colors">
                    {faq.q}
                    <span className="text-xl text-orange-brand group-open:rotate-45 transition-transform flex-shrink-0 ml-4">+</span>
                  </summary>
                  <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed">{faq.a}</div>
                </details>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Parking & shuttle */}
      <section id="directions" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-10">
            <h2 className="section-heading">Getting to Bothwell HQ</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <AnimatedSection direction="left">
              <div className="bg-gray-light rounded-2xl p-6">
                <h3 className="font-bold text-navy mb-3 flex items-center gap-2">
                  <MapPin size={16} className="text-orange-brand" /> Parking Policy
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0 mt-0.5" />
                    <p><strong>Visitors</strong> (suppliers, observers): welcome to park on site.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0 mt-0.5" />
                    <p><strong>Candidates/Learners</strong>: must use the free shuttle service during peak times. Candidates are NOT permitted to park on site.</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div className="bg-navy rounded-2xl p-6 text-white">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  🚐 Free Shuttle Service
                </h3>
                <div className="space-y-2 text-sm text-white/80 mb-4">
                  <p><strong className="text-white">Pick-up point:</strong> St Bride&apos;s Church, Fallside Road, Bothwell</p>
                  <p><strong className="text-white">Before course:</strong> 40 minutes to 10 minutes prior to start time</p>
                  <p><strong className="text-white">After course:</strong> For approximately 40 minutes after course end</p>
                  <p><strong className="text-white">Frequency:</strong> Every 10 minutes</p>
                  <p><strong className="text-white">Cost:</strong> Free for all candidates</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Need help */}
      <section className="py-12 bg-navy">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <AnimatedSection>
            <h2 className="text-2xl font-bold mb-3">Need Help?</h2>
            <p className="text-white/80 mb-6">Your Trainer, Driver Trainer and the Driver Development Team are here to support you every step of the way.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="tel:01412582024" className="flex items-center gap-2 bg-orange-brand text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-orange-dark transition-colors">
                <Phone size={16} /> 0141 258 2024
              </a>
              <Link href="/contact" className="flex items-center gap-2 bg-white/10 border border-white/20 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-white/20 transition-colors">
                Send a Message
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}

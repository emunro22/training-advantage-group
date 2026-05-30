import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";
import PriceCard from "@/components/ui/PriceCard";
import CTASection from "@/components/home/CTASection";
import { CheckCircle2, MapPin, Users, Upload, BookOpen } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Driver CPC Training Scotland – Periodic & Initial CPC Courses",
  description:
    "DVSA & JAUPT approved Driver CPC periodic training across Scotland. Classroom sessions in Bothwell, Motherwell, Glasgow, or online remote delivery. From £50.",
};

const MODULES = [
  "Drivers' Hours & Working Time",
  "Emergency First Aid",
  "Vulnerable Road Users",
  "Vehicle Safety & Security",
  "Health & Safety for Drivers",
  "Tachograph Use & Records",
  "Load Security",
  "Eco-friendly Driving",
  "Customer Relations",
  "Road Traffic Law",
];

const FAQS = [
  {
    q: "What is Driver CPC?",
    a: "Driver CPC (Certificate of Professional Competence) is a mandatory qualification for all professional HGV and PCV drivers. It requires 35 hours of periodic training every 5 years to maintain your Driver Qualification Card (DQC).",
  },
  {
    q: "Do I need Driver CPC training?",
    a: "If you hold a Category C, C+E, C1, D, D+E or D1 licence and drive professionally, you are likely required to hold a valid DQC. There are some exemptions — contact us if unsure.",
  },
  {
    q: "How long is a Driver CPC course?",
    a: "We offer both 3.5-hour and full 7-hour sessions. Each 7-hour session counts as 7 hours towards your 35-hour requirement. Each 3.5-hour session counts as 3.5 hours.",
  },
  {
    q: "Can I do Driver CPC online?",
    a: "Yes — we offer remote online CPC training. You'll need a computer or tablet with a webcam and stable internet connection. Hours are uploaded directly to DVSA.",
  },
  {
    q: "How are hours uploaded to DVSA?",
    a: "We upload your training hours directly to the DVSA JAUPT system. You'll receive a certificate, and your DQC will be updated when all 35 hours are complete.",
  },
];

export default function DriverCPCPage() {
  return (
    <>
      <PageHero
        title="Driver CPC Training"
        subtitle="DVSA & JAUPT approved periodic and initial Driver CPC training delivered in classroom or online across Scotland."
        tag="Driver CPC"
        breadcrumbs={[{ label: "Driver CPC" }]}
        cta={{ label: "Book CPC Training", href: "/booking?course=dcpc-classroom" }}
      />

      {/* Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection direction="left">
            <span className="tag bg-blue-50 text-blue-brand mb-4">What is Driver CPC?</span>
            <h2 className="section-heading mb-4">Professional Driver Certification</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Driver CPC is the mandatory continuing professional development qualification for all professional HGV and PCV drivers. It requires 35 hours of periodic training every 5 years to maintain your Driver Qualification Card.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              At Training Advantage Group, we deliver engaging, practical CPC sessions that not only keep drivers compliant but actually improve their professional skills and road safety awareness.
            </p>
            <ul className="space-y-2 mb-8">
              {["DVSA & JAUPT approved training", "Hours uploaded directly to DVSA", "Attendance-based assessment", "Certificates issued same day", "Available classroom or remote"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 size={16} className="text-blue-brand flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/booking?course=dcpc-classroom" className="btn-primary">
              Book Your CPC Course
            </Link>
          </AnimatedSection>

          <AnimatedSection direction="right">
            <div className="bg-gray-light rounded-2xl p-6">
              <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                <BookOpen size={18} className="text-orange-brand" />
                Available CPC Modules
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {MODULES.map((mod) => (
                  <div key={mod} className="flex items-start gap-1.5 text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-brand flex-shrink-0 mt-1.5" />
                    {mod}
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-light">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="section-heading">CPC Training Pricing</h2>
            <p className="section-subheading mx-auto text-center mt-3">All prices exclude VAT. Discounts available for group bookings.</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <PriceCard
              title="3.5-Hour CPC Session"
              price={35}
              priceNote="per delegate, excl. VAT"
              features={[
                "3.5 hours JAUPT approved",
                "Morning or afternoon session",
                "Certificate issued",
                "Hours uploaded to DVSA",
                "Classroom delivery",
              ]}
              cta={{ label: "Book Now", href: "/booking?course=dcpc-classroom" }}
            />
            <PriceCard
              title="Full 7-Hour CPC Session"
              price={59}
              priceNote="per delegate, excl. VAT"
              highlighted
              features={[
                "7 hours JAUPT approved",
                "Full day session",
                "Refreshments included",
                "Certificate issued",
                "Hours uploaded to DVSA",
                "Classroom delivery",
              ]}
              cta={{ label: "Book Now", href: "/booking?course=dcpc-classroom-full" }}
            />
            <PriceCard
              title="Remote Online CPC"
              price={50}
              priceNote="per delegate, excl. VAT"
              features={[
                "7 hours JAUPT approved",
                "Delivered via Zoom/Teams",
                "Nationwide delivery",
                "Certificate issued",
                "Hours uploaded to DVSA",
                "Webcam required",
              ]}
              cta={{ label: "Book Now", href: "/booking?course=dcpc-remote" }}
            />
          </div>

          <AnimatedSection className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-gray-600 bg-white rounded-lg px-4 py-2 shadow-sm">
              <Upload size={14} className="text-blue-brand" />
              JAUPT upload fee: £8.75 per candidate
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="section-heading">How It Works</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Book Online", desc: "Choose your course, date and location through our booking system or call us directly.", icon: BookOpen },
              { step: "02", title: "Attend Training", desc: "Join your session in one of our professional training centres or remotely online.", icon: Users },
              { step: "03", title: "Complete Assessment", desc: "Attendance-based assessment — no difficult exams. Simply participate and engage.", icon: CheckCircle2 },
              { step: "04", title: "Hours Uploaded", desc: "We upload your hours directly to DVSA JAUPT within 3 working days.", icon: Upload },
            ].map(({ step, title, desc, icon: Icon }, i) => (
              <AnimatedSection key={step} delay={i * 0.1}>
                <div className="text-center p-6">
                  <div className="relative inline-flex mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-navy flex items-center justify-center">
                      <Icon size={24} className="text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-orange-brand flex items-center justify-center text-white text-xs font-bold">
                      {step}
                    </div>
                  </div>
                  <h3 className="font-bold text-navy mb-2">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-12 bg-gray-light">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-8">
            <h2 className="text-2xl font-bold text-navy">Training Locations</h2>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Bothwell HQ", detail: "G71 8DA – Exam Suite" },
              { name: "Motherwell", detail: "ML1 1TA – Training Centre" },
              { name: "Glasgow", detail: "G14 0BX – Training Centre" },
              { name: "Remote Online", detail: "Nationwide – Via Zoom" },
            ].map((loc) => (
              <div key={loc.name} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
                <MapPin size={16} className="text-orange-brand flex-shrink-0" />
                <div>
                  <div className="font-semibold text-navy text-sm">{loc.name}</div>
                  <div className="text-xs text-gray-500">{loc.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="section-heading">Frequently Asked Questions</h2>
          </AnimatedSection>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <AnimatedSection key={faq.q} delay={i * 0.05}>
                <details className="group bg-gray-light rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-navy hover:bg-gray-mid transition-colors">
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

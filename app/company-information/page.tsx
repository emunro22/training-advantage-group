import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Link from "next/link";
import { Building2, MapPin, Phone, Mail, Globe, ShieldAlert, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Company Information | Training Advantage Group",
  description:
    "Official company identity, registration and contact details for Training Advantage Group Ltd.",
};

// TAG-SEC-PROC-001 §11 Public Company Information Sheet. Only the permitted public fields appear
// here — company identity, registration, VAT status, address, contact details and standard
// remittance guidance. VAT number/bank details are not guessed where not already an established
// public fact on this site; TAG bank details are never published here (Controlled Payment
// Information Sheet is a restricted, Finance-issued document, not a public webpage).
export default function CompanyInformationPage() {
  return (
    <>
      <PageHero
        title="Company Information"
        subtitle="Official identity and contact details for Training Advantage Group Ltd."
        tag="Public Company Information Sheet"
      />

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <AnimatedSection className="bg-white rounded-2xl border border-gray-100 shadow-card p-8 space-y-6">
            <div className="flex items-start gap-3">
              <Building2 className="text-orange-brand flex-shrink-0 mt-1" size={20} />
              <div>
                <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Company</div>
                <div className="font-bold text-navy">Training Advantage Group Ltd</div>
                <div className="text-sm text-gray-500 mt-0.5">Registered in Scotland No. SC765674</div>
                <div className="text-sm text-gray-500">VAT Registration No. 446609573</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="text-orange-brand flex-shrink-0 mt-1" size={20} />
              <div>
                <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Registered / Training Address</div>
                <div className="text-sm text-gray-700">1st Floor Training Suite, APC Depot, Coalburn Road, Bothwell, G71 8DA</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="text-orange-brand flex-shrink-0 mt-1" size={20} />
              <div>
                <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Telephone</div>
                <a href="tel:01412582024" className="text-sm text-blue-brand font-semibold hover:underline">0141 258 2024</a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="text-orange-brand flex-shrink-0 mt-1" size={20} />
              <div>
                <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide">General &amp; Finance Enquiries</div>
                <a href="mailto:office@trainingadvantagegroup.co.uk" className="text-sm text-blue-brand font-semibold hover:underline">office@trainingadvantagegroup.co.uk</a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Globe className="text-orange-brand flex-shrink-0 mt-1" size={20} />
              <div>
                <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Website</div>
                <span className="text-sm text-gray-700">www.trainingadvantagegroup.co.uk</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="text-orange-brand flex-shrink-0 mt-1" size={20} />
              <div>
                <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Payment &amp; Remittance</div>
                <p className="text-sm text-gray-700">
                  Online bookings are paid securely at checkout via our hosted payment provider. For invoiced or
                  purchase-order customers, remittance instructions are issued only through a verified Finance
                  communication or a controlled, restricted document — never published on this page.
                </p>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-5 flex gap-3">
            <ShieldAlert className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-sm text-red-800">
              TAG will never ask you to change payment or bank details by email alone. Any bank-detail change is
              independently verified by phone using a number already held before it is actioned. If you receive an
              unexpected request to change payment details, contact us directly using the number above before acting
              on it.
            </p>
          </AnimatedSection>

          <p className="text-center text-sm text-gray-400 mt-8">
            See our{" "}
            <Link href="/policies" className="text-blue-brand font-semibold hover:underline">
              Privacy &amp; Security Notice
            </Link>{" "}
            for how we handle your information.
          </p>
        </div>
      </section>
    </>
  );
}

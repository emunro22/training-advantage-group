import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Link from "next/link";
import {
  UserPlus,
  ShieldCheck,
  CalendarDays,
  ClipboardList,
  GraduationCap,
  Truck,
  BadgeCheck,
  Lock,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Secure Links | Training Advantage Group",
  description:
    "Candidate registration, secure candidate update, course booking/allocation, instructor/assessor, supplier/subcontractor and certificate checker — the secure routes for TAG data.",
};

interface SecureLink {
  icon: typeof UserPlus;
  title: string;
  description: string;
  href?: string;
  internal?: boolean;
  unavailableNote?: string;
}

// TAG-SEC-PROC-001 §5 / §12. This page only links out to the existing controlled Jotform and
// portal routes — it does not duplicate any of their fields, uploads, declarations or signature
// process (TAG-WEB-REQ-001 §6: "NO DUPLICATE FORM BUILD").
function getLinks(): SecureLink[] {
  return [
    {
      icon: UserPlus,
      title: "Candidate Registration",
      description:
        "Register with TAG once when you do not already have a Candidate ID, or when TAG specifically asks for a full registration.",
      href: process.env.JOTFORM_REGISTRATION_URL,
    },
    {
      icon: ShieldCheck,
      title: "Secure Candidate Update",
      description:
        "Update changed ID, driving licence, photograph, signature or requested evidence without completing the full form again.",
      href: process.env.JOTFORM_UPDATE_URL,
    },
    {
      icon: CalendarDays,
      title: "Book a Course / Upcoming Courses",
      description:
        "Choose an approved course/date, purchase or enquire. Registration and booking remain separate until confirmed.",
      href: "/upcoming-courses",
      internal: true,
    },
    {
      icon: ClipboardList,
      title: "Course Booking/Allocation",
      description:
        "For authenticated TAG staff/instructors to request that a registered candidate is linked to a Course Instance.",
      href: process.env.JOTFORM_COURSE_BOOKING_URL,
    },
    {
      icon: GraduationCap,
      title: "Instructor/Assessor Portal",
      description:
        "Qualifications, CPD, availability, course actions, assessments, evidence and declarations for authorised instructors/assessors.",
      href: process.env.INSTRUCTOR_PORTAL_URL,
    },
    {
      icon: Truck,
      title: "Supplier/Subcontractor Portal",
      description:
        "Onboarding, insurance, approvals, NDA/declarations, documents and authenticated update requests.",
      href: process.env.SUPPLIER_PORTAL_URL,
    },
    {
      icon: BadgeCheck,
      title: "Certificate Checker",
      description: "Verify a published certificate using the approved certificate number/search method.",
      href: "/verify-certificate",
      internal: true,
    },
  ];
}

export default function SecureLinksPage() {
  const links = getLinks();

  return (
    <>
      <PageHero
        title="Secure Links"
        subtitle="Clear routes for candidates, instructors, administrators and suppliers — using secure forms and SharePoint instead of ordinary email for ID, signatures, bank details and other restricted evidence."
        tag="TAG-SEC-PROC-001"
      />

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <AnimatedSection className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-10 flex gap-3">
            <Lock className="text-blue-brand flex-shrink-0 mt-0.5" size={20} />
            <p className="text-sm text-gray-700">
              TAG collects only the information needed to administer training, check identity and eligibility,
              satisfy awarding-body/regulatory requirements, issue course documents and certificates, and maintain
              an auditable record. Never send ID photographs, driving-licence images, signatures or bank details by
              ordinary email — use the secure routes below.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-5">
            {links.map((link) => {
              const Icon = link.icon;
              const isAvailable = !!link.href;
              const isExternal = !link.internal && isAvailable;
              return (
                <AnimatedSection key={link.title}>
                  <div className="h-full bg-white rounded-2xl border border-gray-100 shadow-card p-6 flex flex-col">
                    <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center mb-3">
                      <Icon size={20} className="text-orange-brand" />
                    </div>
                    <h3 className="font-bold text-navy text-lg mb-1.5">{link.title}</h3>
                    <p className="text-sm text-gray-600 flex-1 mb-4">{link.description}</p>
                    {isAvailable ? (
                      <Link
                        href={link.href!}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-brand hover:text-navy transition-colors"
                      >
                        Open {isExternal && <ExternalLink size={13} />}
                      </Link>
                    ) : (
                      <span className="text-xs text-gray-400 italic">
                        Route not yet configured — please call us on 0141 258 2024
                      </span>
                    )}
                  </div>
                </AnimatedSection>
              );
            })}
          </div>

          <AnimatedSection className="mt-10 text-center text-sm text-gray-400">
            <p>
              Need help or can&apos;t use an online form?{" "}
              <Link href="/contact" className="text-blue-brand font-semibold hover:underline">
                Contact us
              </Link>{" "}
              for an accessible alternative.
            </p>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}

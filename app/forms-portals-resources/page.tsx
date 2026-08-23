import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";
import {
  UserPlus,
  ShieldCheck,
  BadgeCheck,
  GraduationCap,
  Truck,
  Lock,
  ExternalLink,
  CalendarDays,
  ClipboardList,
  AlertCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Forms, Portals & Secure Resources | Training Advantage Group",
  description:
    "The correct secure route for candidate registration and updates, instructor/assessor course workspaces, supplier/subcontractor onboarding and certificate checking.",
};

interface CandidateCard {
  icon: typeof UserPlus;
  title: string;
  description: string;
  href?: string;
  internal?: boolean;
  image?: string;
}

function getCandidateCards(): CandidateCard[] {
  return [
    {
      icon: UserPlus,
      title: "Complete Full Candidate Registration",
      description:
        "For new candidates, or when TAG specifically asks for a full registration. Creates your permanent TAG Candidate ID, privacy acknowledgements, declarations, signature and available evidence in one place.",
      href: process.env.JOTFORM_REGISTRATION_URL,
      image: "/images/portal/candidate-registration-page.png",
    },
    {
      icon: ShieldCheck,
      title: "Update an Existing Candidate Record",
      description:
        "For existing candidates. Update ID, driving licence evidence, photograph, signature or other details without completing the full registration again.",
      href: process.env.JOTFORM_UPDATE_URL,
      image: "/images/portal/candidate-update-page.png",
    },
    {
      icon: BadgeCheck,
      title: "Check a Certificate",
      description: "Verify a published TAG certificate using the approved certificate number/search method.",
      href: "/verify-certificate",
      internal: true,
    },
  ];
}

export default function FormsPortalsResourcesPage() {
  const candidateCards = getCandidateCards();

  return (
    <>
      <PageHero
        title="TAG Forms, Portals & Secure Resources"
        subtitle="Use the correct secure route to register, update records, access controlled course resources or submit supplier information."
        tag="TAG-SEC-PROC-001"
      />

      {/* Security notice */}
      <section className="pt-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <AnimatedSection className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex gap-3">
            <Lock className="text-blue-brand flex-shrink-0 mt-0.5" size={20} />
            <p className="text-sm text-gray-700">
              For your protection, do not email identity documents, licence images, photographs, signatures or
              medical information. Use the secure form requested by TAG — never ordinary email or WhatsApp.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Candidate services */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <AnimatedSection className="mb-10">
            <h2 className="section-heading mb-3">Candidate Services</h2>
            <p className="text-gray-600 max-w-3xl">
              <strong>Which form should I use?</strong> New candidates complete the full registration once — this
              establishes your core candidate record, privacy acknowledgements, declarations, signature and
              available evidence. Existing candidates use the shorter secure update route whenever ID, licence
              evidence, photograph, signature or other details change.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-5 mb-10">
            {candidateCards.map((card) => {
              const Icon = card.icon;
              const isAvailable = !!card.href;
              const isExternal = !card.internal && isAvailable;
              return (
                <AnimatedSection key={card.title}>
                  <div className="h-full bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden flex flex-col">
                    {card.image && (
                      <div className="relative w-full h-40 bg-gray-50 border-b border-gray-100">
                        <Image src={card.image} alt={`${card.title} — TAG secure form preview`} fill className="object-cover object-top" />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center mb-3">
                        <Icon size={20} className="text-orange-brand" />
                      </div>
                      <h3 className="font-bold text-navy text-lg mb-1.5">{card.title}</h3>
                      <p className="text-sm text-gray-600 flex-1 mb-4">{card.description}</p>
                      {isAvailable ? (
                        <Link
                          href={card.href!}
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
                  </div>
                </AnimatedSection>
              );
            })}
          </div>

          {/* Candidate journey explanation */}
          <AnimatedSection className="grid md:grid-cols-2 gap-8 items-center bg-gray-light rounded-2xl p-6 md:p-8">
            <div>
              <h3 className="font-bold text-navy text-lg mb-2">Registration, booking and allocation are separate</h3>
              <p className="text-sm text-gray-600 mb-3">
                Course booking or allocation is separate from candidate registration. A registered candidate may be
                linked to a booked course later by TAG administration or an authorised instructor. Where a
                candidate attends without a prior online booking, TAG may create a controlled manual course entry,
                issue the required form for signature and upload it to the candidate/course record after checks.
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Registering does not by itself guarantee a course place — TAG confirms allocation separately.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/upcoming-courses" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-brand hover:text-navy transition-colors">
                  <CalendarDays size={15} /> Book a course / Upcoming Courses
                </Link>
                {process.env.JOTFORM_COURSE_BOOKING_URL && (
                  <a
                    href={process.env.JOTFORM_COURSE_BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-brand hover:text-navy transition-colors"
                  >
                    <ClipboardList size={15} /> Staff: course booking/allocation
                  </a>
                )}
              </div>
            </div>
            <div className="relative w-full aspect-[864/1821] max-h-[420px] mx-auto rounded-xl overflow-hidden border border-gray-100">
              <Image src="/images/portal/candidate-secure-journey.png" alt="TAG secure candidate journey: register once, update safely, join your course, submit securely" fill className="object-contain" />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Instructor / assessor services */}
      <section className="py-16 bg-gray-light">
        <div className="max-w-5xl mx-auto px-4">
          <AnimatedSection className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative w-full aspect-[933/1686] max-h-[440px] mx-auto rounded-xl overflow-hidden border border-gray-100 md:order-2">
              <Image src="/images/portal/instructor-secure-course-workflow.png" alt="TAG secure course workflow for instructors, assessors and invigilators" fill className="object-contain" />
            </div>
            <div className="md:order-1">
              <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center mb-3">
                <GraduationCap size={20} className="text-orange-brand" />
              </div>
              <h2 className="section-heading mb-3">Instructor / Assessor Services</h2>
              <p className="text-sm text-gray-600 mb-4">
                The secure course workspace for authorised instructors, assessors and invigilators — registers,
                assessments, evidence return, qualification/CPD updates, trainee/shadowing arrangements and
                lead-instructor responsibilities.
              </p>
              {process.env.INSTRUCTOR_PORTAL_URL ? (
                <a
                  href={process.env.INSTRUCTOR_PORTAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  Instructor / Assessor Secure Access <ExternalLink size={15} />
                </a>
              ) : (
                <span className="text-xs text-gray-400 italic block mb-2">
                  Route not yet configured — please call us on 0141 258 2024
                </span>
              )}
              <p className="text-xs text-gray-500 mt-3">
                Requires a TAG-approved Microsoft account and assigned permissions. If you see &ldquo;Access
                Denied&rdquo;, contact{" "}
                <a href="mailto:office@trainingadvantagegroup.co.uk" className="text-blue-brand hover:underline">
                  office@trainingadvantagegroup.co.uk
                </a>{" "}
                — do not request the folder be made public.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Supplier / subcontractor services */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <AnimatedSection className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative w-full aspect-[916/1716] max-h-[440px] mx-auto rounded-xl overflow-hidden border border-gray-100">
              <Image src="/images/portal/supplier-secure-process.png" alt="TAG secure supplier and subcontractor onboarding and payment protection process" fill className="object-contain" />
            </div>
            <div>
              <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center mb-3">
                <Truck size={20} className="text-orange-brand" />
              </div>
              <h2 className="section-heading mb-3">Supplier / Subcontractor Services</h2>
              <p className="text-sm text-gray-600 mb-4">
                Onboarding, compliance documents, invoice and delivery submission, NDA/data protection declarations,
                and protected bank-detail changes.
              </p>
              {process.env.SUPPLIER_PORTAL_URL ? (
                <a
                  href={process.env.SUPPLIER_PORTAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  Supplier / Subcontractor Secure Access <ExternalLink size={15} />
                </a>
              ) : (
                <span className="text-xs text-gray-400 italic block mb-2">
                  Route not yet configured — please call us on 0141 258 2024
                </span>
              )}
              <p className="text-xs text-gray-500 mt-3">
                Submitting onboarding information does not create automatic supplier approval. Bank-detail changes
                are independently verified using an existing trusted contact route before payment records are
                amended — never by email or WhatsApp. If you see &ldquo;Access Denied&rdquo;, contact{" "}
                <a href="mailto:office@trainingadvantagegroup.co.uk" className="text-blue-brand hover:underline">
                  office@trainingadvantagegroup.co.uk
                </a>
                .
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Help & complaints */}
      <section className="py-16 bg-navy">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <AnimatedSection>
            <AlertCircle size={28} className="text-orange-brand mx-auto mb-3" />
            <h2 className="text-2xl font-black text-white mb-3">Help &amp; Complaints</h2>
            <p className="text-blue-light/80 mb-2">
              For general support, questions about any of the routes above, or to raise a complaint, contact{" "}
              <a href="mailto:office@trainingadvantagegroup.co.uk" className="text-white font-semibold hover:underline">
                office@trainingadvantagegroup.co.uk
              </a>
              .
            </p>
            <p className="text-blue-light/60 text-sm">
              Sensitive evidence (ID, licence images, photographs, signatures, medical information) must not be
              emailed — use the secure form requested by TAG instead.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Privacy footer */}
      <section className="py-10 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center text-xs text-gray-400">
          <p>
            Records submitted through these routes are handled in TAG&apos;s controlled Microsoft environment and
            retained in accordance with TAG&apos;s six-year retention schedule, subject to applicable legal and
            awarding-body requirements.
          </p>
        </div>
      </section>
    </>
  );
}

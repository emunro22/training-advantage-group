import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";

export const metadata: Metadata = {
  alternates: { canonical: "/policies" },
  title: "Policies | Training Advantage Group Ltd",
  description: "Privacy policy, terms and conditions, complaints procedure and quality policy for Training Advantage Group Ltd.",
};

export default function PoliciesPage() {
  return (
    <>
      <PageHero
        title="Policies & Terms"
        subtitle="Our commitment to transparency, quality and fair treatment of all learners and customers."
        breadcrumbs={[{ label: "Policies" }]}
      />

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 space-y-12">
          <AnimatedSection>
            <section id="privacy">
              <h2 className="text-2xl font-bold text-navy mb-4">Privacy Policy</h2>
              <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-3 text-gray-700">
                <p>Training Advantage Group Ltd is committed to protecting your personal data. This policy explains how we collect, use and protect your information in accordance with UK GDPR and the Data Protection Act 2018.</p>
                <p><strong>Data we collect:</strong> Name, contact details, employer details, training records, payment information and any information you provide when making a booking or enquiry.</p>
                <p><strong>How we use your data:</strong> To process bookings, deliver training, issue certificates, comply with legal obligations and communicate with you about your training.</p>
                <p><strong>Your rights:</strong> You have the right to access, correct, delete or restrict processing of your personal data. Contact us at office@trainingadvantagegroup.co.uk to exercise these rights.</p>
                <p><strong>Data retention:</strong> Training records are retained for a minimum of 7 years in line with regulatory requirements.</p>
                <p>We do not sell your data to third parties. We may share information with regulatory bodies (DVSA, JAUPT, NLTC) as required for certification purposes.</p>
              </div>
            </section>
          </AnimatedSection>

          <AnimatedSection>
            <section id="terms">
              <h2 className="text-2xl font-bold text-navy mb-4">Terms & Conditions</h2>
              <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-3 text-gray-700">
                <p><strong>Bookings:</strong> All bookings are subject to availability and confirmation by TAG. A booking is only confirmed upon receipt of a written confirmation from us.</p>
                <p><strong>Payment:</strong> Payment terms are stated on your invoice. Corporate accounts may be subject to credit terms as agreed.</p>
                <p><strong>Cancellation:</strong> Cancellations must be made in writing. Cancellations with less than 5 working days&apos; notice may be subject to a cancellation charge of up to 50% of the course fee. No-shows are charged at 100%.</p>
                <p><strong>Attendance:</strong> Candidates must attend for the full duration of their course to receive a certificate. Late arrival may result in inability to sit the course.</p>
                <p><strong>Conduct:</strong> TAG reserves the right to exclude any candidate who behaves inappropriately or unsafely, without refund.</p>
                <p><strong>Liability:</strong> TAG&apos;s liability is limited to the cost of the training provided. We are not responsible for consequential losses arising from training outcomes.</p>
              </div>
            </section>
          </AnimatedSection>

          <AnimatedSection>
            <section id="complaints">
              <h2 className="text-2xl font-bold text-navy mb-4">Complaints Procedure</h2>
              <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-3 text-gray-700">
                <p>Training Advantage Group Ltd is committed to providing excellent service. If you are dissatisfied with any aspect of our service, please follow the procedure below:</p>
                <p><strong>Step 1 — Informal resolution:</strong> Speak with your instructor or course coordinator in the first instance. Many issues can be resolved quickly and informally.</p>
                <p><strong>Step 2 — Formal complaint:</strong> If the matter is not resolved, submit a written complaint to office@trainingadvantagegroup.co.uk with full details of the complaint.</p>
                <p><strong>Step 3 — Investigation:</strong> We will acknowledge your complaint within 3 working days and provide a full written response within 10 working days.</p>
                <p><strong>Step 4 — Escalation:</strong> If you remain dissatisfied, you may escalate to the relevant awarding body or regulatory authority depending on the nature of your complaint.</p>
              </div>
            </section>
          </AnimatedSection>

          <AnimatedSection>
            <section id="quality">
              <h2 className="text-2xl font-bold text-navy mb-4">Quality Policy</h2>
              <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-3 text-gray-700">
                <p>Training Advantage Group Ltd is committed to continuous improvement in the quality of our training provision. We aim to:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Meet and exceed the requirements of all relevant awarding bodies and regulatory authorities</li>
                  <li>Continuously improve our training materials, delivery methods and assessment practices</li>
                  <li>Actively seek and respond to learner and employer feedback</li>
                  <li>Invest in the continuing professional development of our staff</li>
                  <li>Ensure equality of access and opportunity for all learners</li>
                  <li>Maintain accurate and secure records in line with legal requirements</li>
                </ul>
                <p>This policy is reviewed annually by the Senior Management Team. All staff are responsible for the quality of their work and for reporting any concerns or improvement suggestions.</p>
              </div>
            </section>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}

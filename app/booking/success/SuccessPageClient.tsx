"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Phone, Mail, Calendar, ClipboardEdit } from "lucide-react";
import Link from "next/link";

export default function SuccessPageClient({ registrationUrl }: { registrationUrl?: string }) {
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const candidateLink = registrationUrl && orderId
    ? `${registrationUrl}${registrationUrl.includes("?") ? "&" : "?"}orderId=${encodeURIComponent(orderId)}`
    : registrationUrl;

  return (
    <>
      <section className="relative bg-gradient-hero py-16 md:py-20 overflow-hidden pattern-bg">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-brand via-red-brand to-orange-brand" />
      </section>

      <section className="py-20 bg-gray-light">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-card p-8 md:p-12 text-center"
          >
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={48} className="text-green-600" />
            </div>

            <h1 className="text-3xl font-black text-navy mb-3">Payment Confirmed!</h1>
            <p className="text-gray-600 mb-2">
              Thank you — your payment has been received and your booking is confirmed.
            </p>
            <p className="text-gray-600 mb-8">
              We&apos;ve sent a confirmation email to you. A member of our team will be in touch shortly with joining instructions.
            </p>

            {orderId && (
              <div className="inline-block bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 mb-8">
                <p className="text-xs text-gray-400 mb-0.5">Booking Reference</p>
                <p className="font-mono text-sm text-gray-700 font-bold">{orderId.slice(0, 8).toUpperCase()}</p>
              </div>
            )}

            <div className="bg-navy/5 rounded-xl p-5 mb-8 text-left">
              <h3 className="font-bold text-navy mb-3 flex items-center gap-2">
                <Calendar size={16} className="text-orange-brand" />
                What happens next?
              </h3>
              <div className="space-y-2">
                {[
                  "You'll receive a confirmation email shortly",
                  "Our team will contact you to confirm course details",
                  "Joining instructions will be sent before your course date",
                  "Certificates issued on successful completion",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-navy/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-navy mt-0.5">
                      {i + 1}
                    </div>
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {candidateLink && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 mb-8 text-left">
                <h3 className="font-bold text-navy mb-2 flex items-center gap-2">
                  <ClipboardEdit size={16} className="text-orange-brand" />
                  Candidate registration
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Complete your secure candidate registration next — this is where ID, signature and other
                  evidence are collected, never by email.
                </p>
                <a
                  href={candidateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-orange-brand text-white px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-orange-dark transition-colors"
                >
                  Complete candidate registration
                </a>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <a
                href="tel:01412582024"
                className="flex items-center justify-center gap-2 bg-navy text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-navy/90 transition-colors"
              >
                <Phone size={15} />
                0141 258 2024
              </a>
              <a
                href="mailto:office@trainingadvantagegroup.co.uk"
                className="flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 px-5 py-3 rounded-xl font-semibold text-sm hover:border-navy hover:text-navy transition-colors"
              >
                <Mail size={15} />
                Email Us
              </a>
            </div>

            <Link href="/" className="text-sm text-gray-400 hover:text-navy transition-colors">
              ← Return to homepage
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}

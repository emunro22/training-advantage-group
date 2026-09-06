"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Phone, Mail } from "lucide-react";
import Link from "next/link";

export default function ReplacementSuccessClient() {
  const params = useSearchParams();
  const orderId = params.get("orderId");

  return (
    <section className="py-20 bg-gray-light min-h-[60vh]">
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
            Thank you. Your payment has been received and your replacement awarding body certificate order is
            confirmed.
          </p>
          <p className="text-gray-600 mb-8">
            We&apos;ve sent a confirmation email to you. Our team will be in touch once your replacement
            certificate has been processed by the awarding body.
          </p>

          {orderId && (
            <div className="inline-block bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 mb-8">
              <p className="text-xs text-gray-400 mb-0.5">Order Reference</p>
              <p className="font-mono text-sm text-gray-700 font-bold">{orderId.slice(0, 8).toUpperCase()}</p>
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
  );
}

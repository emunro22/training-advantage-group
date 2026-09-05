import Link from "next/link";
import { CalendarCheck, MessageCircleQuestion, FileQuestion } from "lucide-react";
import type { WebsiteProduct } from "@/lib/storage";

interface CourseProductTableProps {
  products: WebsiteProduct[];
  title?: string;
  bookingHref?: string;
}

function formatGBP(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`;
}

const CTA_CONFIG = {
  book: { label: "Book Now", icon: CalendarCheck, className: "bg-orange-brand text-white hover:bg-orange-dark" },
  enquire: { label: "Enquire", icon: MessageCircleQuestion, className: "bg-navy text-white hover:bg-navy-light" },
  quote: { label: "Quote Required", icon: FileQuestion, className: "bg-white text-navy border-2 border-navy hover:bg-navy hover:text-white" },
} as const;

/**
 * TAG-WEB-REQ-001 §3: one consistent course/product layout — title, summary, accreditation
 * wording, duration, delivery method/venue, candidate capacity, approved price inc VAT, and a
 * clear Book / Enquire / Quote Required action. Only ever fed Published rows (see
 * lib/products-public.ts) so nothing here can show a price TAG hasn't approved.
 */
export default function CourseProductTable({ products, title, bookingHref = "/booking" }: CourseProductTableProps) {
  if (products.length === 0) return null;

  return (
    <div className="space-y-3">
      {title && <h3 className="text-lg font-bold text-navy">{title}</h3>}
      {products.map((p) => {
        const cta = CTA_CONFIG[p.saleMode];
        const Icon = cta.icon;
        const href = p.saleMode === "book" ? `${bookingHref}?product=${encodeURIComponent(p.websiteProductId ?? p.priceId)}` : "/contact";
        return (
          <div
            key={p.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 flex flex-col md:flex-row md:items-center gap-4"
          >
            <div className="flex-1 min-w-0">
              <div className="font-bold text-navy text-base">
                {p.courseService}
                {p.variant && <span className="text-gray-400 font-normal">: {p.variant}</span>}
              </div>
              {p.accreditation && <div className="text-xs text-blue-brand font-semibold mt-0.5">{p.accreditation}</div>}
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-2">
                {p.durationRatio && <span>⏱ {p.durationRatio}</span>}
                {p.delivery && <span>📍 {p.delivery}</span>}
                {p.maxCandidates && <span>👥 {p.maxCandidates}</span>}
              </div>
              {p.publicNote && <p className="text-xs text-gray-400 mt-1">{p.publicNote}</p>}
            </div>
            <div className="flex flex-col items-start md:items-end gap-2 flex-shrink-0">
              <div className="text-xl font-black text-navy">
                {formatGBP(p.priceIncVatPence)}
                <span className="text-xs font-normal text-gray-400 ml-1">inc VAT</span>
              </div>
              <Link
                href={href}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${cta.className}`}
              >
                <Icon size={15} /> {cta.label}
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

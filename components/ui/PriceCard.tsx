import { cn } from "@/lib/utils";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

interface PriceCardProps {
  title: string;
  price?: number;
  priceLabel?: string;
  priceNote?: string;
  features?: string[];
  cta?: { label: string; href: string };
  highlighted?: boolean;
  className?: string;
}

export default function PriceCard({
  title,
  price,
  priceLabel,
  priceNote,
  features = [],
  cta,
  highlighted = false,
  className,
}: PriceCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-6 flex flex-col",
        highlighted
          ? "bg-navy text-white shadow-xl ring-2 ring-orange-brand"
          : "bg-white text-navy shadow-card border border-gray-100",
        className
      )}
    >
      {highlighted && (
        <div className="text-xs font-bold uppercase tracking-widest text-orange-brand mb-3">
          Most Popular
        </div>
      )}
      <h3 className={cn("font-bold text-lg mb-2", highlighted ? "text-white" : "text-navy")}>
        {title}
      </h3>
      <div className="mb-4">
        {price ? (
          <div className="flex items-baseline gap-1">
            <span className={cn("text-3xl font-black", highlighted ? "text-orange-brand" : "text-blue-brand")}>
              £{price}
            </span>
            <span className={cn("text-sm", highlighted ? "text-gray-300" : "text-gray-dark")}>
              excl. VAT
            </span>
          </div>
        ) : (
          <div className={cn("text-2xl font-black", highlighted ? "text-orange-brand" : "text-blue-brand")}>
            {priceLabel}
          </div>
        )}
        {priceNote && (
          <p className={cn("text-xs mt-1", highlighted ? "text-gray-300" : "text-gray-dark")}>
            {priceNote}
          </p>
        )}
      </div>

      {features.length > 0 && (
        <ul className="space-y-2 mb-6 flex-1">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm">
              <CheckCircle2 size={16} className={cn("flex-shrink-0 mt-0.5", highlighted ? "text-orange-brand" : "text-blue-brand")} />
              <span className={highlighted ? "text-gray-200" : "text-gray-700"}>{f}</span>
            </li>
          ))}
        </ul>
      )}

      {cta && (
        <Link
          href={cta.href}
          className={cn(
            "mt-auto inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-semibold text-sm transition-all",
            highlighted
              ? "bg-orange-brand text-white hover:bg-orange-dark"
              : "bg-navy text-white hover:bg-navy-light"
          )}
        >
          {cta.label}
        </Link>
      )}
    </div>
  );
}

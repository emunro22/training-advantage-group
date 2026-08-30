import Link from "next/link";
import { Compass } from "lucide-react";

export const metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="relative bg-gradient-hero overflow-hidden py-28 md:py-36">
      <div className="absolute inset-0 pattern-bg pointer-events-none" />
      <div className="relative max-w-2xl mx-auto px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-6">
          <Compass size={28} className="text-orange-brand" />
        </div>
        <div className="text-sm font-bold uppercase tracking-widest text-orange-brand mb-3">404 Error</div>
        <h1 className="text-3xl md:text-4xl font-black text-white mb-4">Page Not Found</h1>
        <p className="text-blue-light/80 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or may have moved. Try one of these instead:
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">
            Back to Homepage
          </Link>
          <Link
            href="/upcoming-courses"
            className="px-6 py-3 rounded-lg font-semibold text-white border border-white/30 hover:bg-white/10 transition-colors"
          >
            View Upcoming Courses
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-lg font-semibold text-white border border-white/30 hover:bg-white/10 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}

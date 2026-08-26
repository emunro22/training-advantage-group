import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";
import CTASection from "@/components/home/CTASection";
import { Calendar, ArrowRight, Tag } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "News & Updates | Training Advantage Group Ltd",
  description:
    "Latest news, training updates and industry insights from Training Advantage Group Ltd — Scotland's leading transport and industrial training provider.",
};

const ARTICLES = [
  {
    slug: "new-website-launch-2026",
    title: "Introducing Our New Website — Built with Munro Studio",
    excerpt:
      "We're proud to launch our brand new website, built in partnership with Munro Studio. It brings together our full training services, upcoming Apprenticeship & SVQ pathways, and a new secure portal for candidates, instructors, assessors and suppliers — all in one place.",
    date: "26 August 2026",
    category: "Company News",
    readTime: "2 min read",
    color: "bg-green-50 text-green-700",
  },
  {
    slug: "driver-cpc-2026-requirements",
    title: "Driver CPC 2026: What Drivers Need to Know",
    excerpt:
      "As the industry approaches the next five-year DQC renewal cycle, we break down everything professional HGV and PCV drivers need to know about completing their 35 hours of periodic training on time.",
    date: "15 May 2026",
    category: "Driver CPC",
    readTime: "4 min read",
    color: "bg-blue-50 text-blue-brand",
  },
  {
    slug: "tm-cpc-exam-fees-included",
    title: "TAG TM CPC: NLTC Exam Fees Now Included",
    excerpt:
      "We're pleased to confirm that NLTC Qualifications exam fees are now fully included in all TAG Transport Manager CPC packages — saving candidates up to £250 compared to some other providers.",
    date: "8 May 2026",
    category: "TM CPC",
    readTime: "2 min read",
    color: "bg-navy/10 text-navy",
  },
  {
    slug: "npors-expansion-2026",
    title: "Expanded NPORS Plant Training Programme",
    excerpt:
      "TAG has expanded our NPORS plant training programme to include excavator, dumper and rough terrain forklift assessments. New courses now available at all three centres.",
    date: "1 May 2026",
    category: "Plant Training",
    readTime: "3 min read",
    color: "bg-orange-50 text-orange-brand",
  },
  {
    slug: "new-glasgow-centre-2026",
    title: "Glasgow Training Centre — New Facilities",
    excerpt:
      "Our Glasgow South Street training centre has been upgraded with new classroom facilities, updated training equipment and improved learner amenities. Find out what's new.",
    date: "22 April 2026",
    category: "Company News",
    readTime: "3 min read",
    color: "bg-green-50 text-green-700",
  },
  {
    slug: "adr-requalification-reminder",
    title: "ADR Requalification — Don't Let Your Certificate Lapse",
    excerpt:
      "ADR certificates are valid for 5 years. With many certificates issued in 2021 now approaching expiry, we remind operators to check their drivers' ADR status and book requalification early.",
    date: "14 April 2026",
    category: "ADR",
    readTime: "3 min read",
    color: "bg-yellow-50 text-yellow-700",
  },
  {
    slug: "fleet-training-packages-2026",
    title: "Introducing TAG Corporate Fleet Training Packages",
    excerpt:
      "We've launched new corporate fleet training packages for operators with 10+ drivers. Dedicated account management, flexible scheduling and volume pricing — designed for busy transport operations.",
    date: "5 April 2026",
    category: "Fleet Training",
    readTime: "4 min read",
    color: "bg-purple-50 text-purple-700",
  },
];

export default function NewsPage() {
  return (
    <>
      <PageHero
        title="Latest News & Updates"
        subtitle="Industry news, training updates, regulatory changes and company announcements from Training Advantage Group Ltd."
        tag="News"
        breadcrumbs={[{ label: "About TAG", href: "/about" }, { label: "News" }]}
      />

      {/* Articles grid */}
      <section className="py-20 bg-gray-light">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {ARTICLES.map((article, i) => (
              <AnimatedSection key={article.slug} delay={i * 0.06}>
                <article className="bg-white rounded-2xl shadow-card overflow-hidden h-full flex flex-col group">
                  {/* Category bar */}
                  <div className={`px-5 py-2.5 ${article.color} flex items-center gap-1.5`}>
                    <Tag size={11} />
                    <span className="text-xs font-bold uppercase tracking-wide">{article.category}</span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <h2 className="font-black text-navy text-base mb-3 leading-tight group-hover:text-blue-brand transition-colors">
                      {article.title}
                    </h2>
                    <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-4">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={11} />
                        {article.date}
                      </span>
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-2xl font-bold text-navy mb-3">Stay Up to Date</h2>
            <p className="text-gray-600 mb-6">
              Subscribe to our mailing list for training updates, course announcements and transport industry compliance news.
            </p>
            <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
              Contact Us to Subscribe
              <ArrowRight size={16} />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <CTASection />
    </>
  );
}

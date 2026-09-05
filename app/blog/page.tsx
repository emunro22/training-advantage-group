import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";
import CTASection from "@/components/home/CTASection";
import { Calendar, ArrowRight, Tag } from "lucide-react";
import { BLOG_POSTS } from "@/lib/blogPosts";

export const metadata: Metadata = {
  alternates: { canonical: "/blog" },
  title: "Blog | Training Advantage Group Ltd",
  description:
    "Guides and explainers on Driver CPC, Transport Manager CPC, IOSH Managing Safely, first aid qualifications and plant training from Training Advantage Group Ltd.",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const CATEGORY_COLORS: Record<string, string> = {
  "Driver CPC": "bg-blue-50 text-blue-brand",
  "Health & Safety": "bg-green-50 text-green-700",
  "First Aid": "bg-red-50 text-red-brand",
  "TM CPC": "bg-navy/10 text-navy",
  "Plant & MHE": "bg-orange-50 text-orange-brand",
};

export default function BlogPage() {
  const posts = [...BLOG_POSTS].sort((a, b) => (a.publishDate < b.publishDate ? 1 : -1));

  return (
    <>
      <PageHero
        title="TAG Blog"
        subtitle="Guides and explainers on Driver CPC, Transport Manager CPC, health & safety and plant training from Training Advantage Group."
        tag="Blog"
        breadcrumbs={[{ label: "Blog" }]}
      />

      <section className="py-20 bg-gray-light">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <AnimatedSection key={post.slug} delay={i * 0.06}>
                <Link href={`/blog/${post.slug}`} className="block h-full group">
                  <article className="bg-white rounded-2xl shadow-card overflow-hidden h-full flex flex-col">
                    <div
                      className={`px-5 py-2.5 flex items-center gap-1.5 ${
                        CATEGORY_COLORS[post.category] ?? "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <Tag size={11} />
                      <span className="text-xs font-bold uppercase tracking-wide">{post.category}</span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <h2 className="font-black text-navy text-base mb-3 leading-tight group-hover:text-blue-brand transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-4">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={11} />
                          {formatDate(post.publishDate)}
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-blue-brand group-hover:gap-2 transition-all">
                          Read more <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}

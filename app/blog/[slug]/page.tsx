import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";
import CTASection from "@/components/home/CTASection";
import StructuredData from "@/components/seo/StructuredData";
import BlogBody from "@/components/blog/BlogBody";
import { BLOG_POSTS, getAllBlogSlugs, getBlogPostBySlug } from "@/lib/blogPosts";
import { buildArticleSchema } from "@/lib/schema";
import { Calendar, Tag, ArrowRight, ArrowLeft } from "lucide-react";

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    alternates: { canonical: `/blog/${post.slug}` },
    title: `${post.title} | Training Advantage Group Blog`,
    description: post.metaDescription,
  };
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const otherPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <StructuredData
        data={buildArticleSchema({
          title: post.title,
          metaDescription: post.metaDescription,
          publishDate: post.publishDate,
          slug: post.slug,
        })}
      />
      <PageHero
        title={post.title}
        subtitle={post.excerpt}
        tag={post.category}
        breadcrumbs={[{ label: "Blog", href: "/blog" }, { label: post.title }]}
      />

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <AnimatedSection>
            <div className="flex items-center gap-4 text-xs text-gray-400 mb-8 pb-6 border-b border-gray-100">
              <span className="flex items-center gap-1.5">
                <Calendar size={12} /> {formatDate(post.publishDate)}
              </span>
              <span className="flex items-center gap-1.5">
                <Tag size={12} /> {post.category}
              </span>
            </div>

            <BlogBody blocks={post.body} />

            <div className="mt-10 bg-gray-light rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-gray-600">
                Want to know more, or ready to book?
              </p>
              <Link href={post.relatedHref} className="btn-primary inline-flex items-center gap-2">
                {post.relatedLabel}
                <ArrowRight size={16} />
              </Link>
            </div>

            <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-brand hover:text-navy transition-colors mt-8">
              <ArrowLeft size={14} /> Back to Blog
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {otherPosts.length > 0 && (
        <section className="py-16 bg-gray-light">
          <div className="max-w-5xl mx-auto px-4">
            <AnimatedSection className="text-center mb-10">
              <h2 className="section-heading">More from the Blog</h2>
            </AnimatedSection>
            <div className="grid sm:grid-cols-2 gap-6">
              {otherPosts.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="block group">
                  <article className="bg-white rounded-2xl shadow-card p-6 h-full">
                    <span className="text-xs font-bold uppercase tracking-wide text-orange-brand">{p.category}</span>
                    <h3 className="font-bold text-navy mt-2 mb-2 group-hover:text-blue-brand transition-colors">{p.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{p.excerpt}</p>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection />
    </>
  );
}

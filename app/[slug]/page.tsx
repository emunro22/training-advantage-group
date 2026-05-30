import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCustomPageBySlug, getCustomPages } from "@/lib/storage";
import PageHero from "@/components/ui/PageHero";
import CTASection from "@/components/home/CTASection";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const pages = await getCustomPages(true);
    return pages.map((p) => ({ slug: p.slug }));
  } catch {
    // Neon tables may not exist yet on first deploy — return empty and render dynamically
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getCustomPageBySlug(slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.metaDescription ?? page.heroSubtitle ?? page.title,
  };
}

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params;
  const page = await getCustomPageBySlug(slug);

  if (!page || !page.published) {
    notFound();
  }

  return (
    <>
      <PageHero
        title={page.heroTitle ?? page.title}
        subtitle={page.heroSubtitle}
        tag={page.navLabel !== page.title ? page.navLabel : undefined}
        breadcrumbs={[{ label: page.title }]}
        cta={{ label: "Get in Touch", href: "/contact" }}
      />

      {page.content ? (
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div
              className="prose prose-lg prose-navy max-w-none
                prose-headings:font-black prose-headings:text-navy
                prose-h2:text-3xl prose-h3:text-xl
                prose-p:text-gray-600 prose-p:leading-relaxed
                prose-li:text-gray-600
                prose-a:text-blue-brand prose-a:no-underline hover:prose-a:underline
                prose-strong:text-navy
                prose-ul:space-y-1"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </div>
        </section>
      ) : (
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center text-gray-400">
            <p>Content coming soon.</p>
          </div>
        </section>
      )}

      <CTASection />
    </>
  );
}

// Revalidate every 60 seconds so content updates appear quickly
export const revalidate = 60;

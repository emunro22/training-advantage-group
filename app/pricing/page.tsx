import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";
import CourseProductTable from "@/components/ui/CourseProductTable";
import CTASection from "@/components/home/CTASection";
import { getPublishedWebsiteProducts } from "@/lib/storage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/pricing" },
  title: "Course Pricing",
  description:
    "Director-approved pricing for Driver CPC, Transport Manager CPC, HGV/PCV, ADR, Plant, OLAT and First Aid training from Training Advantage Group. All prices exclude VAT unless stated.",
};

export default async function PricingPage() {
  const products = await getPublishedWebsiteProducts();

  const byCategory = new Map<string, typeof products>();
  for (const product of products) {
    const list = byCategory.get(product.category) ?? [];
    list.push(product);
    byCategory.set(product.category, list);
  }

  return (
    <>
      <PageHero
        title="Course Pricing"
        subtitle="Director-approved pricing across all of our transport, compliance and industrial training courses."
        tag="Pricing"
        breadcrumbs={[{ label: "Pricing" }]}
        cta={{ label: "Book Training", href: "/booking" }}
      />

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          {byCategory.size === 0 ? (
            <AnimatedSection className="text-center text-gray-500">
              <p>
                Course pricing is updated regularly — see individual course pages or{" "}
                <a href="/contact" className="text-blue-brand underline">
                  get in touch
                </a>{" "}
                for a quote.
              </p>
            </AnimatedSection>
          ) : (
            <div className="space-y-14">
              {[...byCategory.entries()].map(([category, items]) => (
                <AnimatedSection key={category}>
                  <h2 className="section-heading mb-6">{category}</h2>
                  <CourseProductTable products={items} />
                </AnimatedSection>
              ))}
            </div>
          )}

          <AnimatedSection className="mt-14 text-center">
            <p className="text-sm text-gray-500">
              Prices exclude VAT unless stated otherwise. For courses marked &ldquo;Enquire&rdquo; or
              &ldquo;Quote Required&rdquo;, pricing depends on candidate numbers and delivery location —
              contact us for a tailored quote.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <CTASection />
    </>
  );
}

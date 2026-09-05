export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { FileText, Download } from "lucide-react";
import { getDocuments } from "@/lib/storage";

export const metadata: Metadata = {
  alternates: { canonical: "/downloads" },
  title: "Downloads & Documents | Training Advantage Group",
  description: "Policies, handbooks and course information available to download from Training Advantage Group Ltd.",
};

export default async function DownloadsPage() {
  const documents = await getDocuments(true);
  const byCategory = documents.reduce<Record<string, typeof documents>>((acc, d) => {
    (acc[d.category] ??= []).push(d);
    return acc;
  }, {});
  const categories = Object.keys(byCategory).sort();

  return (
    <>
      <PageHero
        title="Downloads & Documents"
        subtitle="Policies, handbooks, course information and joining resources, available to download at any time."
        tag="Resources"
      />

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          {categories.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <FileText size={32} className="mx-auto mb-3 text-gray-200" />
              <p>No documents are published yet. Check back soon.</p>
            </div>
          ) : (
            <div className="space-y-10">
              {categories.map((category) => (
                <AnimatedSection key={category}>
                  <h2 className="text-lg font-bold text-navy mb-4">{category}</h2>
                  <div className="space-y-2">
                    {byCategory[category].map((doc) => (
                      <a
                        key={doc.id}
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-card p-4 hover:border-blue-brand transition-colors group"
                      >
                        <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-brand transition-colors">
                          <FileText size={18} className="text-orange-brand group-hover:text-white transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-navy text-sm">{doc.title}</div>
                          {doc.description && <div className="text-xs text-gray-500 mt-0.5">{doc.description}</div>}
                        </div>
                        <Download size={16} className="text-gray-300 group-hover:text-blue-brand transition-colors flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import { PAGE_SCHEMAS } from "@/lib/page-schemas";
import { ExternalLink, Edit2, ChevronRight } from "lucide-react";

// Group pages by category
function groupByCategory(schemas: typeof PAGE_SCHEMAS) {
  const groups: Record<string, { slug: string; label: string; url: string }[]> = {};
  for (const [slug, schema] of Object.entries(schemas)) {
    if (!groups[schema.category]) groups[schema.category] = [];
    groups[schema.category].push({ slug, label: schema.label, url: schema.url });
  }
  return groups;
}

export default function ContentAdmin() {
  const groups = groupByCategory(PAGE_SCHEMAS);
  const order = ["Transport", "TM CPC", "Plant", "Health & Safety", "E-Learning", "Consultancy", "Instructors", "Learner", "Company"];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Page Content Editor</h1>
        <p className="text-gray-500 text-sm mt-1">
          Edit hero text, SEO tags and prices for every page — changes go live immediately.
        </p>
      </div>

      {order.map((cat) => {
        const pages = groups[cat];
        if (!pages || pages.length === 0) return null;
        return (
          <section key={cat}>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">{cat}</h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {pages.map(({ slug, label, url }) => (
                <div
                  key={slug}
                  className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3 hover:shadow-sm transition-shadow"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-gray-800">{label}</div>
                    <div className="text-xs text-gray-400 truncate">{url}</div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <a
                      href={url}
                      target="_blank"
                      className="p-2 rounded-lg text-gray-400 hover:text-blue-brand hover:bg-blue-50 transition-colors"
                      title="View page"
                    >
                      <ExternalLink size={14} />
                    </a>
                    <Link
                      href={`/admin/content/${slug}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-navy text-white rounded-lg text-xs font-semibold hover:bg-navy-light transition-colors"
                    >
                      <Edit2 size={12} />
                      Edit
                      <ChevronRight size={12} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

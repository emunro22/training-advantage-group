"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, Save } from "lucide-react";

const NAV_CATEGORIES = [
  { value: "standalone", label: "Standalone top-level nav item" },
  { value: "health-safety", label: "Health & Safety dropdown" },
  { value: "transport", label: "Transport dropdown" },
  { value: "plant", label: "Plant & MHE dropdown" },
  { value: "e-learning", label: "E-Learning dropdown" },
  { value: "consultancy", label: "Consultancy dropdown" },
  { value: "instructors", label: "Instructors dropdown" },
  { value: "about", label: "About dropdown" },
  { value: "none", label: "Not shown in nav" },
];

export default function NewPageAdmin() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    navLabel: "",
    navCategory: "standalone",
    heroTitle: "",
    heroSubtitle: "",
    metaDescription: "",
    content: "",
    published: false,
  });

  function handleTitleChange(title: string) {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    setForm((f) => ({ ...f, title, slug, navLabel: title }));
  }

  async function handleSave(publish: boolean) {
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, published: publish }),
      });

      if (res.ok) {
        router.push("/admin/pages");
      } else {
        const data = await res.json();
        setError(data.error ?? "Failed to save page");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/pages" className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Create New Page</h1>
          <p className="text-gray-500 text-sm mt-0.5">Build a new page and choose where it appears in navigation</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setPreview(false)}
            className={`px-6 py-3.5 text-sm font-semibold transition-colors ${!preview ? "text-navy border-b-2 border-navy" : "text-gray-400 hover:text-gray-600"}`}
          >
            Edit
          </button>
          <button
            onClick={() => setPreview(true)}
            className={`px-6 py-3.5 text-sm font-semibold transition-colors flex items-center gap-1.5 ${preview ? "text-navy border-b-2 border-navy" : "text-gray-400 hover:text-gray-600"}`}
          >
            <Eye size={14} /> Preview
          </button>
        </div>

        {!preview ? (
          <div className="p-6 space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Page Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand transition-colors"
                placeholder="e.g. Fire Safety Training"
                required
              />
            </div>

            {/* Slug + nav label row */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  URL Slug *
                  <span className="ml-1 text-gray-400 font-normal">({`/${form.slug || "your-slug"}`})</span>
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") }))}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand transition-colors font-mono"
                  placeholder="fire-safety-training"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nav Label</label>
                <input
                  type="text"
                  value={form.navLabel}
                  onChange={(e) => setForm((f) => ({ ...f, navLabel: e.target.value }))}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand transition-colors"
                  placeholder="Short label for navigation"
                />
              </div>
            </div>

            {/* Nav placement */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Navigation Placement</label>
              <select
                value={form.navCategory}
                onChange={(e) => setForm((f) => ({ ...f, navCategory: e.target.value }))}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand transition-colors bg-white"
              >
                {NAV_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">
                {form.navCategory === "standalone"
                  ? "Will appear as its own item in the main navigation bar."
                  : form.navCategory === "none"
                  ? "Page will exist but won't appear in the nav."
                  : `Will appear in the "${NAV_CATEGORIES.find(c => c.value === form.navCategory)?.label}" dropdown.`}
              </p>
            </div>

            {/* Hero section */}
            <div className="border-t border-gray-100 pt-5">
              <h3 className="font-bold text-sm text-gray-700 mb-3">Hero Section</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Hero Title</label>
                  <input
                    type="text"
                    value={form.heroTitle}
                    onChange={(e) => setForm((f) => ({ ...f, heroTitle: e.target.value }))}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand transition-colors"
                    placeholder="Defaults to page title if left blank"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Hero Subtitle</label>
                  <textarea
                    value={form.heroSubtitle}
                    onChange={(e) => setForm((f) => ({ ...f, heroSubtitle: e.target.value }))}
                    rows={2}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand transition-colors resize-none"
                    placeholder="Short description shown under the hero title"
                  />
                </div>
              </div>
            </div>

            {/* Meta description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Meta Description
                <span className="ml-1 text-gray-400 font-normal text-xs">(for Google)</span>
              </label>
              <textarea
                value={form.metaDescription}
                onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))}
                rows={2}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand transition-colors resize-none"
                placeholder="Brief description for search engines (150–160 characters)"
                maxLength={160}
              />
              <div className="text-xs text-gray-400 mt-1">{form.metaDescription.length}/160</div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Page Content
                <span className="ml-1 text-gray-400 font-normal text-xs">(HTML supported)</span>
              </label>
              <textarea
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                rows={14}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand transition-colors resize-y font-mono"
                placeholder={`<h2>Section Title</h2>\n<p>Your content here...</p>\n\n<ul>\n  <li>Bullet point one</li>\n  <li>Bullet point two</li>\n</ul>`}
              />
              <p className="text-xs text-gray-400 mt-1">You can use HTML tags: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;/&lt;li&gt;, &lt;strong&gt;, &lt;a href=&quot;...&quot;&gt;</p>
            </div>
          </div>
        ) : (
          /* Preview pane */
          <div className="p-6">
            <div className="bg-gradient-to-br from-navy to-blue-950 rounded-2xl p-8 mb-6">
              <div className="inline-block px-4 py-1.5 bg-orange-brand/20 border border-orange-brand/30 text-orange-brand text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                {form.navCategory !== "none" ? form.navLabel || form.title : "Page Preview"}
              </div>
              <h1 className="text-3xl font-black text-white mb-2">{form.heroTitle || form.title || "Page Title"}</h1>
              {form.heroSubtitle && <p className="text-blue-200/80 text-lg">{form.heroSubtitle}</p>}
            </div>
            <div
              className="prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: form.content || "<p><em>No content yet — add some in the Edit tab.</em></p>" }}
            />
          </div>
        )}

        {/* Action footer */}
        <div className="border-t border-gray-100 p-4 flex items-center justify-between bg-gray-50/50">
          <Link href="/admin/pages" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
            Cancel
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSave(false)}
              disabled={saving || !form.title || !form.slug}
              className="px-4 py-2 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-300 transition-colors disabled:opacity-40"
            >
              Save Draft
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving || !form.title || !form.slug}
              className="flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-xl text-sm font-semibold hover:bg-navy-light transition-colors disabled:opacity-40 shadow-sm"
            >
              <Save size={14} />
              {saving ? "Saving…" : "Publish Page"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

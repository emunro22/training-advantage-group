"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, Save, ImagePlus, Loader2 } from "lucide-react";
import type { CustomPage } from "@/lib/storage";

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

export default function EditPageAdmin() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

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

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/pages");
      const data = await res.json();
      const page = data.pages?.find((p: CustomPage) => p.id === id);
      if (page) {
        setForm({
          title: page.title,
          slug: page.slug,
          navLabel: page.navLabel ?? page.title,
          navCategory: page.navCategory ?? "standalone",
          heroTitle: page.heroTitle ?? "",
          heroSubtitle: page.heroSubtitle ?? "",
          metaDescription: page.metaDescription ?? "",
          content: page.content ?? "",
          published: page.published,
        });
      }
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok && data.url) {
        const ta = contentRef.current;
        const imgTag = `<img src="${data.url}" alt="${file.name}" style="max-width:100%;height:auto;" />`;
        if (ta) {
          const start = ta.selectionStart ?? form.content.length;
          const updated = form.content.slice(0, start) + "\n" + imgTag + "\n" + form.content.slice(start);
          setForm((f) => ({ ...f, content: updated }));
        } else {
          setForm((f) => ({ ...f, content: f.content + "\n" + imgTag + "\n" }));
        }
      } else {
        setError(data.error ?? "Upload failed");
      }
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSave(publish?: boolean) {
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          ...form,
          published: publish !== undefined ? publish : form.published,
        }),
      });

      if (res.ok) {
        router.push("/admin/pages");
      } else {
        const data = await res.json();
        setError(data.error ?? "Failed to save");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center text-gray-400">Loading…</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/pages" className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Edit Page</h1>
          <p className="text-gray-500 text-sm mt-0.5">/{form.slug}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
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
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Page Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand transition-colors"
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">URL Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") }))}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand transition-colors font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nav Label</label>
                <input
                  type="text"
                  value={form.navLabel}
                  onChange={(e) => setForm((f) => ({ ...f, navLabel: e.target.value }))}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand transition-colors"
                />
              </div>
            </div>

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
            </div>

            <div className="border-t border-gray-100 pt-5">
              <h3 className="font-bold text-sm text-gray-700 mb-3">Hero Section</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={form.heroTitle}
                  onChange={(e) => setForm((f) => ({ ...f, heroTitle: e.target.value }))}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand transition-colors"
                  placeholder="Hero title (defaults to page title)"
                />
                <textarea
                  value={form.heroSubtitle}
                  onChange={(e) => setForm((f) => ({ ...f, heroSubtitle: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand transition-colors resize-none"
                  placeholder="Hero subtitle"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Meta Description</label>
              <textarea
                value={form.metaDescription}
                onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))}
                rows={2}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand transition-colors resize-none"
                maxLength={160}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-gray-700">Page Content (HTML)</label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-brand border border-blue-200 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                >
                  {uploading ? <Loader2 size={13} className="animate-spin" /> : <ImagePlus size={13} />}
                  {uploading ? "Uploading…" : "Insert Image"}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </div>
              <textarea
                ref={contentRef}
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                rows={14}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand transition-colors resize-y font-mono"
              />
              <p className="text-xs text-gray-400 mt-1">Images are stored in Vercel Blob and inserted at cursor position.</p>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="bg-gradient-to-br from-navy to-blue-950 rounded-2xl p-8 mb-6">
              <h1 className="text-3xl font-black text-white mb-2">{form.heroTitle || form.title}</h1>
              {form.heroSubtitle && <p className="text-blue-200/80 text-lg">{form.heroSubtitle}</p>}
            </div>
            <div
              className="prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: form.content || "<p><em>No content.</em></p>" }}
            />
          </div>
        )}

        <div className="border-t border-gray-100 p-4 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${form.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
              {form.published ? "Published" : "Draft"}
            </span>
            <button
              onClick={() => setForm((f) => ({ ...f, published: !f.published }))}
              className="text-xs text-gray-400 hover:text-gray-600 underline"
            >
              toggle
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin/pages" className="text-sm text-gray-500 hover:text-gray-700 transition-colors px-3 py-2">
              Cancel
            </Link>
            <button
              onClick={() => handleSave()}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-xl text-sm font-semibold hover:bg-navy-light transition-colors disabled:opacity-40 shadow-sm"
            >
              <Save size={14} />
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

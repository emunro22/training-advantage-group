"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, ExternalLink, CheckCircle2, RotateCcw } from "lucide-react";
import { PAGE_SCHEMAS, type PageField } from "@/lib/page-schemas";

export default function EditPageContent() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const schema = PAGE_SCHEMAS[slug];

  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/content?slug=${slug}`);
    const data = await res.json();
    setValues(data.content ?? {});
    setLoading(false);
  }, [slug]);

  useEffect(() => { load(); }, [load]);

  async function handleSave() {
    setSaving(true);
    setError("");
    setSaved(false);

    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, content: values }),
    });

    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      const d = await res.json();
      setError(d.error ?? "Failed to save");
    }
    setSaving(false);
  }

  function resetField(field: PageField) {
    setValues((v) => ({ ...v, [field.key]: field.defaultValue }));
  }

  function isModified(field: PageField) {
    return values[field.key] !== undefined && values[field.key] !== field.defaultValue;
  }

  if (!schema) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <p className="text-gray-500">Page schema not found for &quot;{slug}&quot;.</p>
        <Link href="/admin/content" className="text-blue-brand text-sm hover:underline mt-3 inline-block">← Back to pages</Link>
      </div>
    );
  }

  // Group fields by section
  const sections: Record<string, PageField[]> = {};
  for (const field of schema.fields) {
    if (!sections[field.section]) sections[field.section] = [];
    sections[field.section].push(field);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/content" className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-gray-900">{schema.label}</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-gray-400 text-sm">{schema.url}</span>
            <a href={schema.url} target="_blank" className="text-gray-400 hover:text-blue-brand transition-colors">
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="flex items-center gap-1.5 text-xs text-green-600 font-semibold bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
              <CheckCircle2 size={13} /> Saved & live
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="flex items-center gap-2 bg-navy text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-navy-light transition-colors disabled:opacity-40 shadow-sm"
          >
            <Save size={15} />
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 text-sm">Loading…</div>
      ) : (
        Object.entries(sections).map(([sectionName, fields]) => (
          <div key={sectionName} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
              <h3 className="font-bold text-sm text-gray-600 uppercase tracking-wide">{sectionName}</h3>
            </div>
            <div className="p-6 space-y-5">
              {fields.map((field) => {
                const modified = isModified(field);
                return (
                  <div key={field.key}>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-sm font-semibold text-gray-700">
                        {field.label}
                        {modified && (
                          <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-semibold">
                            Modified
                          </span>
                        )}
                      </label>
                      {modified && (
                        <button
                          onClick={() => resetField(field)}
                          className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                          title="Reset to default"
                        >
                          <RotateCcw size={11} />
                          Reset
                        </button>
                      )}
                    </div>

                    {field.type === "textarea" ? (
                      <textarea
                        value={values[field.key] ?? field.defaultValue}
                        onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                        rows={3}
                        className={`w-full px-4 py-2.5 border-2 rounded-xl text-sm focus:outline-none transition-colors resize-none ${
                          modified ? "border-orange-300 focus:border-orange-brand" : "border-gray-200 focus:border-blue-brand"
                        }`}
                      />
                    ) : (
                      <div className="relative">
                        {field.type === "price" && (
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">£</span>
                        )}
                        <input
                          type="text"
                          value={values[field.key] ?? field.defaultValue}
                          onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                          className={`w-full py-2.5 border-2 rounded-xl text-sm focus:outline-none transition-colors ${
                            field.type === "price" ? "pl-8 pr-4" : "px-4"
                          } ${
                            modified ? "border-orange-300 focus:border-orange-brand" : "border-gray-200 focus:border-blue-brand"
                          }`}
                        />
                      </div>
                    )}

                    {field.hint && (
                      <p className="text-xs text-gray-400 mt-1">{field.hint}</p>
                    )}
                    {!modified && (
                      <p className="text-xs text-gray-300 mt-1">Default: {field.defaultValue.substring(0, 80)}{field.defaultValue.length > 80 ? "…" : ""}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}

      {/* Sticky save bar */}
      <div className="sticky bottom-4">
        <div className="bg-white/90 backdrop-blur border border-gray-200 rounded-2xl px-5 py-3 flex items-center justify-between shadow-lg">
          <p className="text-xs text-gray-500">Changes save to the database and go live immediately on the public site.</p>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-navy-light transition-colors disabled:opacity-40 shadow-sm"
          >
            <Save size={14} />
            {saving ? "Saving…" : saved ? "Saved ✓" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Eye, Edit2, Trash2, Globe, EyeOff, ExternalLink, FileText } from "lucide-react";
import type { CustomPage } from "@/lib/storage";

const STATIC_PAGES = [
  { title: "Home", url: "/" },
  { title: "About TAG", url: "/about" },
  { title: "HGV & PCV Training", url: "/hgv-training" },
  { title: "Driver CPC", url: "/driver-cpc" },
  { title: "TM CPC", url: "/tm-cpc" },
  { title: "ADR Training", url: "/adr-training" },
  { title: "Plant Training", url: "/plant-training" },
  { title: "E-Learning", url: "/e-learning" },
  { title: "IOSH Managing Safely", url: "/iosh-managing-safely" },
  { title: "Consultancy", url: "/consultancy" },
  { title: "Instructor Training", url: "/instructor-training" },
  { title: "Learner Hub", url: "/learner-hub" },
  { title: "Driver Assessments", url: "/driver-assessments" },
  { title: "Fleet Training", url: "/fleet-training" },
  { title: "Medicals", url: "/medicals" },
  { title: "Module 4 CPC", url: "/module-4-cpc" },
  { title: "PCV Training", url: "/pcv-training" },
  { title: "Theory & Hazard Perception", url: "/theory-hazard-perception" },
  { title: "3A Manoeuvres", url: "/3a-manoeuvres" },
  { title: "Training Centres", url: "/training-centres" },
  { title: "Accreditations", url: "/accreditations" },
  { title: "Testimonials", url: "/testimonials" },
  { title: "News", url: "/news" },
  { title: "Careers", url: "/careers" },
  { title: "Booking", url: "/booking" },
  { title: "Contact", url: "/contact" },
  { title: "Verify Certificate", url: "/verify-certificate" },
  { title: "Learner Hub", url: "/learner-hub" },
  { title: "Policies", url: "/policies" },
];

export default function PagesAdmin() {
  const [customPages, setCustomPages] = useState<CustomPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/pages");
    const data = await res.json();
    setCustomPages(data.pages ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function togglePublish(page: CustomPage) {
    setToggling(page.id);
    await fetch("/api/admin/pages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: page.id, published: !page.published }),
    });
    await load();
    setToggling(null);
  }

  async function deletePage(id: string) {
    if (!confirm("Delete this page? This cannot be undone.")) return;
    setDeleting(id);
    await fetch("/api/admin/pages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await load();
    setDeleting(null);
  }

  const NAV_CATEGORY_LABELS: Record<string, string> = {
    standalone: "Top-level nav item",
    "health-safety": "Health & Safety dropdown",
    transport: "Transport dropdown",
    plant: "Plant & MHE dropdown",
    "e-learning": "E-Learning dropdown",
    consultancy: "Consultancy dropdown",
    instructors: "Instructors dropdown",
    about: "About dropdown",
    none: "Not in nav",
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Pages & Navigation</h1>
          <p className="text-gray-500 text-sm mt-1">Manage existing pages and create new ones</p>
        </div>
        <Link
          href="/admin/pages/new"
          className="flex items-center gap-2 bg-navy text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-navy-light transition-colors shadow-sm"
        >
          <Plus size={16} />
          New Page
        </Link>
      </div>

      {/* Custom pages */}
      <section>
        <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <FileText size={18} className="text-purple-600" />
          Custom Pages ({customPages.length})
        </h2>

        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 text-sm">
            Loading…
          </div>
        ) : customPages.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <FileText size={32} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No custom pages yet.</p>
            <Link href="/admin/pages/new" className="text-blue-brand font-semibold text-sm hover:underline mt-2 inline-block">
              Create your first page →
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {customPages.map((page) => (
              <div key={page.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-sm text-gray-800">{page.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${page.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {page.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    /{page.slug} · {NAV_CATEGORY_LABELS[page.navCategory] ?? page.navCategory}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <a
                    href={`/${page.slug}`}
                    target="_blank"
                    className="p-2 rounded-lg text-gray-400 hover:text-blue-brand hover:bg-blue-50 transition-colors"
                    title="View page"
                  >
                    <ExternalLink size={15} />
                  </a>
                  <button
                    onClick={() => togglePublish(page)}
                    disabled={toggling === page.id}
                    className={`p-2 rounded-lg transition-colors ${page.published ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-50"}`}
                    title={page.published ? "Unpublish" : "Publish"}
                  >
                    {page.published ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <Link
                    href={`/admin/pages/${page.id}/edit`}
                    className="p-2 rounded-lg text-gray-400 hover:text-orange-brand hover:bg-orange-50 transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={15} />
                  </Link>
                  <button
                    onClick={() => deletePage(page.id)}
                    disabled={deleting === page.id}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Static pages reference */}
      <section>
        <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Globe size={18} className="text-blue-brand" />
          Built-in Pages ({STATIC_PAGES.length})
        </h2>
        <p className="text-sm text-gray-500 mb-3">
          These pages are built into the site code. To edit their content deeply, update the source files — or create a custom page with the same topic and link to it from the nav.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {STATIC_PAGES.map((p) => (
            <div key={p.url} className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center justify-between hover:shadow-sm transition-shadow">
              <div>
                <div className="font-semibold text-sm text-gray-700">{p.title}</div>
                <div className="text-xs text-gray-400">{p.url}</div>
              </div>
              <a href={p.url} target="_blank" className="text-gray-300 hover:text-blue-brand transition-colors ml-2">
                <ExternalLink size={13} />
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

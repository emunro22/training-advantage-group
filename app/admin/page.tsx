"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { FileText, Award, Tag, CalendarDays, ArrowRight, Globe, PlusCircle, RefreshCw } from "lucide-react";

interface DashboardStats {
  certificates: number;
  customPages: number;
  publishedPages: number;
  specialOffers: number;
  upcomingCourses: number;
}

// Bust browser cache by appending a timestamp so re-visiting the dashboard
// always gets fresh counts from Neon rather than a stale cached response.
function noCache(url: string) {
  return `${url}?_=${Date.now()}`;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = useCallback(async () => {
    setRefreshing(true);
    try {
      const [certsRes, pagesRes, pricingRes, coursesRes] = await Promise.all([
        fetch(noCache("/api/admin/certificates"), { cache: "no-store" }),
        fetch(noCache("/api/admin/pages"), { cache: "no-store" }),
        fetch(noCache("/api/admin/pricing"), { cache: "no-store" }),
        fetch(noCache("/api/admin/upcoming-courses"), { cache: "no-store" }),
      ]);

      const [certs, pages, pricing, courses] = await Promise.all([
        certsRes.json(),
        pagesRes.json(),
        pricingRes.json(),
        coursesRes.json(),
      ]);

      setStats({
        certificates: certs.certificates?.length ?? 0,
        customPages: pages.pages?.length ?? 0,
        publishedPages: pages.pages?.filter((p: { published: boolean }) => p.published).length ?? 0,
        specialOffers: pricing.specialOffers?.filter((o: { active: boolean }) => o.active).length ?? 0,
        upcomingCourses: courses.courses?.filter((c: { active: boolean }) => c.active).length ?? 0,
      });
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadStats(); }, [loadStats]);

  const STAT_CARDS = [
    {
      label: "Certificates",
      value: stats?.certificates,
      icon: Award,
      color: "bg-blue-50 text-blue-brand",
      href: "/admin/certificates",
      desc: "Total records",
    },
    {
      label: "Custom Pages",
      value: `${stats?.publishedPages ?? "—"} / ${stats?.customPages ?? "—"}`,
      icon: FileText,
      color: "bg-purple-50 text-purple-600",
      href: "/admin/pages",
      desc: "Published / Total",
    },
    {
      label: "Active Offers",
      value: stats?.specialOffers,
      icon: Tag,
      color: "bg-orange-50 text-orange-brand",
      href: "/admin/pricing",
      desc: "Live promotions",
    },
    {
      label: "Upcoming Courses",
      value: stats?.upcomingCourses,
      icon: CalendarDays,
      color: "bg-green-50 text-green-600",
      href: "/admin/upcoming-courses",
      desc: "Active schedule entries",
    },
  ];

  const QUICK_ACTIONS = [
    { label: "Add Certificate", href: "/admin/certificates", icon: Award, desc: "Record a new issued certificate" },
    { label: "Create New Page", href: "/admin/pages/new", icon: PlusCircle, desc: "Build a new site page" },
    { label: "Add Special Offer", href: "/admin/pricing", icon: Tag, desc: "Promote a course or discount" },
    { label: "Schedule a Course", href: "/admin/upcoming-courses", icon: CalendarDays, desc: "Add to upcoming courses" },
    { label: "View Live Site", href: "/", icon: Globe, desc: "Open the live website" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome to the TAG Admin Portal. Manage your content from here.</p>
        </div>
        <button
          onClick={loadStats}
          disabled={refreshing}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-navy border border-gray-200 hover:border-gray-300 px-3 py-2 rounded-xl transition-all"
          title="Refresh stats"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ label, value, icon: Icon, color, href, desc }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all group"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon size={20} />
            </div>
            <div className="text-2xl font-black text-gray-900 mb-0.5">
              {value ?? <span className="text-gray-300 animate-pulse">—</span>}
            </div>
            <div className="font-semibold text-sm text-gray-700">{label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {QUICK_ACTIONS.map(({ label, href, icon: Icon, desc }) => (
            <Link
              key={label}
              href={href}
              target={href === "/" ? "_blank" : undefined}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-orange-brand/30 transition-all group flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-navy/5 group-hover:bg-navy flex items-center justify-center flex-shrink-0 transition-colors">
                <Icon size={18} className="text-navy group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-gray-800 group-hover:text-navy transition-colors">{label}</div>
                <div className="text-xs text-gray-400 truncate">{desc}</div>
              </div>
              <ArrowRight size={14} className="text-gray-300 group-hover:text-orange-brand transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}

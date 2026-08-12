"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Award,
  Tag,
  CalendarDays,
  LogOut,
  Menu,
  Shield,
  ChevronRight,
  PenLine,
  MessageSquare,
  ShoppingBag,
  Briefcase,
  ClipboardCheck,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Website Products", icon: ClipboardCheck },
  { href: "/admin/content", label: "Edit Page Content", icon: PenLine },
  { href: "/admin/pages", label: "Custom Pages & Nav", icon: FileText },
  { href: "/admin/certificates", label: "Certificates", icon: Award },
  { href: "/admin/pricing", label: "Pricing & Offers", icon: Tag },
  { href: "/admin/upcoming-courses", label: "Upcoming Courses", icon: CalendarDays },
  { href: "/admin/vacancies", label: "Job Vacancies", icon: Briefcase },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Close sidebar on route change
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  }

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-navy z-50 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-brand rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield size={18} className="text-white" />
            </div>
            <div>
              <div className="text-white font-black text-sm leading-tight">TAG Admin</div>
              <div className="text-blue-200/60 text-xs">Training Advantage Group</div>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? "bg-orange-brand text-white shadow-lg shadow-orange-brand/30"
                    : "text-blue-100/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <item.icon size={17} className="flex-shrink-0" />
                {item.label}
                {active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-blue-100/60 hover:text-white hover:bg-white/10 transition-all mb-1"
          >
            <FileText size={17} />
            View Live Site
          </a>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-300/80 hover:text-red-300 hover:bg-red-500/10 transition-all w-full"
          >
            <LogOut size={17} />
            {loggingOut ? "Logging out…" : "Log Out"}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-8 h-14 flex items-center gap-4 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu size={20} className="text-gray-600" />
          </button>
          <div className="text-sm text-gray-500">
            {NAV.find((n) => isActive(n.href, n.exact))?.label ?? "Admin"}
          </div>
          <div className="ml-auto">
            <span className="inline-flex items-center gap-1.5 text-xs bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full font-semibold">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              Live
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

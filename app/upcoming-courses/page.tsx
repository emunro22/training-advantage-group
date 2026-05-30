import type { Metadata } from "next";
import { getUpcomingCourses } from "@/lib/storage";
import PageHero from "@/components/ui/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";
import CTASection from "@/components/home/CTASection";
import {
  CalendarDays,
  MapPin,
  Clock,
  Users,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Upcoming Courses | Training Advantage Group",
  description:
    "Browse our upcoming training course dates in Bothwell, Motherwell, Glasgow and online. Book your place today — limited spaces available.",
};

// Always fetch fresh data — never serve a cached build-time snapshot
export const dynamic = "force-dynamic";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(t?: string) {
  if (!t) return null;
  // Convert "09:00" → "9:00am" style
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hour}${m ? `:${String(m).padStart(2, "0")}` : ""}${suffix}`;
}

function monthLabel(date: string) {
  return new Date(date).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

function spotsColor(available: number, total: number) {
  if (available === 0) return "bg-red-100 text-red-700";
  if (available <= Math.ceil(total * 0.25)) return "bg-amber-100 text-amber-700";
  return "bg-green-100 text-green-700";
}

export default async function UpcomingCoursesPage() {
  const courses = await getUpcomingCourses(true);

  // Group by month
  const grouped = courses.reduce<Record<string, typeof courses>>((acc, c) => {
    const key = monthLabel(c.date);
    if (!acc[key]) acc[key] = [];
    acc[key].push(c);
    return acc;
  }, {});

  const months = Object.keys(grouped);

  return (
    <>
      <PageHero
        title="Upcoming Courses"
        subtitle="Browse our scheduled course dates across all locations. Spaces are limited — book early to secure your place."
        tag="Course Dates"
        breadcrumbs={[{ label: "Learner Hub", href: "/learner-hub" }, { label: "Upcoming Courses" }]}
        cta={{ label: "Book a Place", href: "/booking" }}
      />

      <section className="py-16 bg-gray-light min-h-[60vh]">
        <div className="max-w-5xl mx-auto px-4">

          {courses.length === 0 ? (
            <AnimatedSection>
              <div className="bg-white rounded-2xl border border-gray-100 p-14 text-center shadow-sm">
                <CalendarDays size={48} className="text-gray-200 mx-auto mb-4" />
                <h2 className="text-xl font-black text-gray-700 mb-2">No courses scheduled yet</h2>
                <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                  We&apos;re currently updating our schedule. Get in touch and we&apos;ll let you know as soon as dates are confirmed.
                </p>
                <Link href="/contact" className="btn-navy">
                  Contact Us About Upcoming Dates
                </Link>
              </div>
            </AnimatedSection>
          ) : (
            <div className="space-y-10">
              {months.map((month) => (
                <div key={month}>
                  {/* Month header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-px flex-1 bg-gray-200" />
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap px-2">
                      {month}
                    </span>
                    <div className="h-px flex-1 bg-gray-200" />
                  </div>

                  {/* Course cards */}
                  <div className="space-y-3">
                    {grouped[month].map((course) => (
                      <AnimatedSection key={course.id}>
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                          <div className="flex items-stretch">
                            {/* Date block */}
                            <div className="bg-navy text-white flex flex-col items-center justify-center px-5 py-4 min-w-[72px] flex-shrink-0">
                              <div className="text-2xl font-black leading-none">
                                {new Date(course.date).getDate()}
                              </div>
                              <div className="text-[10px] uppercase tracking-wide text-blue-200/70 mt-0.5">
                                {new Date(course.date).toLocaleDateString("en-GB", { month: "short" })}
                              </div>
                            </div>

                            {/* Main content */}
                            <div className="flex-1 px-5 py-4 min-w-0">
                              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                <h3 className="font-black text-navy text-base leading-tight">
                                  {course.courseName}
                                </h3>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {course.price && (
                                    <span className="text-sm font-black text-blue-brand">{course.price}</span>
                                  )}
                                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${spotsColor(course.spotsAvailable, course.totalSpots)}`}>
                                    {course.spotsAvailable === 0
                                      ? "Fully Booked"
                                      : course.spotsAvailable <= Math.ceil(course.totalSpots * 0.25)
                                      ? `${course.spotsAvailable} spots left`
                                      : `${course.spotsAvailable} spaces available`}
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1.5">
                                  <CalendarDays size={14} className="text-gray-400 flex-shrink-0" />
                                  {course.endDate && course.endDate !== course.date
                                    ? `${formatDate(course.date)} – ${formatDate(course.endDate)}`
                                    : formatDate(course.date)}
                                </span>

                                {(course.startTime || course.endTime) && (
                                  <span className="flex items-center gap-1.5">
                                    <Clock size={14} className="text-gray-400 flex-shrink-0" />
                                    {formatTime(course.startTime)}
                                    {course.startTime && course.endTime && " – "}
                                    {formatTime(course.endTime)}
                                  </span>
                                )}

                                <span className="flex items-center gap-1.5">
                                  <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                                  {course.location}
                                </span>

                                {course.totalSpots > 0 && (
                                  <span className="flex items-center gap-1.5">
                                    <Users size={14} className="text-gray-400 flex-shrink-0" />
                                    {course.totalSpots} total places
                                  </span>
                                )}
                              </div>

                              {course.notes && (
                                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                                  {course.notes}
                                </p>
                              )}
                            </div>

                            {/* Book button */}
                            <div className="flex items-center px-4 border-l border-gray-100 flex-shrink-0">
                              {course.spotsAvailable === 0 ? (
                                <Link
                                  href="/contact"
                                  className="text-xs font-semibold text-gray-400 hover:text-navy transition-colors whitespace-nowrap"
                                >
                                  Join waitlist
                                </Link>
                              ) : (
                                <Link
                                  href={course.bookingUrl || `/booking?course=${encodeURIComponent(course.courseName)}`}
                                  className="flex items-center gap-1.5 bg-orange-brand text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-orange-600 transition-colors whitespace-nowrap shadow-sm"
                                >
                                  Book
                                  <ArrowRight size={13} />
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </AnimatedSection>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Info bar */}
          {courses.length > 0 && (
            <AnimatedSection className="mt-10">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h3 className="font-bold text-sm text-navy mb-3">Good to know</h3>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {[
                    "Spaces are limited — booking early is strongly advised",
                    "Can't see your course? Get in touch and we'll arrange a date",
                    "Group bookings available — contact us for pricing",
                    "On-site delivery at your premises can be arranged",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 size={14} className="text-blue-brand flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-3 mt-4">
                  <Link href="/booking" className="btn-navy text-sm py-2 px-4">
                    Book Online
                  </Link>
                  <Link href="/contact" className="btn-outline text-sm py-2 px-4">
                    Enquire
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>

      <CTASection />
    </>
  );
}

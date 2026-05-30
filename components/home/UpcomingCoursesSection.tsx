import { getUpcomingCourses } from "@/lib/storage";
import Link from "next/link";
import { CalendarDays, MapPin, Clock, ArrowRight, Users } from "lucide-react";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(t?: string) {
  if (!t) return null;
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hour}${m ? `:${String(m).padStart(2, "0")}` : ""}${suffix}`;
}

function spotsColor(available: number, total: number) {
  if (available === 0) return "text-red-600 bg-red-50";
  if (available <= Math.ceil(total * 0.25)) return "text-amber-600 bg-amber-50";
  return "text-green-700 bg-green-50";
}

export default async function UpcomingCoursesSection() {
  let courses;
  try {
    courses = await getUpcomingCourses(true);
  } catch {
    return null; // DB not yet set up — hide section gracefully
  }

  // Show at most 5 upcoming
  const preview = courses.slice(0, 5);

  if (preview.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
          <div>
            <span className="tag bg-orange-50 text-orange-brand mb-3 inline-block">Available Now</span>
            <h2 className="section-heading">Upcoming Course Dates</h2>
            <p className="text-gray-500 text-sm mt-1 max-w-xl">
              Upcoming scheduled courses — book your place today. Spaces are limited.
            </p>
          </div>
          <Link
            href="/upcoming-courses"
            className="flex items-center gap-2 text-sm font-bold text-blue-brand hover:text-navy transition-colors whitespace-nowrap"
          >
            View all dates
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Cards */}
        <div className="space-y-3">
          {preview.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex items-stretch"
            >
              {/* Date block */}
              <div className="bg-navy text-white flex flex-col items-center justify-center px-5 py-4 min-w-[68px] flex-shrink-0">
                <div className="text-xl font-black leading-none">
                  {new Date(course.date).getDate()}
                </div>
                <div className="text-[10px] uppercase tracking-wide text-blue-200/70 mt-0.5">
                  {new Date(course.date).toLocaleDateString("en-GB", { month: "short" })}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 px-4 py-3.5 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <span className="font-black text-navy text-sm">{course.courseName}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${spotsColor(course.spotsAvailable, course.totalSpots)}`}>
                    {course.spotsAvailable === 0
                      ? "Fully Booked"
                      : `${course.spotsAvailable} ${course.spotsAvailable === 1 ? "space" : "spaces"} left`}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <CalendarDays size={12} className="flex-shrink-0" />
                    {course.endDate && course.endDate !== course.date
                      ? `${formatDate(course.date)} – ${formatDate(course.endDate)}`
                      : formatDate(course.date)}
                  </span>
                  {(course.startTime || course.endTime) && (
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="flex-shrink-0" />
                      {[formatTime(course.startTime), formatTime(course.endTime)].filter(Boolean).join(" – ")}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <MapPin size={12} className="flex-shrink-0" />
                    {course.location}
                  </span>
                  {course.price && (
                    <span className="font-bold text-blue-brand">{course.price}</span>
                  )}
                </div>
              </div>

              {/* Book */}
              <div className="flex items-center px-4 border-l border-gray-100 flex-shrink-0">
                {course.spotsAvailable === 0 ? (
                  <span className="text-xs text-gray-400 font-semibold">Full</span>
                ) : (
                  <Link
                    href={course.bookingUrl || `/booking?course=${encodeURIComponent(course.courseName)}`}
                    className="flex items-center gap-1 bg-orange-brand text-white text-xs font-bold px-3.5 py-2 rounded-xl hover:bg-orange-600 transition-colors shadow-sm whitespace-nowrap"
                  >
                    Book <ArrowRight size={12} />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {courses.length > 5 && (
          <div className="text-center mt-6">
            <Link
              href="/upcoming-courses"
              className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-navy transition-colors border border-gray-200 hover:border-gray-300 px-5 py-2.5 rounded-xl"
            >
              <Users size={14} />
              View all {courses.length} upcoming courses
              <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

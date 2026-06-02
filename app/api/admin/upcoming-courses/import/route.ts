export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { bulkAddUpcomingCourses, type UpcomingCourse } from "@/lib/storage";
import { cookies } from "next/headers";
import { validateSessionToken, ADMIN_COOKIE } from "@/lib/admin-auth";

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  return !!token && validateSessionToken(token);
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json() as { courses: Partial<UpcomingCourse>[] };
    if (!Array.isArray(body.courses) || body.courses.length === 0) {
      return NextResponse.json({ error: "No courses provided" }, { status: 400 });
    }
    if (body.courses.length > 1000) {
      return NextResponse.json({ error: "Maximum 1000 records per import" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const courses: UpcomingCourse[] = body.courses.map((c, i) => ({
      id: `course-import-${Date.now()}-${i}`,
      courseId: (c.courseId ?? slugify(c.courseName ?? "")).trim(),
      courseName: (c.courseName ?? "").trim(),
      date: (c.date ?? "").trim(),
      endDate: c.endDate?.trim() || undefined,
      startTime: c.startTime?.trim() || undefined,
      endTime: c.endTime?.trim() || undefined,
      location: (c.location ?? "Bothwell").trim(),
      spotsAvailable: Number(c.spotsAvailable ?? c.totalSpots ?? 10),
      totalSpots: Number(c.totalSpots ?? 10),
      price: (c.price ?? "").trim(),
      bookingUrl: c.bookingUrl?.trim() || undefined,
      notes: c.notes?.trim() || undefined,
      active: c.active !== false,
      createdAt: now,
    }));

    const valid = courses.filter((c) => c.courseName && c.date);
    const invalidCount = courses.length - valid.length;

    const result = await bulkAddUpcomingCourses(valid);
    return NextResponse.json({ ...result, invalid: invalidCount }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

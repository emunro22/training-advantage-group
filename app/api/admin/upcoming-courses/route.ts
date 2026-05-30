export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import {
  getUpcomingCourses,
  addUpcomingCourse,
  updateUpcomingCourse,
  deleteUpcomingCourse,
  type UpcomingCourse,
} from "@/lib/storage";
import { cookies } from "next/headers";
import { validateSessionToken, ADMIN_COOKIE } from "@/lib/admin-auth";

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  return !!token && validateSessionToken(token);
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const courses = await getUpcomingCourses();
  return NextResponse.json({ courses });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as Partial<UpcomingCourse>;
    const course: UpcomingCourse = {
      id: `uc-${Date.now()}`,
      courseId: body.courseId ?? "",
      courseName: body.courseName ?? "",
      date: body.date ?? "",
      endDate: body.endDate,
      startTime: body.startTime,
      endTime: body.endTime,
      location: body.location ?? "",
      spotsAvailable: body.spotsAvailable ?? 0,
      totalSpots: body.totalSpots ?? 0,
      price: body.price ?? "",
      bookingUrl: body.bookingUrl,
      notes: body.notes,
      active: body.active ?? true,
      createdAt: new Date().toISOString(),
    };

    if (!course.courseName || !course.date) {
      return NextResponse.json({ error: "Course name and date are required" }, { status: 400 });
    }

    await addUpcomingCourse(course);
    return NextResponse.json({ course }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id, ...updates } = (await request.json()) as { id: string } & Partial<UpcomingCourse>;
    const ok = await updateUpcomingCourse(id, updates);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = (await request.json()) as { id: string };
    const ok = await deleteUpcomingCourse(id);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

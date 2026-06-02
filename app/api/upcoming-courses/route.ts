export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getUpcomingCourses } from "@/lib/storage";

export async function GET() {
  const courses = await getUpcomingCourses(true);
  return NextResponse.json({ courses });
}

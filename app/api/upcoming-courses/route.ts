export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getUpcomingCourses, deletePastUpcomingCourses } from "@/lib/storage";

export async function GET() {
  try { await deletePastUpcomingCourses(); } catch {}
  const courses = await getUpcomingCourses(true);
  return NextResponse.json({ courses });
}

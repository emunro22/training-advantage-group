import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, validateSessionToken } from "@/lib/admin-auth";
import {
  getJobVacancies,
  addJobVacancy,
  updateJobVacancy,
  deleteJobVacancy,
  type JobVacancy,
} from "@/lib/storage";

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  return !!token && validateSessionToken(token);
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const vacancies = await getJobVacancies();
  return NextResponse.json({ vacancies });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json()) as Partial<JobVacancy>;
  if (!body.title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  const vacancy: JobVacancy = {
    id: `vacancy-${Date.now()}`,
    title: body.title,
    type: body.type ?? "",
    location: body.location ?? "",
    description: body.description ?? "",
    requirements: body.requirements ?? [],
    icon: body.icon ?? "💼",
    active: body.active ?? true,
    sortOrder: body.sortOrder ?? 0,
    createdAt: new Date().toISOString(),
  };
  await addJobVacancy(vacancy);
  return NextResponse.json({ vacancy }, { status: 201 });
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id, ...updates } = (await request.json()) as { id: string } & Partial<JobVacancy>;
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }
  const ok = await updateJobVacancy(id, updates);
  return NextResponse.json({ ok });
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = (await request.json()) as { id: string };
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }
  const ok = await deleteJobVacancy(id);
  return NextResponse.json({ ok });
}

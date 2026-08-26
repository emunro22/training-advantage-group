export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, validateSessionToken } from "@/lib/admin-auth";
import {
  getApprenticeshipPathways,
  addApprenticeshipPathway,
  updateApprenticeshipPathway,
  deleteApprenticeshipPathway,
  type ApprenticeshipPathway,
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
  const pathways = await getApprenticeshipPathways();
  return NextResponse.json({ pathways });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json()) as Partial<ApprenticeshipPathway>;
  if (!body.title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  const pathway: ApprenticeshipPathway = {
    id: `pathway-${Date.now()}`,
    icon: body.icon ?? "🎓",
    title: body.title,
    description: body.description ?? "",
    status: body.status ?? "developing",
    sortOrder: body.sortOrder ?? 0,
    active: body.active ?? true,
    createdAt: new Date().toISOString(),
  };
  await addApprenticeshipPathway(pathway);
  return NextResponse.json({ pathway }, { status: 201 });
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id, ...updates } = (await request.json()) as { id: string } & Partial<ApprenticeshipPathway>;
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }
  const ok = await updateApprenticeshipPathway(id, updates);
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
  const ok = await deleteApprenticeshipPathway(id);
  return NextResponse.json({ ok });
}

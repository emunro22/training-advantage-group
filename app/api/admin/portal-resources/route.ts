export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, validateSessionToken } from "@/lib/admin-auth";
import {
  getPortalResources,
  getDistinctPortalAreas,
  addPortalResource,
  updatePortalResource,
  deletePortalResource,
  type PortalResource,
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
  const [resources, areas] = await Promise.all([getPortalResources(), getDistinctPortalAreas()]);
  return NextResponse.json({ resources, areas });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json()) as Partial<PortalResource>;
  if (!body.title || !body.url || !body.area) {
    return NextResponse.json({ error: "Title, URL and area are required" }, { status: 400 });
  }
  const resource: PortalResource = {
    id: `pr-${Date.now()}`,
    title: body.title,
    description: body.description ?? "",
    resourceType: body.resourceType ?? "form_link",
    url: body.url,
    fileName: body.fileName,
    area: body.area,
    sortOrder: body.sortOrder ?? 0,
    active: body.active ?? true,
    createdAt: new Date().toISOString(),
  };
  await addPortalResource(resource);
  return NextResponse.json({ resource }, { status: 201 });
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id, ...updates } = (await request.json()) as { id: string } & Partial<PortalResource>;
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }
  const ok = await updatePortalResource(id, updates);
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
  const ok = await deletePortalResource(id);
  return NextResponse.json({ ok });
}

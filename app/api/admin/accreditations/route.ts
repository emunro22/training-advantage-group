import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { ADMIN_COOKIE, validateSessionToken } from "@/lib/admin-auth";
import {
  getAccreditationLogos,
  addAccreditationLogo,
  updateAccreditationLogo,
  deleteAccreditationLogo,
  type AccreditationLogo,
} from "@/lib/storage";

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  return !!token && validateSessionToken(token);
}

function revalidatePublicPages() {
  try {
    // Footer renders on every page via the root layout — revalidate the whole layout, not just "/".
    revalidatePath("/", "layout");
    revalidatePath("/accreditations");
  } catch {
    // no-op outside Next.js context
  }
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const logos = await getAccreditationLogos();
  return NextResponse.json({ logos });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json()) as Partial<AccreditationLogo>;
  if (!body.name || !body.logoUrl) {
    return NextResponse.json({ error: "Name and logo are required" }, { status: 400 });
  }
  const logo: AccreditationLogo = {
    id: `logo-${Date.now()}`,
    name: body.name,
    typeLabel: body.typeLabel ?? "",
    logoUrl: body.logoUrl,
    linkUrl: body.linkUrl,
    altText: body.altText ?? body.name,
    placement: body.placement ?? "both",
    sortOrder: body.sortOrder ?? 0,
    active: body.active ?? true,
    createdAt: new Date().toISOString(),
  };
  await addAccreditationLogo(logo);
  revalidatePublicPages();
  return NextResponse.json({ logo }, { status: 201 });
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id, ...updates } = (await request.json()) as { id: string } & Partial<AccreditationLogo>;
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }
  const ok = await updateAccreditationLogo(id, updates);
  revalidatePublicPages();
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
  const ok = await deleteAccreditationLogo(id);
  revalidatePublicPages();
  return NextResponse.json({ ok });
}

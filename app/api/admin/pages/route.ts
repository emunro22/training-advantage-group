export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import {
  getCustomPages,
  addCustomPage,
  updateCustomPage,
  deleteCustomPage,
  type CustomPage,
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
  const pages = await getCustomPages();
  return NextResponse.json({ pages });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as Partial<CustomPage>;

    if (!body.slug || !body.title) {
      return NextResponse.json({ error: "Slug and title are required" }, { status: 400 });
    }

    // Check for slug conflicts
    const existing = await getCustomPages();
    if (existing.some((p) => p.slug === body.slug)) {
      return NextResponse.json({ error: "A page with this slug already exists" }, { status: 409 });
    }

    const page: CustomPage = {
      id: `page-${Date.now()}`,
      slug: body.slug.replace(/^\/+/, "").toLowerCase(),
      title: body.title,
      navLabel: body.navLabel ?? body.title,
      navCategory: body.navCategory ?? "standalone",
      content: body.content ?? "",
      heroTitle: body.heroTitle,
      heroSubtitle: body.heroSubtitle,
      metaDescription: body.metaDescription,
      published: body.published ?? false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await addCustomPage(page);
    return NextResponse.json({ page }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id, ...updates } = (await request.json()) as { id: string } & Partial<CustomPage>;
    const ok = await updateCustomPage(id, updates);
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
    const ok = await deleteCustomPage(id);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

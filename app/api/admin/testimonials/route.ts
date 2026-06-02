export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import {
  getTestimonials,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
  type Testimonial,
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
  const testimonials = await getTestimonials();
  return NextResponse.json({ testimonials });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const testimonial: Testimonial = {
      id: `testimonial-${Date.now()}`,
      name: (body.name as string) ?? "",
      company: (body.company as string) ?? "",
      role: (body.role as string) ?? "",
      text: (body.text as string) ?? "",
      rating: (body.rating as number) ?? 5,
      category: body.category as string | undefined,
      active: (body.active as boolean) ?? true,
      featured: (body.featured as boolean) ?? false,
      createdAt: new Date().toISOString(),
    };
    await addTestimonial(testimonial);
    return NextResponse.json({ testimonial }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as { id: string } & Partial<Testimonial>;
    const ok = await updateTestimonial(body.id, body);
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
    await deleteTestimonial(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

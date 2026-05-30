import { NextResponse } from "next/server";
import { getPageContent, savePageContent } from "@/lib/storage";
import { getPageSchema } from "@/lib/page-schemas";
import { cookies } from "next/headers";
import { validateSessionToken, ADMIN_COOKIE } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  return !!token && validateSessionToken(token);
}

export async function GET(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "slug param required" }, { status: 400 });
  }

  const content = await getPageContent(slug);
  const schema = getPageSchema(slug);

  // Merge DB overrides with schema defaults
  const merged: Record<string, string> = {};
  for (const field of schema?.fields ?? []) {
    merged[field.key] = content[field.key] ?? field.defaultValue;
  }

  return NextResponse.json({ content: merged });
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug, content } = (await request.json()) as {
      slug: string;
      content: Record<string, string>;
    };

    if (!slug || !content) {
      return NextResponse.json({ error: "slug and content required" }, { status: 400 });
    }

    // Only save fields that differ from the schema default (keep DB lean)
    const schema = getPageSchema(slug);
    const toSave: Record<string, string> = {};
    for (const [key, value] of Object.entries(content)) {
      const field = schema?.fields.find((f) => f.key === key);
      if (!field || value !== field.defaultValue) {
        toSave[key] = value;
      }
    }

    await savePageContent(slug, toSave);

    // Revalidate the page so changes appear immediately
    try {
      const pageUrl = schema?.url ?? `/${slug}`;
      revalidatePath(pageUrl);
    } catch {
      // revalidatePath is a no-op outside Next.js context (e.g. local dev)
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getCustomPages } from "@/lib/storage";

// Public API — returns published custom pages for use by the nav
export async function GET() {
  const pages = await getCustomPages(true); // published only
  return NextResponse.json(
    { pages: pages.map((p) => ({ slug: p.slug, title: p.title, navLabel: p.navLabel, navCategory: p.navCategory })) },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}

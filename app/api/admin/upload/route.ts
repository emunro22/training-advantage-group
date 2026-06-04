import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Image uploads via blob storage have been removed.
// Images are served from the public/ folder directly.
export async function POST() {
  return NextResponse.json(
    { error: "Image uploads are not available. Add images directly to the public/images folder." },
    { status: 503 }
  );
}

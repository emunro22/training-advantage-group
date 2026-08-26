export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPortalResourceById, getPortalUserById } from "@/lib/storage";
import { PORTAL_COOKIE, validatePortalSessionToken } from "@/lib/portal-auth";

interface Params {
  params: Promise<{ id: string }>;
}

// Re-checks the session AND that the resource's area is one this specific user can see,
// then redirects to the real file — so a document's URL is never rendered directly into
// a portal page, and a leaked/guessed resource id still can't be fetched without a valid,
// authorised session for that exact area.
export async function GET(request: Request, { params }: Params) {
  const { id } = await params;
  const cookieStore = await cookies();
  const session = validatePortalSessionToken(cookieStore.get(PORTAL_COOKIE)?.value);
  if (!session) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const user = await getPortalUserById(session.userId);
  if (!user || !user.active) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const resource = await getPortalResourceById(id);
  const allowedAreas = [user.type, ...user.extraAreas];
  if (!resource || !resource.active || resource.resourceType !== "document" || !allowedAreas.includes(resource.area)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.redirect(resource.url);
}

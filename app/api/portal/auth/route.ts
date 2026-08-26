export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getPortalUserByTagId, updatePortalUser } from "@/lib/storage";
import { verifyAccessCode, makePortalSessionToken, PORTAL_COOKIE, PORTAL_SESSION_MAX_AGE } from "@/lib/portal-auth";

export async function POST(request: Request) {
  try {
    const { tagId, accessCode } = (await request.json()) as { tagId?: string; accessCode?: string };

    if (!tagId || !accessCode) {
      return NextResponse.json({ error: "TAG ID and access code are required" }, { status: 400 });
    }

    // Normalised server-side (not just relied on client formatting) — TAG IDs and access
    // codes are always generated/stored uppercase, and this is a case-sensitive lookup.
    const user = await getPortalUserByTagId(tagId.trim().toUpperCase());

    // Generic error for unknown ID, wrong code, or inactive account — never reveal which.
    if (!user || !user.active || !verifyAccessCode(accessCode.trim().toUpperCase(), user.accessCodeSalt, user.accessCodeHash)) {
      return NextResponse.json({ error: "Invalid TAG ID or access code" }, { status: 401 });
    }

    await updatePortalUser(user.id, { lastLoginAt: new Date().toISOString() });

    const token = makePortalSessionToken(user.id, user.type);
    const response = NextResponse.json({ ok: true, type: user.type });
    response.cookies.set(PORTAL_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: PORTAL_SESSION_MAX_AGE,
      path: "/",
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(PORTAL_COOKIE);
  return response;
}

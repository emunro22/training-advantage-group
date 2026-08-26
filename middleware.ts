import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE } from "@/lib/admin-auth";
import { PORTAL_COOKIE, validatePortalSessionToken, PORTAL_USER_TYPES } from "@/lib/portal-auth";
import { getPortalUserById } from "@/lib/storage";

// Portal session validation uses Node's `crypto` (HMAC + timingSafeEqual), which isn't
// available in the default Edge middleware runtime.
export const runtime = "nodejs";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow the admin login page and auth API through
  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/api/admin/auth")
  ) {
    return NextResponse.next();
  }

  // Protect all /admin/* routes
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    const secret = process.env.ADMIN_SECRET ?? "change-this-secret-in-production";

    if (!token || token !== secret) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Allow the portal login page and auth API through
  if (pathname === "/portal/login" || pathname.startsWith("/api/portal/auth")) {
    return NextResponse.next();
  }

  // Protect /portal/{staff,instructor,supplier,candidate} — the URL segment must match
  // the authenticated session's own type, so a direct URL can never bypass permissions
  // even if a user guesses another type's path.
  if (pathname.startsWith("/portal")) {
    const session = validatePortalSessionToken(request.cookies.get(PORTAL_COOKIE)?.value);
    const requestedType = pathname.split("/")[2];
    const typeMatches =
      !!session &&
      PORTAL_USER_TYPES.includes(requestedType as (typeof PORTAL_USER_TYPES)[number]) &&
      session.type === requestedType;

    // Re-check the user is still active on every request (not just at login) so
    // deactivating someone in admin revokes access immediately, even mid-session.
    const stillActive = typeMatches ? (await getPortalUserById(session!.userId))?.active === true : false;

    if (!typeMatches || !stillActive) {
      const loginUrl = new URL("/portal/login", request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(PORTAL_COOKIE);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*"],
};

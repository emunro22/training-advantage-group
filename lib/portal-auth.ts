// Secure portal auth — separate from admin auth (lib/admin-auth.ts).
// Unlike the admin login (one shared password), each portal user has their own TAG ID +
// access code, so sessions carry real per-user identity, an expiry, and are HMAC-signed
// rather than being the raw secret itself. Requires the Node.js `crypto` module, so
// middleware.ts must run with `export const runtime = "nodejs"`.
import crypto from "crypto";

export const PORTAL_COOKIE = "tag-portal-session";
export const PORTAL_SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days, in seconds

export type PortalUserType = "staff" | "instructor" | "supplier" | "candidate";

export const PORTAL_USER_TYPES: PortalUserType[] = ["staff", "instructor", "supplier", "candidate"];

function getPortalSecret(): string {
  return process.env.PORTAL_SESSION_SECRET ?? "change-this-portal-secret-in-production";
}

// Unambiguous alphabet — no 0/O/1/I/l — so a spoken/handwritten code isn't ambiguous.
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateAccessCode(length = 8): string {
  const bytes = crypto.randomBytes(length);
  let code = "";
  for (let i = 0; i < length; i++) code += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  return code;
}

export function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

export function hashAccessCode(code: string, salt: string): string {
  return crypto.scryptSync(code, salt, 64).toString("hex");
}

export function verifyAccessCode(code: string, salt: string, hash: string): boolean {
  const attempt = Buffer.from(hashAccessCode(code, salt), "hex");
  const expected = Buffer.from(hash, "hex");
  return attempt.length === expected.length && crypto.timingSafeEqual(attempt, expected);
}

interface PortalSession {
  userId: string;
  type: PortalUserType;
  exp: number; // unix seconds
}

function sign(payloadB64: string): string {
  return crypto.createHmac("sha256", getPortalSecret()).update(payloadB64).digest("base64url");
}

export function makePortalSessionToken(userId: string, type: PortalUserType): string {
  const exp = Math.floor(Date.now() / 1000) + PORTAL_SESSION_MAX_AGE;
  const payloadB64 = Buffer.from(`${userId}.${type}.${exp}`).toString("base64url");
  return `${payloadB64}.${sign(payloadB64)}`;
}

export function validatePortalSessionToken(token: string | undefined | null): PortalSession | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, sig] = parts;

  const expectedSig = Buffer.from(sign(payloadB64));
  const actualSig = Buffer.from(sig);
  if (expectedSig.length !== actualSig.length || !crypto.timingSafeEqual(expectedSig, actualSig)) {
    return null;
  }

  const [userId, type, expStr] = Buffer.from(payloadB64, "base64url").toString().split(".");
  const exp = Number(expStr);
  if (!userId || !PORTAL_USER_TYPES.includes(type as PortalUserType) || !exp) return null;
  if (Math.floor(Date.now() / 1000) > exp) return null;

  return { userId, type: type as PortalUserType, exp };
}

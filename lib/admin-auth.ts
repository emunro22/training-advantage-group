// Simple cookie-based admin auth.
// Set ADMIN_PASSWORD and ADMIN_SECRET in your .env.local (and Vercel env vars).
// ADMIN_SECRET is stored in the session cookie — must be kept secret.

export const ADMIN_COOKIE = "tag-admin-session";

export function getAdminSecret(): string {
  return process.env.ADMIN_SECRET ?? "change-this-secret-in-production";
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "tagadmin2024";
}

export function validatePassword(input: string): boolean {
  return input === getAdminPassword();
}

export function makeSessionToken(): string {
  return getAdminSecret();
}

export function validateSessionToken(token: string): boolean {
  return token === getAdminSecret();
}

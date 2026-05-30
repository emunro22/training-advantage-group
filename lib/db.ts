import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

// Returns a tagged-template SQL client connected to Neon.
// Each call is lightweight (HTTP, no persistent connection) — safe in serverless.
export function getDb(): NeonQueryFunction<false, false> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add it to .env.local or Vercel environment variables."
    );
  }
  return neon(url);
}

// Creates all tables if they do not already exist.
// Called lazily on first write operation so the app boots without a DB in local dev.
let migrated = false;

export async function ensureSchema() {
  if (migrated) return;
  const sql = getDb();

  await sql`
    CREATE TABLE IF NOT EXISTS certificates (
      id TEXT PRIMARY KEY,
      certificate_number TEXT UNIQUE NOT NULL,
      holder_first_name TEXT NOT NULL DEFAULT '',
      holder_last_name TEXT NOT NULL,
      course TEXT NOT NULL,
      course_type TEXT NOT NULL DEFAULT '',
      issue_date TEXT NOT NULL DEFAULT '',
      expiry_date TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'valid',
      training_centre TEXT,
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS custom_pages (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      nav_label TEXT NOT NULL,
      nav_category TEXT NOT NULL DEFAULT 'standalone',
      content TEXT NOT NULL DEFAULT '',
      hero_title TEXT,
      hero_subtitle TEXT,
      meta_description TEXT,
      published BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS special_offers (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      discount_type TEXT NOT NULL DEFAULT 'percentage',
      discount_value NUMERIC NOT NULL DEFAULT 0,
      course_id TEXT,
      course_name TEXT,
      valid_until TEXT,
      active BOOLEAN NOT NULL DEFAULT TRUE,
      promo_code TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS price_overrides (
      id TEXT PRIMARY KEY,
      course_id TEXT NOT NULL DEFAULT '',
      course_name TEXT NOT NULL,
      original_price TEXT NOT NULL DEFAULT '',
      override_price TEXT NOT NULL,
      label TEXT,
      active BOOLEAN NOT NULL DEFAULT TRUE
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS upcoming_courses (
      id TEXT PRIMARY KEY,
      course_id TEXT NOT NULL DEFAULT '',
      course_name TEXT NOT NULL,
      date TEXT NOT NULL,
      end_date TEXT,
      location TEXT NOT NULL DEFAULT '',
      spots_available INTEGER NOT NULL DEFAULT 0,
      total_spots INTEGER NOT NULL DEFAULT 0,
      price TEXT NOT NULL DEFAULT '',
      booking_url TEXT,
      notes TEXT,
      active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS page_overrides (
      slug TEXT PRIMARY KEY,
      content JSONB NOT NULL DEFAULT '{}',
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  migrated = true;
}

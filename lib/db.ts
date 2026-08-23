import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

export function getDb(): NeonQueryFunction<false, false> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add it to .env.local or Vercel environment variables."
    );
  }
  return neon(url);
}

// Tracks whether schema creation has run in this serverless instance lifecycle.
// Every new instance starts with migrated = false and re-runs ensureSchema(),
// which uses CREATE TABLE IF NOT EXISTS / ALTER TABLE IF NOT EXISTS — all idempotent.
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
      start_time TEXT,
      end_time TEXT,
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

  await sql`
    CREATE TABLE IF NOT EXISTS testimonials (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      company TEXT NOT NULL DEFAULT '',
      role TEXT NOT NULL DEFAULT '',
      text TEXT NOT NULL,
      rating INTEGER NOT NULL DEFAULT 5,
      category TEXT,
      active BOOLEAN NOT NULL DEFAULT TRUE,
      featured BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      status TEXT NOT NULL DEFAULT 'pending',
      payment_type TEXT NOT NULL DEFAULT 'full',
      amount_paid_pence INTEGER NOT NULL DEFAULT 0,
      total_amount_pence INTEGER NOT NULL DEFAULT 0,
      remaining_balance_pence INTEGER NOT NULL DEFAULT 0,
      square_order_id TEXT,
      square_payment_id TEXT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      company TEXT NOT NULL DEFAULT '',
      course_id TEXT NOT NULL,
      course_name TEXT NOT NULL,
      preferred_date TEXT NOT NULL,
      delegates INTEGER NOT NULL DEFAULT 1,
      location TEXT NOT NULL,
      notes TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS job_vacancies (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT '',
      location TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      requirements JSONB NOT NULL DEFAULT '[]',
      icon TEXT NOT NULL DEFAULT '💼',
      active BOOLEAN NOT NULL DEFAULT TRUE,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  // TAG-WEB-REQ-001 / TAG-WEB-SPEC-001: governed Master Pricing → Website Products catalogue.
  // publish_decision follows the workbook's own workflow: Review Required -> Director Approved
  // -> Web Pending -> Published. Only Published rows may ever be shown on public pages.
  await sql`
    CREATE TABLE IF NOT EXISTS website_products (
      id TEXT PRIMARY KEY,
      publish_decision TEXT NOT NULL DEFAULT 'Review Required',
      price_id TEXT NOT NULL UNIQUE,
      website_product_id TEXT UNIQUE,
      category TEXT NOT NULL,
      course_service TEXT NOT NULL,
      variant TEXT NOT NULL DEFAULT '',
      accreditation TEXT NOT NULL DEFAULT '',
      delivery TEXT NOT NULL DEFAULT '',
      duration_ratio TEXT NOT NULL DEFAULT '',
      max_candidates TEXT NOT NULL DEFAULT '',
      pricing_basis TEXT NOT NULL DEFAULT '',
      price_inc_vat_pence INTEGER NOT NULL DEFAULT 0,
      vat_treatment TEXT NOT NULL DEFAULT 'Standard 20%',
      net_ex_vat_pence INTEGER NOT NULL DEFAULT 0,
      vat_amount_pence INTEGER NOT NULL DEFAULT 0,
      effective_from TEXT,
      effective_to TEXT,
      public_note TEXT NOT NULL DEFAULT '',
      joining_pack_code TEXT,
      issue_pack_code TEXT,
      web_slug TEXT,
      sale_mode TEXT NOT NULL DEFAULT 'enquire',
      director_approved_by TEXT,
      director_approved_at TIMESTAMPTZ,
      independent_check_by TEXT,
      independent_check_at TIMESTAMPTZ,
      last_web_check TEXT,
      needs_verification BOOLEAN NOT NULL DEFAULT TRUE,
      source TEXT NOT NULL DEFAULT 'seed',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  // Append-only audit trail — mirrors the workbook's Website Pricing and Document Publication Log.
  await sql`
    CREATE TABLE IF NOT EXISTS pricing_publication_log (
      id TEXT PRIMARY KEY,
      price_id TEXT,
      change_type TEXT NOT NULL DEFAULT '',
      previous_value TEXT,
      new_value TEXT,
      effective_from TEXT,
      requested_by TEXT,
      approved_by TEXT,
      web_updated_by TEXT,
      published_at TIMESTAMPTZ,
      independent_check_by TEXT,
      verified_at TIMESTAMPTZ,
      evidence_ticket TEXT,
      outcome TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS accreditation_logos (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type_label TEXT NOT NULL DEFAULT '',
      logo_url TEXT NOT NULL,
      link_url TEXT,
      alt_text TEXT NOT NULL DEFAULT '',
      placement TEXT NOT NULL DEFAULT 'both',
      sort_order INTEGER NOT NULL DEFAULT 0,
      active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT 'General',
      file_url TEXT NOT NULL,
      file_name TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  // ALTER TABLE migrations — each wrapped individually so one failure never blocks the rest
  const migrations = [
    sql`ALTER TABLE upcoming_courses ADD COLUMN IF NOT EXISTS start_time TEXT`,
    sql`ALTER TABLE upcoming_courses ADD COLUMN IF NOT EXISTS end_time TEXT`,
    sql`ALTER TABLE upcoming_courses ADD COLUMN IF NOT EXISTS website_product_id TEXT`,
    sql`ALTER TABLE upcoming_courses ADD COLUMN IF NOT EXISTS image_url TEXT`,
    sql`ALTER TABLE upcoming_courses ADD COLUMN IF NOT EXISTS vat_status TEXT`,
    sql`ALTER TABLE upcoming_courses ADD COLUMN IF NOT EXISTS entry_requirements TEXT`,
    sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS square_order_id TEXT`,
    sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS square_payment_id TEXT`,
    sql`ALTER TABLE certificates ADD COLUMN IF NOT EXISTS accredited_by JSONB DEFAULT '[]'`,
    sql`ALTER TABLE certificates ADD COLUMN IF NOT EXISTS accredited_ref TEXT`,
    // TAG-WEB-SPEC-001 §3 Order Data Contract additions
    sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_ref TEXT`,
    sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS website_product_id TEXT`,
    sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS tag_price_id TEXT`,
    sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS net_ex_vat_pence INTEGER`,
    sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS vat_amount_pence INTEGER`,
    sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS vat_treatment TEXT`,
    sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS terms_version TEXT`,
    sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS privacy_notice_version TEXT`,
    sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS candidate_registration_required BOOLEAN DEFAULT TRUE`,
    sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS joining_pack_code TEXT`,
    sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS issue_pack_code TEXT`,
    sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS validation_status TEXT DEFAULT 'received'`,
    sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS error_code TEXT`,
    sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS reconciliation_status TEXT DEFAULT 'unmatched'`,
    sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS handoff_sent_at TIMESTAMPTZ`,
    sql`CREATE UNIQUE INDEX IF NOT EXISTS orders_order_ref_idx ON orders(order_ref) WHERE order_ref IS NOT NULL`,
    // Power Automate notification format additions
    sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS source_page TEXT`,
    sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS consent_given BOOLEAN DEFAULT FALSE`,
    sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS consent_given_at TIMESTAMPTZ`,
    sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_code TEXT`,
    sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount_pence INTEGER DEFAULT 0`,
  ];
  for (const m of migrations) {
    try { await m; } catch (e) { console.warn("[db] migration skipped:", e); }
  }

  migrated = true;
}

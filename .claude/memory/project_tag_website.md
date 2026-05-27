---
name: tag-nextjs-website
description: Training Advantage Group Ltd Next.js website redesign — full stack app with booking system and email
metadata:
  type: project
---

Complete Next.js 16 TypeScript website built at `c:\Users\emunro\training-advantage-group`.

**Why:** Full premium redesign from static HTML to Next.js with Framer Motion animations, booking system, and email notifications. Based on detailed design document provided by user.

**Tech stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS, Framer Motion, Nodemailer, React Hook Form, Zod, Lucide React.

**Brand colors (in tailwind.config.ts):**
- Navy: `#0d1b4b` (`navy-*`)
- Blue: `#0066cc` (`blue-brand`)
- Orange: `#ff6600` (`orange-brand`)
- Red: `#cc0000` (`red-brand`)

**Key pages built:**
- `/` – Homepage (Hero, ServiceCards, Stats, WhyChoose, Testimonials, Locations, Accreditations, CTA)
- `/driver-cpc`, `/tm-cpc`, `/hgv-training`, `/adr-training`
- `/plant-training`, `/e-learning`, `/consultancy`, `/instructor-training`
- `/booking` – 3-step booking form with email confirmation
- `/contact` – Contact form with email
- `/about`, `/learner-hub`, `/policies`

**Email system:** Nodemailer in `lib/email.ts`. Uses SMTP (configured via `.env.local`). API routes at `/api/booking` and `/api/contact`.

**Email setup required:** Copy `.env.local.example` → `.env.local`, fill in `SMTP_USER` and `SMTP_PASS`. For Gmail, use an App Password (not main password).

**Images:** Existing images copied to `public/images/`. Logo at `public/images/logo.png`.

**How to apply:** When working on this project, the Next.js app is the primary codebase. Old static HTML files (index.html, etc.) are legacy and can be ignored.

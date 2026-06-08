# Pluscode landing page

Marketing site for Pluscode — a software house & AI consultancy — built on
**Next.js 16**, **Payload CMS 3** (Postgres), and **Tailwind CSS v4**. The
design system mirrors the FH Trade template (dark "night" sections, cool light
surfaces, grain texture, Lenis smooth scroll, Framer Motion) with an
electric-blue brand accent.

## Stack

- **Next.js 16** (App Router) — frontend under `app/(frontend)/[lang]/`, Payload
  admin/API under `app/(payload)/`.
- **Payload CMS 3** + Postgres — collections: Users, Media, Case Studies,
  Insights, Announcements, Team. Localized content (EN default, PL).
- **i18n** — locale routing via `proxy.ts` + per-locale `dictionaries/{en,pl}.json`.
  All UI copy lives in the dictionaries; the CMS fills in case studies, insights,
  the announcement banner and team. Pages fall back to dictionary content when the
  database is unavailable, so the site builds and renders without a DB.
- **Contact form** — Resend email + Google reCAPTCHA v3 (`app/api/contact`).

## Getting started

1. **Start Postgres** (Docker):

   ```bash
   cp .env.example .env   # then fill in PAYLOAD_SECRET, Resend & reCAPTCHA keys
   docker compose up -d    # brings up Postgres on localhost:5434
   ```

2. **Install & generate Payload artifacts:**

   ```bash
   pnpm install
   pnpm payload generate:types
   pnpm payload generate:importmap
   ```

3. **Run migrations & seed sample content:**

   ```bash
   pnpm migrate
   pnpm seed     # admin user + sample case studies, insights, team, announcement
   ```

4. **Develop:**

   ```bash
   pnpm dev
   ```

   - Site: <http://localhost:3000> (redirects to `/en`)
   - Admin: <http://localhost:3000/admin> (default seed login: `admin@pluscode.io` / `changeme123`)

## Scripts

| Script | Description |
| --- | --- |
| `pnpm dev` / `pnpm build` / `pnpm start` | Next.js dev / build / serve |
| `pnpm payload generate:types` | Regenerate `payload-types.ts` from the config |
| `pnpm payload generate:importmap` | Regenerate the admin import map |
| `pnpm migrate` / `pnpm migrate:create` | Run / create Payload migrations |
| `pnpm seed` | Idempotent content seeder |
| `pnpm lint` | ESLint |

## Production

`docker compose --profile prod up --build` builds the app image and runs
`payload migrate && next start` against the bundled Postgres. Put a reverse
proxy in front for TLS.

## Structure

```
app/(frontend)/[lang]/   # public site (pages + components)
app/(payload)/           # Payload admin + REST/GraphQL API (generated)
app/api/contact/         # contact form handler (Resend + reCAPTCHA)
collections/             # Payload collection configs
dictionaries/{en,pl}.json# all UI copy
lib/                     # CMS access, i18n, content helpers
scripts/seed.ts          # sample content seeder
```

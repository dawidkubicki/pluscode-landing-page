# pluscode.io

The website of Pluscode. Pluscode is a software company creating the software
of the future, with AI.

Four pages (Home, About, News, Contact) plus Privacy Policy and Terms of use,
in English and Polish, with the copy editable in a CMS.

## Stack

- **Next.js 16** (App Router). The site is under `app/(frontend)/[lang]/`, the
  Payload admin and API under `app/(payload)/`.
- **Payload CMS 3** on Postgres (`@payloadcms/db-postgres`), configured in
  `payload.config.ts`.
- **Tailwind CSS v4**.
- **Two languages**, `en` (default) and `pl`, carried in the URL (`/en`,
  `/pl`) by `proxy.ts`. Static copy lives in `dictionaries/{en,pl}.json`.

## Content

### What an editor sees in the admin

| Group | Entry | What it is |
| --- | --- | --- |
| Pages | Home, About, News page, Contact | The copy of each page. Globals `home-page`, `about-page`, `news-page`, `contact-page`. |
| Content | News | Articles. Only published ones are shown, newest first. Slug `insights`. |
| Content | People | The portrait cards on Home and About. Slug `team`. |
| Content | Portfolio | The products on Home. Slug `products`. |
| Content | Media | Uploaded images. |
| Inbox | Messages | What the contact form sends. Slug `bookings`. |
| Admin | Users | Who can sign in. |

That is also the order of the sidebar. Payload lists entries without a group
first, so the page globals have none and their built in heading is renamed to
"Pages" in `payload.config.ts`. Every collection has a group; give a new one a
group too, or it will sit above the pages.

The admin offers English and Polish. German is still a Payload locale, because
the database holds German rows from the previous site and old migrations write
them, but `localization.filterAvailableLocales` keeps it out of the language
menu and the site does not serve it.

### What is hidden

`collections/legacy/` and `globals/legacy/` hold the collections of the
previous site: case studies, announcements, reports, use cases, trust logos,
clients, hero slides and the use case section heading. Nothing reads them.
They stay in the config with `admin.hidden: true` because their tables hold
real rows, and because earlier migrations create rows in them through the
Local API, which needs the collection to exist.

Nothing from the previous site was dropped: no table, no column, no enum value.

### The CMS wins over the dictionary once seeded

Each page global mirrors an object in the dictionaries field for field
(`homePage`, `aboutPage`, `newsPage`, `contactPage`), and `people` and
`products` in the dictionaries mirror the People and Portfolio collections.
The pages never read those keys directly. They call the helpers in `lib/`:

| Helper | Reads | Falls back to |
| --- | --- | --- |
| `lib/pages.ts` | the four page globals | `homePage`, `aboutPage`, `newsPage`, `contactPage` |
| `lib/people.ts` | `team`, in Order | `people` |
| `lib/products.ts` | `products`, in Order | `products` |
| `lib/news.ts` | published `insights` | nothing: no news means an empty list |

A helper resolves every field on its own, in this order:

1. the CMS value in the language asked for
2. the dictionary value in that language
3. the CMS value in English

An empty CMS field counts as no value, so clearing a field in the admin brings
the dictionary text back. The helpers never throw. With no database at all, as
during `next build`, they return the dictionaries untouched.

The consequence to remember: **production was seeded from the dictionaries on
first deploy, so editing that copy in `dictionaries/*.json` afterwards changes
nothing on the live site.** It changes a fresh database and the build without
a database, and that is all. To change live copy, edit it in the admin, or
ship a migration that updates the row.

A person or product added in the admin needs a photo or a logo to be shown.
The two portraits and the Quanty logo ship with the site in `public/assets/`
and are used until an upload replaces them.

Syntax in the page copy: a blank line separates paragraphs, and in the
portfolio statement on Home, words in `[square brackets]` become chips.

### How content ships

Content ships in migrations, not in seed scripts. Production runs
`pnpm payload migrate && pnpm start` on container boot, so a content migration
reaches the database with the deploy that needs it.

`20261014_091000_seed_portfolio_and_pages` reads the dictionaries and

- leaves exactly two people in `team`, with their English and Polish role and
  bio,
- inserts each dictionary product whose slug is not there yet,
- fills each page global, but only while its table is still empty.

It never overwrites text an editor has saved, and running it twice changes
nothing.

## Migrations

Migrations are **hand written SQL**, every statement guarded (`IF NOT EXISTS`,
`ON CONFLICT`, `DO $$ ... EXCEPTION WHEN duplicate_object`), because a
migration that throws on boot takes the site down.

- `pnpm migrate:create` is not usable here. The snapshots under `migrations/`
  stop at `20260823`, so it would emit `CREATE TABLE` for tables that already
  exist. Write the file by hand and add it to `migrations/index.ts`.
- To get the DDL right, let Payload push the config into an empty scratch
  database (boot it outside production), dump that table with
  `pg_dump --schema-only`, and mirror it. Then run the whole chain into a
  second empty database and diff the two dumps.
- A migration that has shipped is history: add a new one instead of editing
  it. The exception is a fix that only matters when the chain is replayed into
  an empty database, and such a file says so in its header.
- Prefer SQL to the Local API inside a migration. The Local API speaks the
  schema of the current config, which is ahead of the database at every
  earlier point in the chain.
- **Never run `pnpm migrate` against a development database that Payload
  created by pushing the schema.** In development Payload pushes the config on
  start, which is all a local database needs.

## Getting started

```bash
cp .env.example .env        # then set PAYLOAD_SECRET
docker compose up -d db     # Postgres on 127.0.0.1:5434
pnpm install
pnpm dev                    # pushes the schema, serves http://localhost:3000
pnpm seed                   # creates the admin user from SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD
```

The site is at <http://localhost:3000> and redirects to `/en`. The admin is at
<http://localhost:3000/admin>.

A database built by push never runs the migrations, so it does not get the
seeded people, product and page copy: the pages show the dictionaries, or
whatever rows that database already holds. To work against the seeded state,
create an empty database, point `DATABASE_URI` at it and run
`NODE_ENV=production pnpm migrate` once, before the first `pnpm dev`. Once
`pnpm dev` has touched a database, do not run `pnpm migrate` against it again.

## Scripts

| Script | What it does |
| --- | --- |
| `pnpm dev` / `pnpm build` / `pnpm start` | Next.js dev, build, serve |
| `pnpm lint` | ESLint |
| `pnpm generate:types` | Regenerate `payload-types.ts` after a config change |
| `pnpm generate:importmap` | Regenerate the admin import map |
| `pnpm migrate` / `pnpm migrate:status` | Run pending migrations, list them |
| `pnpm seed` / `pnpm seed:prod` | Create the admin user, from `.env` or from the environment |
| `pnpm generate:og` | Render the social preview image |

## Production

Pushing to `master` builds the Docker image and restarts the container, which
runs `pnpm payload migrate && pnpm start`. Locally,
`docker compose --profile prod up --build` does the same against the bundled
Postgres.

## Structure

```
app/(frontend)/[lang]/   the public site
app/(payload)/           Payload admin and API (generated)
collections/             Payload collections; legacy/ is hidden from the admin
globals/                 the four page globals; legacy/ is hidden from the admin
migrations/              hand written, run on boot
dictionaries/{en,pl}.json  static copy, and the fallback for CMS copy
lib/                     data helpers, i18n, SEO
scripts/seed.ts          creates the admin user
```

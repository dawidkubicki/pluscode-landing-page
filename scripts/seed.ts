/**
 * Development seed: one admin user, so a fresh database has a login.
 *
 * Nothing else. The people, the portfolio and the page copy ship in
 * migrations/20261014_091000_seed_portfolio_and_pages.ts, which runs with
 * `pnpm migrate` and on every container boot, so there is no content left for
 * a script to add.
 *
 *   pnpm seed        local, reads .env
 *   pnpm seed:prod   in the container, reads the environment
 *
 * Safe to re-run: an existing user with that email is left exactly as it is,
 * password included. There is no built in default login, on purpose: this can
 * run against production, and a known password must never end up there.
 */
import { getPayload } from "payload";
import config from "../payload.config.ts";

const email = process.env.SEED_ADMIN_EMAIL?.trim();
const password = process.env.SEED_ADMIN_PASSWORD;

if (!email || !password) {
  console.error("Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD to seed the admin user.");
  process.exit(1);
}

const payload = await getPayload({ config });

const existing = await payload.find({
  collection: "users",
  where: { email: { equals: email } },
  limit: 1,
  depth: 0,
});

if (existing.docs.length > 0) {
  console.log(`users: ${email} already exists, left as it is`);
} else {
  await payload.create({
    collection: "users",
    data: { email, password, name: "Admin" },
  });
  console.log(`users: created ${email}`);
}

process.exit(0);

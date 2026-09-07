/**
 * Reconciles the `team` collection with the two real people.
 *
 * scripts/seed.ts only creates records that do not exist yet, so a database
 * seeded before the team was corrected still carries the old placeholder
 * members, and /about still lists people who do not work here. This script is
 * the repair: it upserts Dawid and Krzysztof from scripts/content/team.ts,
 * uploads their portraits, writes the Polish and German role and bio, and
 * deletes every other team document.
 *
 * Idempotent: re-running updates the same two documents in place and pushes the
 * current portrait over the one already in the media library.
 *
 * Local:          node --env-file=.env --import tsx scripts/seed-team.ts
 * In production:  docker compose exec landing-pluscode node --import tsx scripts/seed-team.ts
 */
import fs from "node:fs";
import path from "node:path";
import { getPayload } from "payload";
import config from "../payload.config.ts";
import { TEAM, TEAM_LOCALES, copyFor, photoPath, teamDoc } from "./content/team.ts";

const payload = await getPayload({ config });

const keptIds: (string | number)[] = [];

for (const person of TEAM) {
  const file = photoPath(person);
  if (!fs.existsSync(file)) throw new Error(`Missing portrait: ${file}`);
  const filename = path.basename(file);

  // The portrait on disk is the source of truth. Drop any document already
  // holding this filename before uploading, rather than updating it in place:
  // an update writes a second file beside the old one and takes a deduplicated
  // name ("dawid-kubicki-1.jpg"), so a re-run would slowly orphan portraits.
  const media = await payload.find({
    collection: "media",
    where: { filename: { equals: filename } },
    limit: 1,
  });
  const previous = media.docs[0];
  if (previous) await payload.delete({ collection: "media", id: previous.id });
  const photoId = (
    await payload.create({
      collection: "media",
      data: { alt: person.name },
      filePath: file,
    })
  ).id;
  console.log(`  ${previous ? "↻ replaced" : "↑ uploaded"} ${filename}`);

  const found = await payload.find({
    collection: "team",
    where: { name: { equals: person.name } },
    limit: 1,
    locale: "en",
  });
  const data = { ...teamDoc(person), photo: photoId } as never;

  let id: string | number;
  if (found.docs[0]) {
    id = found.docs[0].id;
    await payload.update({ collection: "team", id, locale: "en", data });
    console.log(`✓ updated  ${person.name}`);
  } else {
    id = (await payload.create({ collection: "team", locale: "en", data })).id;
    console.log(`✓ created  ${person.name}`);
  }
  keptIds.push(id);

  for (const locale of TEAM_LOCALES) {
    if (locale === "en") continue;
    await payload.update({
      collection: "team",
      id,
      locale,
      data: copyFor(person, locale) as never,
    });
    console.log(`  + ${locale}`);
  }
}

// Anything else in the collection is a placeholder from an earlier seed. The
// homepage says two named people do the work, so /about may not list a third.
const all = await payload.find({ collection: "team", limit: 200, locale: "en" });
for (const doc of all.docs) {
  if (keptIds.some((id) => String(id) === String(doc.id))) continue;
  await payload.delete({ collection: "team", id: doc.id });
  console.log(`✗ removed placeholder "${doc.name}"`);
}

console.log(`\nTeam reconciled: ${keptIds.length} people.`);
process.exit(0);

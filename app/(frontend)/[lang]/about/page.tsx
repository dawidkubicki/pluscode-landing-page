import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "../components/page-hero";
import Banner from "../components/banner";
import Stats from "../components/stats";
import Footer from "../components/footer";
import { Reveal, Stagger, StaggerItem } from "../components/motion";
import { Eyebrow, Plus } from "../components/ui";
import { LinkedInIcon, MailIcon } from "../components/icons";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getTeam } from "@/lib/team";

export const revalidate = 60;

const resolve = (lang: string): Locale => (isLocale(lang) ? lang : defaultLocale);

/* ------------------------------------------------------------------ *
 *  THE ROSTER, AND WHY THE PAGE IS BUILT FROM IT RATHER THAN FROM THE CMS.
 *
 *  Pluscode is two people. This page used to render whatever the `team`
 *  collection happened to hold, falling back to the dictionary only when the
 *  collection was completely empty. Production's collection was not empty: it
 *  still held the placeholder seed, so /about spent months introducing
 *  "Engineering Lead, Head of Engineering" and "Design Lead, Head of Design"
 *  to every visitor. Two of the three people on the page did not exist, and
 *  the one who does but was missing, Krzysztof, was nowhere.
 *
 *  So the loop is inverted. The page iterates THIS list, never the CMS
 *  response, and a CMS row is consulted only after it has been matched to a
 *  name that is on it. A row for somebody who does not work here is not
 *  filtered out at the end, it is never reached: there is no code path from a
 *  `team` document to the screen that does not start here. A database holding
 *  "Design Lead" cannot print "Design Lead" again, however it got there, and
 *  the same is true of the next placeholder somebody seeds by accident.
 *
 *  The CMS is still in charge of everything it is good at. For a matched
 *  person it supplies the role, the bio, the portrait and the contact details,
 *  because those are the fields an editor is meant to be able to change. Each
 *  one falls back independently: the portraits below ship in the repo, and the
 *  role and bio fall back to the dictionary, so a half filled record renders a
 *  complete person instead of a gap. Deleting the whole collection, or losing
 *  the database, leaves the page correct.
 *
 *  The caption and the quote come from `home.founders` rather than from a
 *  second set of strings written for this page. There is one description of
 *  each of these two people on the site and the homepage People band owns it;
 *  /about adds the longer bio and the way to reach them, and repeats nothing.
 *
 *  Adding a person means adding a real one, here and in
 *  scripts/content/team.ts, which is the same list for the seed scripts.
 * ------------------------------------------------------------------ */
const ROSTER = [
  {
    /** Key under pages.about.team.members and under home.founders.items. */
    key: "dawid",
    name: "Dawid Kubicki",
    photo: "/assets/team/dawid-kubicki.jpg",
    email: "contact@pluscode.io",
    linkedin: "https://www.linkedin.com/company/pluscode",
  },
  {
    key: "krzysztof",
    name: "Krzysztof Suliński",
    photo: "/assets/team/krzysztof-sulinski.jpg",
    email: "contact@pluscode.io",
    linkedin: null,
  },
] as const;

/** The two of them in one frame, for the story band. 1350 by 1800, so 3:4. */
const PAIR_PHOTO = "/assets/team/founders.jpg";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = getDictionary(resolve(lang)).pages.about;
  return { title: t.title, description: t.subtitle };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = resolve(lang);
  const dict = getDictionary(locale);
  const t = dict.pages.about;

  /* The CMS is a lookup table here, not a list to render. `find` by name is
     the whole filter: a row nobody on the roster is named after is simply
     never found, and every field it might have supplied falls back. */
  const cms = await getTeam(locale);
  const people = ROSTER.map((person) => {
    const row = cms.find((m) => m.name === person.name);
    const copy = t.team.members[person.key];
    const said = dict.home.founders.items.find((i) => i.key === person.key);
    return {
      key: person.key,
      name: person.name,
      role: row?.role ?? copy.role,
      bio: row?.bio ?? copy.bio,
      caption: said?.caption ?? null,
      quote: said?.quote ?? null,
      photo: row?.photo?.url ?? person.photo,
      email: row?.email ?? person.email,
      linkedin: row?.linkedin ?? person.linkedin,
    };
  });

  const values = Object.values(t.values.items);

  return (
    <main>
      <PageHero
        eyebrow={t.label}
        title={t.title}
        intro={t.subtitle}
        cta={{ label: t.cta.cta, href: "/book-a-call" }}
      />

      {/* Story. The text runs in six columns and the photograph fills the
          last four, at the same 3:4 register as the portraits below it. The
          plate used to be an abstract SVG; a page about the company is the
          one place where a picture of the company is the better object. */}
      <section className="bg-paper py-20 md:py-[104px]">
        <div className="pc-shell">
          <div className="pc-grid">
            <div className="col-span-4 md:col-span-6">
              <Reveal>
                <Eyebrow>{t.story.label}</Eyebrow>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-4 text-heading-lg text-ink">
                  {t.story.title}
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="mt-6 space-y-4 text-[1.125rem] leading-[1.375] text-moss">
                  <p className="max-w-[46ch]">{t.story.paragraph1}</p>
                  <p className="max-w-[46ch]">{t.story.paragraph2}</p>
                </div>
              </Reveal>
            </div>
            <Reveal
              delay={0.1}
              className="col-span-4 mt-12 md:col-start-9 md:mt-0"
            >
              <figure>
                <div className="relative aspect-[3/4] overflow-hidden bg-paper-dim">
                  <Image
                    src={PAIR_PHOTO}
                    alt={t.story.imageAlt}
                    fill
                    sizes="(min-width: 768px) 33vw, 92vw"
                    className="object-cover object-center grayscale contrast-[1.02]"
                  />
                </div>
                <figcaption className="mt-4 text-[0.875rem] text-moss">
                  {t.story.caption}
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      {/* How we work. Four cells of three columns, ruled at the top rather
          than boxed, so they land on the same columns as every other band. */}
      <section className="bg-paper-dim py-20 md:py-[104px]">
        <div className="pc-shell">
          <div className="pc-grid">
            <div className="col-span-4 md:col-span-8">
              <Reveal>
                <Eyebrow>{t.values.label}</Eyebrow>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-4 text-heading-lg text-ink">
                  {t.values.title}
                </h2>
              </Reveal>
            </div>
          </div>
          <Stagger className="pc-grid mt-16 md:mt-24" gap={0.08}>
            {values.map((v) => (
              <StaggerItem
                key={v.title}
                className="col-span-4 border-t border-rule pt-8 md:col-span-3"
              >
                <article>
                  <Plus className="size-5 text-moss" />
                  <h3 className="mt-5 text-heading-sm text-ink">{v.title}</h3>
                  <p className="mt-3 text-[1.125rem] leading-[1.375] text-moss">
                    {v.description}
                  </p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <Stats locale={locale} />

      {/* Team. One row per person rather than two cards side by side: this is
          the page about the company, so each of them gets the portrait at a
          size worth printing, the longer bio, the line they say on the
          homepage and a way to reach them. The photo register is the one the
          page has always used, 3:4 and grayscale contrast-[1.02]. Each row is
          its own `pc-grid` spanning the full twelve columns of the band, which
          nests exactly: same width, same gutter, so the portrait in row two
          starts on the same rule as the portrait in row one. */}
      <section className="bg-paper py-20 md:py-[104px]">
        <div className="pc-shell">
          <div className="pc-grid">
            <div className="col-span-4 md:col-span-6">
              <Reveal>
                <Eyebrow>{t.team.label}</Eyebrow>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-4 text-heading-lg text-ink">
                  {t.team.title}
                </h2>
              </Reveal>
            </div>
            <Reveal
              delay={0.1}
              className="col-span-4 mt-6 md:col-span-5 md:col-start-8 md:mt-0 md:self-end"
            >
              <p className="text-[1.125rem] leading-[1.375] text-moss">
                {t.team.intro}
              </p>
            </Reveal>
          </div>

          <div className="mt-16 space-y-16 md:mt-24 md:space-y-24">
            {people.map((p) => (
              <article key={p.key} className="pc-grid">
                <Reveal className="col-span-4">
                  <div className="relative aspect-[3/4] overflow-hidden bg-paper-dim">
                    <Image
                      src={p.photo}
                      alt={p.name}
                      fill
                      sizes="(min-width: 768px) 33vw, 92vw"
                      className="object-cover object-center grayscale contrast-[1.02]"
                    />
                  </div>
                </Reveal>

                <div className="col-span-4 mt-8 md:col-span-7 md:col-start-6 md:mt-0 md:self-center">
                  <Reveal>
                    <h3 className="text-heading-md text-ink">{p.name}</h3>
                    <p className="mt-2 text-[0.875rem] text-moss">{p.role}</p>
                  </Reveal>
                  <Reveal delay={0.05}>
                    <p className="mt-6 max-w-[52ch] text-[1.125rem] leading-[1.375] text-moss">
                      {p.bio}
                    </p>
                  </Reveal>

                  {/* The line they actually say, straight off the homepage
                      band, with its caption above it. The muted line first
                      and the large line second is the house inversion. */}
                  {p.quote && (
                    <Reveal delay={0.1}>
                      <figure className="mt-10 border-t border-rule pt-6">
                        {p.caption && (
                          <figcaption className="text-[0.875rem] text-moss">
                            {p.caption}
                          </figcaption>
                        )}
                        <blockquote className="mt-4 max-w-[34ch] text-heading-sm text-ink">
                          {p.quote}
                        </blockquote>
                      </figure>
                    </Reveal>
                  )}

                  {(p.email || p.linkedin) && (
                    <Reveal delay={0.15}>
                      <div className="-ml-3 mt-4 flex items-center text-moss">
                        {p.email && (
                          <a
                            href={`mailto:${p.email}`}
                            aria-label={t.team.emailLabel.replace("{name}", p.name)}
                            className="inline-flex size-11 items-center justify-center transition-colors hover:text-ember"
                          >
                            <MailIcon className="size-[18px]" />
                          </a>
                        )}
                        {p.linkedin && (
                          <a
                            href={p.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={t.team.linkedinLabel.replace("{name}", p.name)}
                            className="inline-flex size-11 items-center justify-center transition-colors hover:text-ember"
                          >
                            <LinkedInIcon className="size-[18px]" />
                          </a>
                        )}
                      </div>
                    </Reveal>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Banner dict={t.cta} />
      <Footer locale={locale} />
    </main>
  );
}

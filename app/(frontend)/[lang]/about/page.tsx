import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "../components/page-hero";
import Banner from "../components/banner";
import Stats from "../components/stats";
import Footer from "../components/footer";
import { Reveal, Stagger, StaggerItem } from "../components/motion";
import { Eyebrow, Plus } from "../components/ui";
import { Visual } from "../components/visual";
import { LinkedInIcon, MailIcon } from "../components/icons";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getTeam, type TeamMember } from "@/lib/team";

export const revalidate = 60;

const resolve = (lang: string): Locale => (isLocale(lang) ? lang : defaultLocale);

/**
 * The 3:4 portrait register from spec F1. These files ship in the repo, so the
 * page shows the two real people with their real faces even when the CMS is
 * unreachable and the dictionary fallback is doing the work. Keyed by name so
 * it matches scripts/content/team.ts without importing a seed script.
 */
const PORTRAITS: Record<string, string> = {
  "Dawid Kubicki": "/assets/team/dawid-kubicki.jpg",
  "Krzysztof Suliński": "/assets/team/krzysztof-sulinski.jpg",
};

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
  const t = getDictionary(locale).pages.about;

  const cmsTeam = await getTeam(locale);
  const fallbackTeam: TeamMember[] = Object.values(t.team.members).map(
    (m, i) => ({
      id: String(i),
      name: m.name,
      role: m.role,
      bio: m.bio,
      email: "contact@pluscode.io",
      phone: null,
      linkedin: null,
      photo: PORTRAITS[m.name] ? { url: PORTRAITS[m.name], alt: m.name } : null,
    }),
  );
  const team = cmsTeam.length > 0 ? cmsTeam : fallbackTeam;
  const values = Object.values(t.values.items);

  return (
    <main>
      <PageHero
        eyebrow={t.label}
        title={t.title}
        intro={t.subtitle}
        visual="aurora"
        cta={{ label: t.cta.cta, href: "/contact" }}
      />

      {/* Story. The text runs in six columns and the plate fills the last
          five, which is the same pair the homepage uses for a band header. */}
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
            <Reveal delay={0.1} className="col-span-4 md:col-span-5 md:col-start-8">
              <div className="aspect-[4/3] overflow-hidden bg-paper-dim">
                <Visual kind="nodes" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values */}
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

      {/* Team */}
      <section className="bg-paper py-20 md:py-[104px]">
        <div className="pc-shell">
          <div className="pc-grid">
            <div className="col-span-4 md:col-span-8">
              <Reveal>
                <Eyebrow>{t.team.label}</Eyebrow>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-4 text-heading-lg text-ink">
                  {t.team.title}
                </h2>
              </Reveal>
            </div>
          </div>
          {/* Two people, so two cells of four columns each. The 3:4 portrait
              and the one filter, grayscale(1) contrast(1.02), are the photo
              system from spec F1, the same one the homepage uses. The card is
              the photograph plus the words under it: no frame, no ground and
              no border, because the portrait is its own edge. */}
          <Stagger className="pc-grid mt-16 md:mt-24" gap={0.08}>
            {team.map((m) => (
              <StaggerItem key={m.id} className="col-span-4">
                <article>
                  <div className="relative aspect-[3/4] overflow-hidden bg-paper-dim">
                    {m.photo && (
                      <Image
                        src={m.photo.url}
                        alt={m.photo.alt}
                        fill
                        sizes="(min-width: 768px) 33vw, 92vw"
                        className="object-cover object-center grayscale contrast-[1.02]"
                      />
                    )}
                  </div>
                  <h3 className="mt-6 text-heading-md text-ink">{m.name}</h3>
                  {m.role && (
                    <p className="mt-2 text-[0.875rem] text-moss">{m.role}</p>
                  )}
                  {m.bio && (
                    <p className="mt-4 text-[1.125rem] leading-[1.375] text-moss">
                      {m.bio}
                    </p>
                  )}
                  {(m.email || m.linkedin) && (
                    <div className="-ml-3 mt-4 flex items-center text-moss">
                      {m.email && (
                        <a
                          href={`mailto:${m.email}`}
                          aria-label={`Email ${m.name}`}
                          className="inline-flex size-11 items-center justify-center transition-colors hover:text-ink"
                        >
                          <MailIcon className="size-[18px]" />
                        </a>
                      )}
                      {m.linkedin && (
                        <a
                          href={m.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${m.name} on LinkedIn`}
                          className="inline-flex size-11 items-center justify-center transition-colors hover:text-ink"
                        >
                          <LinkedInIcon className="size-[18px]" />
                        </a>
                      )}
                    </div>
                  )}
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <Banner dict={t.cta} />
      <Footer locale={locale} />
    </main>
  );
}

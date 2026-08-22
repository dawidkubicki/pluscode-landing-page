import type { Metadata } from "next";
import { PageHero, CtaBand } from "../components/page-hero";
import Stats from "../components/stats";
import Footer from "../components/footer";
import { Reveal, Stagger, StaggerItem } from "../components/motion";
import { Plus } from "../components/ui";
import { Visual } from "../components/visual";
import { LinkedInIcon, MailIcon } from "../components/icons";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getTeam, type TeamMember } from "@/lib/team";

export const revalidate = 60;

const resolve = (lang: string): Locale => (isLocale(lang) ? lang : defaultLocale);

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
      email: null,
      phone: null,
      linkedin: null,
      photo: null,
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
        cta={{ label: t.cta.button, href: "/contact" }}
      />

      {/* Story */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-[1240px] items-center gap-12 px-5 py-20 sm:px-10 sm:py-[6.25rem] lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <div className="mb-4 font-mono text-[13px] uppercase tracking-[0.14em] text-lime">
                {t.story.label}
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="text-balance font-serif text-[2.5rem] font-medium leading-[1.12] tracking-[-0.01em] text-ink sm:text-5xl">
                {t.story.title}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-6 space-y-4 text-[17px] leading-[1.7] text-ink-soft">
                <p>{t.story.paragraph1}</p>
                <p>{t.story.paragraph2}</p>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <div className="aspect-[4/3] overflow-hidden rounded">
              <Visual kind="nodes" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-cream-line bg-cream">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-10 sm:py-[6.25rem]">
          <Reveal>
            <div className="mb-4 font-mono text-[13px] uppercase tracking-[0.14em] text-lime">
              {t.values.label}
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="max-w-3xl text-balance font-serif text-[2.5rem] font-medium leading-[1.12] tracking-[-0.01em] text-ink sm:text-5xl">
              {t.values.title}
            </h2>
          </Reveal>
          <Stagger
            className="mt-14 grid border-l border-t border-cream-line sm:grid-cols-2 lg:grid-cols-4"
            gap={0.08}
          >
            {values.map((v) => (
              <StaggerItem key={v.title} className="h-full">
                <article className="flex h-full flex-col border-b border-r border-cream-line bg-white p-7 transition-colors duration-300 hover:bg-cream">
                  <Plus className="size-5" />
                  <h3 className="mt-5 text-lg font-semibold text-ink">{v.title}</h3>
                  <p className="mt-3 text-[14.5px] leading-[1.65] text-ink-soft">
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
      <section className="border-t border-cream-line bg-white">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-10 sm:py-[6.25rem]">
          <Reveal>
            <div className="mb-4 font-mono text-[13px] uppercase tracking-[0.14em] text-lime">
              {t.team.label}
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="max-w-3xl text-balance font-serif text-[2.5rem] font-medium leading-[1.12] tracking-[-0.01em] text-ink sm:text-5xl">
              {t.team.title}
            </h2>
          </Reveal>
          <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" gap={0.08}>
            {team.map((m) => (
              <StaggerItem key={m.id} className="h-full">
                <article className="flex h-full flex-col overflow-hidden rounded border border-cream-line bg-white transition-colors duration-300 hover:border-lime">
                  <div className="aspect-[4/5] overflow-hidden">
                    {m.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.photo.url} alt={m.photo.alt} className="size-full object-cover" />
                    ) : (
                      <Visual kind="portrait" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-lg font-semibold text-ink">{m.name}</h3>
                    {m.role && (
                      <p className="mt-1 font-mono text-xs uppercase tracking-[0.1em] text-lime">
                        {m.role}
                      </p>
                    )}
                    {m.bio && (
                      <p className="mt-3 text-[14.5px] leading-[1.65] text-ink-soft">{m.bio}</p>
                    )}
                    {(m.email || m.linkedin) && (
                      <div className="mt-auto flex items-center gap-3 pt-5 text-ink-soft">
                        {m.email && (
                          <a href={`mailto:${m.email}`} aria-label={`Email ${m.name}`} className="transition-colors hover:text-ink">
                            <MailIcon className="size-[18px]" />
                          </a>
                        )}
                        {m.linkedin && (
                          <a href={m.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${m.name} on LinkedIn`} className="transition-colors hover:text-ink">
                            <LinkedInIcon className="size-[18px]" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CtaBand
        locale={locale}
        title={t.cta.title}
        text={t.cta.subtitle}
        cta={{ label: t.cta.button, href: "/contact" }}
      />
      <Footer locale={locale} />
    </main>
  );
}

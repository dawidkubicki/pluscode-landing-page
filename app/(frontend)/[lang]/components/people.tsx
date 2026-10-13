import { useId } from "react";
import type { Person } from "@/lib/people";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Stagger, StaggerItem } from "./motion";
import { ArrowLink, Container, Paragraphs } from "./ui";
import PersonCard from "./home/person-card";

/**
 * The people section, shared by the home page and About. It is a complete
 * `<section>` with its own vertical rhythm and page column: drop it straight
 * into `<main>`, do not wrap it in another section or container.
 *
 * With one or two people the heading takes the left third and the portraits
 * fill the right two thirds, so a small team reads as a decision and not as
 * a grid with empty seats. From three people on it becomes the reference's
 * row: heading above, four portraits across.
 */
export default function People({
  people,
  heading,
  intro,
  ui,
  cta,
}: {
  people: Person[];
  heading: string;
  intro?: string;
  ui: Dictionary["ui"];
  /** The outline button beside the heading. Left out on About. */
  cta?: { label: string; href: string };
}) {
  const headingId = useId();
  if (people.length === 0) return null;

  const few = people.length <= 2;
  const labels = {
    bio: ui.bio,
    closeBio: ui.closeBio,
    linkedinOf: ui.linkedinOf,
    linkedin: ui.linkedin,
    opensInNewTab: ui.opensInNewTab,
  };

  return (
    <section className="pc-section" aria-labelledby={headingId}>
      <Container>
        <div
          className={
            few
              ? "grid gap-x-8 gap-y-10 lg:grid-cols-3"
              : "grid gap-y-10 lg:gap-y-14"
          }
        >
          <div
            className={
              few
                ? "flex flex-wrap items-start justify-between gap-x-8 gap-y-5 lg:flex-col lg:justify-start"
                : "flex flex-wrap items-start justify-between gap-x-8 gap-y-5"
            }
          >
            <div>
              <h2 id={headingId} className="text-title">
                {heading}
              </h2>
              {intro && (
                <Paragraphs
                  text={intro}
                  className="mt-2 max-w-[24rem] space-y-3 text-body text-grey"
                />
              )}
            </div>
            {cta && (
              <ArrowLink href={cta.href} className="min-h-11">
                {cta.label}
              </ArrowLink>
            )}
          </div>

          <Stagger
            as="ul"
            className={
              few
                ? "grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-8 lg:col-span-2"
                : "grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-8 md:grid-cols-3 lg:grid-cols-4"
            }
          >
            {people.map((person) => (
              <StaggerItem
                as="li"
                key={person.key}
                className={people.length === 1 ? "col-span-2 sm:col-span-1" : undefined}
              >
                <PersonCard
                  person={person}
                  labels={labels}
                  sizes={
                    few
                      ? "(min-width: 1440px) 26rem, (min-width: 1024px) 29vw, 45vw"
                      : "(min-width: 1440px) 19rem, (min-width: 1024px) 21vw, (min-width: 768px) 29vw, 45vw"
                  }
                />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Container>
    </section>
  );
}

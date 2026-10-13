"use client";

import Image from "next/image";
import { useId } from "react";
import type { Person } from "@/lib/people";
import { CloseIcon, LinkedInIcon, Paragraphs, PlusIcon } from "../ui";
import { useModal } from "../chrome/use-modal";

export type PersonCardLabels = {
  bio: string;
  closeBio: string;
  linkedinOf: string;
  linkedin: string;
  opensInNewTab: string;
};

/**
 * The image optimizer only fetches paths on this site. A photo the CMS serves
 * from another origin is passed through as it is rather than failing the page.
 */
const passthrough = (url: string) => !url.startsWith("/");

/**
 * One person: portrait, name, role, LinkedIn, and the "Bio +" pill that opens
 * the biography in a dialog. The dialog is part of the server HTML, so the
 * biography is in the page for a reader that never clicks.
 */
export default function PersonCard({
  person,
  labels,
  sizes,
}: {
  person: Person;
  labels: PersonCardLabels;
  /** `sizes` of the card portrait, which depends on the grid it sits in. */
  sizes: string;
}) {
  const titleId = useId();
  const { open, close, dialogProps } = useModal();
  const linkedinLabel = `${labels.linkedinOf} ${person.name}, ${labels.opensInNewTab}`;

  return (
    <>
      <div className="pc-portrait">
        <Image
          src={person.image.url}
          alt={person.image.alt}
          fill
          sizes={sizes}
          unoptimized={passthrough(person.image.url)}
        />
      </div>

      <h3 className="mt-4 text-small font-bold">{person.name}</h3>
      <p className="text-small">{person.role}</p>

      <div className="mt-4 flex items-center gap-4">
        {person.linkedin && (
          <a
            href={person.linkedin}
            target="_blank"
            rel="noopener"
            aria-label={linkedinLabel}
            className="relative text-navy transition-colors duration-200 after:absolute after:-inset-3 hover:text-blue"
          >
            <LinkedInIcon className="h-5 w-5" />
          </a>
        )}
        <button
          type="button"
          onClick={open}
          aria-haspopup="dialog"
          className="pc-pill relative after:absolute after:-inset-x-1 after:-inset-y-2.5"
        >
          <span>{labels.bio}</span>
          <span className="sr-only">: {person.name}</span>
          <PlusIcon />
        </button>
      </div>

      <dialog
        {...dialogProps}
        aria-labelledby={titleId}
        className="fixed inset-0 z-[60] m-0 h-full max-h-none w-full max-w-none overflow-y-auto overscroll-contain bg-night/70 p-0 text-ink opacity-0 transition-[opacity,display,overlay] transition-discrete duration-300 ease-out open:opacity-100 starting:open:opacity-0 motion-reduce:transition-none"
      >
        <div
          data-modal-dismiss
          className="flex min-h-full items-end justify-center md:items-center md:p-10"
        >
          <article className="relative grid w-full max-w-[60rem] bg-white md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            {/* The portrait is a full column beside the text on a wide
                screen and a thumbnail beside the name on a phone. They are
                two elements; only the one on show is ever fetched. */}
            <div className="hidden md:block">
              <div className="pc-portrait h-full">
                <Image
                  src={person.image.url}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 25rem, 1px"
                  unoptimized={passthrough(person.image.url)}
                />
              </div>
            </div>

            <div className="flex flex-col px-5 pt-5 pb-8 md:px-10 md:pt-8 md:pb-10">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={close}
                  className="pc-pill relative min-h-8 after:absolute after:-inset-x-1 after:-inset-y-1.5"
                >
                  <span>{labels.closeBio}</span>
                  <CloseIcon className="h-2.5 w-2.5" />
                </button>
              </div>

              <div className="mt-6 flex items-end gap-4 md:mt-10 md:block">
                <div className="pc-portrait w-24 flex-none md:hidden">
                  <Image
                    src={person.image.url}
                    alt=""
                    fill
                    sizes="6rem"
                    unoptimized={passthrough(person.image.url)}
                  />
                </div>
                <div>
                  <h4 id={titleId} className="text-title">
                    {person.name}
                  </h4>
                  <p className="mt-1 text-small text-grey">{person.role}</p>
                </div>
              </div>

              <Paragraphs
                text={person.bio}
                className="mt-6 max-w-[32rem] space-y-4 text-body md:mt-8"
              />

              {person.linkedin && (
                <p className="mt-8 md:mt-auto md:pt-10">
                  <a
                    href={person.linkedin}
                    target="_blank"
                    rel="noopener"
                    aria-label={linkedinLabel}
                    className="inline-flex min-h-11 items-center gap-2.5 text-small transition-colors duration-200 hover:text-blue"
                  >
                    <LinkedInIcon className="h-5 w-5" />
                    <span aria-hidden="true">{labels.linkedin}</span>
                  </a>
                </p>
              )}
            </div>
          </article>
        </div>
      </dialog>
    </>
  );
}

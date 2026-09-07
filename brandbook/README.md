# Pluscode brand book

Open `index.html` in any browser. Double-click it, nothing to install, no build
step, no network needed.

## What's in here

```
brandbook/
├── index.html                       the book itself, self-contained
├── README.md
└── assets/
    ├── tokens.css                   every colour, font and motion value
    ├── logo/
    │   ├── pluscode-logo.svg        white lockup — the primary
    │   └── pluscode-black-logo.svg  black lockup — documents and print
    └── fonts/
        ├── Figtree.ttf              variable, 300–900
        ├── Figtree-Italic.ttf       variable, 300–900
        └── OFL.txt                  SIL Open Font License
```

The fonts load from `assets/fonts/`, so the page renders correctly offline and
looks the same on a machine that has never seen Figtree. Keep the folder
together: move `index.html` on its own and it falls back to a system sans and
loses the logo downloads.

## Where the content comes from

Every value in the book is read out of the live site, not invented for it:

| Section | Source in the repo |
| --- | --- |
| Colour, motion, type tokens | `app/(frontend)/[lang]/globals.css` |
| Font loading | `app/(frontend)/[lang]/fonts.ts` |
| Buttons, labels, the plus marker | `app/(frontend)/[lang]/components/ui.tsx` |
| Reveal and stagger timings | `app/(frontend)/[lang]/components/motion.tsx` |
| Voice, headlines, proof figures | `dictionaries/{en,pl,de}.json` |
| Logo artwork | `public/assets/logo/` |
| Open Graph card spec | `scripts/generate-og.tsx` |

If the book and the code ever disagree, **the code is right** and the book needs
updating. `assets/tokens.css` is a mirror of `globals.css` kept here so the
folder can travel on its own; it is not wired into the build.

## Two known contrast traps

Both are documented in §04 of the book, and both are easy to reintroduce:

- **`--color-lime` `#059669` on a light ground is 3.55:1.** Safe above 24px, or
  at 19px bold. Below that use `--color-lime-deep` `#047857` (5.16:1).
- **`--color-ink-mute` `#8093a8` is 2.97:1 on cream.** Uppercase metadata at
  11–13px only. It must never carry a sentence.

## Sharing it

There is a hosted copy of the same book if you need to send a link rather than a
folder. Ask Claude to republish after any edit here so the two stay in step.

/* ------------------------------------------------------------------ *
 *  BAND ICONS. One glyph per engagement, for Offerings and Services.
 *
 *  WHY THEY EXIST. Both bands are lists of four or five text entries that
 *  differ only in their words, so a reader scanning the page cannot tell
 *  the audit from the workshop without reading. A single glyph at the head
 *  of each entry lets the list scan before it is read, the way a table of
 *  contents scans by its numbers.
 *
 *  WHY SOLID BLACK SLABS. The system allows no accent colour, no radius, no
 *  shadow and no second weight, so the only decoration it has left is the
 *  ink itself. These are drawn as heavy isometric objects made of solid
 *  slabs separated by thin gaps of ground: a box seen from above and in
 *  front, its three visible faces cut into stripes by the same 2-unit gap.
 *  Every one of the nine shares that construction (30-degree edges, one
 *  step across is half a step down) so they read as one family, and they
 *  are recognisable at the 56px they are set at because each has a
 *  different silhouette, not because of any detail inside it.
 *
 *  HOW THEY ARE DRAWN. Every slab is its own polygon, inset by one unit on
 *  every edge, so two slabs that share an edge in the model end up two
 *  units apart on screen. Nothing is drawn in white over black: the gaps
 *  are absence, which is why the glyphs also work on the dark bands and in
 *  any `currentColor`. The few cutouts that are not gaps between slabs (the
 *  tick, the spark, the arrow, the brackets, the two text lines in the
 *  bubble) are holes in an even-odd path, still negative space. The
 *  coordinates were generated from a small isometric model and checked by
 *  rasterising every glyph; they are kept as literals here so the component
 *  ships no geometry code.
 *
 *  Each exported icon takes only `className`, sizes itself from that, and
 *  is hidden from the accessibility tree because the headline next to it
 *  is the name.
 * ------------------------------------------------------------------ */

type IconProps = { className?: string };
export type BandIcon = (props: IconProps) => React.JSX.Element;

/* A shape is either a polygon's `points` string or, when it begins with
   "M", an even-odd path: the slab's outline followed by its cutouts. */
function Glyph({
  shapes,
  className,
}: {
  shapes: readonly string[];
  className?: string;
}) {
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" aria-hidden className={className}>
      {shapes.map((shape, i) =>
        shape.startsWith("M") ? (
          <path key={i} fillRule="evenodd" d={shape} />
        ) : (
          <polygon key={i} points={shape} />
        ),
      )}
    </svg>
  );
}

/* ---- Offerings ---- */

/* Audyt procesu: a thick slab with a tick cut into its top face. */
const AUDIT: readonly string[] = [
  "7,25.62 14,29.12 14,35.88 7,32.38",
  "16,30.12 23,33.62 23,40.38 16,36.88",
  "41,25.62 34,29.12 34,35.88 41,32.38",
  "32,30.12 25,33.62 25,40.38 32,36.88",
  "M24 16.12L39.76 24L24 31.88L8.24 24ZM16.54 24.95L21.5 29.07L31.63 22.35L29.97 19.85L21.7 25.33L18.46 22.65Z",
];

/* Pierwsza wersja: the reference cube, solid top and three stripes a side. */
const FIRST_VERSION: readonly string[] = [
  "24,7.12 39.76,15 24,22.88 8.24,15",
  "7,16.62 11,18.62 11,34.38 7,32.38",
  "13,19.62 17,21.62 17,37.38 13,35.38",
  "19,22.62 23,24.62 23,40.38 19,38.38",
  "41,16.62 37,18.62 37,34.38 41,32.38",
  "35,19.62 31,21.62 31,37.38 35,35.38",
  "29,22.62 25,24.62 25,40.38 29,38.38",
];

/* AI w codziennej pracy: a chip. Five pins a side, a spark in the top. */
const AI: readonly string[] = [
  "7,26.62 8.6,27.42 8.6,33.18 7,32.38",
  "10.6,28.42 12.2,29.22 12.2,34.98 10.6,34.18",
  "14.2,30.22 15.8,31.02 15.8,36.78 14.2,35.98",
  "17.8,32.02 19.4,32.82 19.4,38.58 17.8,37.78",
  "21.4,33.82 23,34.62 23,40.38 21.4,39.58",
  "41,26.62 39.4,27.42 39.4,33.18 41,32.38",
  "37.4,28.42 35.8,29.22 35.8,34.98 37.4,34.18",
  "33.8,30.22 32.2,31.02 32.2,36.78 33.8,35.98",
  "30.2,32.02 28.6,32.82 28.6,38.58 30.2,37.78",
  "26.6,33.82 25,34.62 25,40.38 26.6,39.58",
  "M24 17.12L39.76 25L24 32.88L8.24 25ZM24 19.5L26.1 23.75L33.5 25L26.1 26.25L24 30.5L21.9 26.25L14.5 25L21.9 23.75Z",
];

/* Warsztat: a workbench. The cube with the middle stripe of each side cut
   short to an apron, so the outer stripes become its legs. */
const WORKSHOP: readonly string[] = [
  "24,7.12 39.76,15 24,22.88 8.24,15",
  "7,16.62 11,18.62 11,34.38 7,32.38",
  "41,16.62 37,18.62 37,34.38 41,32.38",
  "13,19.62 17,21.62 17,24.38 13,22.38",
  "35,19.62 31,21.62 31,24.38 35,22.38",
  "19,22.62 23,24.62 23,40.38 19,38.38",
  "29,22.62 25,24.62 25,40.38 29,38.38",
];

/* ---- Services ---- */

/* Automatyzacja papierologii: three stacked sheets, an arrow cut out of the
   top one pointing away and to the right. */
const PAPERWORK: readonly string[] = [
  "7,28.62 23,36.62 23,40.38 7,32.38",
  "41,28.62 25,36.62 25,40.38 41,32.38",
  "7,22.62 23,30.62 23,34.38 7,26.38",
  "41,22.62 25,30.62 25,34.38 41,26.38",
  "7,16.62 23,24.62 23,28.38 7,20.38",
  "41,16.62 25,24.62 25,28.38 41,20.38",
  "M24 7.12L39.76 15L24 22.88L8.24 15ZM15.18 17.79L23.82 13.47L20.76 11.94L31.2 11.4L30.12 16.62L27.06 15.09L18.42 19.41Z",
];

/* Odpowiedzi z Twoich dokumentow: a sheet with a speech bubble standing on
   it, two text lines cut into the bubble, the sheet's top drawn around the
   tail. */
const ANSWERS: readonly string[] = [
  "7,29.62 23,37.62 23,40.38 7,32.38",
  "41,29.62 25,37.62 25,40.38 41,32.38",
  "M17.08 8.96L27.32 14.08L27.32 25.84L23.98 24.17L20.56 26.03L20.27 22.32L17.08 20.72ZM17.88 11.74L26.52 16.06L26.52 18.56L17.88 14.24ZM17.88 16.24L24.36 19.48L24.36 21.98L17.88 18.74Z",
  "8.24,28 17.7,23.27 18.37,23.6 18.8,29.25 24.02,26.43 29.32,29.08 29.32,22.78 39.76,28 24,35.88",
];

/* Tworzenie oprogramowania: the cube with an opening bracket cut into the
   left face and a closing one into the right; the front edge is the bar. */
const SOFTWARE: readonly string[] = [
  "24,7.12 39.76,15 24,22.88 8.24,15",
  "M7 16.62L23 24.62L23 40.38L7 32.38ZM17.51 22.74L8.91 29.5L17.51 36.26L19.49 33.74L14.09 29.5L19.49 25.26Z",
  "M41 16.62L25 24.62L25 40.38L41 32.38ZM28.51 25.26L33.91 29.5L28.51 33.74L30.49 36.26L39.09 29.5L30.49 22.74Z",
];

/* Rozwoj MVP: a low striped block with a smaller cube growing out of its
   back corner; the block's top face is drawn around the small cube. */
const MVP_GROWTH: readonly string[] = [
  "7,24.62 11,26.62 11,34.38 7,32.38",
  "13,27.62 17,29.62 17,37.38 13,35.38",
  "19,30.62 23,32.62 23,40.38 19,38.38",
  "41,24.62 37,26.62 37,34.38 41,32.38",
  "35,27.62 31,29.62 31,37.38 35,35.38",
  "29,30.62 25,32.62 25,40.38 29,38.38",
  "15,19.62 24,24.12 33,19.62 39.76,23 24,30.88 8.24,23",
  "24,7.12 30.76,10.5 24,13.88 17.24,10.5",
  "16,12.12 23,15.62 23,21.38 16,17.88",
  "32,12.12 25,15.62 25,21.38 32,17.88",
];

/* Prognozy i raporty: three bars stepping away and to the right, rising. */
const FORECASTING: readonly string[] = [
  "12.6,29.82 19.86,33.45 16.4,35.18 9.14,31.55",
  "7.9,33.17 15.4,36.92 15.4,40.38 7.9,36.63",
  "21.1,35.07 17.4,36.92 17.4,40.38 21.1,38.53",
  "22.1,18.42 29.36,22.05 25.9,23.78 18.64,20.15",
  "17.4,21.77 24.9,25.52 24.9,35.63 17.4,31.88",
  "30.6,23.67 26.9,25.52 26.9,35.63 30.6,33.78",
  "31.6,7.02 38.86,10.65 35.4,12.38 28.14,8.75",
  "26.9,10.37 34.4,14.12 34.4,30.88 26.9,27.13",
  "40.1,12.27 36.4,14.12 36.4,30.88 40.1,29.03",
];

export function AuditIcon({ className }: IconProps) {
  return <Glyph shapes={AUDIT} className={className} />;
}
export function FirstVersionIcon({ className }: IconProps) {
  return <Glyph shapes={FIRST_VERSION} className={className} />;
}
export function AiIcon({ className }: IconProps) {
  return <Glyph shapes={AI} className={className} />;
}
export function WorkshopIcon({ className }: IconProps) {
  return <Glyph shapes={WORKSHOP} className={className} />;
}
export function PaperworkIcon({ className }: IconProps) {
  return <Glyph shapes={PAPERWORK} className={className} />;
}
export function AnswersIcon({ className }: IconProps) {
  return <Glyph shapes={ANSWERS} className={className} />;
}
export function SoftwareIcon({ className }: IconProps) {
  return <Glyph shapes={SOFTWARE} className={className} />;
}
export function MvpGrowthIcon({ className }: IconProps) {
  return <Glyph shapes={MVP_GROWTH} className={className} />;
}
export function ForecastingIcon({ className }: IconProps) {
  return <Glyph shapes={FORECASTING} className={className} />;
}

/* Keyed by the dictionary item keys. The maps are partial on purpose: an
   item whose key has no glyph renders nothing rather than the wrong one,
   so adding an entry to the dictionary never breaks the band. */
export const OFFERING_ICONS: Partial<Record<string, BandIcon>> = {
  audit: AuditIcon,
  mvp: FirstVersionIcon,
  ai: AiIcon,
  workshop: WorkshopIcon,
};

export const SERVICE_ICONS: Partial<Record<string, BandIcon>> = {
  paperwork: PaperworkIcon,
  answers: AnswersIcon,
  software: SoftwareIcon,
  mvp: MvpGrowthIcon,
  forecasting: ForecastingIcon,
};

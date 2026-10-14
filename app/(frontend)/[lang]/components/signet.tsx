import { useId, type CSSProperties } from "react";
import { SIGNET, WORDMARK_PATHS, WORDMARK_VIEWBOX } from "./signet-paths";

export { SIGNET };

/**
 * Where things sit inside the signet's own box, as fractions of its width and
 * height. A component that lays text inside the big disc positions it with
 * these, so the text stays in the disc at every size.
 */
export const SIGNET_LAYOUT = {
  /** width / height of the whole mark */
  aspect: SIGNET.width / SIGNET.height,
  /** centre of the big disc, from the left edge */
  bigCenterX: SIGNET.big.cx / SIGNET.width,
  /** where the big disc's clear interior starts, right of the bite */
  bigInnerLeft: 30.2828 / SIGNET.width,
  /** diameter of the small disc as a share of the width */
  smallWidth: (SIGNET.small.r * 2) / SIGNET.width,
} as const;

type RingProps = {
  /**
   * `light` is for dark grounds: white running into navy and back, the
   * reference's ring. `dark` is for white pages: ink fading to pale grey.
   */
  tone?: "light" | "dark";
  /** Stroke width in the drawing's own units (the mark is 44 tall). */
  weight?: number;
  /** Lay the stroke down on load. Only for the first screen. */
  draw?: boolean;
  className?: string;
  style?: CSSProperties;
};

/**
 * The signet as a thin gradient outline: the site's recurring shape.
 *
 * Decorative, so it is hidden from assistive technology. The stroke scales
 * with the drawing, as the reference's ring does, so a large ring is drawn
 * with a proportionally heavier line than a small one.
 */
export function SignetRing({
  tone = "light",
  weight = 0.28,
  draw = false,
  className,
  style,
}: RingProps) {
  const id = useId();
  const pad = weight;
  const stops =
    tone === "light"
      ? ["#ffffff", "#152644", "#ffffff"]
      : ["#222222", "#d6d6d6", "#222222"];

  return (
    <svg
      viewBox={`${-pad} ${-pad} ${SIGNET.width + pad * 2} ${SIGNET.height + pad * 2}`}
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={[draw ? "pc-ring-draw" : "", className].filter(Boolean).join(" ")}
      style={style}
    >
      <defs>
        <linearGradient
          id={id}
          gradientUnits="userSpaceOnUse"
          x1={SIGNET.width * 0.86}
          y1={SIGNET.height * 0.9}
          x2={SIGNET.width * 0.2}
          y2={SIGNET.height * 0.08}
        >
          <stop stopColor={stops[0]} />
          <stop offset="0.5" stopColor={stops[1]} />
          <stop offset="1" stopColor={stops[2]} />
        </linearGradient>
      </defs>
      <path
        d={SIGNET.bigPath}
        stroke={`url(#${id})`}
        strokeWidth={weight}
        pathLength={1}
        data-ring-path="big"
      />
      <circle
        cx={SIGNET.small.cx}
        cy={SIGNET.small.cy}
        r={SIGNET.small.r}
        stroke={`url(#${id})`}
        strokeWidth={weight}
        pathLength={1}
        data-ring-path="small"
      />
    </svg>
  );
}

/** The signet, solid, in the current text colour. */
export function SignetMark({
  className,
  title,
}: {
  className?: string;
  /** Give it a name when it stands alone as a link's only content. */
  title?: string;
}) {
  return (
    <svg
      viewBox={`0 0 ${SIGNET.width} ${SIGNET.height}`}
      fill="currentColor"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <circle cx={SIGNET.small.cx} cy={SIGNET.small.cy} r={SIGNET.small.r} />
      <path d={SIGNET.bigPath} />
    </svg>
  );
}

/** The word "pluscode" in the logo's own letters, in the current colour. */
export function Wordmark({
  className,
  title = "Pluscode",
}: {
  className?: string;
  title?: string | null;
}) {
  return (
    <svg
      viewBox={WORDMARK_VIEWBOX}
      fill="currentColor"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title ?? undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {WORDMARK_PATHS.map((d) => (
        <path key={d.slice(0, 24)} d={d} />
      ))}
    </svg>
  );
}

/**
 * The full lockup, signet and wordmark, exactly as the logo file draws it.
 *
 * The letters sit in their own group (`data-logo-word`) so a caller can fade
 * them without moving the signet: the header does that on the home page's
 * first screen, where the wordmark already stands inside the ring.
 */
export function Logo({
  className,
  title = "Pluscode",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 203 44"
      fill="currentColor"
      className={className}
      role="img"
      aria-label={title}
      focusable="false"
    >
      <circle cx={SIGNET.small.cx} cy={SIGNET.small.cy} r={SIGNET.small.r} />
      <path d={SIGNET.bigPath} />
      <g data-logo-word>
        {WORDMARK_PATHS.map((d) => (
          <path key={d.slice(0, 24)} d={d} />
        ))}
      </g>
    </svg>
  );
}

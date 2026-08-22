import { Plus } from "./ui";

/** The tech we build with — a continuous marquee strip. */
const stack = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Python",
  "PostgreSQL",
  "AWS",
  "Google Cloud",
  "Kubernetes",
  "TensorFlow",
  "React Native",
  "Terraform",
];

function Track() {
  return (
    <div className="flex shrink-0 items-center gap-14 pr-14">
      {stack.map((name, i) => (
        <div key={`${name}-${i}`} className="flex items-center gap-2.5 text-xl text-ink/70">
          <Plus className="size-4 text-ink/40" />
          <span className="font-medium">{name}</span>
        </div>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <section className="border-y border-cream-line/70 bg-cream py-7">
      <div className="mask-fade-x overflow-hidden">
        <div className="flex w-max" style={{ animation: "var(--animate-marquee)" }}>
          <Track />
          <Track />
        </div>
      </div>
    </section>
  );
}

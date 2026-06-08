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
    <div className="flex shrink-0 items-center gap-12 pr-12">
      {stack.map((name, i) => (
        <div key={`${name}-${i}`} className="flex items-center gap-2.5 text-lg text-ink/70">
          <Plus className="size-3.5 text-ink/30" />
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

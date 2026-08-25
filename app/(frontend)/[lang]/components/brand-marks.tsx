/**
 * Monochrome vendor marks for the "technologies we work with" chip rows and
 * for the systems named in the use-case flow diagram.
 *
 * Inlined single-colour paths (they inherit `currentColor`), so a chip is one
 * DOM node with no network request and no colour clash with the page. Sources:
 * Simple Icons (CC0) for Anthropic, LangGraph and every vendor mark from `sap`
 * down; @lobehub/icons-static-svg (MIT) for OpenAI, Azure and Bedrock. The
 * marks stay the trademarks of their owners and are used here only to name the
 * systems we connect to.
 *
 * `vector` is ours: a plain database glyph for the one chip that names a kind
 * of system rather than a product.
 */

type MarkProps = { className?: string };

function OpenAI({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" aria-hidden className={className}>
      <path d="M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z" />
    </svg>
  );
}

function Anthropic({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z" />
    </svg>
  );
}

function Azure({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" aria-hidden className={className}>
      <path d="M18.397 15.296H7.4a.51.51 0 00-.347.882l7.066 6.595c.206.192.477.298.758.298h6.226l-2.706-7.775z" fillOpacity=".75" />
      <path d="M8.295.857c-.477 0-.9.304-1.053.756L.495 21.605a1.11 1.11 0 001.052 1.466h5.43c.477 0 .9-.304 1.053-.755l1.341-3.975-2.318-2.163a.51.51 0 01.347-.882h3L15.271.857H8.295z" fillOpacity=".5" />
      <path d="M17.193 1.613a1.11 1.11 0 00-1.052-.756h-7.81.035c.477 0 .9.304 1.052.756l6.748 19.992a1.11 1.11 0 01-1.052 1.466h-.12 7.895a1.11 1.11 0 001.052-1.466L17.193 1.613z" />
    </svg>
  );
}

function Bedrock({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" aria-hidden className={className}>
      <path d="M13.05 15.513h3.08c.214 0 .389.177.389.394v1.82a1.704 1.704 0 011.296 1.661c0 .943-.755 1.708-1.685 1.708-.931 0-1.686-.765-1.686-1.708 0-.807.554-1.484 1.297-1.662v-1.425h-2.69v4.663a.395.395 0 01-.188.338l-2.69 1.641a.385.385 0 01-.405-.002l-4.926-3.086a.395.395 0 01-.185-.336V16.3L2.196 14.87A.395.395 0 012 14.555L2 14.528V9.406c0-.14.073-.27.192-.34l2.465-1.462V4.448c0-.129.062-.249.165-.322l.021-.014L9.77 1.058a.385.385 0 01.407 0l2.69 1.675a.395.395 0 01.185.336V7.6h3.856V5.683a1.704 1.704 0 01-1.296-1.662c0-.943.755-1.708 1.685-1.708.931 0 1.685.765 1.685 1.708 0 .807-.553 1.484-1.296 1.662v2.311a.391.391 0 01-.389.394h-4.245v1.806h6.624a1.69 1.69 0 011.64-1.313c.93 0 1.685.764 1.685 1.707 0 .943-.754 1.708-1.685 1.708a1.69 1.69 0 01-1.64-1.314H13.05v1.937h4.953l.915 1.18a1.66 1.66 0 01.84-.227c.931 0 1.685.764 1.685 1.707 0 .943-.754 1.708-1.685 1.708-.93 0-1.685-.765-1.685-1.708 0-.346.102-.668.276-.937l-.724-.935H13.05v1.806zM9.973 1.856L7.93 3.122V6.09h-.778V3.604L5.435 4.669v2.945l2.11 1.36L9.712 7.61V5.334h.778V7.83c0 .136-.07.263-.184.335L7.963 9.638v2.081l1.422 1.009-.446.646-1.406-.998-1.53 1.005-.423-.66 1.605-1.055v-1.99L5.038 8.29l-2.26 1.34v1.676l1.972-1.189.398.677-2.37 1.429V14.3l2.166 1.258 2.27-1.368.397.677-2.176 1.311V19.3l1.876 1.175 2.365-1.426.398.678-2.017 1.216 1.918 1.201 2.298-1.403v-5.78l-4.758 2.893-.4-.675 5.158-3.136V3.289L9.972 1.856zM16.13 18.47a.913.913 0 00-.908.92c0 .507.406.918.908.918a.913.913 0 00.907-.919.913.913 0 00-.907-.92zm3.63-3.81a.913.913 0 00-.908.92c0 .508.406.92.907.92a.913.913 0 00.908-.92.913.913 0 00-.908-.92zm1.555-4.99a.913.913 0 00-.908.92c0 .507.407.918.908.918a.913.913 0 00.907-.919.913.913 0 00-.907-.92zM17.296 3.1a.913.913 0 00-.907.92c0 .508.406.92.907.92a.913.913 0 00.908-.92.913.913 0 00-.908-.92z" />
    </svg>
  );
}

function LangGraph({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M5 19H10A5 5 0 115 14ZM19 14A5 5 0 1114 19H19ZM10 5A5 5 0 105 10V5ZM19 5V10A5 5 0 1014 5Z" />
    </svg>
  );
}

/** House glyph for the one chip that names a kind of system, not a product. */
function VectorStore({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <ellipse cx="12" cy="5.5" rx="7.5" ry="2.9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M4.5 5.5v13c0 1.6 3.36 2.9 7.5 2.9s7.5-1.3 7.5-2.9v-13"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M4.5 12c0 1.6 3.36 2.9 7.5 2.9s7.5-1.3 7.5-2.9"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

/* ---- Systems named in the use-case flows (Simple Icons, CC0) ------------- */

function Sap({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M0 6.064v11.872h12.13L24 6.064zm3.264 2.208h.005c.863.001 1.915.245 2.676.633l-.82 1.43c-.835-.404-1.255-.442-1.73-.467-.708-.038-1.064.215-1.069.488-.007.332.669.633 1.305.838.964.306 2.19.715 2.377 1.9L7.77 8.437h2.046l2.064 5.576-.007-5.575h2.37c2.257 0 3.318.764 3.318 2.519 0 1.575-1.09 2.514-2.936 2.514h-.763l-.01 2.094-3.588-.003-.25-.908c-.37.122-.787.189-1.23.189-.456 0-.885-.071-1.263-.2l-.358.919-2 .006.09-.462c-.029.025-.057.05-.087.074-.535.43-1.208.629-2.037.644l-.213.002a5.075 5.075 0 0 1-2.581-.675l.73-1.448c.79.467 1.286.572 1.956.558.347-.007.598-.07.761-.239a.557.557 0 0 0 .156-.369c.007-.376-.53-.553-1.185-.756-.531-.164-1.135-.389-1.606-.735-.559-.41-.825-.924-.812-1.65a1.99 1.99 0 0 1 .566-1.377c.519-.537 1.357-.863 2.363-.863zm10.597 1.67v1.904h.521c.694 0 1.247-.23 1.248-.964 0-.709-.554-.94-1.248-.94zm-5.087.767l-.748 2.362c.223.085.481.133.757.133.268 0 .52-.047.742-.126l-.736-2.37z" />
    </svg>
  );
}


function Zendesk({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12.914 2.904V16.29L24 2.905H12.914zM0 2.906C0 5.966 2.483 8.45 5.543 8.45s5.542-2.484 5.543-5.544H0zm11.086 4.807L0 21.096h11.086V7.713zm7.37 7.84c-3.063 0-5.542 2.48-5.542 5.543H24c0-3.06-2.48-5.543-5.543-5.543z" />
    </svg>
  );
}

function Jira({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 0 0 5.215 5.214h2.129v2.058a5.218 5.218 0 0 0 5.215 5.214V6.758a1.001 1.001 0 0 0-1.001-1.001zM23.013 0H11.455a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.215 5.215 0 0 0 24 12.483V1.005A1.001 1.001 0 0 0 23.013 0Z" />
    </svg>
  );
}

function Confluence({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M.87 18.257c-.248.382-.53.875-.763 1.245a.764.764 0 0 0 .255 1.04l4.965 3.054a.764.764 0 0 0 1.058-.26c.199-.332.454-.763.733-1.221 1.967-3.247 3.945-2.853 7.508-1.146l4.957 2.337a.764.764 0 0 0 1.028-.382l2.364-5.346a.764.764 0 0 0-.382-1 599.851 599.851 0 0 1-4.965-2.361C10.911 10.97 5.224 11.185.87 18.257zM23.131 5.743c.249-.405.531-.875.764-1.25a.764.764 0 0 0-.256-1.034L18.675.404a.764.764 0 0 0-1.058.26c-.195.335-.451.763-.734 1.225-1.966 3.246-3.945 2.85-7.508 1.146L4.437.694a.764.764 0 0 0-1.027.382L1.046 6.422a.764.764 0 0 0 .382 1c1.039.49 3.105 1.467 4.965 2.361 6.698 3.246 12.392 3.029 16.738-4.04z" />
    </svg>
  );
}

function GoogleDrive({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12.01 1.485c-2.082 0-3.754.02-3.743.047.01.02 1.708 3.001 3.774 6.62l3.76 6.574h3.76c2.081 0 3.753-.02 3.742-.047-.005-.02-1.708-3.001-3.775-6.62l-3.76-6.574zm-4.76 1.73a789.828 789.861 0 0 0-3.63 6.319L0 15.868l1.89 3.298 1.885 3.297 3.62-6.335 3.618-6.33-1.88-3.287C8.1 4.704 7.255 3.22 7.25 3.214zm2.259 12.653-.203.348c-.114.198-.96 1.672-1.88 3.287a423.93 423.948 0 0 1-1.698 2.97c-.01.026 3.24.042 7.222.042h7.244l1.796-3.157c.992-1.734 1.85-3.23 1.906-3.323l.104-.167h-7.249z" />
    </svg>
  );
}




const marks = {
  openai: OpenAI,
  anthropic: Anthropic,
  azure: Azure,
  bedrock: Bedrock,
  langgraph: LangGraph,
  vector: VectorStore,
  sap: Sap,
  zendesk: Zendesk,
  jira: Jira,
  confluence: Confluence,
  drive: GoogleDrive,
} as const;

export type BrandMarkName = keyof typeof marks;

export function isBrandMark(value: unknown): value is BrandMarkName {
  return typeof value === "string" && value in marks;
}

/** Renders the mark for `name`, or nothing when the key is unknown. */
export function BrandMark({
  name,
  className = "size-4",
}: {
  name: string;
  className?: string;
}) {
  if (!isBrandMark(name)) return null;
  const Mark = marks[name];
  return <Mark className={className} />;
}

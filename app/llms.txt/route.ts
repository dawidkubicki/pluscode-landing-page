import { LLMS_HEADERS, llmsText } from "./content";

/* Rebuilt at most once an hour, so the CMS is not read on every request and
   an edit there shows up without a deploy. */
export const revalidate = 3600;

export async function GET() {
  return new Response(await llmsText("short"), { headers: LLMS_HEADERS });
}

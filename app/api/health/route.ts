// Lightweight liveness probe for the container healthcheck and any uptime
// monitor. No DB work — just confirms the server is answering.
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ ok: true }, { status: 200 });
}

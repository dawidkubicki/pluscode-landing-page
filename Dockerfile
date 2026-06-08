# syntax=docker/dockerfile:1

# Full (non-standalone) image on purpose: the runner keeps the Payload CLI and
# source so it can run `payload migrate` and `pnpm seed` in-container.
# node:22-slim (glibc) avoids alpine/musl edge cases with sharp & lightningcss.
FROM node:22-slim AS base
ENV PNPM_HOME=/pnpm PATH=/pnpm:$PATH COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM base AS build
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm payload generate:importmap && pnpm build

FROM base AS runner
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
COPY --from=build /app ./
EXPOSE 3000
# migrate is idempotent (only pending migrations run), then start Next.
CMD ["sh", "-c", "pnpm payload migrate && pnpm start"]

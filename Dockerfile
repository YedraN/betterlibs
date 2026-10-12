# syntax=docker/dockerfile:1
FROM node:24-bookworm-slim AS development

ARG PNPM_VERSION=12.4.1
RUN npm install --global pnpm@${PNPM_VERSION}

ENV HUSKY=0 \
    NEXT_TELEMETRY_DISABLED=1 \
    TURBO_TELEMETRY_DISABLED=1 \
    STORYBOOK_DISABLE_TELEMETRY=1

WORKDIR /workspace
RUN chown node:node /workspace
USER node

# Keep the dependency layer cached when only component/page source changes.
COPY --chown=node:node package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --chown=node:node packages/tokens/package.json ./packages/tokens/package.json
COPY --chown=node:node packages/icons/package.json ./packages/icons/package.json
COPY --chown=node:node packages/react/package.json ./packages/react/package.json
COPY --chown=node:node packages/motion/package.json ./packages/motion/package.json
COPY --chown=node:node apps/playground/package.json ./apps/playground/package.json
COPY --chown=node:node apps/docs/package.json ./apps/docs/package.json
COPY --chown=node:node apps/storybook/package.json ./apps/storybook/package.json
COPY --chown=node:node apps/e2e/package.json ./apps/e2e/package.json
RUN --mount=type=cache,id=betterlibs-pnpm,target=/pnpm/store,uid=1000,gid=1000 \
    pnpm install --frozen-lockfile --store-dir /pnpm/store

COPY --chown=node:node . .
RUN pnpm exec turbo run build --filter='./packages/*'

EXPOSE 5173 3000 6006
CMD ["node", "docker/dev.mjs"]

# =============================================================================
# Stage 1 — Production dependencies (compiles native modules)
# =============================================================================
FROM node:20-alpine AS deps
WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci --omit=dev

# =============================================================================
# Stage 2 — Full build
# =============================================================================
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./

RUN npm ci

COPY apps/ ./apps/
COPY libs/ ./libs/
COPY scripts/ ./scripts/

ARG APP_NAME
RUN npm run build -- ${APP_NAME}

# Copy app-specific i18n assets (not bundled by webpack)
RUN if [ -d "apps/${APP_NAME}/src/i18n" ]; then \
      cp -r "apps/${APP_NAME}/src/i18n" "dist/apps/${APP_NAME}/i18n"; \
    fi

# =============================================================================
# Stage 3 — Runtime image
# =============================================================================
FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=deps  --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist

ARG APP_NAME
ENV APP_NAME=${APP_NAME} \
    NODE_ENV=production

USER node

CMD ["sh", "-c", "node dist/apps/${APP_NAME}/main.js"]

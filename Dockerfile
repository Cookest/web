# Stage 1: Install dependencies
FROM oven/bun:alpine AS deps
WORKDIR /app

# Copy lockfile and package.json to install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Stage 2: Build the Next.js application
FROM oven/bun:alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables at build-time since Next.js bakes client-side env vars (NEXT_PUBLIC_*) into the bundle
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

ARG NEXT_PUBLIC_API_IP
ENV NEXT_PUBLIC_API_IP=$NEXT_PUBLIC_API_IP

ARG NEXT_PUBLIC_API_PORT
ENV NEXT_PUBLIC_API_PORT=$NEXT_PUBLIC_API_PORT

RUN bun run build

# Stage 3: Runner
FROM oven/bun:alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Next.js telemetry disable
ENV NEXT_TELEMETRY_DISABLED=1

# Copy public assets and built app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["bun", "run", "start"]

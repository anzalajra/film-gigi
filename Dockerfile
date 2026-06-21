FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Next.js standalone server output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma schema, migrations, generated client (WASM-based, self-contained), seed.
# prisma.config.ts is required by `prisma migrate deploy` to read DATABASE_URL
# (Prisma 7 no longer keeps the url in schema.prisma).
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder --chown=nextjs:nodejs /app/src/generated ./src/generated
COPY --from=builder --chown=nextjs:nodejs /app/tsconfig.json ./tsconfig.json

# Full node_modules from the (alpine) builder so `prisma migrate deploy`
# and the tsx-based seed can run at container startup. Native binaries
# (esbuild, prisma engines) match because builder and runner are both alpine.
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

RUN mkdir -p ./public/uploads && chown -R nextjs:nodejs ./public/uploads

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

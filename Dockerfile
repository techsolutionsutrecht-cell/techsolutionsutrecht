# ۱. مرحله پایه - نصب کتابخانه‌های سیستم
FROM node:20-slim AS base
WORKDIR /app
# نصب openssl و libssl در لایه بیس برای استفاده در تمام مراحل
RUN apt-get update && apt-get install -y openssl libssl3 && rm -rf /var/lib/apt/lists/*

# ۲. مرحله نصب وابستگی‌ها
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ۳. مرحله بیلد پروژه
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# تولید کلاینت پریزما
RUN npx prisma generate

ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# ۴. مرحله نهایی برای اجرا
FROM base AS runner
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# کپی فایل‌های لازم از مرحله بیلد
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["npm", "start"]
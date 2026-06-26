# 1. Aşama: Bağımlılıkların kurulması (Dependencies)
FROM node:20-alpine AS deps
# libc6-compat, alpine tabanlı imajlarda bazı C++ eklentilerinin (örn: sharp) düzgün çalışması için gereklidir
RUN apk add --no-cache libc6-compat
WORKDIR /app

# package.json ve package-lock.json dosyalarını kopyalayıp sadece gerekli paketleri temiz bir şekilde kuruyoruz
COPY package.json package-lock.json ./
RUN npm ci

# 2. Aşama: Projenin derlenmesi (Builder)
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js build sırasında Supabase env değişkenlerini (NEXT_PUBLIC_) kodun içine gömer.
# Bu değişkenleri build-arg olarak dışarıdan alıp derleme ortamına aktarıyoruz.
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=$NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

RUN npm run build

# 3. Aşama: Çalışma zamanı (Runner)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Next.js standalone telemetry devre dışı bırakılabilir
ENV NEXT_TELEMETRY_DISABLED=1

# Güvenlik nedeniyle root kullanıcısı yerine sınırlı yetkilere sahip 'nextjs' kullanıcısı oluşturuyoruz
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Standalone build çıktısını alıyoruz (gereksiz node_modules dosyalarını eler ve imaj boyutunu %90 oranında küçültür)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
# Dinleme IP'si Docker ortamında 0.0.0.0 olmalıdır ki dışarıdan erişilebilsin
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

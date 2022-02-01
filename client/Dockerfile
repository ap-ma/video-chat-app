# 開発環境
FROM node:16 as developer
WORKDIR /app

# ビルド環境
FROM developer as builder
COPY . .
RUN npm ci --only=production && npm run build

# リリース環境
FROM gcr.io/distroless/nodejs:16
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

CMD ["node_modules/.bin/next", "start"]
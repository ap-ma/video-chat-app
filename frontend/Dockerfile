# 開発環境
FROM node:16 as developer
WORKDIR /app
RUN npm install -g npm@8.5.5
RUN ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime

# ビルド環境
FROM developer as builder
COPY . .
RUN npm install && npm run build

# リリース環境
FROM gcr.io/distroless/nodejs:16
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

CMD ["node_modules/.bin/next", "start"]
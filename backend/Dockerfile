# 開発環境
FROM rust:1.57 as developer
WORKDIR /app
RUN apt-get update -y && apt-get install -y clang llvm-dev libclang-dev
RUN cargo install cargo-watch && \ 
  cargo install diesel_cli --no-default-features --features mysql
RUN ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime

# ビルド環境
FROM developer as builder
COPY . .
RUN cp -p .env.prod .env
RUN cargo build --release

# リリース環境
FROM debian:11
COPY --from=builder /app/target/release/chat-app-api /usr/local/bin/chat-app-api
CMD ["/usr/local/bin/chat-app-api"]
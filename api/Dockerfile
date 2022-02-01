# 開発環境
FROM rust:1.57 as developer
WORKDIR /app
RUN cargo install cargo-watch && \ 
  cargo install diesel_cli --no-default-features --features mysql

# ビルド環境
FROM developer as builder
COPY . .
RUN cp -p .env.prod .env
# RUN diesel migration run
RUN cargo build --release

# リリース環境
FROM debian:11
COPY --from=builder /app/target/release/links /usr/local/bin/links
CMD ["/usr/local/bin/links"]
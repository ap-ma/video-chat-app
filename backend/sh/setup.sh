#!/bin/bash

# dotenv
mkdir -p /opt/app
if [ -e .env.local ]; then
  cat .env.local <(echo -e "\n") .env.dev > /opt/app/.env
  chmod 666 /opt/app/.env
else
  cp -p .env.dev /opt/app/.env
fi

# db migration
chmod 645 ./sh/wait-for-it.sh
./sh/wait-for-it.sh mysql:3306 --strict -- \
  diesel database setup

# auto reloading server
touch .trigger
cargo watch -x check -s 'touch .trigger' -i .trigger &
cargo watch --no-gitignore -w .trigger -x run
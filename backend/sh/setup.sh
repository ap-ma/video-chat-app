#!/bin/bash

# dotenv
if [ -e .env.local ]; then
  cat .env.local <(echo -e "\n") .env.dev > .env
else
  cp ./.env.dev ./.env
fi

# db migration
chmod 645 ./sh/wait-for-it.sh
./sh/wait-for-it.sh mysql:3306 --strict -- \
  diesel migration run

# auto reloading server
touch .trigger
cargo watch -x check -s 'touch .trigger' -i .trigger &
cargo watch --no-gitignore -w .trigger -x run
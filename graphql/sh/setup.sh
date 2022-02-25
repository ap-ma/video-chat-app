#!/bin/bash

# dotenv
cp -p ./.env.dev ./.env

# db migration
chmod 645 ./sh/wait-for-it.sh
./sh/wait-for-it.sh mysql:3306 --strict -- \
  diesel migration run

# auto reloading server
touch .trigger
cargo watch -x check -s 'touch .trigger' &
cargo watch --no-gitignore -w .trigger -x run
#!/bin/bash

USER_ID=$(id -u $USER) \
GROUP_ID=$(id -g $USER) \
docker compose up -d --build
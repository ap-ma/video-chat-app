#!/bin/bash

cd `dirname $(cd $(dirname $0); pwd)`
docker compose exec node /bin/bash
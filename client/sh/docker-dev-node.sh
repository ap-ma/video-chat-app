#!/bin/bash

if [ $# != 1 ]; then
    echo Specify the port number.
    exit 1
fi

cd `dirname $(cd $(dirname $0); pwd)`
docker run \
  -it \
  --rm \
  -p $1:$1 \
  -w /app \
  -v $(pwd):/app \
  -u $(id -u):$(id -g) \
  -e TZ=Asia/Tokyo \
  --name node_dev \
  node:lts \
  /bin/bash
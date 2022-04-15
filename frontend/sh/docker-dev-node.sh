#!/bin/bash

if [ $# = 0 ]; then
    echo Specify the port number.
    exit 1
fi

cd `dirname $(cd $(dirname $0); pwd)`
docker run \
  -it \
  --rm \
  -p $1:$1 \
  -p 9229:9229 \
  -w /app \
  -v $(pwd):/app \
  -u $(id -u):$(id -g) \
  -e TZ=Asia/Tokyo \
  --name node_dev \
  node:lts \
  ${2:-"/bin/bash"}
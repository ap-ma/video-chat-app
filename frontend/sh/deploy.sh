#!/bin/bash -x

mkdir -p /opt/app

pushd `dirname $(cd $(dirname $0); pwd)`
npm install
npm run build
cp -rf ./public /opt/app/
cp -rf ./.next /opt/app/
cp -rf ./node_modules /opt/app/
cp -f ./chat-app.service /etc/systemd/system/
popd

systemctl daemon-reload
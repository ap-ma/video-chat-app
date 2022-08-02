#!/bin/bash -x

mkdir -p /opt/app

pushd `dirname $(cd $(dirname $0); pwd)`
npm install
npm run build
cp -r ./public /opt/app/
cp -r ./.next /opt/app/
cp -r ./node_modules /opt/app/
cp ./package.json /opt/app/
cp ./chat-app.service /etc/systemd/system/
popd

systemctl daemon-reload
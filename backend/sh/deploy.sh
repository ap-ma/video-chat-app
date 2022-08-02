#!/bin/bash -x

mkdir -p /opt/app

pushd `dirname $(cd $(dirname $0); pwd)`
cargo build --release
cp -f ./chat-app-api /opt/app/
cp -f ./chat-app-api.service /etc/systemd/system/
popd

chmod 700 /opt/app/chat-app-api
systemctl daemon-reload
#!/bin/bash -x

mkdir -p /opt/app

pushd `dirname $(cd $(dirname $0); pwd)`
cp ./src/main.rs.tls ./src/main.rs
su -l $(logname) -c "cd $(pwd) && cargo build --release"
cp ./target/release/chat-app-api /opt/app/
cp ./chat-app-api.service /etc/systemd/system/
popd

chmod 700 /opt/app/chat-app-api
systemctl daemon-reload
#!/bin/bash

usermod -o -u $UID mysql
groupmod -o -g $GID mysql
chown -R mysql:mysql /var/run/mysqld /var/log/mysql /var/lib/mysql /var/lib/mysql-files

/entrypoint.sh mysqld --user=mysql
#!/bin/sh

mysql -uroot -proot links_dev < "/tmp/init.d/schema.sql"
mysql -uroot -proot links_dev < "/tmp/init.d/data.sql"
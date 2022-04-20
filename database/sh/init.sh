#!/bin/sh

mysql -uroot -proot dev_db < "/tmp/init.d/schema.sql"
mysql -uroot -proot dev_db < "/tmp/init.d/data.sql"
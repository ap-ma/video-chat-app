FROM mysql:8.0

COPY ./initdb.d /tmp/init.d
COPY ./sh/init.sh /docker-entrypoint-initdb.d/init.sh
COPY ./sh/setup.sh /tmp/setup.sh
COPY ./my.cnf /etc/mysql/my.cnf
RUN chmod 644 /etc/mysql/my.cnf
RUN mkdir /var/log/mysql /var/lib/mysql-files
FROM redis:6.2

COPY ./sh/setup.sh /tmp/setup.sh
COPY ./redis.conf /etc/redis/redis.conf
RUN ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime
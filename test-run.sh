#!/bin/sh

echo "******************** Test server run ********************"

CONTAINER_LIST=`docker ps -a -q`

docker kill $CONTAINER_LIST
docker rm $CONTAINER_LIST
docker-compose -f docker-compose.test.yml up
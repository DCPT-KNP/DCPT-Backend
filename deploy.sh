#!/bin/sh

if [ "$1" = "local" ]; then
    # remove image
    echo "******************** Remove previous image... ********************"
    docker rmi -f jiho5993/nerdit

    # new-build/re-build docker image
    echo "******************** Build new image... ********************"
    docker-compose build

    # push image
    echo "******************** Push image... ********************"
    docker push jiho5993/nerdit
else
    # remove container
    echo "******************** Remove previous container... ********************"
    docker rm -f app

    # pull image
    echo "******************** Pull image... ********************"
    docker pull jiho5993/nerdit

    # run container
    echo "******************** Run container... ********************"
    docerk-compose up -d

    # prune image
    echo "******************** Prune previous image... ********************"
    docker image prune -af
fi
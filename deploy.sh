#!/bin/sh
# ./deploy.sh prod : 서버 배포
# ./deploy.sh test : 테스트 서버 배포
# ./deploy.sh : ec2에서 컨테이너 구동

# TODO: 도커 스크립트 작성

if [ "$1" = "prod" ]; then

    echo "******************** Deploy real server... ********************"
    # remove image
    docker rmi -f jiho5993/nerdit

    # new-build/re-build docker image
    docker-compose build

    # push image
    docker push jiho5993/nerdit
    echo "******************** Success ********************"

elif [ "$1" = "test" ]; then

    # test server deploy
    echo "******************** Deploy test server... ********************"
    docker rmi -f jiho5993/nerdit-test
    docker-compose -f docker-compose.test.yml build
    docker push jiho5993/nerdit-test
    echo "******************** Success ********************"

else
    # remove container
    CONTAINER_LIST=`docker ps -a -q`

    docker kill $CONTAINER_LIST
    docker rm $CONTAINER_LIST

    # pull image
    docker pull jiho5993/nerdit

    # run container
    docerk-compose up -d jiho5993/nerdit
fi
#!/bin/bash


if [ -f service/dist/stop.sh ]
then
    service/dist/stop.sh $1
fi

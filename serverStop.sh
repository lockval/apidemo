#!/bin/bash


if [ -f svrBin/dist/stop.sh ]
then
    svrBin/dist/stop.sh $1
fi

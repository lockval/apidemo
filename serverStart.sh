#!/bin/bash


if [ ! -f latest.amd64.linux.zip ]
then
    echo "latest.amd64.linux.zip does not exist, download and unzip it..."
    wget -L https://downloads.lockval.com/latest.amd64.linux.zip
    unzip -d svrBin -o latest.amd64.linux.zip
fi

cd svrBin/dist
./start.sh $1
cd ../..

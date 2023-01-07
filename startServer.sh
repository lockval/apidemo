#!/bin/bash

# This script can help you compile server code and upload it to your own server

if [ -f dist/stop.sh ]
then
    dist/stop.sh
fi

if [ ! -f latest.amd64.linux.zip ]
then
    echo "latest.amd64.linux.zip does not exist, download and unzip it..."
    wget -L https://downloads.lockval.com/latest.amd64.linux.zip
    unzip -o latest.amd64.linux.zip
fi

cd dist
./start.sh
cd ..
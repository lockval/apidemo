#!/bin/bash


./stopServer.sh

if [ ! -f latest.amd64.linux.zip ]
then
    echo "latest.amd64.linux.zip does not exist, download and unzip it..."
    wget -L https://downloads.lockval.com/latest.amd64.linux.zip
    unzip -d service -o latest.amd64.linux.zip
fi

cd service/dist
./start.sh
cd ../..

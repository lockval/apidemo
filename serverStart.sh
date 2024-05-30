#!/bin/bash


if [ ! -f latest.amd64.linux.zip ]
then
    echo "latest.amd64.linux.zip does not exist, download and unzip it..."
    wget -L https://downloads.lockval.com/latest.amd64.linux.zip
    unzip -d svrBin -o latest.amd64.linux.zip
fi

if [ -n "$CODESPACES" ]; then
    echo "Running in GitHub Codespace"
    gh codespace ports visibility 59501:public -c $CODESPACE_NAME
    gh codespace ports visibility 59502:public -c $CODESPACE_NAME
else
    echo "Not running in GitHub Codespace"
fi


cd svrBin/dist
./start.sh $1
cd ../..

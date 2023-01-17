#!/bin/bash


./serverStop.sh
rm -f latest.amd64.linux.zip
rm -rf svrBin
./serverStart.sh

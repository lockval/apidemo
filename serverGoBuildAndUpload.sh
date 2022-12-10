#!/bin/bash

# This script can help you compile server code and upload it to your own server

cd ./public/server/go/

if [[ $(go env GOVERSION) != go1.19* ]]; then
    echo fail
    exit 1
fi

UpdatefileDomain="127.0.0.1:8080"
UpdatefilePassword="123456"
if [[ "$lockvalUpdatefileDomain" != "" ]];then
    UpdatefileDomain=$lockvalUpdatefileDomain
fi
if [[ "$lockvalUpdatefilePassword" != "" ]];then
    UpdatefilePassword=$lockvalUpdatefilePassword
fi

GoPluginMagicModule="GoPluginMagicModule"$(date +%s)

# find . -name "*.go" -print0 | xargs -0 perl -pe "s/GoPluginMagicModule/${GoPluginMagicModule}/gi"
find . -name '*.go' | xargs perl -pi -e "s|GoPluginMagicModule|${GoPluginMagicModule}|g"
find . -name 'go.mod' | xargs perl -pi -e "s|GoPluginMagicModule|${GoPluginMagicModule}|g"

go build -trimpath -buildmode=plugin -o dist/main.elf ./main && \
curl --insecure -X POST --data-binary @../../../public/main.json https://${UpdatefileDomain}/main.json?pwd=${UpdatefilePassword} && \
curl --insecure -X POST --data-binary @dist/main.elf https://${UpdatefileDomain}/main?pwd=${UpdatefilePassword}

find . -name 'go.mod' | xargs perl -pi -e "s|${GoPluginMagicModule}|GoPluginMagicModule|g"
find . -name '*.go' | xargs perl -pi -e "s|${GoPluginMagicModule}|GoPluginMagicModule|g"

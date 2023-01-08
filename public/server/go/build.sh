#!/bin/bash

# This script can help you compile go server script

if [[ $(go env GOVERSION) != go1.19.4 ]]; then
    echo fail
    exit 1
fi

GoPluginMagicModule="GoPluginMagicModule"$(date +%s)

# find . -name "*.go" -print0 | xargs -0 perl -pe "s/GoPluginMagicModule/${GoPluginMagicModule}/gi"
find . -name '*.go' | xargs perl -pi -e "s|GoPluginMagicModule|${GoPluginMagicModule}|g"
find . -name 'go.mod' | xargs perl -pi -e "s|GoPluginMagicModule|${GoPluginMagicModule}|g"

go build -trimpath -buildmode=plugin -o ../../../dist/main.elf ./main && \


find . -name 'go.mod' | xargs perl -pi -e "s|${GoPluginMagicModule}|GoPluginMagicModule|g"
find . -name '*.go' | xargs perl -pi -e "s|${GoPluginMagicModule}|GoPluginMagicModule|g"

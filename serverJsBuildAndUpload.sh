#!/bin/bash

# This script can help you compile server code and upload it to your own server

# uglifyjs -c -m -o public/server.js -- public/server.js
echo Before running, please set the environment variables lockvalUpdatefileDomain and lockvalUpdatefilePassword
npm run serverGen && npm run serverUpload

#!/usr/bin/env node
let mydomain = process.argv[2];
let password = process.argv[3];
if (!mydomain) mydomain = "127.0.0.1:8080";
if (!password) password = "123456";
console.log("https://" + mydomain + "/main?pwd=" + password);

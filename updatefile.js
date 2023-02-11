#!/usr/bin/env node
let mydomain = process.env.lockvalUpdatefileDomain;
let password = process.env.lockvalUpdatefilePassword;
if (!mydomain) mydomain = "127.0.0.1:8080";
if (!password) password = "123456";

const { exit } = require("node:process");
const { exec } = require("child_process");
function execCmd(cmd){
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      exit(1);
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      // exit(2);
    }
    console.log(`stdout: ${stdout}`);
  });
  
}

let url=""
let cmd=""

// upload main.json (input.Json)
url = "https://" + mydomain + "/main.json?pwd=" + password
cmd = "curl --insecure -X POST --data-binary @public/main.json" + " " + url
execCmd(cmd)

// upload server script
url = "https://" + mydomain + "/main?pwd=" + password
cmd = "curl --insecure -X POST --data-binary @" + process.argv[2] + " " + url
execCmd(cmd)


#!/usr/bin/env node
let mydomain = process.env.lockvalUpdatefileDomain;
let password = process.env.lockvalUpdatefilePassword;
if (!mydomain) mydomain = "127.0.0.1:8080";
if (!password) password = "123456";

let url = "https://" + mydomain + "/main?pwd=" + password
// console.log(url);



const { exec } = require("child_process");

let cmd = "curl --insecure -X POST --data-binary @" + process.argv[2] + " " + url

exec(cmd, (error, stdout, stderr) => {
  if (error) {
    console.log(`error: ${error.message}`);
    return 1;
  }
  if (stderr) {
    console.log(`stderr: ${stderr}`);
    // return 2;
  }
  console.log(`stdout: ${stdout}`);
});

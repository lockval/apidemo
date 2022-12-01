#!/usr/bin/env node

function walkSync(currentDirPath, ext, callback) {
  let fs = require('fs'),
    path = require('path');

  fs.readdirSync(currentDirPath, { withFileTypes: true }).forEach(function (dirent) {
    let filePath = path.join(currentDirPath, dirent.name);
    if (dirent.isFile()) {
      if (filePath.endsWith(ext)) {
        callback(filePath.substring(4, filePath.length - ext.length));
      }

    } else if (dirent.isDirectory()) {
      walkSync(filePath, ext, callback);
    }
  });
}

let filePaths = []
walkSync("src", ".lua", function (filePath) {
  console.log(filePath);
  filePaths.push(filePath)
});

let cmd = "lua umd.lua src ../../../dist/main.lua " + filePaths.join(" ")
console.log(cmd);


const { exec } = require("child_process");

exec(cmd, (error, stdout, stderr) => {
  if (error) {
    console.log(`error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.log(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});

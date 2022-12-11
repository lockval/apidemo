#!/usr/bin/env node

let fs = require("fs");
var Mustache = require("mustache");

let demoList = JSON.parse(fs.readFileSync("./src/assets/client.json", "utf8"));
let output = fs.readFileSync("./public/client/player.temp.ts", "utf8");

let repl1tmp = "  //repl1";
let repl2tmp = "  //repl2";
let repl3tmp = "    //repl3";
let repl4tmp = "//repl4";

let view = {
  KeySubList: [],
};

let KeySubObjs = {};
for (let demo of demoList) {
  if (demo.KeySubList) {
    for (let KeySub of demo.KeySubList) {
      if (KeySubObjs[KeySub.name]) {
        KeySubObjs[KeySub.name].demoList.push({ name: demo.name });
      } else {
        KeySubObjs[KeySub.name] = {
          name: KeySub.name,
          comment: KeySub.comment,
          demoList: [{ name: demo.name }],
        };
      }
    }
  }
}
view.KeySubList = Object.values(KeySubObjs);

let repl1 = Mustache.render(
  `{{#KeySubList}}
  {{name}}     = this.regMap("{{name}}", this.onchange_{{name}}); // {{& comment}}
{{/KeySubList}}`,
  view
);

let repl2 = Mustache.render(
  `{{#KeySubList}}
  private onchange_{{name}}(contextObject: any, change: Map<string,string>) {
    let oldV = "";
    this.{{name}}.forEach((v,k)=>{
      oldV+=k+":"+v+"\\n";
    })
    let chgV = "";
    change.forEach((v,k)=>{
      chgV+=k+":"+v+"\\n";
    })
    this.eventTarget.dispatchEvent(
      new CustomEvent("postOldAndChg",{detail:{
        name:"{{name}}",
        oldV:oldV,
        chgV:chgV,
      }}))

    contextObject["{{name}}"] = true

  }

{{/KeySubList}}`,
  view
);

let repl3 = Mustache.render(
  `{{#KeySubList}}

    if("{{name}}" in contextObject){
      let newV = "";
      this.{{name}}.forEach((v,k)=>{
        newV+=k+":"+v+"\\n";
      })
      this.eventTarget.dispatchEvent(
        new CustomEvent("postNew",{detail:{
          name:"{{name}}",
          newV:newV,
        }}))
    }
{{/KeySubList}}`,
  view
);

let repl4="http://127.0.0.1:59501,http://127.0.0.1:59502";
if(process.env.lockvalGwAddrs){
  repl4=process.env.lockvalGwAddrs;
}

console.log("-------------------");
console.log(repl4);
console.log("-------------------");

output = output.replace(repl1tmp, repl1);
output = output.replace(repl2tmp, repl2);
output = output.replace(repl3tmp, repl3);
output = output.replace(repl4tmp, repl4);

fs.writeFileSync("./public/client/player.ts", output, "utf8");
// console.log(repl1);

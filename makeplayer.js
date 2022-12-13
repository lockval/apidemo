#!/usr/bin/env node

let fs = require("fs");
var Mustache = require("mustache");
const { exit } = require("node:process");
let demoList = JSON.parse(fs.readFileSync("./src/assets/client.json", "utf8"));

let outputMain = fs.readFileSync("./public/client/player.temp.ts", "utf8");
let outputStruct = fs.readFileSync("./public/client/struct.temp.ts", "utf8");

let repl1tmp = "  //repl1";
let repl2tmp = "  //repl2";
let repl3tmp = "    //repl3";
let repl4tmp = "//repl4";
let repl5tmp = "//repl5";

let structTemp = "structTemp";

class View{
  KeySubList = []
  KeySubObjs = {};
}

let view = new View()

let structView = {
  StructNameList: [],
  StructName2view: {}, //StructName.name:View
}

for (let demo of demoList) {
  if(demo.StructName){

    structView.StructNameList.push( { name: demo.StructName.name } )
    structView.StructName2view[demo.StructName.name]=new View();

  }else{
    if (demo.KeySubList) {
      
      for (let KeySub of demo.KeySubList) {

        if(KeySub.structName){
          
          let KeySubObjs = structView.StructName2view[KeySub.structName].KeySubObjs;
          if(!KeySubObjs){
            console.log("Define StructName before observing");
            exit(1)
          }
          if (KeySubObjs[KeySub.name]) {
            KeySubObjs[KeySub.name].demoList.push({ name: demo.name });
          } else {
            KeySubObjs[KeySub.name] = {
              name: KeySub.name,
              sName: KeySub.structName+"_",
              sID: KeySub.structID+"_",
              comment: KeySub.comment,
              demoList: [{ name: demo.name }],
            };
          }

        }else{

          let KeySubObjs = view.KeySubObjs;

          if (KeySubObjs[KeySub.name]) {
            KeySubObjs[KeySub.name].demoList.push({ name: demo.name });
          } else {
            KeySubObjs[KeySub.name] = {
              name: KeySub.name,
              sName: "",
              sID: "",
              comment: KeySub.comment,
              demoList: [{ name: demo.name }],
            };
          }

        }


        
      }
    }
  }

}


view.KeySubList = Object.values(view.KeySubObjs);

for(let StructName in structView.StructName2view){
  let viewS = structView.StructName2view[StructName];
  viewS.KeySubList = Object.values(viewS.KeySubObjs);
}

function repl123(v){

let repl1 = Mustache.render(
  `{{#KeySubList}}
  {{name}}     = this.regMap("{{name}}", this.onchange_{{name}}); // {{& comment}}
{{/KeySubList}}`,
  v
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
    eventTarget.dispatchEvent(
      new CustomEvent("postOldAndChg",{detail:{
        name:"{{sName}}{{sID}}{{name}}",
        oldV:oldV,
        chgV:chgV,
      }}))

    contextObject["{{name}}"] = true

  }

{{/KeySubList}}`,
  v
);

let repl3 = Mustache.render(
  `{{#KeySubList}}

    if("{{name}}" in contextObject){
      let newV = "";
      this.{{name}}.forEach((v,k)=>{
        newV+=k+":"+v+"\\n";
      })
      eventTarget.dispatchEvent(
        new CustomEvent("postNew",{detail:{
          name:"{{sName}}{{sID}}{{name}}",
          newV:newV,
        }}))
    }
{{/KeySubList}}`,
  v
);

return [repl1,repl2,repl3];

}

let [repl1,repl2,repl3] = repl123(view)

let repl4="http://127.0.0.1:59501,http://127.0.0.1:59502";
if(process.env.lockvalGwAddrs){
  repl4=process.env.lockvalGwAddrs;
}

let repl5 = Mustache.render(
  `{{#StructNameList}}
import { {{name}}Data } from "./struct_{{name}}";
{{/StructNameList}}
export const structDict: Dict={
  {{#StructNameList}}
  {{name}}: {{name}}Data,
  {{/StructNameList}}
}
`,
  structView
);

console.log("-------------------");
console.log(repl4);
console.log("-------------------");

outputMain = outputMain.replace(repl1tmp, repl1);
outputMain = outputMain.replace(repl2tmp, repl2);
outputMain = outputMain.replace(repl3tmp, repl3);
outputMain = outputMain.replace(repl4tmp, repl4);
outputMain = outputMain.replace(repl5tmp, repl5);

fs.writeFileSync("./public/client/player.ts", outputMain, "utf8");



for(let StructName in structView.StructName2view){
  
  let myview = structView.StructName2view[StructName]

  // console.log("!!!",StructName, myview);

  let [repl1,repl2,repl3] = repl123(myview)

  let outputStructGen = outputStruct.replace(repl1tmp, repl1);
  outputStructGen = outputStructGen.replace(repl2tmp, repl2);
  outputStructGen = outputStructGen.replace(repl3tmp, repl3);
  outputStructGen = outputStructGen.replace(structTemp, StructName);


  fs.writeFileSync(`./public/client/struct_${StructName}.ts`, outputStructGen, "utf8");
}

// console.log(repl1);

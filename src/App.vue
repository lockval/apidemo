<script setup lang="ts">
import clientobj from "./assets/client.json";
import { Player } from "../public/client/player";

import { store, type Dict } from "./g/data";
import { onMounted } from "vue";

let params: Dict = {};
let player = new Player();

function input() {
  window.localStorage.setItem("guestname", store.state.config.guestname);
}

function makeid(length: number) {
  var result = "";
  var characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

onMounted(() => {
  let guestname = window.localStorage.getItem("guestname");

  if (!guestname) {
    guestname = makeid(16);
    window.localStorage.setItem("guestname", guestname);
  }
  store.commit("setConfig", { k: "guestname", v: guestname });

  player.userData.eventTarget.addEventListener("OnLogin", () => {
    store.commit("setConfig", { k: "UID", v: player.UID });
    console.log("OnLogin");
  });
  player.userData.eventTarget.addEventListener("OnDisconnect", (e: any) => {
    console.log("OnDisconnect", e.detail);
  });
  player.userData.eventTarget.addEventListener("postOldAndChg", (e: any) => {
    store.commit("setOld", { k: e.detail.name, v: e.detail.oldV });
    store.commit("setChg", { k: e.detail.name, v: e.detail.chgV });
  });
  player.userData.eventTarget.addEventListener("postNew", (e: any) => {
    store.commit("setNew", { k: e.detail.name, v: e.detail.newV });
  });
  player.InitWindow();

  player.guestname = guestname;
  player.Open(1);
});

function toBoolean(v: any): boolean {
  if (!v) {
    return false;
  } else if (v === true) {
    return true;
  } else if (typeof v == "string") {
    v = v.toLowerCase().trim();
    switch (v) {
      case "true":
      case "yes":
      case "1":
        return true;

      default:
        return !!JSON.parse(v);
    }
  }
  return false;
}
function clientCode() {
  if (!store.state.config.clientCode) {
    fetch("./client/player.ts")
      .then((resp) => resp.text())
      .then((data) => store.commit("setConfig", { k: "clientCode", v: data }));
  } else {
    store.commit("setConfig", { k: "clientCode", v: "" });
  }
}

function mainJSON() {
  if (!store.state.config.clientCode) {
    fetch("./main.json")
      .then((resp) => resp.text())
      .then((data) => store.commit("setConfig", { k: "clientCode", v: data }));
  } else {
    store.commit("setConfig", { k: "clientCode", v: "" });
  }
}

// window.open("./server/javascript/src/usr/" + callname + ".ts");
async function jscode(callname: string, demoname: string) {
  fetch("./server/javascript/src/usr/" + callname + ".ts")
    .then((resp) => resp.text())
    .then((data) => store.commit("setCode", { k: demoname, v: data }));
}
async function gocode(callname: string, demoname: string) {
  fetch("./server/go/src/usr/" + callname + ".go")
    .then((resp) => resp.text())
    .then((data) => store.commit("setCode", { k: demoname, v: data }));
}
async function luacode(callname: string, demoname: string) {
  fetch("./server/lua/src/usr/" + callname + ".lua")
    .then((resp) => resp.text())
    .then((data) => store.commit("setCode", { k: demoname, v: data }));
}
async function starcode(callname: string, demoname: string) {
  fetch("./server/starlark/src/usr/" + callname + ".star")
    .then((resp) => resp.text())
    .then((data) => store.commit("setCode", { k: demoname, v: data }));
}

async function Call(name: string, types: any, demoname: string) {
  store.commit("setCode", { k: demoname, v: "" });

  if (types === undefined) {
    types = {};
    params = {};
  }
  for (const [key, value] of Object.entries(types)) {
    if (key in params) {
      if (value == "boolean") {
        params[key] = toBoolean(params[key]);
      } else if (value == "number") {
        params[key] = Number(params[key]);
      }
    }
  }
  // console.log(params);

  let resp = await player.Call(name, params);
  store.commit("setCode", { k: demoname, v: JSON.stringify(resp, null, 4) });
}
</script>

<template>
  <!-- <header>
    <div>
      <HelloWorld msg="You did it!" />
    </div>
  </header> -->

  <main>
    <p>
      <span>welcome to </span>
      <span style="font-size: 40px" class="blue">loc</span>
      <span style="font-size: 40px" class="red">K</span>
      <span style="font-size: 40px" class="green">V</span>
      <span style="font-size: 40px" class="blue">al</span>
    </p>
    <br />
    <p>
      locKVal is a distributed key-value service engine that can run scripts.
    </p>
    <p>
      You can
      <a href="https://github.com/lockval/apidemo" target="_blank">download</a>
      it to build your own server
    </p>
    <br />
    <p>On the server side, you can write in the following languages:</p>
    <p class="red">Javascript/TypeScript, Go, Lua, Starlark(like Python)</p>
    <p>
      <span>We now provide </span>
      <span class="red">TypeScript libraries for clients</span>,
    </p>
    <p>
      and will gradually provide support for more environments in the future
    </p>
    <br />
    <p>You can learn how to build your app with locKVal here.</p>
    <p>
      This site(<a href="https://github.com/lockval/apidemo" target="_blank"
        >source</a
      >) is built using locKVal itself
    </p>
    <p>This site is still under construction</p>
    <br /><br /><br />

    x.Name = <input @input="input" v-model="$store.state.config.guestname" /> //
    refresh takes effect<br />
    <button @click="clientCode()">show / hide client code</button><br />
    <button @click="mainJSON()">show / hide main.json (config)</button><br />
    <highlightjs language="typescript" :code="$store.state.config.clientCode" />

    console.log(this.UID);<br />
    {{ $store.state.config.UID }}<br />

    <br /><br /><br />

    <div v-for="demo in clientobj" :key="demo.name">
      <li>{{ demo.name }}</li>
      <v-md-preview :text="demo.comment"></v-md-preview>

      <highlightjs autodetect :code="$store.state.getHL(demo.name)" />
      <button @click="jscode(demo.Call.name, demo.name)">JS</button> •
      <button @click="gocode(demo.Call.name, demo.name)">Go</button> •
      <button @click="luacode(demo.Call.name, demo.name)">Lua</button> •
      <button @click="starcode(demo.Call.name, demo.name)">Starlark</button> ---
      <button @click="Call(demo.Call.name, demo.Call.params, demo.name)">
        Call "{{ demo.Call.name }}"
      </button>
      {

      <span v-for="(val, key) in demo.Call.params" :key="key">
        {{ key }} {{ val }}<input :type="val" v-model="params[key]" />,
      </span>
      }
      <div v-for="KeySub in demo.KeySubList" :key="KeySub.name">
        KeySub: {{ KeySub.name }}

        <table>
          <tr>
            <td>old( onchange_{{ KeySub.name }} .. let oldV .. )</td>
            <td>change( onchange_{{ KeySub.name }} .. let chgV .. )</td>
            <td>new( contextObject.ChangeName=="{{ KeySub.name }}" .. )</td>
          </tr>
          <tr>
            <td>
              <textarea
                readonly
                rows="10"
                cols="54"
                v-model="$store.state.oldV[KeySub.name]"
              ></textarea>
            </td>
            <td>
              <textarea
                readonly
                rows="10"
                cols="54"
                v-model="$store.state.chgV[KeySub.name]"
              ></textarea>
            </td>
            <td>
              <textarea
                readonly
                rows="10"
                cols="54"
                v-model="$store.state.newV[KeySub.name]"
              ></textarea>
            </td>
          </tr>
        </table>
      </div>

      <br /><br /><br /><br />
    </div>
  </main>
</template>

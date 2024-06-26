<script setup lang="ts">
import clientobj from "./assets/client.json";
import { Player, eventTarget, structDict } from "../public/client/player";

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

  fetch("./main.json")
    .then((resp) => {
      if (!resp.ok && resp.status === 404) {
        return "";
      }
      return resp.text();
    })
    .then((data) => store.commit("setConfig", { k: "jsonCode", v: data }))
    .catch((error) => {
      console.error("Fetch error:", error);
      store.commit("setConfig", { k: "jsonCode", v: "" });
    });

  if (!guestname) {
    guestname = makeid(16);
    window.localStorage.setItem("guestname", guestname);
  }
  store.commit("setConfig", { k: "guestname", v: guestname });

  eventTarget.addEventListener("OnLogin", () => {
    store.commit("setConfig", { k: "UID", v: player.userData.UID });
    console.log("OnLogin");
  });
  eventTarget.addEventListener("OnDisconnect", (e: any) => {
    console.log("OnDisconnect", e.detail);
    store.commit("setConfig", {
      k: "UID",
      v: "After successful login, this text will be replaced by UID",
    });
    store.commit("disconnect");
  });
  eventTarget.addEventListener("postOldAndChg", (e: any) => {
    store.commit("setOld", { k: e.detail.name, v: e.detail.oldV });
    store.commit("setChg", { k: e.detail.name, v: e.detail.chgV });
  });
  eventTarget.addEventListener("postNew", (e: any) => {
    store.commit("setNew", { k: e.detail.name, v: e.detail.newV });
  });
  player.InitWindow();

  player.guestname = guestname;
  player.Open(null);
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
      .then((resp) => {
        if (!resp.ok && resp.status === 404) {
          return "";
        }
        return resp.text();
      })
      .then((data) => store.commit("setConfig", { k: "clientCode", v: data }))
      .catch((error) => {
        console.error("Fetch error:", error);
        store.commit("setConfig", { k: "clientCode", v: "" });
      });
  } else {
    store.commit("setConfig", { k: "clientCode", v: "" });
  }
}

async function Watch(StructName: string, id: string) {
  let resp = await player.Watch(StructName + ":" + id, structDict[StructName]);
  if (resp) {
    store.commit("setWatch", { k: StructName + ":" + id, v: true });
  }
}

function structName(KeySub: any) {
  return !!KeySub["structName"];
}
function structNameID(KeySub: any) {
  return '"' + KeySub["structName"] + ":" + KeySub["structID"] + '"';
}

function WatchClose(StructName: string, id: string) {
  player.WatchClose(StructName + ":" + id);
  store.commit("setWatch", { k: StructName + ":" + id, v: false });
}

function updateCodeTitle(demoname: string, path: string) {
  fetch(path)
    .then((resp) => {
      if (!resp.ok && resp.status === 404) {
        return "";
      }
      return resp.text();
    })
    .then((data) => {
      store.commit("setCode", { k: demoname, v: data });
      store.commit("setTitle", { k: demoname, v: path });
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      store.commit("setCode", { k: demoname, v: "" });
      store.commit("setTitle", { k: demoname, v: path });
    });
}

async function structCode(structName: string, demoname: string) {
  updateCodeTitle(demoname, "./client/struct_" + structName + ".ts");
}

// window.open("./server/javascript/src/usr/" + callname + ".ts");
async function jscode(name: string, callname: string, demoname: string) {
  updateCodeTitle(
    demoname,
    "./server/javascript/src/" + name + "/" + callname + ".ts"
  );
}
async function gocode(name: string, callname: string, demoname: string) {
  updateCodeTitle(demoname, "./server/go/src/" + name + "/" + callname + ".go");
}
async function luacode(name: string, callname: string, demoname: string) {
  updateCodeTitle(
    demoname,
    "./server/lua/src/" + name + "/" + callname + ".lua"
  );
}
async function starcode(name: string, callname: string, demoname: string) {
  updateCodeTitle(
    demoname,
    "./server/starlark/src/" + name + "/" + callname + ".star"
  );
}

async function jswatch(name: string, demoname: string) {
  updateCodeTitle(demoname, `./server/javascript/src/${name}.ts`);
}
async function gowatch(name: string, demoname: string) {
  updateCodeTitle(demoname, `./server/go/src/${name}.go`);
}
async function luawatch(name: string, demoname: string) {
  updateCodeTitle(demoname, `./server/lua/src/${name}.lua`);
}
async function starwatch(name: string, demoname: string) {
  updateCodeTitle(demoname, `./server/starlark/src/${name}.star`);
}

function GetoldV(KeySub: any) {
  if (KeySub.structName) {
    return store.state.oldV[
      KeySub.structName + "_" + KeySub.structID + "_" + KeySub.name
    ];
  } else {
    return store.state.oldV[KeySub.name];
  }
}

function GetchgV(KeySub: any) {
  if (KeySub.structName) {
    return store.state.chgV[
      KeySub.structName + "_" + KeySub.structID + "_" + KeySub.name
    ];
  } else {
    return store.state.chgV[KeySub.name];
  }
}

function GetnewV(KeySub: any) {
  if (KeySub.structName) {
    return store.state.newV[
      KeySub.structName + "_" + KeySub.structID + "_" + KeySub.name
    ];
  } else {
    return store.state.newV[KeySub.name];
  }
}

async function Call(name: string, types: any, demoname: string) {
  store.commit("setCode", { k: demoname, v: "" });
  store.commit("setTitle", { k: demoname, v: "" });

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

  let resp = await player.userData.Call(name, params);
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
      <span>
        <a href="https://lockval.com" target="_blank">Lockval Engine</a>
        is free Game backend engine
      </span>
      <!-- <span style="font-size: 40px" class="blue">loc</span>
      <span style="font-size: 40px" class="red">K</span>
      <span style="font-size: 40px" class="green">V</span>
      <span style="font-size: 40px" class="blue">al</span> -->
    </p>
    <br />
    <p>
      Lockval Engine is a distributed backend key-value engine that can run
      scripts.
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
    <p>You can learn how to build your app with Lockval Engine here.</p>
    <p>
      This site(<a href="https://github.com/lockval/apidemo" target="_blank"
        >source</a
      >) is built using Lockval Engine itself
    </p>

    <br /><br /><br />

    <hr />
    ▼ Client Code
    <br />
    <br />
    <button @click="clientCode()">show / hide player.ts</button><br />
    <highlightjs language="typescript" :code="$store.state.config.clientCode" />
    <br />
    your entry code:<br />
    guestname =
    <input @input="input" v-model="$store.state.config.guestname" /> // refresh
    takes effect<br />
    <highlightjs
      language="typescript"
      code='import { Player } from "./player";
let player = new Player();
player.guestname = guestname;
player.Open(null);
    '
    />
    <br />
    In player.ts you can check your UID<br />
    <highlightjs language="typescript" code="console.log(this.userData.UID);" />
    <div class="blinking">{{ $store.state.config.UID }}</div>
    <br /><br /><br />

    <hr />
    ▼ main.json (config)
    <highlightjs language="json" :code="$store.state.config.jsonCode" />

    <br />
    <br />
    <hr />

    ▼ Server Basic Code<br />

    When loading a new server-side script, this json code is called first. You
    can preprocess json data here and return new json data<br />
    <button @click="jswatch('json', '')">JS(json)</button> •
    <button @click="gowatch('json', '')">Go(json)</button> •
    <button @click="luawatch('json', '')">Lua(json)</button> •
    <button @click="starwatch('json', '')">Starlark(json)</button>
    <br /><br />

    After calling the json code, the public code will be executed. Here you can
    set which prefix UIDs expose which fields.<br />
    <button @click="jswatch('public', '')">JS(public)</button> •
    <button @click="gowatch('public', '')">Go(public)</button> •
    <button @click="luawatch('public', '')">Lua(public)</button> •
    <button @click="starwatch('public', '')">Starlark(public)</button>
    <br /><br />

    Run this code when user logs in.<br />
    <button @click="jswatch('login', '')">JS(login)</button> •
    <button @click="gowatch('login', '')">Go(login)</button> •
    <button @click="luawatch('login', '')">Lua(login)</button> •
    <button @click="starwatch('login', '')">Starlark(login)</button>
    <br /><br />

    When the front end executes the 'Watch' command, this code will be executed,
    and the returned Boolean value determines whether the 'Watch' command is
    allowed<br />
    <button @click="jswatch('watch', '')">JS(watch)</button> •
    <button @click="gowatch('watch', '')">Go(watch)</button> •
    <button @click="luawatch('watch', '')">Lua(watch)</button> •
    <button @click="starwatch('watch', '')">Starlark(watch)</button>
    <br /><br />

    <div>{{ $store.state.getTitle("") }}</div>
    <highlightjs autodetect :code="$store.state.getHL('')" />

    <br />
    <br />
    <hr />
    <br />
    <br />
    <div style="color: #f00">
      ▼ The following uses several examples to explain the functions and usage
      of each API, click to expand to view
    </div>
    <br />

    <br /><br /><br />

    <div v-for="demo in clientobj" :key="demo.name">
      <hr />
      <details>
        <summary>
          {{ demo.name }}
        </summary>
        <v-md-preview :text="demo.comment"></v-md-preview>
        <div>{{ $store.state.getTitle(demo.name) }}</div>
        <highlightjs autodetect :code="$store.state.getHL(demo.name)" />
        <template v-if="demo.Call">
          <button @click="jscode('usr', demo.Call.name, demo.name)">JS</button>
          •
          <button @click="gocode('usr', demo.Call.name, demo.name)">Go</button>
          •
          <button @click="luacode('usr', demo.Call.name, demo.name)">
            Lua
          </button>
          •
          <button @click="starcode('usr', demo.Call.name, demo.name)">
            Starlark
          </button>
          ---
          <button @click="Call(demo.Call.name, demo.Call.params, demo.name)">
            player.userData.Call("{{ demo.Call.name }}",obj)
          </button>
          obj:{

          <span v-for="(val, key) in demo.Call.params" :key="key">
            {{ key }}: {{ val }},
            <input size="6" :type="val" v-model="params[key]" />&nbsp;
          </span>
          }

          <div v-for="KeySub in demo.KeySubList" :key="KeySub.name">
            <template v-if="structName(KeySub)">
              {{ structNameID(KeySub) }} KeySub: {{ KeySub.name }}
            </template>
            <template v-else> KeySub: {{ KeySub.name }} </template>

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
                    :value="GetoldV(KeySub)"
                  ></textarea>
                </td>
                <td>
                  <textarea
                    readonly
                    rows="10"
                    cols="54"
                    :value="GetchgV(KeySub)"
                  ></textarea>
                </td>
                <td>
                  <textarea
                    readonly
                    rows="10"
                    cols="54"
                    :value="GetnewV(KeySub)"
                  ></textarea>
                </td>
              </tr>
            </table>
          </div>
        </template>
        <template v-else-if="demo.StructName">
          <button @click="structCode(demo.StructName.name, demo.name)">
            show CLIENT code
          </button>

          <div v-for="id in demo.IDs" :key="id">
            <button
              :disabled="$store.state.IsInWatch(demo.StructName.name, id)"
              @click="Watch(demo.StructName.name, id)"
            >
              player.Watch("{{ demo.StructName.name }}:{{ id }}",{{
                demo.StructName.name
              }}Data);
            </button>
            •
            <button
              :disabled="$store.state.IsNoWatch(demo.StructName.name, id)"
              @click="WatchClose(demo.StructName.name, id)"
            >
              player.WatchClose("{{ demo.StructName.name }}:{{ id }}");
            </button>
          </div>
        </template>
        <template v-else-if="demo.sys">
          <button @click="jscode('sys', demo.sys.name, demo.name)">JS</button> •
          <button @click="gocode('sys', demo.sys.name, demo.name)">Go</button> •
          <button @click="luacode('sys', demo.sys.name, demo.name)">Lua</button>
          •
          <button @click="starcode('sys', demo.sys.name, demo.name)">
            Starlark
          </button>

          <div v-for="KeySub in demo.KeySubList" :key="KeySub.name">
            <template v-if="structName(KeySub)">
              {{ structNameID(KeySub) }} KeySub: {{ KeySub.name }}
            </template>
            <template v-else> KeySub: {{ KeySub.name }} </template>

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
                    :value="GetoldV(KeySub)"
                  ></textarea>
                </td>
                <td>
                  <textarea
                    readonly
                    rows="10"
                    cols="54"
                    :value="GetchgV(KeySub)"
                  ></textarea>
                </td>
                <td>
                  <textarea
                    readonly
                    rows="10"
                    cols="54"
                    :value="GetnewV(KeySub)"
                  ></textarea>
                </td>
              </tr>
            </table>
          </div>
        </template>
        <br /><br /><br />
      </details>
      <br /><br /><br />
    </div>

    <br />
    <br />
    <hr />
    <br />
    <br />
    <div style="color: #f00">
      ▼ Below is a demo of the "trigger" service.<br />

      You can only test it in your own local environment.<br />

      'trigger' can initiate the execution of script functions via http. In this
      way, a function similar to recharge callback can be realized<br />

      Copy the code to the console for execution, and find that the value of
      Count has changed.
    </div>
    <br />
    fetch("http://127.0.0.1:59102/call?chk=3333&uid={{
      $store.state.config.UID
    }}&cmd=sys/testItsTime",{method: 'POST',body:JSON.stringify({n:1})})
  </main>
</template>

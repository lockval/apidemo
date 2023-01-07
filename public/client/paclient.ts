// contextObject is the context Object before and after kv modification
// A contextObject will call successively:
// OnKeySub...
// UpdateAfter
export abstract class UserDataBase {
  public UID = ""; //UID
  private metaData = new Map<string, metaDef>();

  protected abstract UpdateAfter(contextObject: Object): void; //After updating the data

  protected regMap<T extends Map<string, string>>(
    n: string,
    OnKeySub: (contextObject: Object, changeData: T) => void,
    c?: { new (): T }
  ): T {
    if (c) {
      this.metaData.set(n, new metaDef(c, OnKeySub));
      return new c();
    } else {
      this.metaData.set(n, new metaDef(Map, OnKeySub));
      return <T>new Map<string, string>();
    }
  }

  private owner: paclient | null = null;

  public Call<T = any>(apiname: string, requ: any): Promise<ApiResp<T>> {
    if (apiname.startsWith("-")) {
      throw "bad apiname";
    }

    const cmdAndCookies = apiname.split("-");
    for (let i = 1; i < cmdAndCookies.length; i++) {
      const names = cmdAndCookies[i].split("_");
      let vv = "";
      if (names.length == 2) {
        const v = (<any>this)[names[0]].get(names[1]);
        if (v !== undefined) {
          vv = v;
        }
      } else if (names.length == 3) {
        const v = (<any>this)[names[0]].get(requ[names[1]]);
        if (v !== undefined) {
          vv = v;
        }
      } else {
        throw "bad apiname cookie:" + cmdAndCookies[i];
      }

      requ["Cookie_" + cmdAndCookies[i]] = vv;
    }

    return <Promise<ApiResp<T>>>this.owner?._call(apiname, requ);
  }
}

abstract class Base {
  public abstract userData: any;
  protected Index: any; //KeySub

  protected OnPush(
    UpdateData: any,
    contextObject: any,
    klist: Array<string>
  ): void {
    for (const k of klist) {
      // append Resp.KeySub.SubVal and contextObject to KeySub
      if ("SubVal" in UpdateData.Resp.KeySub[k]) {
        UpdateData.Requ.KeySub[k]["RespSubVal"] =
          UpdateData.Resp.KeySub[k].SubVal;
      }
      UpdateData.Requ.KeySub[k]["contextObject"] = contextObject;

      const md: metaDef = this.userData.metaData.get(k);
      // set index:KeySub[k], and push sort index
      md.pushDataList.set(
        UpdateData.Resp.KeySub[k].Index,
        UpdateData.Requ.KeySub[k]
      );
      md.pushDataSort.push(UpdateData.Resp.KeySub[k].Index);
      md.pushDataSort.sort();

      while (md.pushDataSort.length) {
        const firstkey = md.pushDataSort[0];

        if (this.Index[k].Index + 1 === firstkey) {
          const firstval = md.pushDataList.get(firstkey);

          if (md.OnKeySub) {
            const changeData = new md.cls();

            if (firstval.Clear) {
              //clean all
              this.userData[k].forEach((_: string, kk: string) => {
                changeData.set(kk, "");
              });
            }

            if ("RespSubVal" in firstval) {
              const kks = Object.keys(firstval.RespSubVal);
              kks.sort();
              for (const kk of kks) {
                changeData.set(kk, firstval.RespSubVal[kk]);
              }
            } else {
              for (const kk in firstval.SubVal) {
                changeData.set(kk, firstval.SubVal[kk]);
              }
            }

            md.OnKeySub.bind(this.userData)(firstval.contextObject, changeData);
          }

          if ("Clear" in firstval) {
            this.userData[k] = new md.cls();
          }

          if ("RespSubVal" in firstval) {
            const kks = Object.keys(firstval.RespSubVal);
            kks.sort();

            for (const kk of kks) {
              if (firstval.RespSubVal[kk]) {
                this.userData[k].set(kk, firstval.RespSubVal[kk]);
              } else {
                this.userData[k].delete(kk);
              }
            }
          } else {
            for (const kk in firstval.SubVal) {
              if (firstval.SubVal[kk]) {
                this.userData[k].set(kk, firstval.SubVal[kk]);
              } else {
                this.userData[k].delete(kk);
              }
            }
          }

          firstval.contextObject.__KeySubNum__--;

          if (firstval.contextObject.__KeySubNum__ === 0) {
            // setTimeout(() => {
            this.userData.UpdateAfter.bind(this.userData)(
              firstval.contextObject
            );
            // }, 0)
          }

          md.pushDataList.delete(firstkey);
          md.pushDataSort.shift();
          this.Index[k].Index = firstkey;
        } else if (this.Index[k].Index === firstkey) {
          //same index

          const firstval = md.pushDataList.get(firstkey);
          // console.log("====discard====", firstkey, firstval);

          firstval.contextObject.__KeySubNum__--;

          if (firstval.contextObject.__KeySubNum__ === 0) {
            // setTimeout(() => {
            this.userData.UpdateAfter.bind(this.userData)(
              firstval.contextObject
            );
            // }, 0)
          }

          md.pushDataList.delete(firstkey);
          md.pushDataSort.shift();
        } else {
          break;
        }
      }
    }
  }

  protected contextObjectMake(UpdateData: any): [Array<string>, any] {
    const contextObject = <any>new Object();
    contextObject.__KeySubNum__ = 0;

    const klist: string[] = [];
    for (const k in UpdateData.Resp.KeySub) {
      if (this.userData.metaData.has(k)) {
        contextObject.__KeySubNum__++;
        klist.push(k);
      }
    }

    if (!contextObject.__KeySubNum__) {
      return [klist, null];
    }

    return [klist, contextObject];
  }

  protected _onLogin(data: any) {
    // console.log("====OnLogin====data====", data);

    // this.userData = new this.userData.constructor();
    this.userData.owner = this;

    // console.log("====Get====", data.Get)
    // console.log("====Put====", data.Put)
    // console.log("====UpdateData====", data.UpdateData)
    this.Index = data.Put.KeySub;

    const contextObject = <any>new Object();

    for (const k in data.Get.KeySub) {
      const md: metaDef = this.userData.metaData.get(k);
      const SubVal = data.Get.KeySub[k].SubVal;
      if (!md || !SubVal) {
        continue;
      }

      const changeData = new md.cls();

      const kks = Object.keys(SubVal);
      kks.sort();
      for (const kk of kks) {
        changeData.set(kk, SubVal[kk]);
      }

      md.OnKeySub.bind(this.userData)(contextObject, changeData);
      this.userData[k] = changeData;
    }

    this.userData.UpdateAfter.bind(this.userData)(contextObject);

    // console.log("====OnLogin====userData====", this.userData)
  }
}

export class paclientSub extends Base {
  public userData!: UserDataBase;
}

export abstract class paclient extends Base {
  protected abstract OnDisconnect(reason: string, reconnSec: number): void;
  protected abstract OnLogin(): void;

  protected abstract OnPleaseLogin(logindata: any): Promise<LoginByMethod>; //Get login module and information
  protected abstract OnLoginInfo(logindata: any): LoginInfo; //Get login address and bucket

  // about storage
  private bucket = ""; //storage bucket

  // about websocket
  private loginStep = 0; // login step
  private reconnMs = 16; // wait for reconnect time
  private ws: WebSocket | null = null; // websocket
  private t2popo = 0; //ws heartbeat timer handle
  private t2reconn = 0; //ws reconnect timer handle
  private error = ""; // error message
  private watchMgr: Dict<any> = {}; //UID:UserDataBase
  private UpdateDatas: any[] = []; //The UpdateData data received during the incomplete login process is temporarily stored here
  private watchData: Dict<any> = {}; //WatchUID:any[]  The UpdateData data received before the watch is not completed is temporarily stored here
  // about time
  private cliTimezoneSec = 0; // The client's time zone, example: UTC−05:00 is +18000
  private svrTimezoneSec = 0; // The server's time zone, example: UTC−05:00 is +18000
  private svrZone = ""; // The server's time zone string for display, example: -05:00
  private getTimeDelta = 0; // The time difference with the server, in milliseconds
  private d1 = new Date(); // for calc delay

  public ClearLocalData() {
    _clearLocalData(this.bucket);
  }

  public GetCliDate(): Date {
    const d = new Date();
    const dd = d.getTime() + this.getTimeDelta;
    return new Date(dd);
  }
  public GetSvrDate(): Date {
    const d = this.GetCliDate();
    const dd = d.getTime() + (this.cliTimezoneSec - this.svrTimezoneSec) * 1000;
    return new Date(dd);
  }
  private async loginAndWs(
    gw: string,
    bucket: string,
    ws: WebSocket,
    scheme: string
  ) {
    this.bucket = bucket;

    const l = _loadLocalData(this.bucket);

    let ll: LocalData | Platform;

    if (l.DBToken.length != 0) {
      ll = l;
    } else {
      const l = await this.OnPleaseLogin(this.logindata);
      const type = l.LoginMethodName();

      let resp: Response;
      try {
        resp = await fetch(scheme + "://" + gw + "/proxy/" + type + "/auth", {
          method: "POST",
          body: JSON.stringify(l),
        });
      } catch (e: any) {
        this.error = e.toString();
        _clearLocalData(this.bucket);
        const ce = new CloseEvent(type + " catch", { reason: this.error });
        this.onclose(ce);
        return;
      }

      if (!resp.ok) {
        this.error = await resp.text();
        _clearLocalData(this.bucket);
        const ce = new CloseEvent(type + " not ok", { reason: this.error });
        this.onclose(ce);
        return;
      }

      ll = await resp.json();

      // console.log("====login by auth====")
    }

    let resp: Response;
    try {
      resp = await fetch(scheme + "://" + gw + "/proxy/login/auth", {
        method: "POST",
        body: JSON.stringify(ll),
      });
    } catch (e: any) {
      this.error = e.toString();
      _clearLocalData(this.bucket);
      const ce = new CloseEvent("login catch", { reason: this.error });
      this.onclose(ce);
      return;
    }

    if (!resp.ok) {
      this.error = await resp.text();
      _clearLocalData(this.bucket);
      const ce = new CloseEvent("login not ok", { reason: this.error });
      this.onclose(ce);
      return;
    }

    const respdata: LoginRequ = await resp.json();
    this.userData.UID = respdata.UID;
    _saveLocalData(this.bucket, respdata);

    this.ws = ws;
    this.ws.onmessage = this.onmessage.bind(this);
    this.ws.onclose = this.onclose.bind(this);
    this.ws?.send(JSON.stringify(respdata));
    this.loginStep = 2;
    this.d1 = new Date();
  }

  private p_open() {
    const li = this.OnLoginInfo(this.logindata);

    const wslist: WebSocket[] = [];
    type wsinfo = {
      ws: WebSocket;
      count: number;
      gw: string;
      pacli: paclient;
      scheme: string;
    };
    // this.pacli.loginAndWs(gw, li.Bucket, this.ws);

    const t2fail = setTimeout(() => {
      for (const ws of wslist) {
        ws.close();
      }

      this.error = "gw is not available";
      _clearLocalData(this.bucket);
      const ce = new CloseEvent("p_open", { reason: this.error });
      this.onclose(ce);

      return;
    }, 5000); //Connect within 5 seconds and ping 5 times

    const sgws = li.GwAddrs.split(",");
    for (const sgw of sgws) {
      if (sgw) {
        const [scheme, Domain] = sgw.split("://");
        if (scheme != "https" && scheme != "http") {
          throw "scheme must be http or https";
        }

        let wsScheme = "ws";
        if (scheme == "https") {
          wsScheme = "wss";
        }
        const ws = new WebSocket(wsScheme + "://" + Domain + "/ws");
        wslist.push(ws);

        ws.onmessage = function (this: wsinfo) {
          if (this.count < 5) {
            this.count++;
            this.ws.send("");
            return;
          }
          clearTimeout(t2fail);
          const end = new Date().getTime();
          const ms = (end - (<any>this.ws).start) / 5;

          console.log("ws delay:" + ms + "ms", this.gw);

          for (const ws of wslist) {
            if (this.ws !== ws) {
              ws.close();
            }
          }
          this.pacli.loginAndWs(this.gw, li.Bucket, this.ws, this.scheme);
        }.bind({ ws: ws, count: 1, gw: Domain, pacli: this, scheme: scheme });

        ws.onopen = function () {
          (<any>this).start = new Date().getTime();
          this.send("");
        };
      }
    }
  }

  private logindata: any;
  public Open(logindata: any = null) {
    if (this.loginStep) {
      return;
    }
    this.logindata = logindata;
    this.loginStep = 1;
    this.p_open();
  }

  private p_close() {
    this.watchMgr = {};
    this.UpdateDatas = [];
    this.watchData = {};
    this.error = "";
    if (this.t2popo) {
      clearInterval(this.t2popo);
      this.t2popo = 0;
    }
    if (this.ws) {
      this.ws.onclose = function () {};
      this.ws.close();
      this.ws = null;
    }
  }
  public Close() {
    this.loginStep = 0;
    this.reconnMs = 16; //reset reconnect time
    if (this.t2reconn) {
      clearTimeout(this.t2reconn);
      this.t2reconn = 0;
    }
    this.p_close();
  }

  private popo() {
    this.ws?.send("{}");
  }

  private onclose(ev: CloseEvent) {
    this.reconnMs *= 2;
    if (this.reconnMs > 60000) {
      this.reconnMs = 60000;
    }

    //Notify user if running
    if (this.loginStep) {
      if (this.error) {
        this.OnDisconnect(this.error, Math.ceil(this.reconnMs / 1000));
      } else {
        this.OnDisconnect(ev.reason, Math.ceil(this.reconnMs / 1000));
      }
    }

    this.p_close();

    //If you are kicked offline, clear the relevant stored data
    if (ev.reason && ev.reason.startsWith("kick")) {
      _clearLocalData(this.bucket);
      return;
    }

    this.t2reconn = setTimeout(() => {
      this.t2reconn = 0;
      this.p_open();
    }, this.reconnMs);
  }

  private onmessage(ev: MessageEvent) {
    switch (this.loginStep) {
      case 1:
        {
          // console.log("====loginStep0===", ev.data)
          this.ws?.close();
        }
        break;
      case 3:
        {
          const data: LoginResp = JSON.parse(ev.data);
          if ("ID" in data) {
            this.UpdateDatas.push(data);
            return;
          }
          if (data.Error != "") {
            this.error = data.Error;
            this.ws?.close();
            return;
          }

          this._onLogin(data);

          //50s nginx defaults to a timeout of 60 seconds
          this.t2popo = window.setInterval(this.popo.bind(this), 50 * 1000);

          for (const UpdateData of this.UpdateDatas) {
            const [klist, contextObject] = this.contextObjectMake(UpdateData);
            if (contextObject) {
              this.OnPush(UpdateData, contextObject, klist);
            }
          }
          this.UpdateDatas = [];

          this.OnLogin();

          this.loginStep = 4; // Finish
          this.reconnMs = 16; // reset reconnect time
        }
        break;
      case 2:
        {
          const data: SyncTimeResp = JSON.parse(ev.data);
          if (data.Error != "") {
            this.error = data.Error;
            this.ws?.close();
            return;
          }

          const d4 = new Date();
          const d23 = new Date(data.ISO8601);
          this.svrZone = data.ISO8601.slice(-6);

          // delta = (t2-t1) + (t3-t4) / 2
          this.getTimeDelta =
            (d23.getTime() -
              this.d1.getTime() +
              (d23.getTime() - d4.getTime())) /
            2;
          this.svrTimezoneSec = data.TimezoneSec;
          // console.log("====svrZone====:", this.svrZone);

          this.loginStep = 3;

          // console.log("====svr====:", this.svrTimezoneSec, this.svrZone)
          // console.log("====cli====:", this.cliTimezoneSec, this.getTimeDelta)
        }
        break;

      default:
        {
          const UpdateData = JSON.parse(ev.data);
          if (!("ID" in UpdateData)) {
            const resolve = this.resolves.shift();
            resolve!(UpdateData);
            return;
          }

          let b = this;

          if (UpdateData["ID"] != this.userData.UID) {
            b = this.watchMgr[UpdateData["ID"]];
            if (!b) {
              if (UpdateData["ID"] in this.watchData) {
                this.watchData[UpdateData["ID"]].push(UpdateData);
              }
              return;
            }
          }

          const [klist, contextObject] = b.contextObjectMake(UpdateData);
          if (contextObject) {
            b.OnPush(UpdateData, contextObject, klist);
          }
        }

        break;
    }
  }

  private resolves: ResolveCallback[] = [];

  private rpc(name: string, data: any): Promise<ApiResp<any>> {
    const obj: Dict<any> = {};
    obj[name] = data;
    const p = new Promise<ApiResp<any>>((resolve) => {
      this.resolves.push(resolve);
    });
    this.ws?.send(JSON.stringify(obj));
    return p;
  }
  private notiy(name: string, data: any) {
    const obj: Dict<any> = {};
    obj[name] = data;
    this.ws?.send(JSON.stringify(obj));
  }

  public WatchKeys() {
    return Object.keys(this.watchMgr);
  }
  public WatchIsIn(k: string) {
    return k in this.watchMgr;
  }
  public WatchClose(k: string) {
    if (this.WatchIsIn(k)) {
      this.notiy("WatchClose", k);
      delete this.watchMgr[k];
    }
  }
  public WatchGet(k: string) {
    return this.watchMgr[k];
  }
  public async Watch(watchuid: string, dataCls: { new (): UserDataBase }) {
    this.watchData[watchuid] = [];
    const data = await this.rpc("WatchOpen", watchuid);
    if (data.Error != "") {
      delete this.watchData[watchuid];
      console.log("====Watch err====", data.Error);
      return null;
    }

    const sub = <any>new paclientSub();

    sub.userData = new dataCls();
    sub.userData.UID = watchuid;
    this.watchMgr[watchuid] = sub;
    sub._onLogin(data);
    for (const UpdateData of this.watchData[watchuid]) {
      const [klist, contextObject] = sub.contextObjectMake(UpdateData);
      if (contextObject) {
        sub.OnPush(UpdateData, contextObject, klist);
      }
    }

    delete this.watchData[watchuid];
    return sub;
  }

  public async _call(cmd: string, body: Object) {
    return await this.rpc("Call", { Cmd: cmd, Body: body });

    // // You can handle errors here, not at the call
    // const data = await this.rpc("Call", { Cmd: cmd, Body: body });
    // if ("Error" in data) {
    //   if ("Code" in data) {
    //     // user error
    //   } else {
    //     // system error
    //   }
    //   return null;
    // }
    // return data.Resp;
  }
}

export abstract class OnDateTime {
  // A= 0=a.m 1=p.m
  // W=Week of Month 1~n
  // mm=Mintute
  // MM=Month 01~12
  // hh=00~23
  YYYYMMWDDAhhmm = "";
  YYYYMMWDDAhh = "";
  YYYYMMWDDA = "";
  YYYYMMWDD = "";
  YYYYMMW = "";
  YYYYMM = "";

  private t2ymd: number = 0; // timer handle

  protected abstract OnYYYYMMWDDAhhmm(): void; //Called once after string changes
  protected abstract OnYYYYMMWDDAhh(): void; //Called once after string changes
  protected abstract OnYYYYMMWDDA(): void; //Called once after string changes
  protected abstract OnYYYYMMWDD(): void; //Called once after string changes
  protected abstract OnYYYYMMW(): void; //Called once after string changes
  protected abstract OnYYYYMM(): void; //Called once after string changes

  //use GetSvrDate()
  constructor(private SvrDate: Date) {}

  Start() {
    this.t2ymd = window.setInterval(this.getYMD.bind(this), 1000); //1s
    this.getYMD();
  }
  Stop() {
    if (this.t2ymd) {
      clearInterval(this.t2ymd);
      this.t2ymd = 0;
    }
  }

  private Date2YYYYMMWDDAhhmmss(date: Date) {
    const h = date.getHours();
    let A = "0";
    if (h >= 12) {
      A = "1";
    }
    const Y = date.getFullYear();
    const M = date.getMonth();
    const D = date.getDate();

    const firstWeekday = new Date(Y, M, 1).getDay();
    const offsetDate = D + firstWeekday - 1;
    const W = 1 + Math.floor(offsetDate / 7);

    return (
      Y +
      ("0" + (M + 1)).slice(-2) +
      W.toString() +
      ("0" + D).slice(-2) +
      A +
      ("0" + h).slice(-2) +
      ("0" + date.getMinutes()).slice(-2) +
      ("0" + date.getSeconds()).slice(-2)
    );
  }

  private getYMD() {
    const ymd = this.Date2YYYYMMWDDAhhmmss(this.SvrDate);

    const YYYYMMWDDAhhmm = ymd.substring(0, 14);
    if (YYYYMMWDDAhhmm != this.YYYYMMWDDAhhmm) {
      this.YYYYMMWDDAhhmm = YYYYMMWDDAhhmm;
      this.OnYYYYMMWDDAhhmm();
    }

    const YYYYMMWDDAhh = ymd.substring(0, 12);
    if (YYYYMMWDDAhh != this.YYYYMMWDDAhh) {
      this.YYYYMMWDDAhh = YYYYMMWDDAhh;
      this.OnYYYYMMWDDAhh();
    }

    const YYYYMMWDDA = ymd.substring(0, 10);
    if (YYYYMMWDDA != this.YYYYMMWDDA) {
      this.YYYYMMWDDA = YYYYMMWDDA;
      this.OnYYYYMMWDDA();
    }

    const YYYYMMWDD = ymd.substring(0, 9);
    if (YYYYMMWDD != this.YYYYMMWDD) {
      this.YYYYMMWDD = YYYYMMWDD;
      this.OnYYYYMMWDD();
    }

    const YYYYMMW = ymd.substring(0, 7);
    if (YYYYMMW != this.YYYYMMW) {
      this.YYYYMMW = YYYYMMW;
      this.OnYYYYMMW();
    }

    const YYYYMM = ymd.substring(0, 6);
    if (YYYYMM != this.YYYYMM) {
      this.YYYYMM = YYYYMM;
      this.OnYYYYMM();
    }
  }
}

function _loadLocalData(bucket: string): LocalData {
  let l: LocalData = { DBToken: "", UID: "" };
  const data = window.localStorage.getItem("LocalData:" + bucket);
  if (data) {
    l = JSON.parse(data);
    return l;
  }
  return l;
}
function _saveLocalData(bucket: string, l: LoginRequ): void {
  if (l) {
    const s: LocalData = { DBToken: l.DBToken, UID: l.UID };
    window.localStorage.setItem("LocalData:" + bucket, JSON.stringify(s));
    return;
  }

  window.localStorage.removeItem("LocalData:" + bucket);

  return;
}
function _clearLocalData(bucket: string): void {
  window.localStorage.removeItem("LocalData:" + bucket);

  return;
}

type ResolveCallback = (value: any) => void;

export type Dict<T = any> = {
  [key: string | number | symbol]: T;
};

// Login verification, c->s
// the structure and method that need to be implemented
export interface LoginByMethod {
  //The obj that implements this interface will be serialized and sent to the login server
  //The login server calls related modules according to the name of LoginMethodName to realize login verification
  LoginMethodName(): string; //Returns the name of the module, such as: guest,wechat,facebook...
}

type LocalData = {
  DBToken: string; //Quick re-login key
  UID: string; //user id
};

//Platform login transparent transmission data
type Platform = {
  PID: string;
  Info?: string; //There may not be this field
  Token: string;
  Platform: string;
  TimestampMicro: number;
};

// LoginRequ c->s
type LoginRequ = {
  DBToken: string; //Quick re-login key
  UID: string; //user id
  Token: string; //Token
  TimestampMicro: number; //ms
  Info: string; //Info string
};
// c<-s
type LoginResp = {
  Error: string; //error message
};

// c<-s
type SyncTimeResp = {
  Error: string; //error message
  ISO8601: string; // 2006-01-02T15:04:05.000-07:00
  TimezoneSec: number; //example: UTC−05:00 is +18000
};

class metaDef {
  pushDataList = new Map<number, any>();
  pushDataSort = new Array<number>();
  constructor(
    readonly cls: { new (): any },
    readonly OnKeySub: (contextObject: Object, changeData: any) => void
  ) {}
}

export type LoginInfo = {
  Bucket: string; //Specify to save to the local database to support multiple accounts to remember user login function
  GwAddrs: string; //Specify the gateway service address,eg: http://127.0.0.1:59501,http://127.0.0.1:59502
};

type ApiResp<T> = {
  Resp?: T; //Call return value
  Error?: string; //Error prompt, when Code is included, it is "user error", otherwise it is "system error"
  Code?: number; //User error, server script throws business error, negative number is system error, -1=data is not synchronized, please execute it later
  MD5?: string; //User error, script MD5 value
  GitVer?: string; //System error, server version
};

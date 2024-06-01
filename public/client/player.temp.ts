import {
  UserDataBase,
  paclient,
  type LoginInfo,
  type LoginByMethod,
  type Dict,
} from "./paclient";

export const eventTarget = new EventTarget();

// import others Struct for watch
//repl5

export class UserData extends UserDataBase {
  nowDemoName = "";

  protected UpdateAfter(contextObject: any): void {
    //repl3
  }

  // vars:

  //repl1

  // callbacks

  //repl2
}

class guestcls implements LoginByMethod {
  Name = "";
  LoginMethodName() {
    return "guest";
  }
}

export class Player extends paclient {
  userData = new UserData();

  protected OnDisconnect(reason: string): void {
    eventTarget.dispatchEvent(
      new CustomEvent("OnDisconnect", { detail: reason })
    );
  }

  protected OnLogin(): void {
    console.log(this.userData.UID);
    eventTarget.dispatchEvent(new CustomEvent("OnLogin"));
  }

  protected OnPleaseLogin(logindata: any): Promise<LoginByMethod> {
    const x = new guestcls();
    x.Name = this.guestname;

    return Promise.resolve(x);
  }

  protected OnLoginInfo(logindata: any): LoginInfo {
    let gwaddrs = "//repl4";
    const hostname = window.location.hostname;
    const appgithubdev = ".app.github.dev";

    if (hostname.endsWith(appgithubdev)) {
      const prefixWithPort = hostname.slice(0, -appgithubdev.length);
      const lastIndex = prefixWithPort.lastIndexOf("-");
      const prefix = prefixWithPort.substring(0, lastIndex);
      gwaddrs =
        "https://" +
        prefix +
        "-59501" +
        appgithubdev +
        "," +
        "https://" +
        prefix +
        "-59502" +
        appgithubdev;
    }

    console.log("=hostname=", hostname);
    console.log("=GwAddrs=", gwaddrs);

    const retval: LoginInfo = {
      Bucket: "guest_" + this.guestname,
      GwAddrs: gwaddrs,
    };

    return retval;
  }

  ///////////////////////

  public guestname = "";

  constructor() {
    super();
  }

  InitWindow() {
    (<any>window).player = this;
  }
}

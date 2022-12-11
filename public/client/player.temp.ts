import {
  UserDataBase,
  paclient,
  type LoginInfo,
  type LoginByMethod,
} from "./paclient";

//repl5

export class UserData extends UserDataBase {
  eventTarget = new EventTarget();
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
    this.userData.eventTarget.dispatchEvent(
      new CustomEvent("OnDisconnect", { detail: reason })
    );
  }

  protected OnLogin(): void {
    console.log(this.UID);
    this.userData.eventTarget.dispatchEvent(new CustomEvent("OnLogin"));
  }

  protected OnPleaseLogin(logindata: any): Promise<LoginByMethod> {
    const x = new guestcls();
    x.Name = this.guestname;

    return Promise.resolve(x);
  }

  protected OnLoginInfo(logindata: any): LoginInfo {
    const retval: LoginInfo = {
      Bucket: "guest_" + this.guestname,
      GwAddrs: "//repl4",
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

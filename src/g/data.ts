import { createStore } from "vuex";

export type Dict = {
  [key: string | number | symbol]: any;
};

class mystatus {
  oldV: Dict = {};
  chgV: Dict = {};
  newV: Dict = {};

  resp: Dict = {};
  code: Dict = {};
  isCode: Dict = {};

  config: Dict = {
    clientCode: "",
  };

  getHL(k: string): string {
    let v: any;
    if (this.isCode[k]) {
      v = this.code[k];
    } else {
      v = this.resp[k];
    }

    if (!v) {
      v = "";
    }
    return v;
  }
}

export const store = createStore({
  state() {
    return new mystatus();
  },
  mutations: {
    setOld(state: mystatus, o: any) {
      state.oldV[o.k] = o.v;
    },
    setChg(state: mystatus, o: any) {
      state.chgV[o.k] = o.v;
    },
    setNew(state: mystatus, o: any) {
      state.newV[o.k] = o.v;
    },
    setResp(state: mystatus, o: any) {
      state.resp[o.k] = o.v;
    },
    setCode(state: mystatus, o: any) {
      state.code[o.k] = o.v;
    },
    setIsCode(state: mystatus, o: any) {
      state.isCode[o.k] = o.v;
    },
    setConfig(state: mystatus, o: any) {
      state.config[o.k] = o.v;
    },
  },
  actions: {},
  modules: {},
});

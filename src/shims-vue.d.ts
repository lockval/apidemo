import { store } from "./g/data";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $store: store;
  }
}

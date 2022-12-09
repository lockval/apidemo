import { createApp } from "vue";
import App from "./App.vue";

import "./assets/main.css";
import { store } from "./g/data";

import "highlight.js/styles/stackoverflow-light.css";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import hljsVuePlugin from "@highlightjs/vue-plugin";

import VMdPreview from "@kangc/v-md-editor/lib/preview";
import "@kangc/v-md-editor/lib/style/preview.css";
import vuepressTheme from "@kangc/v-md-editor/lib/theme/vuepress.js";
import "@kangc/v-md-editor/lib/theme/style/vuepress.css";

import Prism from "prismjs";
import "prismjs/components/prism-json";
VMdPreview.use(vuepressTheme, {
  Prism,
});

hljs.registerLanguage("javascript", javascript);

const app = createApp(App);

app.use(store);
app.use(hljsVuePlugin);
app.use(VMdPreview);

app.mount("#app");

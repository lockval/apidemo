import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { log } from "node:console";
import { publicDecrypt } from "node:crypto";

// https://vitejs.dev/config/

export default defineConfig(({ command, mode, ssrBuild }) => {
  if (mode == "private") {
    return {
      publicDir: "private",
      plugins: [vue()],
      resolve: {
        alias: {
          "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
      },
    };
  }

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  };
});

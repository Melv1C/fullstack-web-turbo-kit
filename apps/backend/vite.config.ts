import path from "path";

import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    entry: {
      index: "./src/index.ts",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

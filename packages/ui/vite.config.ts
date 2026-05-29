import path from "path";

import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    exports: {
      customExports: {
        "./index.css": "./index.css",
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "happy-dom",
  },
});

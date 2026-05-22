import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    exports: {
      customExports: {
        "./index.css": "./index.css",
      },
    },
  },
});

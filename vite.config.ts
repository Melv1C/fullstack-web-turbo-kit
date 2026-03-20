import { defineConfig } from "vite-plus";

export default defineConfig({
  lint: {
    options: { typeAware: true, typeCheck: true },
    rules: { "no-unused-vars": "error", "no-console": ["warn", { allow: ["error"] }] },
  },
  fmt: {
    sortPackageJson: { sortScripts: true },
    sortImports: {},
    sortTailwindcss: {},
  },
});

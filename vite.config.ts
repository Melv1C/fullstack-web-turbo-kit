import { defineConfig } from "vite-plus";

export default defineConfig({
  lint: {
    options: { typeAware: true, typeCheck: true },
    rules: { "no-unused-vars": "error", "no-console": "allow", "no-floating-promises": "allow" },
  },
  fmt: {
    ignorePatterns: ["routeTree.gen.ts"],
    sortPackageJson: { sortScripts: true },
    sortImports: {},
    sortTailwindcss: {},
  },
});

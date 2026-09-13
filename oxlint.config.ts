import eslintPluginZod from "eslint-plugin-zod";
import { defineConfig, type DummyRuleMap } from "oxlint";

const zodRecommendedRules = {
  ...eslintPluginZod.configs.recommended.rules,
  "zod/consistent-schema-var-name": ["error", { after: "$" }],
} as DummyRuleMap;

export default defineConfig({
  ignorePatterns: ["routeTree.gen.ts", "packages/ui/src/components/ui"],
  jsPlugins: ["eslint-plugin-zod"],
  rules: {
    "no-unused-vars": "error",
    "no-console": "allow",
    "no-floating-promises": "allow",
    ...zodRecommendedRules,
  },
  plugins: ["eslint", "unicorn", "typescript", "oxc", "react", "react-perf"],
});

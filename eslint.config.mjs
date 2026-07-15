import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // React escapes text nodes. Allow natural punctuation in long-form copy.
      "react/no-unescaped-entities": "off",
    },
  },
  {
    files: ["scripts/*.js"],
    rules: {
      // Standalone maintenance scripts intentionally use Node CommonJS.
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Archived one-off database scripts are retained for reference only.
    "scripts/legacy/**",
  ]),
]);

export default eslintConfig;

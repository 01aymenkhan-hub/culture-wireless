import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  {
    rules: {
      // We render several sections with static copy that includes apostrophes and quotes.
      "react/no-unescaped-entities": "off",
      // The existing UI intentionally uses <img> in a few places (e.g. logo swap by data-theme
      // via onError). Switching every one to next/image would change layout. Keep as warn.
      "@next/next/no-img-element": "warn",
      // Allow useEffect deps that are intentionally omitted with a trailing eslint-disable-next-line.
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "node_modules/**",
  ]),
]);

export default eslintConfig;

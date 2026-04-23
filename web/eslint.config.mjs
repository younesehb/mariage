import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // French copy uses apostrophes everywhere (l'invité, aujourd'hui…).
      // The rule flags valid HTML text as unsafe, so it's pure noise here.
      "react/no-unescaped-entities": "off",
      // We hydrate localStorage state in `useEffect(() => setState(load()), [])`
      // because reading storage on the server is impossible. That's the canonical
      // pattern; keep it visible as a warning rather than blocking builds.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;

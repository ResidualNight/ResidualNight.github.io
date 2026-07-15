import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Top-level navigation intentionally performs full document loads so the
      // homepage's nested scroll-snap deck never leaks its scroll position.
      "@next/next/no-html-link-for-pages": "off",
      // Photography assets are pre-generated locally and served directly from
      // object storage; no runtime Next image optimizer exists on a static host.
      "@next/next/no-img-element": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["app/blog/BlogArchive.tsx"],
    rules: {
      // URL query state is intentionally restored after hydration because it
      // is unavailable during static generation.
      "react-hooks/set-state-in-effect": "off",
    },
  },
  {
    files: [
      "app/photography/PhotographyArchive.tsx",
      "app/motion-lab/MotionLab.tsx",
    ],
    rules: {
      // GSAP's contextSafe callbacks read refs only when an interaction runs;
      // the hook rule cannot infer that deferred execution boundary.
      "react-hooks/refs": "off",
      // The photography preference is restored from localStorage only after
      // hydration to keep the server-rendered static HTML deterministic.
      "react-hooks/set-state-in-effect": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "dist/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;

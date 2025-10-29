import nextPlugin from "eslint-config-next";

export default [
  {
    ignores: [".next/**", "node_modules/**", "out/**"],
  },
  ...nextPlugin,
  {
    rules: {
      "react/no-unescaped-entities": "off",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];

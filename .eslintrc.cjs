module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript"
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh", "import", "@typescript-eslint"],
  rules: {
    "import/default": "off",
    "react-hooks/exhaustive-deps": "off",
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "import/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          ["parent", "sibling", "index"],
          "type",
          "object",
        ],
        pathGroups: [
          {
            pattern: "@/**",
            group: "internal",
          },
        ],
      },
    ],
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: ["./tsconfig.app.json"],
      },
      node: true,
      alias: {
        map: [["@", "./src"]],
      },
    },
  },
};

module.exports = {
  root: true,
  env: {
    node: true,
    es2020: true,
    jest: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    // Enable type-aware linting: https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/TYPED_LINTING.md
    // 'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: false,
    },
    project: "./tsconfig.json",
    lib: ["es2020"],
    ecmaVersion: 2020,
  },
  plugins: ["@typescript-eslint", "import", "header"],
  rules: {
    "header/header": [2, "block", { pattern: "\\s*Copyright", template: " Copyright " }],
    eqeqeq: [2, "smart"],
    "no-unused-vars": "off",
    "no-param-reassign": 2,
    "import/no-useless-path-segments": 2,
    "import/no-unresolved": 0,
    "import/newline-after-import": 2,
    "@typescript-eslint/explicit-function-return-type": 2,
    "@typescript-eslint/no-use-before-define": 2,
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/no-explicit-any": 2,
    "@typescript-eslint/explicit-member-accessibility": 2,
    "@typescript-eslint/consistent-type-assertions": 2,
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "@typescript-eslint/no-non-null-assertion": 0,
  },
  ignorePatterns: [
    "/.serverless",
    "/coverage",
    "/lambda-iam-roles",
    "/lib",
    "/mapping-templates",
    "*.js",
    "*.json",
    "*.yml",
    "/generated/**",
    "/node_modules",
    "/.idea",
  ],
};

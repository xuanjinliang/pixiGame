// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  env: {
    "browser": true,
    "node": true,
    "es6": true,
  },
  extends: "eslint:recommended",
  // add your custom rules here
  rules: {
    "semi": [
      2,
      "always"
    ],
    "no-var": 2,
    "no-console": 0,
    "no-prototype-builtins": 2,
    "array-callback-return": 2,
    "no-alert": 1,
    "no-caller": 2,
    "no-else-return": 2,
    "no-empty-function": 2,
    "no-eq-null": 2,
    "no-eval": 2,
    "no-extend-native": 2,
    "no-extra-bind": 2,
    "no-extra-label": 2,
    "no-floating-decimal": 2,
    "no-implicit-globals": 2,
    "no-implied-eval": 2,
    "no-invalid-this": 2,
    "no-iterator": 2,
    "no-labels": 2,
    "no-lone-blocks": 2,
    "no-multi-str": 2,
    "no-new-func": 2,
    "no-new-wrappers": 2,
    "no-new": 2,
    "no-octal-escape": 2,
    "no-proto": 2,
    "no-return-assign": 2,
    "no-self-compare": 2,
    "no-sequences": 2,
    "no-throw-literal": 2,
    "no-unmodified-loop-condition": 2,
    "no-unused-expressions": 2,
    "no-useless-concat": 2,
    "no-useless-return": 2,
    "no-void": 2,
    "no-with": 2,
    "radix": [
      2,
      "as-needed"
    ],
    "require-await": 2,
    "wrap-iife": [
      2,
      "any"
    ],
    "no-label-var": 2,
    "no-undefined": 2,
    "callback-return": [
      "error",
      [
        "done",
        "send.error",
        "send.success"
      ]
    ],
    "handle-callback-err": 2,
    "no-new-require": 2,
    "comma-dangle": [
      2,
      {
        "functions": "never"
      }
    ],
    "comma-style": [
      2,
      "last"
    ],
    "func-call-spacing": [
      2,
      "never"
    ],
    "max-depth": [
      2,
      4
    ],
    "max-nested-callbacks": [
      2,
      5
    ],
    "max-params": [
      2,
      6
    ],
    "new-cap": [
      2,
      {
        "capIsNew": false
      }
    ],
    "new-parens": 2,
    "no-array-constructor": 2,
    "no-bitwise": 2,
    "no-lonely-if": 1,
    "no-mixed-operators": 2,
    "no-new-object": 2,
    "no-restricted-syntax": [
      2,
      "WithStatement"
    ],
    "no-tabs": 2,
    "no-underscore-dangle": 1,
    "no-unneeded-ternary": 2,
    "no-whitespace-before-property": 2,
    "object-property-newline": 2,
    "one-var-declaration-per-line": 2,
    "operator-linebreak": [
      2,
      "after"
    ],
    "wrap-regex": 2,
    "arrow-body-style": [
      2,
      "as-needed"
    ],
    "arrow-parens": 2,
    "arrow-spacing": 2,
    "no-confusing-arrow": 2,
    "no-duplicate-imports": 2,
    "no-useless-computed-key": 2,
    "no-useless-constructor": 2,
    "no-useless-rename": [
      2,
      {
        "ignoreDestructuring": false,
        "ignoreImport": false,
        "ignoreExport": false
      }
    ],
    "prefer-spread": 2,
    "prefer-template": 2
  }
};

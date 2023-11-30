module.exports = {
  //"eslint.enable": true,
  "env": {
    "node": true,
    "commonjs": true,
    "es2021": true
  },
  "extends": "eslint:recommended",
  "overrides": [
    {
      "env": {
        "node": true
      },
      "files": [
        ".eslintrc.{js,cjs}"
      ],
      "parserOptions": {
        "sourceType": "script"
      }
    }
  ],
  "parserOptions": {
    "ecmaVersion": "latest"
  },
  "rules": {
    //"no-empty": "off",
    "no-inner-declarations": "off",
    "no-unused-vars": "warn",
    "no-unreachable": "off",
    //"no-case-declarations": "off",
    //"no-use-before-define": "error"
  },
};

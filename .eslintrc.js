module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es2020": true
    },
    "globals": {
        "web3": "writable",
        "Web3": "writable",
        "ethers": "writable",
        "artifacts": "writable",
        "assert": "writable",
        "it": "writable"
    },
    "extends": [
        "airbnb-base"
    ],
    "parserOptions": {
        "ecmaVersion": 11
    },
    "rules": {
        "max-len":0,
        "class-methods-use-this":0,
        "no-restricted-syntax":0,
        "no-await-in-loop":0,
        "camelcase":0,
        "no-nested-ternary":0,
        "no-console":0,
        "no-useless-constructor":0,
        "prefer-destructuring":0,
        "no-shadow":0,
        "no-underscore-dangle":0,
        "indent": ["error", 4],
        "no-plusplus":0,
        "semi":0,
        "quotes":0,
        "eqeqeq":0,
        "no-loop-func":0,
        "prefer-const":0,
        "object-curly-newline":0
    }
};

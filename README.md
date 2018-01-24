# rollup-config-module

[![npm version](https://img.shields.io/npm/v/rollup-config-module.svg)](https://www.npmjs.com/package/rollup-config-module)
[![Build Status](https://travis-ci.org/shinnn/rollup-config-module.svg?branch=master)](https://travis-ci.org/shinnn/rollup-config-module)

[Rollup](https://github.com/rollup/rollup) config to create npm modules that support both [ECMAScript module](http://www.2ality.com/2014/09/es6-modules-final.html) and [CommonJS](http://www.commonjs.org/)

## Installation

[Use](https://docs.npmjs.com/cli/install) [npm](https://docs.npmjs.com/getting-started/what-is-npm).

```
npm install --save-dev rollup-config-module
```

## Usage

### For module author

1. Include `rollup --config=node:module` to the build part of your module's [npm scripts](https://docs.npmjs.com/misc/scripts).

  ```json
  "scripts": {
    "build": "rollup --config=node:module",
    "pretest": "npm run-script build"
  }
  ```
2. Write your module using ECMAScript [`import`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import) / [`export`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export) instead of [`require`](https://nodejs.org/api/globals.html#globals_require) / [`module.exports`](https://nodejs.org/api/modules.html#modules_module_exports), and save it as `module.js`.
3. Add [`module` field](https://github.com/dherman/defense-of-dot-js/blob/master/proposal.md#typical-usage) to `package.json` and let it point to `index.mjs`.

  ```json
  "module": "module.js"
  ```
4. Run the build script and you'll see `index.js` is created.
5. [Include](https://docs.npmjs.com/files/package.json#files) both `index.mjs` and `index.js` to the published npm package.

  ```json
  "files": [
    "index.js",
    "index.mjs"
  ]
  ```

### For module user

Modules built with this configuration can be used in both ES2015+ projects and traditional `require`-based projects.

Users can load `module.js` with a build tool that supports `module` field, for example [rollup-plugin-node-resolve](https://github.com/rollup/rollup-plugin-node-resolve) and [Webpack](https://webpack.js.org/configuration/resolve/#resolve-mainfields).

```javascript
import fn from 'awesome-npm-package';
```

Users can also load `index.js` via Node's built-in `require`,

```javascript
const fn = require('awesome-npm-package');
```

because `index.js` has been compiled from `index.mjs` with all `import` and `export` replaced with `require` and `module.exports`.

```javascript
import {inspect} from 'util';
import isNaturalNumber from 'is-natural-number';

export default function(v) {
  if (!isNaturalNumber(v)) {
    console.log(inspect(v) + 'is not a natural number.');
  }
}
```
↓

```javascript
'use strict';

var util = require('util');
var isNaturalNumber = require('is-natural-number');

var index = function(v) {
  if (!isNaturalNumber(v)) {
    console.log(util.inspect(v) + 'is not a natural number.');
  }
}

module.exports = index;
```

## License

[ISC License](./LICENSE) © 2018 Shinnosuke Watanabe

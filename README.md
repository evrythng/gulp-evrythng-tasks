# EVRYTHNG.js Gulp tasks framework

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](http://standardjs.com)

This repo contains common configuration files and tasks to be used across all evrythng.js libraries and plugins.

## Getting started

Install using npm:

```
$ npm install --save-dev gulp-evrythng-tasks
```

Add pre-defined tasks to your Gulpfile:

```javascript
const gulp = require('gulp')
require('gulp-evrythng-tasks')(gulp)
```

## Tasks

### Linting (Standard.js)

```
$ gulp lint
```

Linting uses [Standard Code Style](http://standardjs.com/) to lint all files in your repository,
[excluding the ones in .gitignore](http://standardjs.com/#how-do-i-ignore-files).

If you need additional configuration use the `standard` configuration object in your `package.json`:

```json
{
  "standard": {
    "globals": ["fetch"]
  }
}
```

### Building (Rollup)

```
$ gulp build
```

This builds two versions of your library (including the minified versions):

* using ES6 modules: for future use, or to use with next generation bundlers like Webpack 2+ and Rollup;
* using the UMD pattern: to use across environments and different loaders (globals, AMD, Commonjs)

All libraries should be isomorphic (do not rely on browser and/or Node.js platforms).

**Configuration**

Add an `evrythng.config.js` file to the root of your library with the base [Rollup configuration](https://github.com/rollup/rollup/wiki/JavaScript-API):

```javascript
module.exports = {
  moduleName: 'EVTPlugin',
  external: 'evrythng',
  globals: {
    'evrythng': 'EVT'
  }
}
```

**Additional builds**

TODO

- [ ] Update configuration for generic builds (not just polyfill)
- [ ] Document configuration file

### Testing (Karma + Jasmine)

```
$ gulp test
$ gulp test:unit
$ gulp test:integration
$ gulp test:int:globals
$ gulp test:int:amd
$ gulp test:int:cjs
$ gulp test:int:node
$ gulp test:int:es6
```

This tests all the above scenarios using Karma and Jasmine.

Unit tests are loaded via Rollup, so they can use ES6 modules. It also adds `istanbul` and `coveralls` reports
to the `report` folder in your project, to be used in Travis CI.

Integration tests test the loading of the compiled library in UMD and ES6 modules environments. UMD integration tests should also
be UMD compatible (i.e. have the UMD wrapper). See [evrythng.js example](https://github.com/evrythng/evrythng.js).

**require-main.js**

AMD requires an extra bit of configuration. You need to tell RequireJS where to load your external dependencies from. This is
done in the `test/require-main.js` file. It should also export the dependencies path map to be used in Node.js.
See [evrythng.js example](https://github.com/evrythng/evrythng.js).

### Publishing

TODO

- [ ] Automate release notes (?)
- [ ] Document release process

## Developing

If you need to update and test `gulp-evrythng-tasks` while you're working on evrythng.js libraries the best way is to link your
local package in the evrythng.js library repo:

**In <$cwd>/gulp-evrythng-tasks**
```
$ npm install
$ npm link
```

**In <$cwd>/evrythng-plugin**
```
$ npm link gulp-evrythng-tasks
```

## License

Apache 2.0 License. Copyright (c) EVRYTHNG Ltd.
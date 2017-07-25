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

### Testing (Karma + Jasmine)

```
$ gulp test
$ gulp test:unit
$ gulp test:integration
$ gulp test:int:globals
$ gulp test:int:amd
$ gulp test:int:cjs
$ gulp test:int:node
$ gulp test:int:es
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

1. Add the correct Travis deploy configuration:

```
deploy:
  # CDN Latest
  - provider: s3
    access_key_id: $AWS_ACCESS_KEY_ID
    secret_access_key: $AWS_SECRET_ACCESS_KEY
    bucket: $AWS_EVTJS_BUCKET
    local_dir: dist
    upload-dir: js/<PACKAGE_NAME>/latest
    skip_cleanup: true
    on:
      tags: true
  # CDN Versioned
  - provider: s3
    access_key_id: $AWS_ACCESS_KEY_ID
    secret_access_key: $AWS_SECRET_ACCESS_KEY
    bucket: $AWS_EVTJS_BUCKET
    local_dir: dist
    upload-dir: js/<PACKAGE_NAME>/$TRAVIS_TAG
    skip_cleanup: true
    on:
      tags: true
  # NPM
  - provider: npm
    email: $NPM_EMAIL
    api_key: $NPM_TOKEN
    skip_cleanup: true
    tag: next
    on:
      tags: true
```

2. Add `deploy` NPM script to `package.json`:

```
"deploy": "sh ./node_modules/gulp-evrythng-tasks/bin/deploy.sh"
```

3. Run deploy script with target version:

```
npm run deploy 1.0.0-pre.1
```

4. Travis will do the rest!

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
/**
 * For each base config we'll also add a bundle with any polyfill
 * dependency and a minified version for all targets:
 *
 * - ES6 + ES Modules
 * - ES6 + ES Modules + Polyfills
 * - ES5 + UMD
 * - ES5 + UMD + Polyfills
 */

const rollup = require('rollup')
const options = require('../options')

/**
 * Mandatory banner for all files published to CDN
 * (i.e. not distributed via a package manager).
 */
const currentYear = (new Date()).getFullYear()
const banner = `/**
 * ${options.name.toUpperCase()}.JS v${options.version}
 * (c) 2012-${currentYear} EVRYTHNG Ltd. London / New York / San Francisco.
 * Released under the Apache Software License, Version 2.0.
 * For all details and usage:
 * https://github.com/evrythng/${options.name}.js
 */
`

/**
 * Build all bundles with Rollup for each specified configuration.
 */
function build (files) {
  const baseConfigs = files.map(file => require(file))
  const targetConfigs = getTargetConfigs(baseConfigs)

  return Promise.all(targetConfigs.map(config => {
    return rollup.rollup(config).then(bundle => {
      return bundle.write({
        banner,
        sourceMap: true,
        output: {
          file: config.file,
          format: config.format,
          name: config.name,
          globals: config.globals
        },
      })
    })
  }))
}

/**
 * Add polyfill and minified versions to base targets.
 * @param targets {Object[]} Base target configurations
 */
function getTargetConfigs (targets) {
  return options.polyfill
    ? targets.concat(targets.map(getPolyfillConfig))
    : targets
}

/**
 * Add polyfill version to given target. UMD needs the
 * global name of the Fetch api.
 * @param target {Object} Previous target
 * @returns {Object}
 */
function getPolyfillConfig (target) {
  let polyfill = Object.assign({}, target, {
    input: addExtension(target.input, 'polyfill'),
    output: {
      file: addExtension(target.output.file, 'polyfill'),
      format: target.output.format
    },
    external: options.polyfill.external
  })

  if (target.format === 'umd') {
    polyfill.globals = options.polyfill.globals
  }

  return polyfill
}

/**
 * Add sub-extension to filename.
 * @param filename {string} Filename
 * @param ext {string} Extension to add before original extension
 * @returns {string}
 */
function addExtension (filename, ext) {
  return filename.replace('.js', `.${ext}.js`)
}

module.exports = build

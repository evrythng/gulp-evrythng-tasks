/**
 * For each base config we'll also add a minified version:
 *
 * - ES6 + ES Modules
 * - ES6 + ES Modules (minified)
 * - ES5 + UMD
 * - ES5 + UMD (minified)
 */

const rollup = require('rollup')
const uglify = require('rollup-plugin-uglify')
const { minify } = require('uglify-js')
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
 * https://github.com/${options.name}/${options.name}.js
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
        format: config.format,
        dest: config.dest,
        moduleName: config.moduleName,
        globals: config.globals
      })
    })
  }))
}

/**
 * Add minified versions to base targets.
 * @param targets {Object[]} Base target configurations
 */
function getTargetConfigs (targets) {
  const uglifys = targets.map(getUglifyConfig)
  return targets.concat(uglifys)
}

/**
 * Add uglified version to previous targets. We're using Uglify Harmony
 * as the stable does not yet understand ES Modules. See:
 * https://github.com/TrySound/rollup-plugin-uglify#warning
 * @param target {Object} Previous target
 * @returns {Object[]}
 */
function getUglifyConfig (target) {
  return Object.assign({}, target, {
    dest: addExtension(target.dest, 'min'),
    plugins: target.plugins.concat(uglify({}, minify))
  })
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

const babel = require('rollup-plugin-babel')
const node = require('rollup-plugin-node-resolve')
const cjs = require('rollup-plugin-commonjs')
const options = require('../options')

/**
 * ES5 + UMD module export
 */

module.exports = {
  entry: `src/${options.name}.js`,
  dest: `dist/${options.name}.js`,
  format: 'umd',
  plugins: [
    node(),
    cjs(),
    babel({
      exclude: 'node_modules/**',
      presets: ['es2017', ['es2015', {modules: false}]],
      plugins: [
        'external-helpers',
        'transform-async-generator-functions',
        ['transform-runtime', {helpers: false, polyfill: false}]
      ]
    })
  ],
  moduleName: options.moduleName,
  external: options.external,
  globals: options.globals
}

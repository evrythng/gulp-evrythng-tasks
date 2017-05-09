const node = require('rollup-plugin-node-resolve')
const options = require('../options')

/**
 * ES2015 + ES2015 module export
 */

module.exports = {
  entry: `src/${options.name}.js`,
  dest: `dist/${options.name}.es.js`,
  format: 'es',
  plugins: [ node() ],
  external: options.external
}

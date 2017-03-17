const node = require('rollup-plugin-node-resolve')
const cjs = require('rollup-plugin-commonjs')

// Load Unit tests and compile through Rollup, which will require src files.
const TESTS = 'test/unit/**/*.spec.js'
const SRC = 'src/**/*.js'

module.exports = function (config) {
  config.set({
    basePath: process.cwd(),
    frameworks: ['jasmine'],
    files: [TESTS, { pattern: SRC, included: false }],
    preprocessors: {
      [TESTS]: ['rollup', 'sourcemap']
    },
    rollupPreprocessor: {
      plugins: [
        node({ jsnext: true, browser: true }),
        cjs()
      ],
      format: 'iife',
      sourceMap: 'inline'
    },
    reporters: ['dots'],
    browsers: ['Chrome'],
    singleRun: false,
    autoWatch: true
  })
}

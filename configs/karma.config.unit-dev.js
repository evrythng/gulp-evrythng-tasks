const node = require('rollup-plugin-node-resolve')
const cjs = require('rollup-plugin-commonjs')
const babel = require('rollup-plugin-babel')

// Load Unit tests and compile through Rollup, which will require src files.
const TESTS = 'test/unit/**/*.spec.js'

module.exports = function (config) {
  config.set({
    basePath: process.cwd(),
    frameworks: ['jasmine'],
    files: [TESTS],
    preprocessors: {
      [TESTS]: ['rollup', 'sourcemap']
    },
    rollupPreprocessor: {
      plugins: [
        babel({
          exclude: 'node_modules/**',
          plugins: [
            'external-helpers',
            'transform-async-generator-functions'
          ]
        }),
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

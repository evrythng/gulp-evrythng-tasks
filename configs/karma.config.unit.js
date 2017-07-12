const path = require('path')
const node = require('rollup-plugin-node-resolve')
const cjs = require('rollup-plugin-commonjs')
const babel = require('rollup-plugin-babel')

// Load Unit tests and compile through Rollup, which will require src files.
const TESTS = 'test/unit/**/*.spec.js'

// Don't include test files and node_modules in coverage report.
const IGNORE_COVERAGE = ['test/**/*']

const REPORT_DIR = path.resolve('report')

module.exports = function (config) {
  config.set({
    basePath: process.cwd(),
    frameworks: ['jasmine'],
    files: [TESTS],
    preprocessors: {
      [TESTS]: ['rollup']
    },
    rollupPreprocessor: {
      plugins: [
        node({ jsnext: true, browser: true }),
        cjs(),
        babel({
          exclude: 'node_modules/**',
          plugins: [
            ['istanbul', {'exclude': IGNORE_COVERAGE}],
            'external-helpers',
            'transform-async-generator-functions'
          ]
        })
      ],
      context: 'window',
      format: 'iife',
      sourceMap: 'inline'
    },
    reporters: ['dots', 'coverage', 'coveralls'],
    coverageReporter: {
      dir: REPORT_DIR,
      reporters: [
        { type: 'html', subdir: 'html-coverage' },
        { type: 'lcovonly', subdir: '.' }
      ]
    },
    browsers: ['Chrome'],
    singleRun: true
  })
}

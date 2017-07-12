// Load ES6 integration test file, which will require the src files.
const TESTS = 'test/integration/es.spec.js'

module.exports = function (config) {
  config.set({
    basePath: process.cwd(),
    frameworks: ['jasmine'],
    files: [TESTS],
    preprocessors: {
      [TESTS]: ['rollup']
    },
    reporters: ['dots'],
    browsers: ['Chrome'],
    singleRun: true
  })
}

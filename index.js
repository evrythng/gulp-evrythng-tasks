const standard = require('gulp-standard')

const build = require('./tasks/build')
const test = require('./tasks/test')

const config = filename => `${__dirname}/configs/${filename}.js`

module.exports = gulp => {
  gulp.task('lint', () => {
    return gulp.src([
      'src/**/*.js',
      'test/**/*.js',
      '*.js'
    ])
      .pipe(standard())
      .pipe(standard.reporter('default', {
        breakOnError: true
      }))
  })

  gulp.task('build', () => build([
    config('rollup.config.es'),
    config('rollup.config.umd')
  ]))

  gulp.task('test:unit', () => test(config('karma.config.unit')))
  gulp.task('test:unit-dev', () => test(config('karma.config.unit-dev')))

  gulp.task('test:int:globals', () => test(config('karma.config.int.globals')))
  gulp.task('test:int:amd', () => test(config('karma.config.int.amd')))
  gulp.task('test:int:cjs', () => test(config('karma.config.int.cjs')))
  gulp.task('test:int:node', () => test(config('jasmine.config.int.node')))
  gulp.task('test:int:es6', () => test(config('karma.config.int.es')))
  gulp.task('test:integration', gulp.series([
    'build',
    'test:int:globals',
    'test:int:amd',
    'test:int:cjs',
    'test:int:node',
    'test:int:es6'
  ]))

  gulp.task('test', gulp.series([
    'lint',
    'test:unit',
    'test:integration'
  ]))
}

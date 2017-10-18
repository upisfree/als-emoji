var gulp = require('gulp'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify');

gulp.task('develop', function()
{
  return browserify(
  {
    entries: ['./src/index.js']
  })
  .bundle()
  .pipe(source('index.js'))
  .pipe(buffer())
  .pipe(gulp.dest('.'));
});

gulp.task('min', function() // release
{
  return browserify(
  {
    entries: ['./src/index.js']
  })
  .transform('coffeeify')
  .bundle()
  .pipe(source('index.js'))
  .pipe(buffer())
  .pipe(uglify())
  .pipe(gulp.dest('.'));
});

gulp.task('dev', function() {
  gulp.watch('./src/**', ['develop']);
});

gulp.task('default', ['dev']);
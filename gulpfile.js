var gulp = require('gulp'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify');

// TODO: refactor this :/
gulp.task('develop-index', function()
{
  return browserify(
  {
    entries: ['./src/index.js']
  })
  .bundle()
  .pipe(source('index.js'))
  .pipe(buffer())
  .pipe(gulp.dest('./bin'));
});

gulp.task('develop-worker', function()
{
  return browserify(
  {
    entries: ['./src/worker.js']
  })
  .bundle()
  .pipe(source('worker.js'))
  .pipe(buffer())
  .pipe(gulp.dest('./bin'));
});

gulp.task('min-index', function() // release
{
  return browserify(
  {
    entries: ['./src/index.js']
  })
  .bundle()
  .pipe(source('index.js'))
  .pipe(buffer())
  .pipe(uglify())
  .pipe(gulp.dest('./bin'));
});

gulp.task('min-worker', function() // release
{
  return browserify(
  {
    entries: ['./src/worker.js']
  })
  .bundle()
  .pipe(source('worker.js'))
  .pipe(buffer())
  .pipe(uglify())
  .pipe(gulp.dest('./bin'));
});

gulp.task('dev', function() {
  gulp.watch('./src/**', ['develop-index', 'develop-worker']);
});


gulp.task('min', ['min-index', 'min-worker']);
gulp.task('default', ['dev']);
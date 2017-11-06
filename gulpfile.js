var gulp = require('gulp'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify');
    insert = require('gulp-insert'),
    rename = require('gulp-rename');

// TODO: refactor this :/
gulp.task('develop-ui', function()
{
  return browserify(
  {
    entries: ['./src/ui.js']
  })
  .bundle()
  .pipe(source('ui.js'))
  .pipe(buffer())
  .pipe(gulp.dest('./bin'));
});

gulp.task('develop-worker', function()
{
  return browserify(
  {
    entries: ['./src/worker.js']
  })
  .transform('babelify', { presets: ['es2015'] })
  .bundle()
  .pipe(source('worker.js'))
  .pipe(buffer())
  .pipe(gulp.dest('./bin'));
});

gulp.task('min-ui', function() // release
{
  return browserify(
  {
    entries: ['./src/ui.js']
  })
  .transform('babelify', { presets: ['es2015'] })
  .bundle()
  .pipe(source('ui.js'))
  .pipe(buffer())
  .pipe(babel({ presets: ['babili']} ))
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
  .pipe(babel({ presets: ['babili']} ))
  .pipe(uglify())
  .pipe(gulp.dest('./bin'));
});

gulp.task('copy-emojies', function()
{
  gulp.src('./converter/emojies.json')
  .pipe(insert.wrap('var emojies = ', ';'))
  .pipe(rename('emojies.js'))
  .pipe(gulp.dest('./bin'));
});

gulp.task('dev', function() {
  gulp.watch('./src/**', ['develop-ui', 'develop-worker']);
  gulp.watch('./converter/emojies.json', ['copy-emojies']);
});

gulp.task('min', ['min-ui', 'min-worker', 'copy-emojies']);
gulp.task('default', ['dev']);
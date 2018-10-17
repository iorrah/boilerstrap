var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var ghPages = require('gulp-gh-pages');

gulp.task('default', function(callback) {
  runSequence(['sass','browserSync', 'dev'],
    callback
  );
});

gulp.task('boot', function(callback) {
  runSequence('clean:dist',
    'copy',
    ['sass', 'images', 'fonts'],
    'useref',
    'dev',
    callback
  );
});

gulp.task('deploy', ['build'], function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});

gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss')
  .pipe(sass())
  .pipe(gulp.dest('app/css'))
  .pipe(browserSync.reload({
    stream: true
  }));
});

gulp.task('dev', ['browserSync', 'sass'], function() {
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    }
  });
});

gulp.task('useref', function() {
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano({
      discardComments: {
        removeAll: true
      }
    })))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function() {
  return gulp.src('app/assets/images/**/*.+(png|jpg|jpeg|gif|svg)')
  .pipe(cache(imagemin({
    interlaced: true
  })))
  .pipe(gulp.dest('dist/assets/images'));
});

gulp.task('fonts', function() {
  return gulp.src('app/css/libs/font/**/*')
  .pipe(gulp.dest('dist/font'));
});

gulp.task('clean:dist', function() {
  return del.sync('dist');
});

gulp.task('clean:libs:js', function() {
  return del.sync('app/js/libs');
});

gulp.task('clean:libs:css', function() {
  return del.sync('app/css/libs');
});

gulp.task('clean:css', function() {
  return del.sync('app/css/*');
});

gulp.task('clean:node', function() {
  return del.sync('node_modules');
});

gulp.task('clean:temps', [
    'clean:dist',
    'clean:libs:js',
    'clean:libs:css',
    'clean:css'
  ],
  function(callback) {
    callback;
  }
);

gulp.task('clean:all', [
    'clean:dist',
    'clean:libs:js',
    'clean:libs:css',
    'clean:node'
  ],
  function(callback) {
    callback;
  }
);

gulp.task('build', function(callback) {
  runSequence('clean:dist',
    ['sass', 'useref', 'images', 'fonts'],
    callback
  );
});

gulp.task('copy', function(callback) {
  return runSequence(
    'copy:bootstrap:css',
    'copy:bootstrap:js',
    'copy:jquery',
    callback
  );
});

gulp.task('copy:bootstrap:css', function() {
  return gulp.src('node_modules/bootstrap/dist/css/**')
  .pipe(gulp.dest('./app/css/libs/bootstrap'));
});

gulp.task('copy:bootstrap:js', function() {
  return gulp.src('node_modules/bootstrap/dist/js/**')
  .pipe(gulp.dest('./app/js/libs/bootstrap'));
});

gulp.task('copy:jquery', function() {
  return gulp.src('node_modules/jquery/dist/**')
  .pipe(gulp.dest('./app/js/libs/jquery'));
});

gulp.task('copy:holderjs', function() {
  return gulp.src('node_modules/holderjs/holder.js')
  .pipe(gulp.dest('./app/js/libs/holderjs'));
});

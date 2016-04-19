var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var filter = require('gulp-filter');
var bower = require('gulp-main-bower-files');
var clean = require('gulp-clean');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var sass = require('gulp-sass');

// ----------------------------------------
// clean
// ----------------------------------------

gulp.task('clean', function() {
  return gulp.src(['public/assets', 'public/fonts'])
    .pipe(clean());
});


// ----------------------------------------
// sass
// ----------------------------------------

gulp.task('sass', function () {
  return gulp.src('./assets/stylesheets/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./assets/stylesheets/css/style.css'))
    .pipe(cssmin())
    .pipe(gulp.dest('./public/assets/'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./assets/stylesheets/scss/**/*.scss', ['sass']);
});

// ----------------------------------------
// bower
// ----------------------------------------

gulp.task('bower', ['clean'], function() {

  var filterFonts = filter('**/glyphicons-*.*', { restore: true });
  var filterCss = filter('**/*.css', { restore: true });
  var filterJs = filter('**/*.js', { restore: true });


  return gulp.src('./bower.json')
    .pipe(bower({
      overrides: {
        bootstrap: {
          main: [
            './dist/js/bootstrap.js',
            './dist/css/bootstrap.min.css',
            './dist/fonts/*.*'
          ]
        }
      }
    }))

    .pipe(filterJs)
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./public/assets'))
    .pipe(filterJs.restore)

    .pipe(filterCss)
    .pipe(concat('vendor.css'))
    .pipe(cssmin())
    .pipe(gulp.dest('./public/assets'))
    .pipe(filterCss.restore)
    .pipe(filterFonts)

    .pipe(rename(function(path) {
      path.dirname = '';
    }))
    .pipe(gulp.dest('./public/fonts'))
    .pipe(filterFonts.restore);

});








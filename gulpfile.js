var gulp = require('gulp');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var obfuscate = require('gulp-obfuscate');
var plumber = require('gulp-plumber');
var browserSync = require("browser-sync").create();

// transpile JS
function script(file) {
  return (
    gulp.src(file)
    		.pipe(babel({
    			presets: ['@babel/preset-env']
    		}))
        .pipe(obfuscate({ replaceMethod: obfuscate.ZALGO }))
        .pipe(uglify())
        .pipe(rename({dirname:''}))
    		.pipe(gulp.dest('site/newjs'))
  );
}

//Compile SCSS
function style() {
  return (
    gulp
    .src("site/scss/main.scss")
    .pipe(sass())
    .on("error", sass.logError)
    .pipe(gulp.dest("site/css"))
    .pipe(browserSync.stream())
  );
}
//Reload
function reload() {
  browserSync.reload();
}

//Watcher
function watch() {
  browserSync.init({
    server: {
      baseDir: "./site/"
    }

  });

  gulp.watch('site/scss/*.scss', style);
  gulp.watch("site/*.html", reload);
  gulp.watch("site/js/*.js").on('change', function(file) {script(file)});


}
exports.watch = watch

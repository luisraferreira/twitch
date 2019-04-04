var gulp = require('gulp');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var plumber = require('gulp-plumber');
var browserSync = require("browser-sync").create();

function script() {
  return (
    gulp.src('site/js/*.js')
    		.pipe(babel({
    			presets: ['@babel/preset-env']
    		}))
    		.pipe(gulp.dest('site/newjs'))
  );
}

exports.script = script;


//Compile SCSS
function style() {
  return (
    gulp
    .src("site/scss/*.scss")
    .pipe(sass())
    .on("error", sass.logError)
    .pipe(gulp.dest("site/css"))
    .pipe(browserSync.stream())
  );
}
exports.style = style;

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
  gulp.watch("site/js/*.js", script);


}
exports.watch = watch

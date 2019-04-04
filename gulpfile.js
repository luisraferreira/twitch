var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require("browser-sync").create();

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
function watch(){
  browserSync.init({
          server: {
              baseDir: "./site/"
          }

      });

  gulp.watch('site/scss/*.scss', style);
  gulp.watch("site/*.html", reload);

}
exports.watch = watch

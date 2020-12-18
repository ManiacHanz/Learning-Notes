const { src, dest, parallel, series } = require("gulp");
const sass = require("gulp-sass");
const babel = require("gulp-babel");
const swig = require("gulp-swig");
const browserify = require("gulp-browserify");
const { clean } = require("./common");

const { joinPath } = require("./utils");
const { data } = require("./constance");

const styles = (done) => {
  return src(joinPath("src/assets/styles/*.scss"))
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(dest(joinPath(".tmp/assets/styles")));
};

const scripts = () => {
  return src(joinPath("src/assets/scripts/*.js"))
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(dest(joinPath(".tmp/assets/scripts")));
};

const html = () => {
  return src(joinPath("src/**/*.html"))
    .pipe(swig(data))
    .pipe(dest(joinPath(".tmp")));
};

const compile = series(clean, parallel(styles, scripts, html));

module.exports = {
  styles,
  scripts,
  html,
  compile,
};

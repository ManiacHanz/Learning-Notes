const { src, dest, parallel, series, watch } = require("gulp");
const sass = require("gulp-sass");
const babel = require("gulp-babel");
const swig = require("gulp-swig");
const browserSync = require("browser-sync").create();
const { clean } = require("./common");
const { joinPath } = require("./utils");
const { data } = require("./constance");

const path = require("path");
const cwd = process.cwd();

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
  const opts = {
    data,
    defaults: { cache: false },
  };
  return src(joinPath("src/**/*.html"))
    .pipe(swig(opts))
    .pipe(dest(joinPath(".tmp")));
};

const compile = series(clean, parallel(styles, scripts, html));

const server = () => {
  watch("src/**/*.scss", { cwd }, styles);
  watch("src/**/*.js", { cwd }, scripts);
  watch("src/**/*.html", { cwd }, html);

  watch(
    joinPath("assets/images/**/*.{jpg,jpeg,png,gif,svg}"),
    browserSync.reload
  );
  watch(
    joinPath("assets/fonts/**/*.{eot,svg,ttf,woff,woff2}"),
    browserSync.reload
  );

  browserSync.init({
    port: 8080,
    files: [
      path.resolve(cwd, ".tmp/**/*.html"),
      path.resolve(cwd, ".tmp/**/*.css"),
      path.resolve(cwd, ".tmp/**/*.js"),
    ],
    server: {
      baseDir: "./.tmp/",
      directory: false,
      routes: { "/node_modules": path.resolve(cwd, "node_modules") },
    },
  });
};

const serve = series(compile, server);

module.exports = {
  styles,
  scripts,
  html,
  compile,
  serve,
};

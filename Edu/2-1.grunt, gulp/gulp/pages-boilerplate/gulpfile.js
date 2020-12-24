const { src, dest, parallel, series, watch } = require("gulp");

const sass = require("gulp-sass");
const babel = require("gulp-babel");
const swig = require("gulp-swig");
const browserSync = require("browser-sync").create();
const gulpIf = require('gulp-if')
const htmlmin = require("gulp-htmlmin");
const uglify = require('gulp-uglify')
const cleanCss = require('gulp-clean-css')
const ur = require("gulp-useref");
const gulpClean = require("gulp-clean");


const { data, config } = require("./config/constance");

const path = require("path");
const cwd = process.cwd();
const argv = process.argv

const joinPath = (p) => path.resolve(cwd, p);

const cleanTmp = () => {
  return src(joinPath(".tmp"), { allowEmpty: true }).pipe(
    gulpClean({ force: true })
  );
};
const cleanDist = () => {
  return src(joinPath(".dist"), { allowEmpty: true }).pipe(
    gulpClean({ force: true })
  );
};
const clean = parallel(cleanDist, cleanTmp)


const styles = (done) => {
  return src("src/assets/styles/*.scss", {base:'src'})
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(dest(".tmp"))
    .pipe(browserSync.reload({ stream: true }))
};

const scripts = () => {
  return src("src/assets/scripts/*.js", {base: 'src'})
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(dest(".tmp"))
    .pipe(browserSync.reload({ stream: true }))
};

const html = () => {
  const opts = {
    data,
    defaults: { cache: false },
  };
  return src("src/**/*.html", {base: 'src'})
    .pipe(swig(opts))
    .pipe(dest(".tmp"))
    .pipe(browserSync.reload({ stream: true }))
};

const compile = parallel(styles, scripts, html)

const server = () => {
  watch("src/**/*.scss", { cwd }, styles);
  watch("src/**/*.js", { cwd }, scripts);
  watch("src/**/*.html", { cwd }, html);

  watch(
    "assets/images/**/*.{jpg,jpeg,png,gif,svg}",
    {cwd: 'src'},
    browserSync.reload
  );
  watch(
    "assets/fonts/**/*.{eot,svg,ttf,woff,woff2}",
    {cwd: 'src'},
    browserSync.reload
  );

  // 获取端口
  const [port, open] = argv.reduce((pre, curr) => {
    if(curr.includes('--port')) {
      const [str, p] = curr.split('=')
      return [Number(p), pre[1]]
    }
    if(curr === '--open') return [pre[0], true]
    return pre
  }, [config.port, config.open])

  browserSync.init({
    port,
    open,
    files: [
      path.resolve(cwd, ".tmp/**/*.html"),
      path.resolve(cwd, ".tmp/**/*.css"),
      path.resolve(cwd, ".tmp/**/*.js"),
    ],
    server: {
      baseDir: [".tmp/", "src", "public"],
      directory: false,
      routes: { "/node_modules": path.resolve(cwd, "node_modules") },
    },
  });
};

const serve = series(clean, compile, server);

const image = () => {
  return src("src/assets/images/**/*.{jpg,jpeg,png,gif,svg}", {base: 'src'}).pipe(dest('dist'))
}

const font = () => {
  return src("src/assets/fonts/**/*.{eot,svg,ttf,woff,woff2}", {base: 'src'}).pipe(dest('dist'))
}

const extra = () => {
  return src('public/**',  {base: 'public'}).pipe(dest('dist'))
}

const useref = () => {
  return src("./.tmp/**/*.html")
    .pipe(
      ur({
        searchPath: [".", ".."],
      })
    )
    // .pipe(gulpIf(/\.js$/, uglify()))
    // .pipe(gulpIf(/\.css$/, cleanCss()))
    // .pipe(gulpIf(/\.html$/, htmlmin({collapseWhitespace: true, minifyCSS: true, minifyJS: true})))
    .pipe(dest("dist"));
};


const build = series(clean, compile,useref, parallel(image, font, extra))

module.exports = {
  serve,
  build
}

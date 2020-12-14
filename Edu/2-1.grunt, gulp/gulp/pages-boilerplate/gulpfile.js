// 实现这个项目的构建任务

const { src, dest, watch } = require("gulp");
const path = require("path");
const sass = require("gulp-sass");
const cwd = process.cwd();

const joinPath = (p) => path.resolve(cwd, p);

const clean = (done) => {
  console.log("clean");
  done();
};

const lint = () => {};

const serve = () => {};

const build = () => {};

const start = () => {};

const deploy = () => {};
// module.exports = {
//   clean,
//   lint,
//   serve,
//   build,
//   start,
//   deploy,
// };

exports.styles = (done) => {
  return src(joinPath("src/assets/styles/*.scss"))
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(dest(joinPath(".tmp/styles")));
};

// 实现这个项目的构建任务

const { src, dest, watch } = require("gulp");

const { compile, serve } = require("./config/develop");
const { clean } = require("./config/common");
const htmlmin = require("gulp-htmlmin");
const lint = () => {};
const ur = require("gulp-useref");

const useref = () => {
  return src("./dist/**/*.html")
    .pipe(
      ur({
        searchPath: ["dist", "."],
      })
    )
    .pipe(dest("dist"));
};
const build = () => {};

const start = () => {};

const deploy = () => {};
module.exports = {
  clean,
  lint,
  serve,
  build,
  start: compile,
  deploy,
  serve,
  useref,
};

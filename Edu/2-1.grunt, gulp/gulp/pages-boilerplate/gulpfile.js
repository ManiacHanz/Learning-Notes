// 实现这个项目的构建任务

const { src, dest, watch } = require("gulp");

const { compile } = require("./config/develop");
const { clean } = require("./config/common");
const htmlmin = require("gulp-htmlmin");
const lint = () => {};

const serve = () => {};

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
};

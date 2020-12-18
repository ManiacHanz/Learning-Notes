const { src, dest, watch } = require("gulp");
const gulpClean = require("gulp-clean");
const { joinPath } = require("./utils");

const clean = () => {
  return src(joinPath(".tmp"), { allowEmpty: true }).pipe(
    gulpClean({ force: true })
  );
};

module.exports = {
  clean,
};

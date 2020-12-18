const path = require("path");
const cwd = process.cwd();
const joinPath = (p) => path.resolve(cwd, p);

module.exports = {
  joinPath,
};

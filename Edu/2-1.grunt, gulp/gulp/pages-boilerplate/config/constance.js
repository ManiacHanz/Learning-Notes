const path = require("path");
const { joinPath } = require("./utils");

exports.data = {
  menus: [],
  pkg: require(joinPath("./package.json")),
  data: new Date(),
};

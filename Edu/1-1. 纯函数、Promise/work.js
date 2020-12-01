const fp = require("lodash/fp");
const MyPromise = require("./promise");
const p = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("success");
  }, 2000);
  // reject("fail");
});

MyPromise.resolve(p).then(
  s => console.log("s: ", s),
  f => console.log("f: ", f)
);

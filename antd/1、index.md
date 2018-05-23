

## 入口文件


### 两个知识点提前掌握以下

* 老生常谈的 `exports`和 `module.exports` 二者的区别
  简单的说就是 `require` 引用的是 `module.exports` 暴露出去的东西，而 `exports` 只是 `modules.exports` 的引用对象

* 第三  去中心化引用函数    `require.context`   
	·directory：说明需要检索的目录
	·useSubdirectories：是否检索子目录
	·regExp: 匹配文件的正则表达式
  详细用法可以看[这篇文章](https://juejin.im/entry/590c2777128fe10058392598)


```js
// 转化驼峰变成驼峰
function camelCase(name) {
  return name.charAt(0).toUpperCase() +
    name.slice(1).replace(/-(\w)/g, (m, n) => {
      return n.toUpperCase();
    });
}
```

```js
// 去中心化的引用所有的样式文件
const req = require.context('./components', true, /^\.\/[^_][\w-]+\/style\/index\.tsx?$/);

req.keys().forEach((mod) => {
  let v = req(mod);
  if (v && v.default) {
    v = v.default;
  }
  const match = mod.match(/^\.\/([^_][\w-]+)\/index\.tsx?$/);
  if (match && match[1]) {
    if (match[1] === 'message' || match[1] === 'notification') {
      // message & notification should not be capitalized
      exports[match[1]] = v;
    } else {
      exports[camelCase(match[1])] = v;
    }
  }
});

module.exports = require('./components');
```
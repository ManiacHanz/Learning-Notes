
`taro build`是整个Taro项目的灵魂和核心，主要负责**多端代码编译**，我们接下来就大体介绍一下taro编译的秘密

### 关于taro跨平台的秘密 -- ast和babel

> 万里长征第零步：编译就是把一段字符串改成另外一段字符串

比如说我们要把一段JSON中键名`foo`改成`bar`，这就是最简单的代码编译
```js
jsonStr.replace(/(?<=")foo(?="\s*:)/i, 'bar')   
```

而复杂的代码编译，就需要了解**抽象语法树(Abstract Syntax Tree)**以及**babel**

##### AST

![AST](https://user-gold-cdn.xitu.io/2018/10/8/166515483b7fa7c0?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

首先是 Parse，将代码解析（Parse）成抽象语法树（Abstract Syntex Tree），然后对 AST 进行遍历（traverse）和替换(replace)（这对于前端来说其实并不陌生，可以类比 DOM 树的操作），最后是生成（generate），根据新的 AST 生成编译后的代码。

##### babel -- Javascript编译器

*通俗的说，babel就是把你交给他的代码，通过一些规则更改以后，生成新的代码*

taro用到的babel模块主要有下面几个

* Babylon - Babel 的解析器。最初是从 Acorn 项目 fork 出来的。Acorn 非常快，易于使用，并且针对非标准特性(以及那些未来的标准特性) 设计了一个基于插件的架构。
* Babel-traverse - 负责维护整棵树的状态，并且负责替换、移除和添加节点。
* Babel-types - 一个用于 AST 节点的 Lodash 式工具库， 它包含了构造、验证以及变换 AST 节点的方法。 该工具库包含考虑周到的工具方法，对编写处理 AST 逻辑非常有用。
* Babel-generator - Babel 的代码生成器，它读取 AST 并将其转换为代码和源码映射（sourcemaps）。
* Babel-template - 另一个虽然很小但却非常有用的模块。 它能让你编写字符串形式且带有占位符的代码来代替手动编码， 尤其是生成大规模 AST 的时候。

```js
import * as babylon from "@babel/parser";
import traverse from "babel-traverse";

import * as t from "babel-types"; 

const code = `function square(n) {
  return n * n;
}`;

const ast = babylon.parse(code);

traverse(ast, {
  enter(path) {
    if (
      path.node.type === "Identifier" &&
      path.node.name === "n"
    ) {
      path.node.name = "x";
    }
    // 使用babel-types
    if (t.isIdentifier(path.node, { name: "n" })) {
      path.node.name = "x";
    }
  }
});
// function square(n) {
//  return n * n;
// }
```

### 关于transform-wx

编译成小程序能运行的代码的核心内容，举个转换config的例子

在组件里我们都可以声明一个config属性，最终这个属性并没有被放在wxml或者是js文件里，而是被放在了组件的json文件里，形成了符合小程序条件的配置文件，我们接下来大概看一下，这一块的解析原理

```jsx
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

class Home extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

}
```

```js
// 1. babel-traverse方法， 遍历和更新节点
traverse(ast, {  
  ClassProperty(astPath) { // 遍历类的属性声明
    const node = astPath.node
    if (node.key.name === 'config') { // 类的属性名为 config
      configObj = traverseObjectNode(node)
      astPath.remove() // 将该方法移除掉
    }
  }
})

// 2. 遍历，解析为 JSON 对象
function traverseObjectNode(node, obj) {
    //根据类型判断的递归
  if (node.type === 'ClassProperty' || node.type === 'ObjectProperty') {
    const properties = node.value.properties
      obj = {}
      properties.forEach((p, index) => {
        obj[p.key.name] = traverseObjectNode(p.value)
      })
      return obj
  }
  if (node.type === 'ObjectExpression') {
    const properties = node.properties
    obj = {}
    properties.forEach((p, index) => {
      // const t = require('babel-types')  AST 节点的 Lodash 式工具库
      const key = t.isIdentifier(p.key) ? p.key.name : p.key.value
      obj[key] = traverseObjectNode(p.value)
    })
    return obj
  }
  if (node.type === 'ArrayExpression') {
    return node.elements.map(item => traverseObjectNode(item))
  }
  if (node.type === 'NullLiteral') {
    return null
  }
  return node.value
}

// 3. 写入对应目录的 *.json 文件
fs.writeFileSync(outputPageJSONPath, JSON.stringify(configObj, null, 2))

```
那么我们实际上有什么用途呢

### 全局植入`AuthModal`

react中一般的全局弹窗是用`createPortal`来添加到指定的`container`下面，而小程序没有个页面都是一个`Page`，所以就有了自动在每个页面植入弹窗组件的办法


```js
// transform-wx/index
const ast = babel_core_1.transform(code, options_1.buildBabelTransformOptions()).ast;

// transform-wx/options
exports.buildBabelTransformOptions = () => {
    return {
        plugins: [/*  babel - plugins  */]
    }
}
```

`babel-core.transform`是把code变成ast的过程，而第二个参数把`babel`需要的配置通过另一个文件引进来。所以这里给我们在这个流程之前把这个方法复写的机会，最后再调用`@tarojs/build`就恢复到正常流程了

```js
const buildOptions = require('@tarojs/transformer-wx/lib/src/options');

const injectPlugins = (plugins) => {
    buildOptions.buildBabelTransformOptions = () => {
        // do something
        return opts;
    };
};

injectPlugins([ /* custom bable plugin */ ]);

require('@tarojs/cli/bin/taro-build');
```


### 关于stylus

一般情况下，一个程序都只有一个主色，或者一个主字体等等，我们应该像js设置变量一样，给一些主要的属性设置一个变量来方便代码的维护。但是所有地方都去`@import`又会造成无谓的工作量

在一般的webpack项目中，我们只需要通过`loader`里面的配置项来搞定，比如说`@vue/cli`中的配置

```js
// 部分代码

// webpack.base.conf.js
module.exports = {
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
            },
        ]
    }
}

// vueLoaderConfig -> cssLoaders({sourceMap, extract})
exports.cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }
  // import 是关键
  var stylusOptions = {
    import: [
        path.join(__dirname, "../src/common/base.styl"), // base.styl全局变量文件
    ]
  }
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus', stylusOptions),
    styl: generateLoaders('stylus', stylusOptions)
  }
}
```

而在Taro中的config文件中没有类似格式的配置，所以只有看看taro中的实现原理
**通过build然后找到对应的weapp.js，然后在`buildSingleComponent`里面编译时候会调用到样式插件**
这里直接找到`plugin-stylus`文件夹

```js
const stylus = require('stylus')

module.exports = function compileStylus (content, file, config) {
  return new Promise((resolve, reject) => {
    if (!content && !fs.existsSync(file)) {
      return resolve({
        css: ''
      })
    }
    if (!content) {
      content = fs.readFileSync(file).toString()
    }
    const opath = path.parse(file)
    config.paths = [opath.dir].concat(config.paths || [])
    config.filename = opath.base
    const instance = stylus(content, { filename: file })
    /*
        根据stylus文档的地址，如果在这里加一条
        就相当于在所有的.styl文件前自动添加了这个变量文件，可以不用手动添加
        但是在不修改源码的情况下这个办法显然行不通，所以需要另一个重要api use
    */
    /* instance.import('../variebles.styl') */


    // 通过这里的set可以把属性植入到实例里
    for (const k in config) {
      instance.set(k, config[k])
    }
    let imports = instance.deps()
   

    // render就相当于分析stylus生成新的ast
    // 所以需要在之前处理
    instance.render((err, css) => {
      if (err) {
        return reject(err)
      }
      resolve({
        css,
        imports
      })
    })
  })
}

```

最优解  stylus的 `set`配合`use`达到目的。就是说在不修改源码的情况下可以通过这两个的配合达到植入`stylus.import()`的效果
代码如下

```js
// config/index
var config = {
    plugins: {
        stylus: {
            use: [function(stylus){
                stylus.import('../variebles')
            }]
        }
    }
}

// 原理
// `new Renderer()`就是stylus的实例
// set就是把config里的所有配置都挂在了实例的options上面
Renderer.prototype.set = function(key, val){
  this.options[key] = val;
  return this;
};
// use的作用其实就是调用这个方法，注意use方法传进来的必须是一个fn
Renderer.prototype.use = function(fn){
  fn.call(this, this);
  return this;
};

Renderer.prototype.render = function(fn){
  var parser = this.parser = new Parser(this.str, this.options);

  // 调用options上的use属性里的所有fn
  // 通过set挂上来的use必须是一个数组，这里是文档中没有提到的
  // 会循环调用 所以可以传入多个类似的fn
  // function(stylus){ stylus.import('../variebles.styl') }
  for (var i = 0, len = this.options.use.length; i < len; i++) {
    this.use(this.options.use[i]);
  }

  // ...其他过程
};
```

##### 开放问题，关于require.context？



附录

[ASTexplorer](https://astexplorer.net/)
在线组织抽象语法树

[Babel plugin handbook](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md)
一个相信的babel教程，并且有中文

[Babel-types](https://babeljs.io/docs/en/babel-types#docsNav)
babel操作ast的工具库文档

stylus [文档地址](https://stylus.bootcss.com/docs/js.html), [中文文档](https://www.zhangxinxu.com/jq/stylus/js.php)
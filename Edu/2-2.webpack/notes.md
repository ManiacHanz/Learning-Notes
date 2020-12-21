

### 定义

webpack只是**打包工具**
所有资源都可以当成模块，模块的加载器即是Loader。*Loader是webpack的核心*

### Loader

1. 可以认为webpack的默认loader只能识别js文件

2. 关于样式。 `css-loader`是用来讲css资源文件装换成可被识别的js语句，再通过`style-loader`把css语句，通过`<style>`标签加载到html页面中

3. 文件loader。
    `file-loader`, 把文件直接拷贝到配置的`publicPath`目录下，在把目标地址返回出来给代码引用；
    `url-loader`，把文件**内容**转换成浏览器可识别的`Data URL`格式，比如`base64`等；
    小文件使用`url-loader`可以减少对于文件的请求，大文件使用`file-loader`可以减少打包出来的代码量，提高加载速度；
    注： `url-loader`配置大小条件时，需要同时安装`file-loader`

4. Loader类型： 编译转换类，文件操作类，代码检查类

5. babel。 组合拳 `babel-loader` `@babel/core` `@babel/preset-env`

6. html文件。`html-loader`。注意添加`attrs`来触发打包资源

7. Loader的最终必须返回合法的**js字符串**。这个js语句会被直接放入`bundle.js`里，变成模块的语句。


### Plugin

> 解决除了模块加载以外的自动化工作，比如清理，检查等等。

通过生命周期中的钩子函数，实现其他的目的

1. `clean-webpack-plugin`。清理文件夹

2. `html-webpack-plugin`。软编码自动生成`html`文件。注意配置属性，来修改html文件中的各个配置。[配置文档](https://github.com/jantimon/html-webpack-plugin#configuration)

3. `copy-webpack-plugin`。单纯的拷贝文件

4. `MiniCssExtractPlugin`。提取css语句到css文件。[git仓库](https://github.com/webpack-contrib/mini-css-extract-plugin)

5. `OptimizeCssAssetsWebpackPlugin`。压缩单独提取过的css文件。也可使用[官方推荐](https://webpack.js.org/plugins/mini-css-extract-plugin/#minimizing-for-production)

### dev-server

集成的自动更新，自动刷新的开发服务器。比`browserSync`优势在于从内存中读取

### Source Map的模式对比

* `eval`: 使用eval的方式嵌入sourcemap文件路径
* `eval-source-map`: 使用eval方式并且生成了单独的sourcemap文件
* `cheap-eval-source-map`: 阉割版的上者，只能显示错误的行，无法显示错误的列 
* `cheap-module-eval-source-map`: 带了`module`的模式可以展示被loader处理前的文件，不带的会处展示处理后的
* `inline-source-map`: 会把sourcemap路径转成data url
* `hidden-source-map`: 无法直接看到sourcemap的效果。开发第三发包可用
* `nosources-source-map`: 在浏览器开发者工具可隐藏掉源文件内容

### HMR

注意配置除了`hot:true`以外还需要加上`new webpack.HotModuleReplacementPlugin()`插件配合使用

JS模块的热替换需要手动处理替换方式。是因为默认情况下webpack并不知道JS更新后应该如何更新模块，所以只能刷新浏览器


### Optimization
#### TreeShaking

**必须使用ESM环境, 而不能处理cmd环境。**原理是因为`tree shaking`分析以来是以`ESM`为依赖2的

production mode下自动开启

通过optimization开启需要两部
1. `usedExports`负责`“标记”`。开启以后在打包后的代码中，会把未被引用的代码不再导出。但此时代码中仍然存在此代码.[目录](https://webpack.js.org/configuration/optimization/#optimizationusedexports)
2. `minimize`压缩。把上面部分未被引用也未被使用的代码清除掉。[目录](https://webpack.js.org/configuration/optimization/#optimizationminimize)
```js
{
    optimization: {
        usedExports: true,
        minimize: true
    }
}
```


#### Scope Hoisting 作用域提升

[文档](https://webpack.js.org/configuration/optimization/#optimizationconcatenatemodules)

把模块打包到一个模块中（见bundle.js）。减小代码体积，提升代码效率

```js
{
    optimization: {
        concatenateModules: true
    }
}
```

#### sideEffect 副作用

[文档](https://webpack.js.org/configuration/optimization/#optimizationsideeffects)

让webpack明确，没有被用到的`export`，是没有副作用的，可以直接被`tree shaking`掉。从而进一步优化代码体积

1. webpack.config.js 里的配置表示开启此项功能。打包时会检查当前模块是否有副作用，如果没有就不会打包。可以使用`true`或者`'flag'`。
2. package.json 配置。false表示所有文件都没有副作用。或者使用文件路径数组，用来表示哪些模块有无副作用

```js
// webpack.config.js
{
    optimization: {
        sideEffects: true
    }
}

// package.json
// 表示没有副作用
{
  "name": "awesome npm module",
  "version": "1.0.0",
  "sideEffects": false
}
```

#### splitChunks

`common-chunk-plugin`

### Hash

[文档](https://www.webpackjs.com/guides/caching/)

* hash 项目级别hash，所有文件都会改变
* chunkhash 根据chunk创建不同的hash, 同一个chunk会使用同一个hash
* contenthash 根据内容不同而改变的hash


## RollUp

### 模块规范

默认使用ESM，CMD需要配置`rollup-plugin-commonjs`插件来实现

### 代码拆分及多入口

rollup代码拆分和多入口文件不能使用iife，只能使用amd标准


缺点：第三方模块，HMR
优点：打包出来的模块在一个作用域，没有多余的代码


## lint

* husky用来使用package.json完成对.git/hooks的sh脚本编写
* lint-stage配合husky可以完成复合指令
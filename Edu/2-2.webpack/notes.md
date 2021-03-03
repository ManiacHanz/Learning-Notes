

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


### webpack流程（打包后的主代码）
    通过ast解析模块暴露方法，使用`__webpack_require__`的挂载方法，来兼容commonjs和esModule规范，然后在递归调用`__webpack_require__`，依次打包每个依赖

* `__webpack_require__`方法。用来兼容各个模块规范，返回被加载模块的内容

    1. commonJs. webpack不会采用过多操作，直接替换为`__webpack_require__`方法，然后导出出来
    2. esModule导出方式，webpack会稍作处理，把本来的exports改成自定义的`__webpack_exports__`,主要调用的`__webpack_require__.r`以及`__webpack_require__.d`方法。`__webpack_require__.r`是给`exports`对象加标记，标记`__esModule`, 在后续的使用时可以知道是`esModule`。`__webpack_require__.d`，其实就是把代码中`export {}`出来的属性，通过`Object.defineProperty(exports, prop, {enumerable: true, get: getter})`挂到`Module`下面的`exports`上面，相当于处理成了commonjs
    3. 导入方式也会同时做兼容。比如在使用import导入commonjs规范导出的模块时，webpack也会把commonjs上通过getter使import能抓到内容
    4. 总结就是，在esModule时，不管是导入还是导出，webpack都会进行处理，主要处理方式是对`exports`对象进行赋值及属性挂载。另外就是要兼容使用`import`方式去导入`commonJs`引入的包
    5. 注意：以上设计到的`module`，不是`nodejs`环境中的`module`，而是在`__webpack_require__`函数声明的内部变量。`let module = { i: moduleId, l: false, exports: {} }`

* import()懒加载主流程
    1. 当前懒加载的核心原理是jsonp -- script标签
    2. `__webpack_require__.t`方法，用的是二进制的位运算，针对内容进行不同的处理。处理主要还是针对不同规范的兼容
    3. 懒加载魔法注解`import(/*webpackChunkName: abc*/ './abc.js').then(chunk => {})`
    4. 懒加载的主流程，主要是通过`Promise`，先把内容放进一个`promises`数组，并且保存每一个`promise`的`resolve`方法，放进`promises`数组里。然后在读取文件内容以后，遍历调用`resolve`方法，这样就可以在then后面使用了。被动态加载的文件会编译成调用`webpackJsonpCallback`调用，也就是读取完文件内容需要改变`promise`状态

### tapable
> 可以理解成就是一个发布-订阅模式的库

* 钩子准备
    1. 分为同步和异步钩子
    2. 普通钩子 -- 监听器之间互相独立不干扰；熔断钩子(bailhook) -- 监听返回非undefined时后续不执行；瀑布沟子(waterfallHook) -- 上一个监听的返回值可传递到下一个；循环钩子(loophook) -- 不返回false则一直执行

* hook.tap
    有点类似于各个中间件的use方法，就是组装，然后放进taps数组里
* hook.call
    调用这个函数的时候，会根据taps里面的内容，以及钩子的类型，利用模板拼接成一个新的匿名函数，然后调用这个匿名函数

* Compiler 
    Compiler类，其实是继承了Tapable类，同时在实例上挂载了很多tapable的钩子

* webpack函数的主流程
    1. 实例化compiler对象  `new Compiler()`
    2. 初始化`NodeEnvironmentPlugin(compiler)`插件，让compiler具备文件读写以及监听的能力
    3. 挂载所有的plugins插件到compiler对象身上
    4. 挂载webpack内置的插件，比如处理入口文件的插件
    5. 返回compiler对象
    6. 调用compiler.run的方法
    7. 总结：整体是一个类似于事件执行机制

* 处理入口文件的内置插件 webpackOptionsApply内部的EntryOptionPlugin

## webpack主流程梳理

一、步骤
    1. 实例化 compiler对象，用来贯穿整个webpack工程。`new Compiler`。Compiler类又继承自Tapable类
    2. compiler实例执行run方法

二、compiler实例化操作
    1. compiler 继承 tapable 。是为了具备钩子的操作能力。因为webpack是一个事件流，它的工作机制主要是 监听事件 - 触发事件
    2. 在实例化 compiler 以后，就是对compiler 实例的扩展操作。比如往上面挂载属性及添加方法。其中 NodeEnvironmentPlugin 这个关键操作，是为了让他具备文件的读写的能力。`outputSystem` `inputSystem`
    3. 具备了文件读写能力之后，会把 option 中的plugins配置，都挂载到compiler身上
    4. 把webpack内部的插件与compiler建立关系。其中 EntryOptionPlugin 处理了入口模块的 id，即 config 里面的 entry 属性
    5. 在实例化 compiler 的时候只是监听了 make 钩子 (SingleEntryPlugin -- 处理入口文件的插件)
        5.1 在 SingleEntryPlugin 模块的 apply 方法中对两个钩子进行监听（在run里面触发）
        5.2 其中 compilation 钩子就是让 compilation 具备了利用 normalModuleFactory 工厂创建一个普通模块的能力。
        5.3 有5.2的能力是因为编译的过程就是 compilation 需要创建一个模块来加载需要打包的模块
        5.4 其中 make 钩子，在 compiler.run 的时候会出发，走到这里就意味着某个模块执行打包之前的所有准备工作就完成了
        5.5 addEntry() 方法调用，就是处理入口文件的

三、run 方法执行
    1. run方法就是利用tapable去按顺序调用钩子(beforeRun run compile)。符合webpack的工作机制、
    2. compile 方法执行( run 内部的 compile. 就是 Compiler类上的方法)
        2.1 准备参数，返回一个params对象。其中有normalModuleFactory，用于2-5-2所说
        2.2 触发beforeCompile钩子
        2.3 将第一步的参数传给一个函数，开始创建一个 compilation。 同时把compiler 对象也挂载到了 compilation身上
        2.4 在调用 newCompilation 的内部
            - 调用了 createCompilation
            - 触发了 this.compilation 钩子和 compilation 钩子的监听
    3. 创建compilation对象以后就触发make 钩子
    4. 触发make钩子监听以后就把 compilation 对象传进去。所以此时既能拿到当前处理的 compilation 对象，也能拿到贯穿始终的 compiler 对象

四、总结
    1. 实例化compiler方法。 `const compiler = webpack(require(webpack.config.js))`
    2. 调用compiler方法
    3. newCompilation
    4. 实例化compilation对象，身上具有compiler
    5. 触发make监听
    6. make监听里有对于入口文件的处理的插件，就触发了编译流程

## 编译流程

整个编译过程都是有compilation实例来处理

一、通过compilation里的addEntry以及addModules方法，会收集并保存模块的依赖关系
    1. 这个收集的过程是通过解析ast，把import或者require关键声明都改成__webpack_require，并且把依赖关系明确出来
    2. 有两个重要的属性，entries保存入口文件；modules保存所有用到的模块文件。都是扁平的1维数组

二、根据收集到的入口的依赖，递归的去分析每一个模块需要的依赖及代码解析。这中间会把moduleId，moduleResource等等信息保存起来

三、在make钩子里面调用afterCompiler钩子，在里面就会根据模块的依赖关系生成chunk
    1. 有依赖关系的代码应该生成一份chunk
    2. 里面用来辨识的moduleId应该相同
    3. 写到磁盘指定位置
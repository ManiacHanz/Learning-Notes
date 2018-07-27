

# Ant 的 webpack配置 以及 架构目录，单测等

*水平有限，浅浅看一下*

#### 先看webpack打包

```js
// 主要的 配置文件是在一个Npm包里引入进来的
const getWebpackConfig = require('antd-tools/lib/getWebpackConfig');

// module.noParse 
// 防止webpack解析那些任何与给定正则表达式相匹配的文件。忽略大型的library可以提高构建性能
// 例如：noParse: /jquery|lodash/
// 引入的文件中只有moment.js是noParse，这里在生产环境下把其删除，生产环境不需要考虑反复构建
// 新增一个IgnorePlugin
// 防止在 import 或 require 调用时，生成一下正则表达式匹配的模块
// requestRegExp 匹配(test)资源请求路径的正则表达式。
// contextRegExp （可选）匹配(test)资源上下文（目录）的正则表达式。
// webpakc官网特意为moment.js举了一个例子，这里也正好完整的用上：打包核心，但是忽略本地化
// moment 2.18 会将所有本地化内容和核心功能一起打包（见该 GitHub issue）。你可使用 IgnorePlugin 在打包时忽略本地化内容:
// new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
function ignoreMomentLocale(webpackConfig) {
  delete webpackConfig.module.noParse;
  webpackConfig.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));
}

// 改变一些入口、出口配置
function addLocales(webpackConfig) {
  let packageName = 'antd-with-locales';
  if (webpackConfig.entry['antd.min']) {
    packageName += '.min';
  }
  webpackConfig.entry[packageName] = './index-with-locales.js';
  webpackConfig.output.filename = '[name].js';
}

// extarnal配置
// 配置选项提供[从输出的bundle中排除依赖]的方法，通常作用于各种library
// 防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖(external dependencies)。
// root：可以通过一个全局变量访问 library（例如，通过 script 标签）。
// commonjs：可以将 library 作为一个 CommonJS 模块访问。
// commonjs2：和上面的类似，但导出的是 module.exports.default.
// amd：类似于 commonjs，但使用 AMD 模块系统。
function externalMoment(config) {
  config.externals.moment = {
    root: 'moment',
    commonjs2: 'moment',
    commonjs: 'moment',
    amd: 'moment',
  };
}

const webpackConfig = getWebpackConfig(false);
if (process.env.RUN_ENV === 'PRODUCTION') {
  webpackConfig.forEach((config) => {
    ignoreMomentLocale(config);
    externalMoment(config);
    addLocales(config);
  });
}
module.exports = webpackConfig;

```


#### 接下来看 `antd-tools/lib/getWebpackConfig` 模块里的配置文件

##### 知识点先看

* CaseSensitivePathsPlugin
    这个插件用来避免多人合作开发情况下，开发人员不遵循严格路径导致冲突，主要是OSX上。这个插件会强制执行需要的模块的完整路径，来匹配在硬盘上的正确位置
[github地址](https://github.com/Urthen/case-sensitive-paths-webpack-plugin)

* BannerPlugin
    为每个chunk文件头部添加一个banner，ant这里应该是作为一个标识
[webpack地址](https://webpack.docschina.org/plugins/banner-plugin)

* ModuleConcatenationPlugin
    --ant这里只用在了生产环境

    这个插件会在 webpack 中实现以上的预编译功能。

    过去 webpack 打包时的一个取舍是将 bundle 中各个模块单独打包成闭包。这些打包函数使你的 JavaScript 在浏览器中处理的更慢。相比之下，一些工具像 Closure Compiler 和 RollupJS 可以提升(hoist)或者预编译所有模块到一个闭包中，提升你的代码在浏览器中的执行速度。

    ```js
    new webpack.optimize.ModuleConcatenationPlugin()
    ```

    这种连结行为被称为“作用域提升(scope hoisting)”。
    
    由于实现 ECMAScript 模块语法，作用域提升(scope hoisting)这个特定于此语法的功能才成为可能。webpack 可能会根据你正在使用的模块类型和其他的情况，回退到普通打包。
[webpack地址](https://webpack.docschina.org/plugins/module-concatenation-plugin/)

* process.cwd()
    返回node进程当前工作的目录，而这里没有用常用的`__dirname`
    ```js
      const pkg = require(path.join(process.cwd(), 'package.json'));
    ```

* webpack node配置

    是一个对象，其中每个属性都是 Node.js 全局变量或模块的名称，每个 value 是以下其中之一……

    * true：提供 polyfill。
    * "mock"：提供 mock 实现预期接口，但功能很少或没有。
    * "empty"：提供空对象。
    * false: 什么都不提供。预期获取此对象的代码，可能会因为获取不到此对象ReferenceError 而崩溃。尝试使用 require('modulename') 导入模块的代码，可能会Cannot find module "modulename" 错误。

```js
module.exports = function (modules) {

    const config = {
        // 这里用到了一个node配置
        node: [
            'child_process',
            'cluster',
            'dgram',
            'dns',
            'fs',
            'module',
            'net',
            'readline',
            'repl',
            'tls',
            ].reduce((acc, name) => Object.assign({}, acc, { [name]: 'empty' }), {})
        // 其实合成的是以下这样的对象
        /*{
            'child_process': 'empty',
            'cluster': 'empty',
            'dgram': 'empty',
            'dns': 'empty',
            'fs': 'empty',
            'module': 'empty',
            'net': 'empty',
            'readline': 'empty',
            'repl': 'empty',
            'tls': 'empty',
        }*/
    }

    return config
}
```
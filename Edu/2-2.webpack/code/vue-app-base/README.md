# vue-app-base

1. 这是一个使用 Vue CLI 创建出来的 Vue 项目基础结构
2. 有所不同的是这里我移除掉了 vue-cli-service（包含 webpack 等工具的黑盒工具）
3. 这里的要求就是直接使用 webpack 以及你所了解的周边工具、Loader、Plugin 还原这个项目的打包任务
4. 尽可能的使用上所有你了解到的功能和特性


## 思路


根据package.json中的script分析出来主要需要3个配置
* dev开发环境
* prod构建环境
* lint代码检查


### common

共同的对于src下的文件的loader，以及plugin的共同的配置文件应该放在这里。其他的环境的配置使用`webpack-merge`进行合并

### dev环境

dev环境主要是增加dev-server的配置，以及html模板可能需要读取favicon的路径问题，这里注意不需要打包public的里的静态资源文件，只需要同步读取

### prod环境

prod主要是增加代码丑化压缩，以及分包等，主要是在optimize里的配置。

### 顺序

先按照common打包到dist目录，用serve启动静态服务，看打包后的效果，然后在分开编写dev和prod，最后加上lint，和git hooks

### Loader

* webpack相关依赖安装 webpack webpack-cli 
1. vue模板应该使用`vue-loader`。这里查看[文档](https://vue-loader.vuejs.org/zh/guide/#%E6%89%8B%E5%8A%A8%E8%AE%BE%E7%BD%AE)。根据这个来查看需要引入的`.vue`文件

2. less文件需要引入`less-loader`以及`less`。查看[文档](https://www.webpackjs.com/loaders/less-loader/)

3. 合并webpack配置使用`webpack-merge`。[文档](https://webpack.js.org/guides/production/#setup)

* 运行脚本报错，需要安装依赖`@vue/cli-plugin-babel`

* html-webpack-plugin [配置及使用文档](https://github.com/jantimon/html-webpack-plugin#configuration)



### 遇到的问题及解决

* Cannot find module 'webpack-cli/bin/config-yargs'. 更换`webpack-cli`的版本号。[issue链接](https://github.com/webpack/webpack-cli/issues/1948)。更换回3.3.12

* CleanWebpackPlugin is not a constructor.  根据webpack[官方文档](https://www.webpackjs.com/guides/development/#%E4%BD%BF%E7%94%A8-webpack-dev-server)配置出错. 排查发现需要更改一下代码。同时需要修改里面的参数. [仓库地址](https://github.com/johnagan/clean-webpack-plugin#options-and-defaults-optional)。不再需要传入文件夹路径，会自动根据`output.path`来删除
    ```js
    const CleanWebpackPlugin = require('clean-webpack-plugin'); // wrong
    const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // right

    new CleanWebpackPlugin(['dist']), // wrong
    new CleanWebpackPlugin({}),   // right
    ```

* 图片打包出错 ![图片打包出错](./img-error.png)
    打包后的代码显示设置的图片的src是一个`Object`而不是`String` ![图片打包出错](./img-error-2.png)
    然后就想到了引入图片的方式的问题，如下面代码所示, 通过ESM以模块方式引入就可以解决此问题，然而代码是以静态路劲引入，所以我们也需要考虑如何处理以静态路径引入的问题。如果通过修改配置，则需要在`file-loader`里增加`esModule: false`配置。[仓库地址](https://github.com/webpack-contrib/file-loader#esmodule)
    ```js
    // ESM
    <img alt="Vue logo" :src="img" />

    <script>
        import img from './assets/logo.png'
        export default {
            data() {
                return {
                    img,
                }
            },
        }
    </script>


    // static
    <img alt="Vue logo" :src="./assets/logo.png" />
    ```

* 使用`ExtractTextPlugin`报`compiler.plugin is not a function`。断点得到`compiler`里没有`plugin`方法。后发现在webpack 4.x版本中此插件已被废弃，[文档](https://github.com/webpack-contrib/extract-text-webpack-plugin#usage), 改用`mini-css-extract-plugin`[文档](https://github.com/webpack-contrib/mini-css-extract-plugin)。同时`vue-style-loader`和`style-loader`作用差不多，所以在`.css`里面也需要去替换掉

* **HMR未成功**。 现象：webpack重新打包后，浏览器没有收到websocket通知的update.json文件，没进行热替换。关闭热替换也没自动刷新浏览器。不知道为何 --- 需要增加`target:'web'`配置


## Lint

参考配置[文档](https://eslint.bootcss.com/docs/user-guide/getting-started)

`$ npm i eslint --save-dev`
`$ npx eslint --init`

遇到检测.less文件语法问题报错 使用命令行`--ext`指定文件类型检测


## git hook

参考vue-cli使用的[yorkie](https://cli.vuejs.org/zh/guide/cli-service.html#git-hook), 同husky,只是`script`改成了`gitHooks`




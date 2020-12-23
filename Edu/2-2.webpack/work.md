一、简答题
1、Webpack 的构建流程主要有哪些环节？如果可以请尽可能详尽的描述 Webpack 打包的整个过程。

答： webpack是一个静态模块打包器。它会从配置的入口文件开始，递归的分析并构建一个依赖关系图。这里面的依赖可以是js脚本文件，也可以是样式文件、图片等资源文件，每一个被依赖的文件被认为是一个模块，后续被loader读取进来。最后通过其他的配置，将这些依赖打包成一个或多个包。

2、Loader 和 Plugin 有哪些不同？请描述一下开发 Loader 和 Plugin 的思路。

答：Loader主要是用来读取各种类型的依赖文件，除了默认的脚本文件以外，其他类型的文件都需要对应的Loader来读取。一个Loader主要是需要暴露一个函数，入参是读取的文件中的内容，在对文件内容处理后，最后返回的是一段js语句。在打包后，这段语句会被直接放到对于的bundle模块函数内；
而Plugin是对读取文件以外的工作的一个补充。它的工作原理是利用webpack在构建过程中暴露出来的钩子，完成一些其他的操作。Plugin中有三个概念，`compiler` `compilation` `tapable`。`compiler`代表着`webpack`运行时的配置，比如`webpack.config.js`中的内容；`compilation`实例能够访问当前所有的模块资源和他们的依赖，每一次模块的变化都会生成新的`compilation`；而`tapable`是`webpack`的核心工具，用来提供钩子，也就是生命周期。自定义Plugin首先需要暴露的是一个`类`。其次这个类中必须包含一个`apply`方法。一般来说在这个`apply`方法中，通过`compiler`和`compilation`提供的钩子，完成自定义的功能，就能达到插件的目的。
[编写一个loader](https://www.webpackjs.com/contribute/writing-a-loader/)
[编写一个plugin](https://www.webpackjs.com/contribute/writing-a-plugin/)


二、编程题
1、使用 Webpack 实现 Vue 项目打包任务
具体任务及说明：

先下载任务的基础代码  百度网盘链接: https://pan.baidu.com/s/1pJl4k5KgyhD2xo8FZIms8Q 提取码: zrdd

这是一个使用 Vue CLI 创建出来的 Vue 项目基础结构

有所不同的是这里我移除掉了 vue-cli-service（包含 webpack 等工具的黑盒工具）

这里的要求就是直接使用 webpack 以及你所了解的周边工具、Loader、Plugin 还原这个项目的打包任务

尽可能的使用上所有你了解到的功能和特性


[代码链接](./code/vue-app-base/)
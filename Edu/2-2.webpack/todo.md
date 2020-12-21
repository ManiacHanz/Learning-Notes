- [ ] 仔细阅读webpack中plugin的一些知识。包括复习`compiler`和`compliation`,以及大致看一下常用的钩子时机，比如`emit`

- [ ] SourceMap几种常用模式在文档中的解读
    `eval`: 使用eval的方式嵌入sourcemap文件路径
    `eval-source-map`: 使用eval方式并且生成了单独的sourcemap文件
    `cheap-eval-source-map`: 阉割版的上者，只能显示错误的行，无法显示错误的列 
    `cheap-module-eval-source-map`: 带了`module`的模式可以展示被loader处理前的文件，不带的会处展示处理后的
    `inline-source-map`: 会把sourcemap路径转成data url
    `hidden-source-map`: 无法直接看到sourcemap的效果。开发第三发包可用
    `nosources-source-map`: 在浏览器开发者工具可隐藏掉源文件内容
    
- [ ] 看一下HMR的hot API文档，以及在框架中的处理（比如vue和react的hmr如何保存状态）

- [ ] tree shaking原理。结合打包文件bundle.js的结构，以及webpack的模块函数`__webpack.require__`去研究一下

- [ ] 看下husky对`.git/hooks`的修改原理
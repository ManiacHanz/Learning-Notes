
## vue响应式

### 不同版本间的差异

按照模块和完整度两个维度解析
完整度：带模板编译器和不带
模块： UMD(通用模块，支持多种模块，包括AMD CMD browser等);CommonJS;ESM。ESM的优势在于可以被静态分析，方便在编译的时候进行tree-shaking

### 找入口

从package.json开始，找运行文件，然后找配置文件，然后找到入口文件

### vscode 插件 支持flowtype,ts等语法高亮

bable javascript 。失去超链接功能

## vue响应式

### 不同版本间的差异

按照模块和完整度两个维度解析
完整度：带模板编译器和不带
模块： UMD(通用模块，支持多种模块，包括AMD CMD browser等);CommonJS;ESM。ESM的优势在于可以被静态分析，方便在编译的时候进行tree-shaking

### 找入口

从package.json开始，找运行文件，然后找配置文件，然后找到入口文件

### vscode 插件 支持flowtype,ts等语法高亮

bable javascript 。失去超链接功能

### element.outerHTML

 element  DOM接口的outerHTML属性获取描述元素（包括其后代）的序列化HTML片段。它也可以设置为用从给定字符串解析的节点替换元素。
[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/outerHTML  )

### Observer

给每个对象或数组递归添加getter和setter
* 依赖收集  添加到dep
* 派发更新  发送notify

如果一个值的已经是描述对象，并且configurable === flase，那么vue不会给这个值添加响应式


### Dep.target

在响应式的getter处理中，通过Dep.target的开关来控制，拒绝不可控的访问时也会收集依赖。因为Dep在逻辑上和Watcher强相关，所以在Watcher中改变赋值Dep.target，然后触发响应式中的getter，即可做到在getter中收集依赖。同时收集完毕后需要及时去掉Dep.target


### 对于数组的处理
/observer/array.js

把Array.prototype中的一些方法变成响应式，调用的时候添加一些“补丁”

* 调用原方法，得到正确的值
* 如果是push unshift splice这些能添加元素的方法，调用ob.observer把这些新增的值变成响应式
* 调用ob.dep.notify手动发送通知改变视图
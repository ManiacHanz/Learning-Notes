
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

不能使用`arr[0] = 1`来响应式修改数据的原因：
vue在处理数组的响应式数据的时候，总共收集了3个地方的依赖
1. 对于数组整体的属性，方便在vm.arr = xx的时候通知
2. 对于数组整体的依赖且修改原型，比如vm.arr.push()发送通知
3. 数组里面的每一项进行observe方法。注意：这里的observe只针对type = Object，如果是简单值会直接返回
但是唯独没有给数组里面每一项的属性，也就是下标添加响应式，所以按照属性去修改的时候就不能发送通知。这点和对象的依赖收集就不同了

### observer中的__ob__是用来判断是不是响应式的标准
ob上3个属性
* vmCount 用于区分根$data。$data = 1其他为0
* dep 用来放置当前响应式数据的依赖。方便之后对于数据修改后手动发送通知
* value 挂载自己。比如`vm.msg === vm.msg.__ob__.value`


### watcher的三种类型和创建/调用顺序
* 计算watcher： computed watcher。最先创建和调用
* 侦听watcher: 用户自定义的watcher。在计算属性后创建和调用
* 渲染watcher: 也就是负责模板-虚拟dom-真实dom的watcher。最后创建和调用

### nextTick
可以理解成vm.$nextTick主要是使用Promise.then(cb)去调用的方法达到实现微任务的目的。其他的只是不同平台和不同浏览器的兼容，没有react的那么复杂

### vDom
检查到传入的tag不是HTML原生标签后，就会去vm.$options上找是否符合注册的组件名称。这里可以看到，vue的组件是挂载全局Vue.$options上的，所以不能同名

### vDom diff

vue里的vdom的diff算法，主要体现在`patch`和`updateChildren`中，整体思路和`snabbdom`差不多，只是判断`sameVNode`的逻辑更多一点，然后多了一步用新节点的key去老节点数组中遍历的步骤。不过这里可以认为vue由于是“精确修改”。所以在小范围内（比如列表）会多次操作dom

vdom中关于属性的修改，是放在虚拟patch函数里的modules块中操作的。就好比是snabbdom里面载入的插件。关于style,class等都会在这个地方修改

### baseCompiler

* parse 遍历html节点，生成AST对象。并且找到的属性，会记录在相应的AST树的属性中
* optimize 标记静态节点。之后diff时可以跳过静态节点。分为两步，第一步标记static属性，第二步根据static标记staticRoot（这里仍然是对每一个node操作）属性
* generator 生成vnode



[源码学习注释地址](https://github.com/ManiacHanz/Vue-learning)
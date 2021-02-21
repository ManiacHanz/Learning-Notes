#### 请简述 React 16 版本中初始渲染的流程

首先经过babel编译，会把js文件中的jsx编译成React.createElement，让写的类似于html模板的元素转换为js对象。然后在调用ReactDOM.render方法的时候，首先进行初始化。Fiber的初始化包括rootFiber和FiberRootNode，以及他们之间通过current和stateNode建立起来的关系。然后初始化updateQueue属性挂载到fiber属性上，方便后面用来操作。然后开始调和整颗fiber树，通过两个while遍历，改变全局的workInProgress对象，深度优先的模式，构建完整的fiber树结构，以及每个fiber上的stateNode，即dom或组件实例。以上两个阶段都是在浏览器空闲的时候进行，并且可以打断，最后进入commit阶段，根据处理好的fiber上的effectTag及effect链表进行相应的dom操作，最后挂到container上面


#### 为什么 React 16 版本中 render 阶段放弃了使用递归

递归需要完整递进递出的过程，且中途不可打断，在大型结构中或频繁的dom操作中(例如动画等)，容易造成性能瓶颈，影响用户体验


#### 请简述 React 16 版本中 commit 阶段的三个子阶段分别做了什么事情

主要以dom操作中为分界线，分为前中后
dom操作前主要是记录组件状态快照
dom操作中就是对于根据effectTag进行dom操作
dom操作后就是调用dom构建完毕后的生命周期钩子，或者是函数组件中的钩子函数


#### 请简述 workInProgress Fiber 树存在的意义是什么

workInProgress 是一个fiber的备份。主要是为了在内存中完成对于fiber的操作。提高性能，避免对于原fiber对象的修改。在被意外或者优先级更高的任务中断时，也方便状态的回退。

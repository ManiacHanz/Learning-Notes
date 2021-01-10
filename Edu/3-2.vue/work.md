Vue.js 源码剖析-响应式原理、虚拟 DOM、模板编译和组件化

一、简答题

1、请简述 Vue 首次渲染的过程。

答：
* 初始化Vue构造函数
  - initMixin(Vue)
    为Vue的原型上添加_init方法，此方法会在创建Vue实例的时候使用。
  - stateMixin(Vue)
    和数据管理--响应式相关的初始化。处理this.$data访问到this._data。$props同理；挂载Vue原型的$set/$delete/$watch方法
  - eventsMixin(Vue)
    挂载$on/$once/$off/$emit方法
  - lifecycleMixin(Vue)
    挂载_update/$forceUpdate/$destroy方法
  - renderMixin(Vue)
    挂载$nextTick/_render方法。同时会给Vue.prototype上挂载许多render相关的方法，_c _m _s等等的渲染辅助函数
  - $mount。跟平台相关的模板处理，以及$mount渲染方法的挂载，以及render,staticRenderFns的获取
  - 扩展原型渲染相关的函数。包括mountComponent, patch, 以及扩展Vue.config里面的一些属性
  - initGlobalApi。初始化全局Api。有set, delete, nextTick, observable, components, directives, filters等等。还有一些工具函数，都挂载Vue的静态属性上，方便后面调用


* 调用_init函数
   - 定义唯一_uid，已经Vue实例标识_isVue。
   - 区分组件还是根渲染。后者会合并用户的options以及Vue构造函数上的options(在上一步中初始化的，比如component)等
   - 初始化vm实例。包括父子关系的initLifecycle, 父节点事件的initEvents，关于创建dom的_c,$createElement的initRender，还有和Provider/Inject相关的initInjections/initProvide。关于响应式数据的initState
   - 调用beforeCreate以及created生命周期

* initState
   - 和响应式数据的处理相关，这里会处理props, methods, data, computed, watcher
   - 首先会把上面的key都挂在vm实例上，方便取用。这里会做一个重名的判断，以及是否定义正确的判断等等
   - 处理props，首先会进行一些验证，然后把vm._props做成响应式，之后访问props的时候都会从_props上取。
   - 处理data。和props类似，把data挂载vm实例上方便取，但实际取的是_data上的值，同时把_data做成响应式，并且调用observe(data)。把data里的每一项变成响应式的处理。这里主要的方法是defineReactive

* 在_init中最后调用`vm.$mount`函数
   - 这个函数根据平台的不同解析不同的template和render.
   - 然后再调用mountComponent把Vue对象挂载到真是dom容器上
   - mountComponent会先定义updateComponent，然后新建一个Watcher实例。通过响应式机制调用updateComponent渲染dom

* Watcher
   - new Watcher的时候会调用watcher的get方法
   - get方法首先会确定Dep依赖，然后调用传进来的updateComponent方法（首次渲染）
   - 这时候会先调用vm._render。这个函数其实调用$createElement函数把AST树转成Vnode
   - 然后调用vm._update方法。这个方法的核心是__patch__函数。是把vnode转成真实dom并挂载到真实节点上

2、请简述 Vue 响应式原理。

答：Vue的响应式原理核心是利用Object.defineProperty对vm._data或其他数据进行getter和setter的拦截。然后使用观察者模式，对其中需要被监测的数据，进行依赖收集。在数据变化的时候进行通知，让视图发生变化。

* 

* Dep
   - 负责收集watcher实例
   - 在setter中触发实例的notify方法，也就是把收集到的watcher依次调用其中的update方法
   - 静态属性target，用来标记目标，且可以避免非`new Watcher`过程的依赖收集

* Watcher 
   - 必须拥有update方法，负责修改视图。由于使用vnode，这里可能是放入队列中处理
   - new实例的时候，会同步新建dep实例，并放入dep的依赖数组中，方便日后的响应式通知
   - 构造函数中会调用get方法，把传入的渲染方法先调用一遍，保证组件首次渲染
   - 后续收到dep通知后，调用update方法，然后根据视图渲染的情况，处理队列中的视图修改，这里也时候调用的get方法

3、请简述虚拟 DOM 中 Key 的作用和好处。

答：设置key属性可以更大程度的复用dom，减少html的操作量。核心原因是vue在进行`patchVnode`方法的时候，会使用`sameVnode`对虚拟dom进行比较，这里比较的核心的条件之一是`keyA === keyB`。如果两者都为undefined的话，这个条件也成立，在部分情况下造成多余的html操作。比如同样的tag的元素等等

4、请简述 Vue 中模板编译的过程。

答：
* 首先调用的createCompilerCreator，返回接收options的createCompiler函数

* 然后会调用`createCompiler(baseOptions)`，返回`compile, compileToFunctions`两个方法
   - 在这个方法中定义了compile函数，并将其返回。这个函数的作用是调用baseCompile函数, 并将结果返回
   
* 在执行createCompiler的时候，会定义一个`compile`函数，以及调用一个`createCompileToFunctionFn(compile)`函数
   - createCompileToFunctionFn调用主要是为了返回另一个函数，叫做compileToFunctions.
   - createCompileToFunctionFn使用函数柯里化思想把缓存cache以及compile函数闭包起来

* 然后调用`$mount`方法时会调用`compileToFunctions`返回`render, staticRenderFns`挂载到vm.$options上
   - 调用函数compileToFunctions时，会调用闭包的compile函数。
   - 然后这里闭包的compile函数其实是最早createCompiler返回的compile函数。这个函数会调用核心函数`baseCompile`
   - baseCompile函数分3步。1.解析模板变成ast；2.解析属性等优化修改ast;3.根据ast生成字符串方法。返回的ast,render,staticRenderFns会被外层的compile返回到外层
   - 拿到baseCompile返回出来的结果后再把其中的render和staticRenderFn通过new Function的形式转换成匿名函数并返回出来

* 在最外层`$mount`的时候会拿到刚才返回出来的render和staticRender，然后挂载到vm.$options上

* 后面在通过watcher.update（或其他方式）调用到vm._render的时候，其实调用的这里的render，生成了一个vnode这里其实是在vm的上下文中，调用的vm.$createElement方法去把ast转成的vnode

* 接着调用vm._update。会调用__patch__方法，进行diff算法，以及把vnode转换成真实dom并挂载到真实dom上
   


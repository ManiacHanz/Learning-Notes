jsx是javascript的语法糖，会转换为React.createElement函数

* .babelrc中修改pragma配置，指定为自定义的createElement方法
  [babel配置文档](https://www.babeljs.cn/docs/babel-preset-react#pragma)
  这里的`pragma`配置的第一代表`替换编译jsx表达式时使用的函数`。**这个配置是属于`@babel/preset-react`插件的选项参数。**

* react中判断是函数式组件还是class组件是通过类上面的标记
  ```js
  Component.prototype.isReactComponent = {};

  function shouldConstruct(Component: Function) {
  const prototype = Component.prototype;
  return !!(prototype && prototype.isReactComponent);
  }

  export function isSimpleFunctionComponent(type: any) {
    return (
      typeof type === 'function' &&
      !shouldConstruct(type) &&
      type.defaultProps === undefined
    );
  }
  ```

  class组件的实例的`render`方法是在react-reconciler/ReactFiberBeginWork.js里的`finishClassComponent`中调用的，这一步就是得到组件的虚拟dom树
  ```js
  nextChildren = instance.render();
  ```

* 类的继承后this的指向

  ```js
  class Parent{
    constructor(){
        this.name = 'parent'
    }

    say(){
        
        console.log(this.name)

        console.log(this)
    }
  };

  class Child extends Parent {
      constructor(){
          super()
          this.name = 'child'
          // 注意这里由于是child的实例访问，所以这里的this都指向的child实例
          this.say()
      }
  };
  ```

* webpack-node-externals
  webpack-node-externals[仓库](https://github.com/liady/webpack-node-externals)
  这个插件用来阻止webpack打包时打包node_modules里面的依赖。通常用在给server端打包

  使用
  ```js
  const nodeExternals = require('webpack-node-externals');
  ...
  module.exports = {
      ...
      target: 'node', // in order to ignore built-in modules like path, fs, etc.
      externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
      ...
  };
  ```

* npm-run-all
  [仓库](https://www.npmjs.com/package/npm-run-all)
  用来并行或串行执行多个npm命令的包。并且可以用`*`来指代多条命令。比如`build:*`就指代以`build:`开头的所有命令
  - npm-run-all
  - run-s
  - run-p

* 解释Fiber
  react@16以前采用的递归遍历实现diff，也叫`stack`，因为使用的js的“栈”的概念。在组件树特别大的情况下，这个算法会占用线程，造成卡顿
  所谓Fiber就是“纤维”。把diff的过程拆分成小颗粒任务。放弃递归只采用循环，因为循环可以被打断，而递归需要“递进和递出”。Fiber就是为了这个方案来实现的。（中断的vdom的比对）

* stateNode
  普通节点类型的fiber，存储节点对应的dom对象
  组件类型的fiber，存储节点对应的实例对象

* 调试源码
  通过使用`webpack``alias`别名，把node_modules的引用改成外部的clone下来的包的引用
  忽略flow类型检查：使用`@babel/plugin-transform-flow-strip-types`插件来处理。[babel文档](https://babeljs.io/docs/en/babel-plugin-transform-flow-strip-types)。可以直接去掉代码中的flow

* %s
  常用语调试，或报错，替代变量。可用的还有%d
  ```js
  console.log('%s:123', 'abc') => console.log('abc:123')
  ```

* 链表和数组
  链表在内存上不需要连续的内存空间，在增删上只需要修改指针，效率高于数组。在查询时会更慢，只能遍历。可以动态改变链表的空间大小

* 双缓存技术
  在内存中计算构建，然后直接替换到dom
  react的alternate，即workInProgress就是用这种技术，在内存中先把需要的更新计算出来，然后直接替换

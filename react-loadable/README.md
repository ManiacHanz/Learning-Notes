
# React-loadable (v5.5.0) 源码浅析

[仓库地址](https://github.com/jamiebuilds/react-loadable)

**Topics**

* `import()` 引入方法返回的是一个`Promise`，通过这个`Promise`的状态来决定渲染`Loading`还是`Component`是核心代码
* `webpack`碰到 `import()` 会自动执行代码分离
* `React.createElement()`是这个库里懒加载组件时用的核心api

接下来进入正文

先放一个使用的例子，免得后面用的时候忘了

```js
import Loadable from 'react-loadable';
import Loading from './my-loading-component';

const LoadableComponent = Loadable({
  loader: () => import('./my-component'),
  loading: Loading,
});

export default class App extends React.Component {
  render() {
    return <LoadableComponent/>;
  }
}
```

导出的是`Loadable`，平时使用方法也是`Loadable()`，我们直接找到这个方法

```js
function Loadable(opts) {
  return createLoadableComponent(load, opts);
}
module.exports = Loadable;
```

可以看到，`Loadable`是传入一个`opts`配置文件，然后返回一个`createLoadableComponent`。这是`Loadable`的核心

`createLoadableComponent`作为一个高阶组件，首先先和默认配置文件合并（常规操作），并且声明了一个`res`对象作为判断依据。最后返回了一个`React Component`，按照`loading`状态和`error`状态分别可以渲染一个`Loading`组件、导入组件以及空。
所以这个库的逻辑很简单，就是依赖`promise`，决定渲染什么组件

```jsx
function createLoadableComponent(loadFn, options) {
  if (!options.loading) {
    throw new Error("react-loadable requires a `loading` component");
  }

  let opts = Object.assign(
    {
      loader: null,
      loading: null,
      delay: 200,
      timeout: null,
      render: render,
      webpack: null,
      modules: null
    },
    options
  );

  // ...

  return class LoadableComponent extends React.Component {
    constructor(props) {
      super(props);
      init();

      this.state = {
        error: res.error,
        pastDelay: false,
        timedOut: false,
        loading: res.loading,
        loaded: res.loaded
      };
    }

    // ...

    render() {
      if (this.state.loading || this.state.error) {
        return React.createElement(opts.loading, {
          isLoading: this.state.loading,
          pastDelay: this.state.pastDelay,
          timedOut: this.state.timedOut,
          error: this.state.error,
          retry: this.retry
        });
      } else if (this.state.loaded) {
        return opts.render(this.state.loaded, this.props);
      } else {
        return null;
      }
    }
  };
}
```

想要更深入细节，我们接着往下看

在`constructor`中有一个初始化函数`init`, 而这里调用的是`loadFn(opts.loader)`。而这里传进来的是一个`func`--`() => import(url)` （暂不考虑SSR和loadMap）

```js
function createLoadableComponent(loadFn, options) {
  // ... opts
  let res = null
  function init() {
    if (!res) {
      res = loadFn(opts.loader);
    }
    return res.promise;
  }
  
  return class LoadableComponent extends React.Component {
    constructor(props) {
      super(props);
      init();

      this.state = {
        error: res.error,
        pastDelay: false,
        timedOut: false,
        loading: res.loading,
        loaded: res.loaded
      };
    }

    // 手动预加载其实就是执行了一次init()函数，改变状态
    static preload() {
      return init();
    }

  }
}
```

所以我们要看一下这个`loadFn`是何方神圣，才知道`res`是什么
其实根据`import promise`的状态就是给空的`res`几个属性值，通过这几个值来`setState`，进而来控制`render`的内容

```js
// res = load( () => import() )

function load(loader) {
  // 这个就是import()返回的promise
  let promise = loader();
  // 初始化一个对象
  let state = {
    loading: true,
    loaded: null,
    error: null
  };
  // 在上面挂了一个promise属性
  state.promise = promise
    // resolve成功
    .then(loaded => {
      state.loading = false;
      state.loaded = loaded;
      return loaded;
    })
    // 失败 爆出一个error 并挂上一个error
    .catch(err => {
      state.loading = false;
      state.error = err;
      throw err;
    });

  return state;
}
```

经过了`constructor`以后，会进入`componentWillMount`生命周期（不知道在react v17.0)以后这里会怎么改

```jsx
componentWillMount() {
  // 改变了一个属性值，可以想象挂在this上的就是一个开关
  this._mounted = true;
  // 执行了一次 _loadModule ，想象的话可能和Init的逻辑差不太多。往下看
  this._loadModule();
}

_loadModule() {
  // SSR渲染需要的modules  略过
  if (this.context.loadable && Array.isArray(opts.modules)) {
    opts.modules.forEach(moduleName => {
      this.context.loadable.report(moduleName);
    });
  }
  // 如果import() resolve了 就不需要下面的逻辑了
  if (!res.loading) {
    return;
  }
  // 判断是否需要delay
  if (typeof opts.delay === "number") {
    if (opts.delay === 0) {
      this.setState({ pastDelay: true });
    } else {
      this._delay = setTimeout(() => {
        this.setState({ pastDelay: true });
      }, opts.delay);
    }
  }
  // 判断是否有timeout超时属性
  if (typeof opts.timeout === "number") {
    this._timeout = setTimeout(() => {
      this.setState({ timedOut: true });
    }, opts.timeout);
  }
  // promise从pending状态改变后执行
  let update = () => {
    // 如果还没执行过 willmount钩子  return
    if (!this._mounted) {
      return;
    }
    // 这里就是核心 根据promise的结果改变这个res
    this.setState({
      error: res.error,
      loaded: res.loaded,
      loading: res.loading
    });

    this._clearTimeouts();
  };

  res.promise
    .then(() => {
      update();
    })
    .catch(err => {
      update();
    });
}
```

还有一个`retry`方法，就是在`import() promise`失败以后可以重新尝试执行的方法
逻辑基本是重复`constructor`和`willMount`里的方法

```js
retry = () => {
  // 要先初始化一下state， 
  this.setState({ error: null, loading: true, timedOut: false });
  res = loadFn(opts.loader);
  this._loadModule();
};
```

最后看一下`render`里面调用的方法
成功后高阶组件会调用下面的`render`方法，其实调用的是`React.createElement`方法，而第一项的`dom`是`import()`成功以后返回的`result`，而引入的组件就是它或者在它的`default`属性上

```js
function resolve(obj) {
  return obj && obj.__esModule ? obj.default : obj;
}

function render(loaded, props) {
  return React.createElement(resolve(loaded), props);
}
```

至此，没有SSR的`react-loadable`源码解析完毕，如果有机会会跟上SSR版本
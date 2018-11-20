
# React-loadable 源码浅析

[仓库地址](https://github.com/jamiebuilds/react-loadable)

**Topics**

* `import()` 引入方法返回的是一个`Promise`，通过这个`Promise`的状态来决定渲染`Loading`还是`Component`是核心代码

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


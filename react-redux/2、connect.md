# connect

### react-redux核心部分，新版本分成了connect.js和connectAdvanced.js两个部分

### 知识点

* `invariant.js` [Github](https://github.com/zertosh/invariant)
  开发环境中用来描述报错信息。第一个参数是 Boolean， 第二个参数是报错信息字符串。当第一个参数为`false`的时候，就会抛出后面的信息

* `hoist-non-react-statics`
  [Github](https://github.com/mridgway/hoist-non-react-statics)
  [React官方](http://www.css88.com/react/docs/higher-order-components.html#static-methods-must-be-copied-over)
  用来复制静态方法




### shallowEqual 
    浅比较方法
```javascript {.line-number}
const hasOwn = Object.prototype.hasOwnProperty

function is(x, y) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y
  } else {
    return x !== x && y !== y
  }
}

export default function shallowEqual(objA, objB) {
  if (is(objA, objB)) return true

  if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) {
    return false
  }

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) return false

  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) ||
        !is(objA[keysA[i]], objB[keysA[i]])) {
      return false
    }
  }

  return true
}
```



```javascript {.line-number}
import connectAdvanced from '../components/connectAdvanced'
import shallowEqual from '../utils/shallowEqual'
import defaultMapDispatchToPropsFactories from './mapDispatchToProps'
import defaultMapStateToPropsFactories from './mapStateToProps'
import defaultMergePropsFactories from './mergeProps'
import defaultSelectorFactory from './selectorFactory'


/*
  下面的match用法可知，factories 是一个 函数组成的数组，这里面的函数 的返回条件 是根据arg的存在与否来返回
  比如： func a (arg) { return arg? func : undefined } ; func b(arg){ return !arg? func: undefined }
  最终只会返回一个func
*/
function match(arg, factories, name) {
  for (let i = factories.length - 1; i >= 0; i--) {
    const result = factories[i](arg)
    if (result) return result
  }

  return (dispatch, options) => {
    throw new Error(`Invalid value of type ${typeof arg} for ${name} argument when connecting component ${options.wrappedComponentName}.`)
  }
}

function strictEqual(a, b) { return a === b }     // 严格比较

export function createConnect({
  connectHOC = connectAdvanced,
  mapStateToPropsFactories = defaultMapStateToPropsFactories,
  mapDispatchToPropsFactories = defaultMapDispatchToPropsFactories,
  mergePropsFactories = defaultMergePropsFactories,
  selectorFactory = defaultSelectorFactory
} = {}) {
  return function connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
    {
      pure = true,
      areStatesEqual = strictEqual,        // 严格比较 
      areOwnPropsEqual = shallowEqual,     // 浅比较
      areStatePropsEqual = shallowEqual,
      areMergedPropsEqual = shallowEqual,
      ...extraOptions                      // 这里面的配置从connectAdvanced去看
    } = {}
  ) {
    // 这3个通过下面的connectHOC传给selectorFactory   即mapStateToProps...
    // 通过match 函数， 判断是否传入真实的 mapStateToProps等参数来返回函数
    const initMapStateToProps = match(mapStateToProps, mapStateToPropsFactories, 'mapStateToProps')
    const initMapDispatchToProps = match(mapDispatchToProps, mapDispatchToPropsFactories, 'mapDispatchToProps')
    const initMergeProps = match(mergeProps, mergePropsFactories, 'mergeProps')

    // connectAdvanced()    就是包过的Connect
    return connectHOC(selectorFactory, {
      methodName: 'connect',

      getDisplayName: name => `Connect(${name})`,

      // 根据后面的传入mapStateToProps 是否监听store state， 如果不传就不监听
      shouldHandleStateChanges: Boolean(mapStateToProps),

      // 传个selectorFactory的参数
      initMapStateToProps,
      initMapDispatchToProps,
      initMergeProps,
      pure,
      areStatesEqual,
      areOwnPropsEqual,
      areStatePropsEqual,
      areMergedPropsEqual,

      ...extraOptions
    })
  }
}

export default createConnect()
// ==>  connect( mapStateToProps,mapDispatchToProps, mergeProps, option={} )(selectorFactory)
```

`mergeProps` 也是一个函数，用来筛选出哪些参数传递给组件。默认的情况是3个参数 `stateProps` , `dispatchProps`,`parentProps`。 
`stateProps` 是 `mapStateToProps` 的返回值， `dispatchProps` 是 `mapDispatchToProps` 的返回值，`parentProps` 是当前组件自己的属性。 
这个函数的作用就是把这三个返回值拼装起来返回给组件，所以我们写 `connect(mapStateToProps, mapDispatchToProps)()` 的时候会把这些传过去，如果需要修改过滤，就可以用这个第三个参数修改过滤

> mergeProps.js

```js
export function defaultMergeProps(stateProps, dispatchProps, ownProps) {
  return { ...ownProps, ...stateProps, ...dispatchProps }
}
```
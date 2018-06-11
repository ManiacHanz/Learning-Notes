# 核心

### selectorFactory 从 selectorFactory 里引进来


先梳理一下这个的条理，大致就是把 `WrappedComponent` 的静态属性与 `Connect` 这个组件合并后返回出来，和在 `Connect` 中有 `getChildContext` 等函数用来绑定 `store` 等。 具体的 `Connect` 我们后面分析。这里先了解一下这个函数的大体结构
```js
export default function connectAdvanced(selectorFactory, options ){
  return function wrapWithConnect(WrappedComponent){
    class Connect extends React.Components {

    }

    return hoistStatics(Connect, WrappedComponent)
  }
}
```

然后我们在加一点，这里又要重复一个知识点，就是 `context` 
再祖先组件（`context`提供者）中需要声明2点  `getChildContext` 来传递 以及 `childContextTypes`规定类型
而在子组件（`context`接受者）中定义一点  `contextTypes` ，就可以访问属性。如果没有定义，访问的 `context` 为空

`react-redux` 之所以可以全部通过 `Provider` 让子组件中的所有组件都访问到 `store` ，并订阅更新，核心就是利用 `context` 

```js
export default function connectAdvanced(selectorFactory, option) {
  // ...

  // 获取context
  const contextTypes = {
    [storeKey]: storeShape,
    [subscriptionKey]: subscriptionShape,
  }
  // 传递context
  const childContextTypes = {
    [subscriptionKey]: subscriptionShape,
  }

  return function wrapWithConnect(WrappedComponent) {
    
    const wrappedComponentName = WrappedComponent.displayName
      || WrappedComponent.name
      || 'Component'

    const displayName = getDisplayName(wrappedComponentName)

    class Connect extends Component {
      //...
      Connect.WrappedComponent = WrappedComponent
      Connect.displayName = displayName
      // 这里其实就是 context 的魔法
      Connect.childContextTypes = childContextTypes
      Connect.contextTypes = contextTypes
      Connect.propTypes = contextTypes
      //...

    }

    // hoistStatics 见2. 理解成Object.assign 把后面的WrappedComponent的静态方法复制到Connect组件上并返回
    return hoistStatics(Connect, WrappedComponent)
  }
}
```

如果想知道 `contextTypes` 和 `childContextTypes` 代表什么

```js
//  utils/proptypes
export const subscriptionShape = PropTypes.shape({
  trySubscribe: PropTypes.func.isRequired,
  tryUnsubscribe: PropTypes.func.isRequired,
  notifyNestedSubs: PropTypes.func.isRequired,
  isSubscribed: PropTypes.func.isRequired,
})

export const storeShape = PropTypes.shape({
  subscribe: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  getState: PropTypes.func.isRequired
})

```


``` javascript {.line-number}
export default function connectAdvanced(
  
  selectorFactory,
  {
    // 用来从wrapper的组件的displayName计算HOC的displayName
    getDisplayName = name => `ConnectAdvanced(${name})`,
    // 用来报错信息中展示的  可能被覆写
    methodName = 'connectAdvanced',
    // 如果定义 用来记录render的次数，用来给react-devtools记录不必须的re-render
    renderCountProp = undefined,
    // 定义HOC 是否订阅store的变化
    shouldHandleStateChanges = true,
    // 获取store的 key, 在多个store的时候才会用到（基本没有）
    storeKey = 'store',
    // 如果定义 通过getWrappedInstance()把包裹的元素暴露给HOC，就是通过getWrappedInstance()获取实例
    withRef = false,

    ...connectOptions
  } = {}
) {
  // 获取发布订阅器的key??
  const subscriptionKey = storeKey + 'Subscription'
  const version = hotReloadingVersion++

  const contextTypes = {
    [storeKey]: storeShape,
    [subscriptionKey]: subscriptionShape,
  }
  const childContextTypes = {
    [subscriptionKey]: subscriptionShape,
  }

  return function wrapWithConnect(WrappedComponent) {
    // 排错
    invariant(
      typeof WrappedComponent == 'function',
      `You must pass a component to the function returned by ` +
      `${methodName}. Instead received ${JSON.stringify(WrappedComponent)}`
    )

    const wrappedComponentName = WrappedComponent.displayName
      || WrappedComponent.name
      || 'Component'

    const displayName = getDisplayName(wrappedComponentName)

    const selectorFactoryOptions = {
      ...connectOptions,
      getDisplayName,
      methodName,
      renderCountProp,
      shouldHandleStateChanges,
      storeKey,
      withRef,
      displayName,
      wrappedComponentName,
      WrappedComponent
    }

    class Connect extends Component {
      // 这个才是真正的Connect Hoc 后面分析
    }

    // hoistStatics 见2. 理解成Object.assign 把后面的WrappedComponent的静态方法复制到Connect组件上并返回
    return hoistStatics(Connect, WrappedComponent)
  }
}

```

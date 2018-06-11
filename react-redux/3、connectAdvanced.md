# 核心

### selectorFactory 从 selectorFactory 里引进来

### 知识点

* createElement(Component, props) [文档](http://www.css88.com/react/docs/react-without-jsx.html)
  在jsx里等同于
  ```jsx
  <Component {...props} />
  ```

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
      // 获取了 dispatch、getState、subscribe 的关键
      Connect.contextTypes = contextTypes
      Connect.propTypes = contextTypes
      //...

    }

    // hoistStatics 见2. 理解成Object.assign 把后面的WrappedComponent的静态方法复制到Connect组件上并返回
    return hoistStatics(Connect, WrappedComponent)
  }
}
```

如果想知道 `contextTypes` 和 `childContextTypes` 代表什么，以下
↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
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

还剩一点准备工作了，大概介绍一点各个变量的意义。这里可以顺便看到返回的 `wrapWithConnect` 函数，其主要作用就是给 `selectorFactory` 定制一个参数 `selectorFactoryOptions`

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
    // 定义HOC 是否订阅store的变化 。后面可知，如果mapStateToProps为空，这里会改成false
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
    
    const wrappedComponentName = WrappedComponent.displayName
      || WrappedComponent.name
      || 'Component'

    const displayName = getDisplayName(wrappedComponentName)

    // 用于给初始化 selectorFactory 的参数
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

接下来就是核心的 `Connect` 组件

```js
class Connect extends Component {
  constructor(props, context) {
    super(props, context)

    this.version = version
    this.state = {}
    this.renderCount = 0
    this.store = props[storeKey] || context[storeKey]
    this.propsMode = Boolean(props[storeKey])
    this.setWrappedInstance = this.setWrappedInstance.bind(this)

    invariant(this.store,
      `Could not find "${storeKey}" in either the context or props of ` +
      `"${displayName}". Either wrap the root component in a <Provider>, ` +
      `or explicitly pass "${storeKey}" as a prop to "${displayName}".`
    )

    this.initSelector()
    this.initSubscription()
  }

  getChildContext() {
    // If this component received store from props, its subscription should be transparent
    // to any descendants receiving store+subscription from context; it passes along
    // subscription passed to it. Otherwise, it shadows the parent subscription, which allows
    // Connect to control ordering of notifications to flow top-down.
    const subscription = this.propsMode ? null : this.subscription
    return { [subscriptionKey]: subscription || this.context[subscriptionKey] }
  }

  componentDidMount() {
    if (!shouldHandleStateChanges) return

    // componentWillMount fires during server side rendering, but componentDidMount and
    // componentWillUnmount do not. Because of this, trySubscribe happens during ...didMount.
    // Otherwise, unsubscription would never take place during SSR, causing a memory leak.
    // To handle the case where a child component may have triggered a state change by
    // dispatching an action in its componentWillMount, we have to re-run the select and maybe
    // re-render.
    this.subscription.trySubscribe()
    this.selector.run(this.props)
    if (this.selector.shouldComponentUpdate) this.forceUpdate()
  }

  componentWillReceiveProps(nextProps) {
    this.selector.run(nextProps)
  }

  shouldComponentUpdate() {
    return this.selector.shouldComponentUpdate
  }

  componentWillUnmount() {
    if (this.subscription) this.subscription.tryUnsubscribe()
    this.subscription = null
    this.notifyNestedSubs = noop
    this.store = null
    this.selector.run = noop
    this.selector.shouldComponentUpdate = false
  }

  getWrappedInstance() {
    invariant(withRef,
      `To access the wrapped instance, you need to specify ` +
      `{ withRef: true } in the options argument of the ${methodName}() call.`
    )
    return this.wrappedInstance
  }

  setWrappedInstance(ref) {
    this.wrappedInstance = ref
  }

  initSelector() {
    const sourceSelector = selectorFactory(this.store.dispatch, selectorFactoryOptions)
    this.selector = makeSelectorStateful(sourceSelector, this.store)
    this.selector.run(this.props)
  }

  initSubscription() {
    if (!shouldHandleStateChanges) return

    // parentSub's source should match where store came from: props vs. context. A component
    // connected to the store via props shouldn't use subscription from context, or vice versa.
    const parentSub = (this.propsMode ? this.props : this.context)[subscriptionKey]
    this.subscription = new Subscription(this.store, parentSub, this.onStateChange.bind(this))

    // `notifyNestedSubs` is duplicated to handle the case where the component is  unmounted in
    // the middle of the notification loop, where `this.subscription` will then be null. An
    // extra null check every change can be avoided by copying the method onto `this` and then
    // replacing it with a no-op on unmount. This can probably be avoided if Subscription's
    // listeners logic is changed to not call listeners that have been unsubscribed in the
    // middle of the notification loop.
    this.notifyNestedSubs = this.subscription.notifyNestedSubs.bind(this.subscription)
  }

  onStateChange() {
    this.selector.run(this.props)

    if (!this.selector.shouldComponentUpdate) {
      this.notifyNestedSubs()
    } else {
      this.componentDidUpdate = this.notifyNestedSubsOnComponentDidUpdate
      this.setState(dummyState)
    }
  }

  notifyNestedSubsOnComponentDidUpdate() {
    // `componentDidUpdate` is conditionally implemented when `onStateChange` determines it
    // needs to notify nested subs. Once called, it unimplements itself until further state
    // changes occur. Doing it this way vs having a permanent `componentDidUpdate` that does
    // a boolean check every time avoids an extra method call most of the time, resulting
    // in some perf boost.
    this.componentDidUpdate = undefined
    this.notifyNestedSubs()
  }

  isSubscribed() {
    return Boolean(this.subscription) && this.subscription.isSubscribed()
  }

  addExtraProps(props) {
    if (!withRef && !renderCountProp && !(this.propsMode && this.subscription)) return props
    // make a shallow copy so that fields added don't leak to the original selector.
    // this is especially important for 'ref' since that's a reference back to the component
    // instance. a singleton memoized selector would then be holding a reference to the
    // instance, preventing the instance from being garbage collected, and that would be bad
    const withExtras = { ...props }
    if (withRef) withExtras.ref = this.setWrappedInstance
    if (renderCountProp) withExtras[renderCountProp] = this.renderCount++
    if (this.propsMode && this.subscription) withExtras[subscriptionKey] = this.subscription
    return withExtras
  }

  render() {
    const selector = this.selector
    selector.shouldComponentUpdate = false

    if (selector.error) {
      throw selector.error
    } else {
      return createElement(WrappedComponent, this.addExtraProps(selector.props))
    }
  }
}

```

先看 `render`.
可以看出是通过 最后返回的是一个 `<WrappedComponent {...props}/>`  而这个 `props` 是通过 `addExtraProps` 这个函数加强过的

```js
render() {
  const selector = this.selector
  selector.shouldComponentUpdate = false

  if (selector.error) {
    throw selector.error
  } else {
    return createElement(WrappedComponent, this.addExtraProps(selector.props))
  }
}
```

那我们来找找 `this.selector` 是什么

```js
constructor(props, context) {
  super(props, context)

  this.version = version
  this.state = {}
  this.renderCount = 0
  this.store = props[storeKey] || context[storeKey]
  this.propsMode = Boolean(props[storeKey])
  this.setWrappedInstance = this.setWrappedInstance.bind(this)

  invariant(this.store,
    `Could not find "${storeKey}" in either the context or props of ` +
    `"${displayName}". Either wrap the root component in a <Provider>, ` +
    `or explicitly pass "${storeKey}" as a prop to "${displayName}".`
  )

  this.initSelector()
  this.initSubscription()
}
```

在 `constructor` 里没找到 `this.selector` 但是有 `initSeletor()` 方法，答案应该在这里了

```js
initSelector() {
  const sourceSelector = selectorFactory(this.store.dispatch, selectorFactoryOptions)
  this.selector = makeSelectorStateful(sourceSelector, this.store)
  this.selector.run(this.props)
}

```

至于 `selectorFactory` 这里只需要知道 传进去的是 `store` 里的 `dispatch` 和高阶函数里处理过的 `selectorFactoryOptions`，会返回一个普通的对象 `{...ownProps, ...stateProps, ...dispatchProps}` ，也就是说这里会把 `mergeProps` 过的属性传给被包裹的组件，并且注意 `stateProps` 会覆盖掉 父组件来的 `ownProps`。
**这里也就是说同名的条件下 dispatch 覆盖 store 覆盖 props**


```js
function makeSelectorStateful(sourceSelector, store) {
  // wrap the selector in an object that tracks its results between runs.
  const selector = {
    run: function runComponentSelector(props) {
      try {
        const nextProps = sourceSelector(store.getState(), props)
        if (nextProps !== selector.props || selector.error) {
          selector.shouldComponentUpdate = true
          selector.props = nextProps
          selector.error = null
        }
      } catch (error) {
        selector.shouldComponentUpdate = true
        selector.error = error
      }
    }
  }

  return selector
}
```
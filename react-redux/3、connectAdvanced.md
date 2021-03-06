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

这个 `addExtraProps` 简单的说，就是字面上的意思，在某种情况下给 `props` 加一些属性

```js
addExtraProps(props) {
  if (!withRef && !renderCountProp && !(this.propsMode && this.subscription)) return props
  // make a shallow copy so that fields added don't leak to the original selector.
  // this is especially important for 'ref' since that's a reference back to the component
  // instance. a singleton memoized selector would then be holding a reference to the
  // instance, preventing the instance from being garbage collected, and that would be bad
  // 给props做一个浅拷贝，这样添加的字段不会泄露给原始的selector -- 应该是指没有connect前的组件--
  // 由于 'ref' 是对组件实例的一个引用， 所以这点特别重要
  // 一个单例缓存的选择器会保持对这个实例的引用，来防止这个实例被垃圾回收机制回收
  const withExtras = { ...props }
  // ref 引用
  if (withRef) withExtras.ref = this.setWrappedInstance
  // 给devtool记录渲染次数
  if (renderCountProp) withExtras[renderCountProp] = this.renderCount++
  // initSubscription 里生成的类
  if (this.propsMode && this.subscription) withExtras[subscriptionKey] = this.subscription
  return withExtras
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
  // 执行sourceSelector ，并添加 shouldComponentUpdate和error 增加代码健壮性
  this.selector.run(this.props)
}

```

至于 `selectorFactory` 这里只需要知道 传进去的是 `store` 里的 `dispatch` 和高阶函数里处理过的 `selectorFactoryOptions`，（缺省，现在暂且这么认为）会返回一个普通的对象 `{...ownProps, ...stateProps, ...dispatchProps}` ，也就是说这里会把 `mergeProps` 过的属性传给被包裹的组件，并且注意 `stateProps` 会覆盖掉 父组件来的 `ownProps`。
**这里也就是说同名的条件下 `dispatch` 覆盖 `store` 覆盖 `props`**

第一次声明 `this.selector` 属性是用的 `makeSelectorStateful` 的方法，我们来看一下

```js
function makeSelectorStateful(sourceSelector, store) {
  // wrap the selector in an object that tracks its results between runs
  // 根据这个注释可以看出来，其实为了代码健壮性给 sourceSelector 包装了一下，然后在运行.
  const selector = {
    run: function runComponentSelector(props) {
      try {
        // nextProps是一个普通的对象
        const nextProps = sourceSelector(store.getState(), props)
        if (nextProps !== selector.props || selector.error) {
          // 对比直接在 initSelector 里面直接运行，添加了一个 shouldComponentUpdate 和 error
          // shouldComponentUpdate来记录组件是否应该更新，如果对象变了（引用对比），就会更新
          // 如果返回的同一个对象， 就不会更新组件
          selector.shouldComponentUpdate = true
          // 用.props做成缓存，方便下次对边
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

这里挂在的 `shouldComponentUpdate` 开关很重要，后面许多判断组件是否应该更新，已经使用 `this.forceUpdate()` 的地方都用的这个属性进行的判断。也就是说，当返回的对象，和缓存里的 `.props` 相同的时候，就不会更新组件

还记得 `sourceSelector` 是调用的 `selectorFactory` 初始化出来的变量吗？ `sourceSelector` 是返回回来的一个 `func` 接收两个参数 一个是 `state` 一个是 `ownProps` 。下面我放上默认的一种简单的返回的函数，方便理解

```js

export function impureFinalPropsSelectorFactory(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
  dispatch
) {
  //  可以把这个地方理解成 sourceSelector 。而默认的 mergeProps 就是返回的 {...ownProps, ...state, ...dispatch}
  return function impureFinalPropsSelector(state, ownProps) {
    return mergeProps(
      mapStateToProps(state, ownProps),
      mapDispatchToProps(dispatch, ownProps),
      ownProps
    )
  }
}
```


接着来看 `constructor` 里的另外一个初始化函数 `initSubscription`
*下面的东西有点复杂，感觉很多东西理解有误*

```js
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
```

这段代码看着短，但是信息量不小，尤其还有一个类 `Subscription` 。一句一句来分析

`shouldHandleStateChanges` 代表是否传入了`mapStateToProps`，就是 `connect(mapStateToProps)`
判断这个的值是通过 **connect.js** 里面的 `Boolean(mapStateToProps)` 来判断的 
注意  `Boolean({}) => true`

```js
  if (!shouldHandleStateChanges) return
```


```js
  const parentSub = (this.propsMode ? this.props : this.context)[subscriptionKey]
```

像我这种记性差的程序猿，大概要复习一下 `this.propMode`，这里其实就是区分 `store` 的 `key` 值，是从 `props` 里获得的还是 `context` 获得的。
> 这里从 `context` 获得 `store` `key` 的情景暂时没遇到过，网上说是在区分单个 `store` 和 多个 `store`。遇到的时候过来补充

```js
  constructor(props){
    //...
    this.propsMode = Boolean(props[storeKey])
  }
```

那么 `parentSub` 大部分情况下都是等于 `this.props[subscriptionKey]`
再来看 `new Subscription()` 的第三个参数 `onStateChange`

```js
onStateChange() {
  this.selector.run(this.props)

  if (!this.selector.shouldComponentUpdate) {
    this.notifyNestedSubs()
  } else {
    this.componentDidUpdate = this.notifyNestedSubsOnComponentDidUpdate
    this.setState(dummyState)
  }
}
```

第一行是执行以下 `run` 函数，也就是返回那3个 `props` 的对象。后面的判断用到了前面写过的在`initSelector`里挂载的 `shouldComponentUpdate` 属性。当*不更新*时，调用的一个方法 `notifyNestedSubs` , 而需要更新时，会赋值另一个方法，并且通过设置 `this.setState({})` 来更新组件

回到 `initSubscription` 分析最后一句

```js
  // `notifyNestedSubs` is duplicated to handle the case where the component is  unmounted in
  // the middle of the notification loop, where `this.subscription` will then be null. An
  // extra null check every change can be avoided by copying the method onto `this` and then
  // replacing it with a no-op on unmount. This can probably be avoided if Subscription's
  // listeners logic is changed to not call listeners that have been unsubscribed in the
  // middle of the notification loop.
this.notifyNestedSubs = this.subscription.notifyNestedSubs.bind(this.subscription)
```

这一小段，把 `subscription` 中的 `notifyNestedSubs` 方法，复制一份绑定给 `this` 的 `notifyNestedSubs` 属性上。作者给这一句写了大量的注释。大意是说，在 `notification` 循环中，组件可能会被卸载，于是 `this.subscription` 就会变成空，为了避免这种情况，于是用这段，把这个方法复制挂载到 `this` 上，并且在被写在上会用 `no-op` 替换掉。还有一种可能性，就是 `listeners` 不会在循环中不会去调用其他被卸载的 `listener` 
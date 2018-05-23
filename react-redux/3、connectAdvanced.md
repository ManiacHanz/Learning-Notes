# 核心

### selectorFactory 从 selectorFactory 里引进来

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
    // 获取store的 key
    storeKey = 'store',
    // 如果定义 通过getWrappedInstance()把包裹的元素暴露给HOC
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

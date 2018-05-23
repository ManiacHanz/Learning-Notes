# selectorFactory

`selectorFactory`函数返回一个selector函数。根据store/state，展示型组件props，和dispatch计算得出新的props，最后注入容器组件


### 暴露的核心代码

```javascript
// 如果`pure`是true，会返回一个缓存结果的selector，并且当final props没有变更的时候，组件的shouldComponentUpdate会返回false。
// 如果`pure`是false，selector会一直返回一个新的对象，并且shouldComponentUpdate会一直返回true
export default function finalPropsSelectorFactory(dispatch, {
  initMapStateToProps,
  initMapDispatchToProps,
  initMergeProps,
  ...options
}) {
  const mapStateToProps = initMapStateToProps(dispatch, options)
  const mapDispatchToProps = initMapDispatchToProps(dispatch, options)
  const mergeProps = initMergeProps(dispatch, options)

  if (process.env.NODE_ENV !== 'production') {
    // 确认传进来的函数名必须是  mapStateToProps 和mapDispatchToProps
    verifySubselectors(mapStateToProps, mapDispatchToProps, mergeProps, options.displayName)
  }

  //  这里的 options是从 `connectAdvanced`里面来 其实是从 store里面去取，源头在`connect`里面配置了一个`pure` 默认为true。
  const selectorFactory = options.pure
    ? pureFinalPropsSelectorFactory
    : impureFinalPropsSelectorFactory


  // 
  return selectorFactory(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
    dispatch,
    options
  )
}
```


```javascript
// 非纯函数组件  应该是指的容器组件，处理就比较简单
export function impureFinalPropsSelectorFactory(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
  dispatch
) {
  return function impureFinalPropsSelector(state, ownProps) {
    return mergeProps(
      mapStateToProps(state, ownProps),
      mapDispatchToProps(dispatch, ownProps),
      ownProps
    )
  }
}
```


```js
// 纯函数组件   一下 state代表 store的state  props代表展示组件自己的props
export function pureFinalPropsSelectorFactory(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
  dispatch,
  { areStatesEqual, areOwnPropsEqual, areStatePropsEqual }
) {
  let hasRunAtLeastOnce = false
  let state
  let ownProps
  let stateProps
  let dispatchProps
  let mergedProps

  function handleFirstCall(firstState, firstOwnProps) {
    state = firstState
    ownProps = firstOwnProps
    // store state映射到组件的props
    stateProps = mapStateToProps(state, ownProps)
    dispatchProps = mapDispatchToProps(dispatch, ownProps)
    // 合并props 返回合并后的props
    mergedProps = mergeProps(stateProps, dispatchProps, ownProps)
    hasRunAtLeastOnce = true
    return mergedProps
  }

  
  function handleNewPropsAndNewState() {
    stateProps = mapStateToProps(state, ownProps)

    if (mapDispatchToProps.dependsOnOwnProps)
      dispatchProps = mapDispatchToProps(dispatch, ownProps)

    mergedProps = mergeProps(stateProps, dispatchProps, ownProps)
    return mergedProps
  }
  // 只有展示型自身的Props变更
  function handleNewProps() {
    // mapStateToProps 是否依赖于组件本身的props  (来源未知，后面补上)
    if (mapStateToProps.dependsOnOwnProps)
      stateProps = mapStateToProps(state, ownProps)

    if (mapDispatchToProps.dependsOnOwnProps)
      dispatchProps = mapDispatchToProps(dispatch, ownProps)

    mergedProps = mergeProps(stateProps, dispatchProps, ownProps)
    return mergedProps
  }

  function handleNewState() {
    const nextStateProps = mapStateToProps(state, ownProps)
    const statePropsChanged = !areStatePropsEqual(nextStateProps, stateProps)
    stateProps = nextStateProps
    
    if (statePropsChanged)
      mergedProps = mergeProps(stateProps, dispatchProps, ownProps)

    return mergedProps
  }

  function handleSubsequentCalls(nextState, nextOwnProps) {
    // 自身的Props用浅比较  store state用深比较
    // 这里的 areOwnPropsEqual 是前面的 浅比较函数  
    const propsChanged = !areOwnPropsEqual(nextOwnProps, ownProps)
    // 深比较
    const stateChanged = !areStatesEqual(nextState, state)
    state = nextState
    ownProps = nextOwnProps

    // store的state变化还是组件props变化
    if (propsChanged && stateChanged) return handleNewPropsAndNewState()
    if (propsChanged) return handleNewProps()
    if (stateChanged) return handleNewState()
    return mergedProps
  }

  // handleSubsequentCalls变更后合并；handleFirstCall初次调用
  return function pureFinalPropsSelector(nextState, nextOwnProps) {
    return hasRunAtLeastOnce  // 在第一次执行的时候变更
      ? handleSubsequentCalls(nextState, nextOwnProps)
      : handleFirstCall(nextState, nextOwnProps)
  }
}
```

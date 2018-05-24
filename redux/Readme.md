
# index入口文件


> 参考了掘金的这篇[文章](https://juejin.im/entry/594770295c497d006bf426e6)

### 其实就是暴露了5个核心函数，也就是redux提供的核心api
```js
export {
  createStore,
  combineReducers,
  bindActionCreators,
  applyMiddleware,
  compose,
  //...
}

```

### createStore

**使用方法**
```js
export default function createStore( reducers, preloadedState, enhancer ) {
  // 这个函数可以不传初始化state，而直接传middleware
  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState
    preloadedState = undefined
  }
  // ...  一些防错
  // 返回5个主要函数 
  return {
    dispatch,
    subscribe,
    getState,
    replaceReducer,
    [$$observable]: observable
  }
}
```

之后声明了一系列变量， 以及一个功能函数

```js
  let currentReducer = reducer                          // 声明 当前的reducer
  let currentState = preloadedState                     // 声明 当前的state
  let currentListeners = []                             // 声明 当前的监听函数队列
  let nextListeners = currentListeners                  // 声明 下次的监听函数队列
  let isDispatching = false                             // 声明 是否正在dispatching

  // 这个函数 就是把当前的函数队列生成一个副本给nextListeners
  // 从下面的函数能知道 用副本的原因是 如果currentListeners变化的时候正在dispatching 就会收到影响
  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice()
    }
  }
```

#### getState
  简单的返回当前的state
_______

```js
  function getState() {
    if (isDispatching) {
      throw new Error(
        'You may not call store.getState() while the reducer is executing. ' +
          'The reducer has already received the state as an argument. ' +
          'Pass it down from the top reducer instead of reading it from the store.'
      )
    }
    return currentState
  }
```

#### subscribe
  订阅函数 -- 即注册listener，store里面的state改变以后，执行该listener
________
```js
// 传的监听函数进去 返回的注销监听函数
function subscribe(listener) {
  // 防错

  let isSubscribed = true

  // 制作一个副本， 在副本里加入函数
  ensureCanMutateNextListeners()
  nextListeners.push(listener)

  // 返回一个取消订阅函数，把这个函数取消掉
  return function unsubscribe() {
    // 防错...

    isSubscribed = false

    ensureCanMutateNextListeners()
    const index = nextListeners.indexOf(listener)
    nextListeners.splice(index, 1)
  }
}
```

#### dispatch 发布
  唯一触发state改变的函数
  源码这里有很长的一段注释，大概意思是 `reducer` 会被当前的state tree已经传入的 `action` 调用。 返回的值会被认为是新的state tree（让reducer成为纯函数的意思），同时监听函数listeners会被通知到。同时作者表示`dispatch`这里传入的 `action`只能是个普通对象，如果需要异步等等，就自己使用中间件去加强dispatch

```js 
// action参数  一个普通的对象，体现“我要改什么”，必须包括一个'type'属性。
function dispatch(action) {
    if (!isPlainObject(action)) {
      throw new Error(
        'Actions must be plain objects. ' +
          'Use custom middleware for async actions.'
      )
    }

    if (typeof action.type === 'undefined') {
      throw new Error(
        'Actions may not have an undefined "type" property. ' +
          'Have you misspelled a constant?'
      )
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.')
    }

    try {
      // 执行开关，表示执行过程中不能再次执行
      isDispatching = true
      //             执行reducer() 返回新的state tree
      currentState = currentReducer(currentState, action)
    } finally {
      isDispatching = false
    }
    
    // 每次发布时候，更新当前订阅函数。发布的时候再订阅，会把下次订阅的函数从当前函数拷贝一份，防止当前执行发布函数受影响
    const listeners = (currentListeners = nextListeners)
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]
      // 执行listener
      listener()
    }

    return action
  }
```


#### replaceReducer 
  替换当前的reducer函数
```js
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.')
    }

    currentReducer = nextReducer
    // 重新执行一下 
    dispatch({ type: ActionTypes.REPLACE })

    /*
    const ActionTypes = {
      INIT:
        '@@redux/INIT' +
        Math.random()
          .toString(36)
          .substring(7)
          .split('')
          .join('.'),
      REPLACE:
        '@@redux/REPLACE' +
        Math.random()
          .toString(36)
          .substring(7)
          .split('')
          .join('.')
    }
    */
  }
```

#### observable
  配合其他库使用的

  > observable 是为了配合 Rxjs 这样 observable/reactive 库，不久的将来 EMCAScript 可能会支持原生的 observable/reactive 对象

```js
function observable() {
    const outerSubscribe = subscribe
    return {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe(observer) {
        if (typeof observer !== 'object' || observer === null) {
          throw new TypeError('Expected the observer to be an object.')
        }

        function observeState() {
          // observer这个对象 必须有一个next方法
          if (observer.next) {
            observer.next(getState())
          }
        }

        observeState()
        // 将 observeState 当作一个 listener，dispatch 之后自动调用 observer 的 next 方法。
        const unsubscribe = outerSubscribe(observeState)
        return { unsubscribe }
      },

      [$$observable]() {
        return this
      }
    }
  }
```

最后执行以下初始化 `dispatch({ type: ActionTypes.INIT })`

至此 最主要的`createStore`核心结束

_____________
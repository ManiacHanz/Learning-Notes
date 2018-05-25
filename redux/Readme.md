
# index入口文件


> 参考了掘金的这篇[文章](https://juejin.im/entry/594770295c497d006bf426e6)，侵删

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
  // 如果有中间件
  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.')
    }
    // 这一行  决定了 applyMiddleware里的传参方式 往下看 applyMiddleware部分
    return enhancer(createStore)(reducer, preloadedState)
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

### getState
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

### subscribe

  *在react-redux里已经通过connect内部订阅，mapStateToProps*

  订阅函数 -- 每次更新分为两个部分，1、`dispatch`一个`action`通过`reducer`导致数据更新，2、触发一个`listener`导致View更新。`subscribe`的作用就是不需要每次`dispatch`以后都去调用listener。即注册`listener`，`store`里面的`state`改变以后，执行该`listener`(listeners就是可以让View更新的函数，最简单的就是`render`或者是组件的`setState`方法)

  举个[栗子](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_one_basic_usages.html)
```js
const Counter = ({ value }) => (
  <h1>{value}</h1>
);

const render = () => {
  ReactDOM.render(
    <Counter value={store.getState()}/>,
    document.getElementById('root')
  );
};

store.subscribe(render);
render();
```
来看源码
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

### dispatch 发布
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


### replaceReducer 
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

### observable
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

至此 最主要的`createStore`核心结束，剩下的源码都很短啦

_____________


### bindActionCreators

  *如果使用过`Vuex`的话，就可以理解成`...mapMutations`导出来的`mutation`不需要用`store.commit`来触发一样*

  还是举个栗子
```js
// actions.js
function addTodo(text) {
  return {
    type: 'ADD_TODO',
    text
  }
}

function removeTodo(id) {
  return {
    type: 'REMOVE_TODO',
    id
  }
}

const actions = { addTodo, removeTodo }

// App.js
class App extends Component {
  render() {
    const { visibleTodos, visibilityFilter, actions } = this.props
    return (
      <div>
        <AddTodo
          onAddClick={text =>
            actions.addTodo(text)
          }/>
        <TodoList
          todos={visibleTodos}
          onTodoClick={index =>
            actions.completeTodo(index)
          }/>
        <Footer
          filter={visibilityFilter}
          onFilterChange={nextFilter =>
            actions.setVisibilityFilter(nextFilter)
          }/>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch, a) {
  return { actions: bindActionCreators(actions, dispatch) }
}

const FinalApp = connect(select, mapDispatchToProps)(App)

ReactDOM.render(
  <Provider store={createStore(reducer)}>
    <FinalApp />
  </Provider>,
  document.getElementById('app')
)
```

  这个函数的作用，就是把普通的 `action` 就是我们自己定义的，转换成一个报过了`dispatch`的`action`，这样在组件中直接调用这个返回的新的 `action`，而不用去使用`store.dispatch`来调用`action`，这样做的好处是react和redux分离。

```js
function bindActionCreator(actionCreator, dispatch) {
  return function() {
    // 这里要吧原来的actionCreator的参数带进来
    return dispatch(actionCreator.apply(this, arguments))
  }
}
export default function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch)
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error(
      `bindActionCreators expected an object or a function, instead received ${
        actionCreators === null ? 'null' : typeof actionCreators
      }. ` +
        `Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?`
    )
  }
  // 拿到 actionName: addTodo removeTodo
  const keys = Object.keys(actionCreators)
  // 这样最终返回的也只是一个对象
  const boundActionCreators = {}
  for (let i = 0; i < keys.length; i++) {
    // 第一次执行key = addTodo(string)
    const key = keys[i]
    const actionCreator = actionCreators[key]
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch)
    }
  }
  return boundActionCreators
}
```

_____

### combineReducers

  顾名思义，就是把多个 `reducer` 合并到一个 `reducer` 里，并且把他们的结果合并到一个 `state` 里。这也是为什么， `reducer`在 `default`里面需要返回一个 `initState` 

栗子
```js
function a(state, action) {}
function b(state, action) {}

const reducer = combineReducers({
  a,
  b
})
```

源码
```js
export default function combineReducers(reducers) {
  // [a, b]
  const reducerKeys = Object.keys(reducers)
  const finalReducers = {}
  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i]

    if (process.env.NODE_ENV !== 'production') {
      if (typeof reducers[key] === 'undefined') {
        warning(`No reducer provided for key "${key}"`)
      }
    }

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key]
    }
  }
  // [a,b]
  const finalReducerKeys = Object.keys(finalReducers)

  let unexpectedKeyCache
  if (process.env.NODE_ENV !== 'production') {
    unexpectedKeyCache = {}
  }

  let shapeAssertionError
  try {
    // 如果没有给reducer初始化状态，使用默认的initAction来初始化reducer的状态
    assertReducerShape(finalReducers)
  } catch (e) {
    shapeAssertionError = e
  }

  return function combination(state = {}, action) {
    if (shapeAssertionError) {
      throw shapeAssertionError
    }

    if (process.env.NODE_ENV !== 'production') {
      const warningMessage = getUnexpectedStateShapeWarningMessage(
        state,
        finalReducers,
        action,
        unexpectedKeyCache
      )
      if (warningMessage) {
        warning(warningMessage)
      }
    }

    let hasChanged = false
    const nextState = {}
    for (let i = 0; i < finalReducerKeys.length; i++) {
      // a b
      const key = finalReducerKeys[i]
      // 每一个reducer 即 a b代表的函数
      const reducer = finalReducers[key]
      // state['a']  但是不知道这里 state 从哪传进来的,应该是整个状态树？
      const previousStateForKey = state[key]
      // 即 执行 a 这个reducer
      const nextStateForKey = reducer(previousStateForKey, action)
      // reducer不能返回undefined
      if (typeof nextStateForKey === 'undefined') {
        const errorMessage = getUndefinedStateErrorMessage(key, action)
        throw new Error(errorMessage)
      }
      // 新的state['a'] 等于 刚才执行了reducer以后返回来的新对象
      // 这里也就是为什么 reducer是个纯函数，不是在以前的state上面改，而是直接return新对象
      nextState[key] = nextStateForKey
      // 这句话的意思 就是除非所有的 新状态 === 旧状态， hasChanged才会返回false
      // 这里用全===直接比较引用类型，而没有用深比较。也就是只要在reducer里面返回了新对象，而不是直接返回state里都会判断为false，所以default里面必须直接返回state 而不能返回 {...state}
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey
    }
    // 判断返回新状态还是旧状态
    return hasChanged ? nextState : state
  }
}

```

这里可以看到触发一个`action`会走过每一个`reducer`，所以这里留了一个问题，当`state tree`过于庞大时，redux会不会影响性能，[知乎关于此问题](https://www.zhihu.com/question/41904561)。这里暂时留个口子


### compose

  > 这个知识点在于 纯函数 的理解 作者在这用注释解释了这个函数的作用
  >  For example, compose(f, g, h) is identical to doing (...args) => f(g(h(...args))).  
  
  *深入的了解需要去看 **函数式编程** 的知识*

```js
export default function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }
  // 注意 这里是 从右往左执行，也是从后往前执行，这个和纯函数一样
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

```


### applyMiddleware 

  最后一个啦 坚持坚持！ 直接把作者的 注释参数考过来吧 

  > @param {...Function} middlewares The middleware chain to be applied.
  > @returns {Function} A store enhancer applying the middleware.

  关于中间件的代码阅读，需要深刻理解 applyMiddleware的道理借鉴了这个[博客](http://www.cnblogs.com/cloud-/p/7284136.html)
  而关于中间件的参数在这里 [思否](https://segmentfault.com/a/1190000011766686)
  感谢各位大神分享！

```js
export default function applyMiddleware(...middlewares) {
  return createStore => (...args) => {
    // 这里又回到了 createStore的三个参数 (reducers, prevState, enhancers)
    // 请看createStore这一行代码 ↓
    // return enhancer(createStore)(reducer, preloadedState)
    // 所以 applyMiddlewar 的形式其实是 applyMiddleware(...middlewares)(createStore)(reducer, preloadedState)
    const store = createStore(...args)
    let dispatch = () => {
      throw new Error(
        `Dispatching while constructing your middleware is not allowed. ` +
          `Other middleware would not be applied to this dispatch.`
      )
    }
    let chain = []

    // 这就是为什么 中间件 都有getState 和 dispatch
    const middlewareAPI = {
      getState: store.getState,
      // 这就是 把store里面的dispatch赋给这个dispatch
      dispatch: (...args) => dispatch(...args)
    }
    // 给每一个中间件都传递 这个参数
    chain = middlewares.map(middleware => middleware(middlewareAPI))
    // 这个store.dispatch 就是第一个中间件的next
    dispatch = compose(...chain)(store.dispatch)

    // 返回了store里面的几个api  ，但是这里的 dispatch已经被改过了
    return {
      ...store,
      dispatch
    }
  }
}
```


这里吧 redux-thunk[源码]()放上来，作为上面的applyMiddleware的栗子

```js
function createThunkMiddleware(extraArgument) {
  // 1、 store里的两个api
  // 2、 中间件通过next 执行下一个中间件，没有next下一个中间件就不会执行。这个next，其实就是被之前其他的中间件强化过的 dispatch ，并且作为参数传递下去
  // 3、 action 其实就是 dispatch里的那个 action，必须带type的那个action
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
```


**以上就是在下对redux的分析啦，欢迎各位大佬批评指正，也欢迎star！！！**
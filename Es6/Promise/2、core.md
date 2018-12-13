

# core 核心函数用法


这一段不长，主要定义了 `Promise` 构造函数，已经在原型上挂载了 `then`方法

先看一个引用的`npm`包, `asap`. [源码地址](https://github.com/kriskowal/asap)

```js
var asap = require('asap/raw');
```

> This CommonJS package provides an asap module that exports a function that executes a task function as soon as possible.

简而言之，这个包是一个用来处理 `Promise`或者其他异步观察的库，让回调函数尽可能的在下一个 `event loop` 时尽快实现。而`/raw`是单独提出的接口，不同之处在于会在异步抛出异常是，中断事件队列。而不引用`/raw`则不会中断，异常会被推迟。

先看几个工具函数

```js
function noop() {}

var LAST_ERROR = null;
var IS_ERROR = {};

function getThen(obj) {
  try {
    return obj.then;
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}

function tryCallOne(fn, a) {
  try {
    return fn(a);
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}

function tryCallTwo(fn, a, b) {
  try {
    fn(a, b);
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}
```

进入正题，先看下 `Promise`类。定义这个没有做太多操作，主要是赋予一些初始值

```js
function Promise(fn) {
    // 必须通过 new 来使用的报错处理
  if (typeof this !== 'object') {
    throw new TypeError('Promises must be constructed via new');
  }
  // 必须传入 func
  if (typeof fn !== 'function') {
    throw new TypeError('Promise constructor\'s argument is not a function');
  }
  // Promise一共有3个状态 pending，fulfilled，rejected
  // 作者在这里分别赋予 0 , 1 , 2 来控制
  // 同时加了个3 代表 adopted the state of another promise, _value 
  // 采用另一个promise实例的状态
  this._deferredState = 0;
  this._state = 0;
  this._value = null;
  this._deferreds = null;
  // 传的函数是noop时，就不需要执行 doResolve 函数了
  if (fn === noop) return;
  // 核心函数 fn = (resolve, reject) => {}
  doResolve(fn, this);
}
Promise._onHandle = null;
Promise._onReject = null;
Promise._noop = noop;

```

用 `doResolve` 做一些错误的兼容，同时保证 `onFulfilled` 和 `onRejected` 只被调用一次

*不保证异步*

```js
/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, promise) {
  var done = false;
  // tryCallTwo(fn, a, b)    --->  fn(a, b)
  // 使用done的作为开关，保证只执行一次
  // new Promise((resolve, reject) => { doSomething... ; resolve(res)})
  // 这里分流了resolve和 reject
  // 所以这里就是Promise内部的函数作为宏观任务执行的原理
  // fn( resolve => resolve(),  reject => reject() )
  var res = tryCallTwo(fn, function (value) {
    if (done) return;
    done = true;
    resolve(promise, value);
  }, function (reason) {
    if (done) return;
    done = true;
    reject(promise, reason);
  });
  if (!done && res === IS_ERROR) {
    done = true;
    reject(promise, LAST_ERROR);
  }
}
```

`resolve`和`reject`

```js
// self 是 new Promise的实例
// newValue 是 resolve传进来的参数
function resolve(self, newValue) {
  // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
  // 保证不能传进实例本身
  if (newValue === self) {
    return reject(
      self,
      new TypeError('A promise cannot be resolved with itself.')
    );
  }
  if (
    // 传入的对象或者函数
    newValue &&
    (typeof newValue === 'object' || typeof newValue === 'function')
  ) {
    var then = getThen(newValue);
    // newValue如果挂在的then方法是个空对象，就会进入reject方法
    if (then === IS_ERROR) {
      return reject(self, LAST_ERROR);
    }
    if (
      then === self.then &&
      newValue instanceof Promise
    ) {
      // 这里 传进来的 参数是一个Promise实例 ，所以把_state改成 3
      // 代表 adopted the state of another promise, _value 
      self._state = 3;
      self._value = newValue;
      // 这里的函数会让 self = self._value
      finale(self);
      return;
    } else if (typeof then === 'function') {
      // 如果是个函数，就递归调用
      doResolve(then.bind(newValue), self);
      return;
    }
  }
  // state 从 pending 换成 fulfilled
  self._state = 1;
  // 把resolve(newValue) 的值挂在实例的_value属性上 方便统一调用finale
  self._value = newValue;
  finale(self);
}

function reject(self, newValue) {
  // _state换成 rejected
  self._state = 2;
  self._value = newValue;
  if (Promise._onReject) {
    // 也就是说可以统一配置 onReject的方法 
    Promise._onReject(self, newValue);
  }
  finale(self);
}
```

连续来看 `finale` 方法, 是一个通过 `_deferredState` 属性分流执行 `handle` 方法

```js
function finale(self) {
  if (self._deferredState === 1) {
    handle(self, self._deferreds);
    self._deferreds = null;
  }
  if (self._deferredState === 2) {
    for (var i = 0; i < self._deferreds.length; i++) {
      handle(self, self._deferreds[i]);
    }
    self._deferreds = null;
  }
}
```

`handle`就是`Promise`处理的最后一步，先看挂载在`Promise`原型上的 `then` 方法

```js
Promise.prototype.then = function(onFulfilled, onRejected) {
  if (this.constructor !== Promise) {
      // safeThen 方法是兼容 ，保证可以实现链式调用
    return safeThen(this, onFulfilled, onRejected);
  }
  // 给res 挂了一系列_deferredState = 0,_state = 0,_value = null,_deferreds = null方法
  var res = new Promise(noop);
  // 对res进行了处理，再返回出来，成为then的返回值。
  // 具体的操作方法都写在了 Handler 类里
  // 一个普通实例， 把onFulfilled , onRejected, promise都挂在新出来的实例的对应属性上
  // 在把后面的实例挂在前面的这个promise实例的_deferreds的属性上
  handle(this, new Handler(onFulfilled, onRejected, res));
  return res;
};

// 兼容Promise的原型被误修改，而不指向Promise本身的情况
function safeThen(self, onFulfilled, onRejected) {
  return new self.constructor(function (resolve, reject) {
    var res = new Promise(noop);
    res.then(resolve, reject);
    handle(self, new Handler(onFulfilled, onRejected, res));
  });
}
```


```js
// 第一个参数是Promise的实例
function handle(self, deferred) {
  // 3 代表 self._value 是一个promise实例
  // 即 new Promise( (resolve, reject) => {resolve(new Promise() )})
  while (self._state === 3) {
    self = self._value;
  }
  // 兼容一个 Promise 类的全局函数，如果是 reject 会先执行 Promise._onReject
  // 只是这里 _ 起名，同时api上也没看到可以修改这个，不知道这里到底是什么意思，给所有的promise实例统一一个插件一样的东西？
  if (Promise._onHandle) {
    Promise._onHandle(self);
  }
  // _state = 0 代表 pending
  // 只有在.then()的情况下可能会有 === 0 的情况
  // 防止deferred.onFulfilled或者 deferred.onRejected都为空
  // 这里不是太看得懂 这个 _deferredState 和 _deferreds 
  // 只是根据finale方法倒推，当第一次初始化实例时，从0赋值为1 ，之后调用方法是调用单个方法
  // 而从1变成2时，调用方法变成了一个数组
  if (self._state === 0) {
    if (self._deferredState === 0) {
      self._deferredState = 1;
      self._deferreds = deferred;
      return;
    }
    if (self._deferredState === 1) {
      self._deferredState = 2;
      self._deferreds = [self._deferreds, deferred];
      return;
    }
    self._deferreds.push(deferred);
    return;
  }
  handleResolved(self, deferred);
}

function handleResolved(self, deferred) {
  asap(function() {
    // 根据状态去resolve回调或者reject回调
    var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
    // 没传的情况
    if (cb === null) {
      if (self._state === 1) {
        resolve(deferred.promise, self._value);
      } else {
        reject(deferred.promise, self._value);
      }
      return;
    }
    // cb(self._value)
    var ret = tryCallOne(cb, self._value);
    if (ret === IS_ERROR) {
      reject(deferred.promise, LAST_ERROR);
    } else {
      resolve(deferred.promise, ret);
    }
  });
}
// Handler类
function Handler(onFulfilled, onRejected, promise){
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}


```



看昏了没，我自己都写昏了。还是稍微总结一下，试着剔除多余兼容，抽离一下主要功能

先随便写一个 `Promise` 的使用，方便下面总结
```js
const p = new Promise( (resolve, reject) => {
  if( res ){
    resolve(res)
  }else{
    reject(err)
  }
} ).then( (res)=>{}, (err)=>{})
```

源码是写在一起的，这里我分开来分析，第一步 只分析 new Promise 里面能执行的过程精简；第二步在分析.then()里面能执行的东西

先看 new Promise宏观任务, 这里不考虑兼容和报错

```js

function Promise(fn){
  // 状态和值肯定是必须的
  this._state = 0;
  this._value = null;
  // 下面两个好像用不到 ，先放上来
  this._deferreds = null;
  this._deferredState = 0;

  doResolve(fn, this)
}

// 通过doResolve改变状态 分流
// 这里根据上面的小栗子，if就是直接执行 resolve(promise, res)
// else就执行 reject(promise, err)
function doResolve(fn, promise){
  fn( function(value){
    resolve(promise, value)
  }, function(err){
    reject(promise, err)
  })
}
// 简写 resolve 和 reject
// 挂载_state 和 _value 以后就执行 finale(promise)
function resolve(promise, value){
  promise._state = 1
  promise._value = value
  // 这里就结束了，走不到finale里面的两个条件内
  finale(promise)
}
function reject(promise, error){
  promise._state = 2
  promise._value = error
  // 这里就结束了，走不到finale里面的两个条件内
  finale(promise)
}

function finale(promise){
  // 在这里面不对pending状态的promise进行处理，所以new出来的在这里就结束了
  // 以resolve为例，此时 promise 的 _state = 1 , _value = value,
  // 另外两个属性还是初始值 _deferredState = 0, _deferreds = null
}
```

第二步是 .then()方法

```js
// 简化.then()方法
Promise.prototype.then = function(onFulfilled, onRejected) {
  var res = new Promise(noop);
  handle(this, new Handler(onFulfilled, onRejected, res));
  return res;
};

// 所以.then()方法里面 可以传成功和失败两个处理函数
function Handler(onFulfilled, onRejected, promise){
  // 这里的promise是一个只挂了 _state = 0, _deferredState = 0, _value = null, _deffered = null的实例
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}


// 第一个参数是Promise的实例
// 第二个参数是 handler的实例，也就是一个带着onResolve和onReject处理方法的实例
function handle(self, deferred) {
  handleResolved(self, deferred);
}

function handleResolved(self, deferred) {
  // asap的作用是在宏观任务执行后会尽快执行里面的函数
  asap(function() {
    // resolve的话 这里 cb就等于 onFulfilled
    var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      if (self._state === 1) {
        //deferred.promise是 new Promise(noop)
        resolve(deferred.promise, self._value);
      } else {
        reject(deferred.promise, self._value);
      }
      return;
    }
    // ret = cb(self._value)
    // 即ret = cb(res)
    var ret = tryCallOne(cb, self._value);
    if (ret === IS_ERROR) {
      reject(deferred.promise, LAST_ERROR);
    } else {
      // 递归调用resolve，用来链式调用
      resolve(deferred.promise, ret);
    }
  });
}
```
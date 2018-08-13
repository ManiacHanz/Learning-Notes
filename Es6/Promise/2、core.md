

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
  this._deferredState = 0;
  this._state = 0;
  this._value = null;
  this._deferreds = null;
  // 传的函数是noop时，就不需要执行 doResolve 函数了
  if (fn === noop) return;
  doResolve(fn, this);
}
Promise._onHandle = null;
Promise._onReject = null;
Promise._noop = noop;

```

接下来看挂载在`Promise`原型上的 `then` 方法

```js
Promise.prototype.then = function(onFulfilled, onRejected) {
  if (this.constructor !== Promise) {
      // safeThen 方法是兼容 ，有可能Promise的prototype被修改，导致new出来的实例没有指向Promise的方法
    return safeThen(this, onFulfilled, onRejected);
  }
  // 给res 挂了一系列_deferredState,_state,_value,_deferreds方法
  var res = new Promise(noop);
  // 对res进行了处理，再返回出来，成为then的返回值。
  // 具体的操作方法都写在了 Handler 类里
  handle(this, new Handler(onFulfilled, onRejected, res));
  return res;
};
```


```js
// 兼容Promise的原型被误修改，而不指向Promise本身的情况
function safeThen(self, onFulfilled, onRejected) {
  return new self.constructor(function (resolve, reject) {
    var res = new Promise(noop);
    res.then(resolve, reject);
    handle(self, new Handler(onFulfilled, onRejected, res));
  });
}
// 第一个参数是环境，即this。也就是要指向Promise的实例
// 
function handle(self, deferred) {
    // 3 代表adopt 。这里暂时没接触往后放
  while (self._state === 3) {
    self = self._value;
  }
  // 
  if (Promise._onHandle) {
    Promise._onHandle(self);
  }
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
    var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      if (self._state === 1) {
        resolve(deferred.promise, self._value);
      } else {
        reject(deferred.promise, self._value);
      }
      return;
    }
    var ret = tryCallOne(cb, self._value);
    if (ret === IS_ERROR) {
      reject(deferred.promise, LAST_ERROR);
    } else {
      resolve(deferred.promise, ret);
    }
  });
}
function resolve(self, newValue) {
  // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
  if (newValue === self) {
    return reject(
      self,
      new TypeError('A promise cannot be resolved with itself.')
    );
  }
  if (
    newValue &&
    (typeof newValue === 'object' || typeof newValue === 'function')
  ) {
    var then = getThen(newValue);
    if (then === IS_ERROR) {
      return reject(self, LAST_ERROR);
    }
    if (
      then === self.then &&
      newValue instanceof Promise
    ) {
      self._state = 3;
      self._value = newValue;
      finale(self);
      return;
    } else if (typeof then === 'function') {
      doResolve(then.bind(newValue), self);
      return;
    }
  }
  self._state = 1;
  self._value = newValue;
  finale(self);
}

function reject(self, newValue) {
  self._state = 2;
  self._value = newValue;
  if (Promise._onReject) {
    Promise._onReject(self, newValue);
  }
  finale(self);
}
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

function Handler(onFulfilled, onRejected, promise){
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, promise) {
  var done = false;
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
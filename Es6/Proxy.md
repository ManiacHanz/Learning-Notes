
# Proxy --  代理

*语法*

```js
/**
 * @param target 目标对象
 * @param handler 操作函数 handler里面定义的拦截方法，会对Proxy返回的实例起作用，而不要直接去操作 target 源对象
*/
var proxy = new Proxy(target, handler);
```


> handler里可以实行的 13种方法

#### get()

```js
/**
 * @param target  操作的实例对象 -- proxy
 * @param property  属性名
 * @param reciever? 可选，总是指向读操作指向的对象 --  proxy
*/

var person = {
  name: "张三"
};

var proxy = new Proxy(person, {
  get: function(target, property, receiver) {
    if (property in target) {
      return target[property];
    } else {
    // 把返回undefined 改写成抛出一个错误
      throw new ReferenceError("Property \"" + property + "\" does not exist.");
    }
  }
});

proxy.name // "张三"
proxy.age // 抛出一个错误


// 对于不可写 且 不可编辑的属性 就不能用proxy去改写 否则会报错
// 下面的foo属性不能用get去改写访问
const target = Object.defineProperties({}, {
  foo: {
    value: 123,
    writable: false,
    configurable: false
  },
});
```

### set()


```js
/**
    @param obj   操作的对象
    @param key   属性名
    @param value 属性值
    @param proxy 操作的对象 -- 实例本身
*/

let validator = {
  set: function(obj, prop, value) {
    if (prop === 'age') {
      if (!Number.isInteger(value)) {
        throw new TypeError('The age is not an integer');
      }
      if (value > 200) {
        throw new RangeError('The age seems invalid');
      }
    }

    // 对于满足条件的 age 属性以及其他属性，直接保存
    obj[prop] = value;
  }
};

let person = new Proxy({}, validator);

person.age = 100;

person.age // 100
person.age = 'young' // 报错
person.age = 300 // 报错
```

**注意 第四个参数并不一定是实例本身**

```js
const handler = {
  set: function(obj, prop, value, receiver) {
    obj[prop] = receiver;
  }
};
const proxy = new Proxy({}, handler);
const myObj = {};
// 上面代码中，设置myObj.foo属性的值时，myObj并没有foo属性，因此引擎会到myObj的原型链去找foo属性。
// myObj的原型对象proxy是一个 Proxy 实例，设置它的foo属性会触发set方法。
// 这时，第四个参数receiver就指向原始赋值行为所在的对象myObj。

Object.setPrototypeOf(myObj, proxy);

myObj.foo = 'bar';
myObj.foo === myObj // true
```


### apply()

```js
/**
    @param  target  目标对象
    @param  ctx     上下文环境
    @param  args    参数
*/

var target = function () { return 'I am the target'; };
var handler = {
  apply: function (target, ctx, args) {
    return 'I am the proxy';
  }
};

var p = new Proxy(target, handler);
// p直接作为方法调用时，就会被apply拦截
p()     // "I am the proxy"
```

**另一个例子**

```js
var twice = {
  apply (target, ctx, args) {
    return Reflect.apply(...arguments) * 2;
  }
};
function sum (left, right) {
  return left + right;
};
// 方法也是可以做为对象被代理
// 而apply就是他在调用的时候的劫持
var proxy = new Proxy(sum, twice);
proxy(1, 2) // 6
proxy.call(null, 5, 6) // 22
proxy.apply(null, [7, 8]) // 30
```


### has()   ----    拦截  key in obj  的方法

> 只对  `key in obj` 和 `hasOwnProperty` 起作用，对 `for...in` 和 `hasOwnProperty`  不起作用。 在对象不可配置或者禁止扩展的时候不能拦截

```js
var handler = {
  has (target, key) {
    if (key[0] === '_') {
      return false;
    }
    return key in target;
  }
};
var target = { _prop: 'foo', prop: 'foo' };
var proxy = new Proxy(target, handler);
'_prop' in proxy // false
for (let key in proxy) {
  console.log(proxy[key]);
}   //  foo  ,  foo

```


### constructor()   --   用于拦截 new 命令



```js
/**
    @param target    操作的目标对象
    @param args      构造的参数
    @param newTarget 创造函数时，new作用的构造函数，new proxy 就是指的proxy
    @return 必须返回一个对象，否则会报错 因为new出来的就是一个对象
*/

var p = new Proxy(function () {}, {
  construct: function(target, args) {
    console.log('called: ' + args.join(', '));
    return { value: args[0] * 10 };
  }
});

(new p(1)).value
// "called: 1"
// 10
```

### deleteProperty()   --  拦截 delete命令
    
*target key*

### defineProperty()    --    拦截 Object.defineProperty操作

*target key value*
*如果目标对象不可扩展（extensible），则会报错*

### getOwnPropertyDescriptor()   --    拦截 Object.getOwnPropertyDescriptor() 

> 返回一个属性的描述对象 或者 undefined

### getPrototypeOf()    --    拦截获取对象原型

### isExtensible()    --     拦截Object.isExtensible()操作

### ownKeys()     ---     拦截对象自身属性的读取操作

> 默认会过滤一下三类属性

* 目标对象上不存在的属性
* 属性名为Symbol值
* 不可遍历(enumerable)的属性

### preventExtensions()   --   拦截Object.preventExtensions()方法

### setPrototypeOf()   --    拦截 Object.setPrototypeOf()方法

> 给一个对象设置原型对象



## this

> this 经过 let proxy = new Proxy(target,handler) 以后，会指向proxy，而不是指向target
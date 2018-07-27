
# Iterator    ----     遍历器

> 遍历器（Iterator）是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署 Iterator 接口，就可以完成遍历操作

Iterator 的作用如下三个

- 为各种数据结构，提供一个统一的、简便的访问接口；

- 使得数据结构的成员能够按某种次序排列；

- ES6 创造了一种新的遍历命令for...of循环，Iterator 接口主要供for...of消费。

*简单的说，Iterator就是一个指针对象，创建初始指向当前数据的起始位置。每调一次next()，其实就是将这个指针按顺序往下移动一个位置，直到结束*


### 默认的Iterator接口

> 一个数据只要部署了Iterator接口，我们就称这种数据结构是可遍历的

ES6规定，默认的Iterator接口部署在数据结构的 `Symbol.Iterator` 属性，或者说，一个数据结构只要具有 `Symbol.Iterator` 属性--访问必须要用 `[]`-- ，就可以认为是可遍历的。 `Symbol.Iterator` 本身是一个函数，执行后会返回一个遍历器。

原生具有遍历器接口的对象

- Array
- Map                ->  Obj不具有而Map具有的原因是 Map的顺序是按照插入的顺序，而Obj没有
- Set
- String
- TypedArray
- 函数的 arguments 对象
- NodeList对象


最简单的栗子，数组的原生Iterator接口
```js
let arr = ['a', 'b', 'c'];
let iter = arr[Symbol.iterator]();

iter.next() // { value: 'a', done: false }
iter.next() // { value: 'b', done: false }
iter.next() // { value: 'c', done: false }
iter.next() // { value: undefined, done: true }
```

为对象添加Iterator的栗子

```js
let obj = {
  data: [ 'hello', 'world' ],
  [Symbol.iterator]() {
    const self = this;
    let index = 0;
    return {
      next() {
        if (index < self.data.length) {
          return {
            value: self.data[index++],
            done: false
          };
        } else {
          return { value: undefined, done: true };
        }
      }
    };
  }
};
```

而为 `NodeList` 这些类数组部署接口就更容易，只需要借用一下 `Array` 的遍历器就可以了
*注意，对普通对象没有用*

```js
let iterable = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
  [Symbol.iterator]: Array.prototype[Symbol.iterator]
};
for (let item of iterable) {
  console.log(item); // 'a', 'b', 'c'
}
```


### 调用Iterator接口的场合

- 解构赋值
- 扩展运算符
- yield*
    yield* 后面跟一个可遍历的结构，它会调用该结构的遍历器接口
```js
let generator = function* () {
  yield 1;
  yield* [2,3,4];
  yield 5;
};

var iterator = generator();

iterator.next() // { value: 1, done: false }
iterator.next() // { value: 2, done: false }
iterator.next() // { value: 3, done: false }
iterator.next() // { value: 4, done: false }
iterator.next() // { value: 5, done: false }
iterator.next() // { value: undefined, done: true }
```

- 其他比如 `for...of` `Array.from()` `Map() Set() WeakSet() WeakMap()` `Promise.all()`  `Promise.race()`


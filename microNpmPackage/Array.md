
# Array


### dedupe

[地址戳这里](https://github.com/seriousManual/dedupe)

> 主要用来数组去重

*先上栗子*

```js
// 普通去重
var a = [1, 2, 2, 3]
var b = dedupe(a)
console.log(b)

//result: [1, 2, 3]

// 复杂类型去重
var dedupe = require('dedupe')

var aa = [{a: 2}, {a: 1}, {a: 1}, {a: 1}]
var bb = dedupe(aa)
console.log(bb)

//result: [{a: 2}, {a: 1}]

// 复杂类型指定条件去重
var dedupe = require('dedupe')

var aaa = [{a: 2, b: 1}, {a: 1, b: 2}, {a: 1, b: 3}, {a: 1, b: 4}]
var bbb = dedupe(aaa, value => value.a)
console.log(bbb)

//result: [{a: 2, b: 1}, {a: 1,b: 2}]
```

下面上源码

```js
'use strict'

function dedupe (client, hasher) {
    // hasher的规则应该都是能把复杂类型转化成原始类型，才能在lookup对象中进行是否存在的比较
    hasher = hasher || JSON.stringify

    const clone = []
    // 用来作为监控的是否重复的对象，比较的都是简单类型
    const lookup = {}

    for (let i = 0; i < client.length; i++) {
        let elem = client[i]
        let hashed = hasher(elem)

        if (!lookup[hashed]) {
            clone.push(elem)
            lookup[hashed] = true
        }
    }

    return clone
}

module.exports = dedupe
```


### flatten
    
[地址](https://github.com/jonschlinkert/arr-flatten)

> 用于给数组扁平化

*Example*

```js
var flatten = require('arr-flatten');

flatten(['a', ['b', ['c']], 'd', ['e']]);
//=> ['a', 'b', 'c', 'd', 'e']
```


源码

```js
'use strict';

module.exports = function (arr) {
  return flat(arr, []);
};
// 一个简单的递归，复杂类型调用，简单类型放进放回的数组
function flat(arr, res) {
  var i = 0, cur;
  var len = arr.length;
  for (; i < len; i++) {
    cur = arr[i];
    Array.isArray(cur) ? flat(cur, res) : res.push(cur);
  }
  return res;
}
```


### array-range

[地址](https://github.com/mattdesl/array-range)

> 用于循环生成一个递增的数组

栗子不上了，比较简单，直接上源码

```js
module.exports = function newArray(start, end) {
    var n0 = typeof start === 'number',
        n1 = typeof end === 'number'

    // 不传end就是0-start，都不穿就是空数组
    // 两个都传就是生成start - end 的数组
    if (n0 && !n1) {
        end = start
        start = 0
    } else if (!n0 && !n1) {
        start = 0
        end = 0
    }

    start = start|0
    end = end|0
    var len = end-start
    if (len<0)
        throw new Error('array length must be positive')
    
    var a = new Array(len)
    for (var i=0, c=start; i<len; i++, c++)
        a[i] = c
    return a
}
```
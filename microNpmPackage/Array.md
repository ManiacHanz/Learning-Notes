
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
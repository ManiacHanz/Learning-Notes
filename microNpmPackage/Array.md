
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


### arr-diff

[地址](https://github.com/jonschlinkert/arr-diff)


##### Usage

```js
var diff = require('arr-diff');

var a = ['a', 'b', 'c', 'd'];
var b = ['b', 'c'];

console.log(diff(a, b))
//=> ['a', 'd']
```


```js
/**
* 这里只接收第一个数组，在后面会变成前两个比较后的diff数组
* 使用arguments对象和一个变量的增加来做成一个不限制长度的参数
*/
module.exports = function diff(arr/*, arrays*/) {
  var len = arguments.length;
  var idx = 0;
  
  while (++idx < len) {
      /**
      * 第一次arr是传入的参数，也就是第一个数组
      * 第二次传入的arr，是第一次比较以后返回的不同的arr
      * 也就是会比较所有的不同
      */
    arr = diffArray(arr, arguments[idx]);
  }
  return arr;
};

function diffArray(one, two) {
  //  如果第二个参数不是数组直接返回第一个参数
  if (!Array.isArray(two)) {
    return one.slice();
  }

  var tlen = two.length
  var olen = one.length;
  var idx = -1;
  var arr = [];
  
  while (++idx < olen) {
    var ele = one[idx];
    // 用有相同的这个变量做开关 一旦发现相同的就跳出这次 
    // 不同的就放进diff里
    // 所以只能比较简单类型
    var hasEle = false;
    for (var i = 0; i < tlen; i++) {
      var val = two[i];

      if (ele === val) {
        hasEle = true;
        break;
      }
    }

    if (hasEle === false) {
      arr.push(ele);
    }
  }
  return arr;
}
```


### map-array

按照自定义方法把对象中的`key-value`组装成数组

[地址](https://github.com/parro-it/map-array)

##### Usage 

```js
const mapArray = require('map-array');
const obj = {
  giorgio: 'Bianchi',
  gino: 'Rossi'
};
console.log(mapArray(obj, (key, value) => key + ' ' + value));
// ['giorgio Bianchi', 'gino Rossi']
```


```js
const map = require('map-obj');

function mapToArray(obj, fn) {
	let idx = 0;
	const result = map(obj, (key, value) =>
    // 把每一个key和value同时传给callback。让callback去处理
		[idx++, fn(key, value)]
	);
  // 转化类数组成真正的数组
	result.length = idx;
	return Array.from(result);
}

module.exports = mapToArray;
```



### swap-array

交换数组两项的位置

[地址](https://github.com/michaelzoidl/swap-array)

##### Usage

```js
import SwapArray from 'swap-array';

var SomeArray = ['thats','cool','dude'];

SwapArray(SomeArray, 0, 2);
// ['dude','thats','cool'];
```

```js
export default (Arr, Caller, Target) => {
  let Instance = Arr.constructor();
  let Stash = Arr;

  let InstanceType = Array.isArray(Instance) ? 'array' : typeof Instance;

  // Check types and throw err if no arr is passed
  if(InstanceType !== 'array') throw '[ERR] SwapArray expects a array as first param';

  // Copy the Arr-Content into new Instance - so we don't overwrite the passed array
  // 浅复制一个数组 ，避免用splice影响原数组
  Stash.map((s, i) => Instance[i] = s);

  // Update indexes
  // 使用splice删除目标位置并返回对应的项，返回的是个数组，所以要用[0]
  // 由于换位置,所以把caller和target的地方交换
  Instance[Caller] = Instance.splice(Target, 1, Instance[Caller])[0];

  return Instance;
}
```
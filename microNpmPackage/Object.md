# Object


### map-obj

[地址](https://github.com/sindresorhus/map-obj)

> Map object keys and values into a new object

`WeakMap`
* key只能使用非`null`的对象
* 引用的对象只要其他引用被清除，`WeakMap`的键名所对应的值也会消失

```js
const mapObj = require('map-obj');

const newObject = mapObj({foo: 'bar'}, (key, value) => [value, key]);
//=> {bar: 'foo'}
```


```js
// 数组和对象都返回true
const isObject = x =>
	typeof x === 'object' &&
	x !== null &&
	!(x instanceof RegExp) &&
	!(x instanceof Error) &&
	!(x instanceof Date);

module.exports = function mapObj(object, fn, options, seen) {
	options = Object.assign({
		deep: false,
		target: {}
	}, options);
  // seen 是不传的 正常情况使用WeakMap，避免内存占用
	seen = seen || new WeakMap();

	if (seen.has(object)) {
		return seen.get(object);
	}
  // 使用对象做key ，保存一下target。后面把target从options上去掉
	seen.set(object, options.target);

	const {target} = options;
	delete options.target;
  // 下面就是接近deepclone的递归原理
	const mapArray = array => array.map(x => isObject(x) ? mapObj(x, fn, options, seen) : x);
	if (Array.isArray(object)) {
		return mapArray(object);
	}

	for (const key of Object.keys(object)) {
		const value = object[key];
    // 旧的遍历的key和value，对象本身传进去，
    // 必须返回一个数组2个长度的数组
		let [newKey, newValue] = fn(key, value, object);

		if (options.deep && isObject(newValue)) {
			newValue = Array.isArray(newValue) ?
				mapArray(newValue) :
				mapObj(newValue, fn, options, seen);
		}

		target[newKey] = newValue;
	}

	return target;
};
```



### filter-obj

> Filter object keys and values into a new object

[地址](https://github.com/sindresorhus/filter-obj)

obj的filter，不是找到即止，会遍历整个对象

```js
'use strict';
module.exports = (obj, predicate) => {
	const ret = {};
	const keys = Object.keys(obj);
	const isArray = Array.isArray(predicate);

	for (const key of keys) {
		const val = obj[key];
    // 数组的话 可以多传几个key
    // callback的话就交给自己处理，需要返回boolean
		if (isArray ? predicate.indexOf(key) !== -1 : predicate(key, val, obj)) {
			ret[key] = val;
		}
	}
  // 返回的新对象
	return ret;
};
```


### zipmap

> Returns a map with the keys mapped to the corresponding vals. zipmap also accepts a single value of objects or pairs.

[地址](https://github.com/landau/zipmap)

可以把2个数组对应合并成对象数组，或者把一个对象数组或二维数组格式化。主要可以学习下`reduce` 的用法

*Usage*

```js
// 1
var keys = ['a', 'b', 'c'];
var vals = [1, 2, 3];

var map = zipmap(keys, vals);
assert.deepEqual(map, { a: 1, b: 2, c: 3 });

// 2
var objs = [
  { key: 'foo', value: 'bar' },
  { key: 'hi', value: 'bye' },
];

var out = {
  foo: 'bar',
  hi: 'bye'
};

var map = zipmap(objs);
assert.deepEqual(map, out);

// 3
var pairs = [
  ['foo', 'bar'],
  ['hi', 'bye']
];

var out = {
  foo: 'bar',
  hi: 'bye'
};

var map = zipmap(pairs);
assert.deepEqual(map, out);
```


上源码

这里可以学习一下，暴露的函数主要是做一个类似于策略模式的排错功能，而正常情况再把`_zipmap`核心函数`return`出来

```js
function isObj(o) {
  return toString(o) === '[object Object]';
}

module.exports = function zipmap(keys, vals) {
  if (!vals) {
    if (Array.isArray(keys) && !keys.length) return {};
    if (Array.isArray(keys[0])) return zipmapPairs(keys);
    if (isObj(keys[0])) return zipmapObj(keys);
    throw new TypeError('Expected vals to be an array');
  }

  return _zipmap(keys, vals);
};
```

`_zipmap`是*Usage*里的第一个情况

```js
function _zipmap(keys, vals) {
	// 使用长度更短的来reduce
  var shorter = keys.length > vals.length ? vals : keys;
	// 第三个参数是 当前的index。所以一一对应着形成对象
  return shorter.reduce(function(map, val, idx) {
    map[keys[idx]] = vals[idx];
    return map;
  }, {});

}
```

`zipmapObj`对应的是第二种情况，但是对象必须以`key` `value`这样的格式

```js
function zipmapObj(objs) {
  return objs.reduce(function(map, o) {
		// 必须是key - value
    map[o.key] = o.value;
    return map;
  }, {});
}
```

`zipmapPairs`对应的是第三种情况，以数组第一位做key，第二位做value

```js
function zipmapPairs(pairs) {
  return pairs.reduce(function(map, pair) {
    map[pair[0]] = pair[1];
    return map;
  }, {});
}
```


### deep-assign

相当于“深递归”版的`Object.assign`

[地址](https://github.com/sindresorhus/deep-assign)（目前这个库已被废弃，作者推荐[lodash.merge](https://lodash.com/docs/4.17.11#merge)）

*Usage*

```js
var deepAssign = require('deep-assign');

deepAssign({a: {b: 0}}, {a: {b: 1, c: 2}}, {a: {c: 3}});
//=> {a: {b: 1, c: 3}}
```

还是有一些关于`Object`的操作和思路可以学习，稍微看一下吧

依然是暴露的函数只做简单的容错处理和核心处理，学习这种封装思路，看起来清爽简单

```js
// 保证传入的东西是一个 obj 的容错方法。后面分析默认所有的都是obj类型
function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Cannot convert undefined or null to object');
	}

	return Object(val);
}

module.exports = function deepAssign(target) {
	target = toObject(target);
	// 由于会覆盖target ，所以不需要关注 arguments到底有几个，
	// 有点类似于 assign(target,arguments[1])(arguments[2])...这种思路的处理
	for (var s = 1; s < arguments.length; s++) {
		assign(target, arguments[s]);
	}

	return target;
};
```

```js
var hasOwnProperty = Object.prototype.hasOwnProperty;

var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function assign(to, from) {
	// 同一个直接返回
	if (to === from) {
		return to;
	}

	from = Object(from);
	// for .. in 会循环到原型链上的方法，而hasOwnProperty可以把非自身的排除掉
	for (var key in from) {
		if (hasOwnProperty.call(from, key)) {
			// 根据key来assign对象
			assignKey(to, from, key);
		}
	}
	// getOwnPropertySymbols 方法返回一个给定对象自身的所有 Symbol 属性的数组。
	if (Object.getOwnPropertySymbols) {
		var symbols = Object.getOwnPropertySymbols(from);

		for (var i = 0; i < symbols.length; i++) {
			// 保证可以枚举
			if (propIsEnumerable.call(from, symbols[i])) {
				assignKey(to, from, symbols[i]);
			}
		}
	}
	// 这里返回值好像没什么用，作者是直接修改原值
	return to;
}
```


```js
function assignKey(to, from, key) {
	var val = from[key];
	// undefined或者null的 不会被合并
	if (val === undefined || val === null) {
		return;
	}
	
	if (hasOwnProperty.call(to, key)) {
		if (to[key] === undefined || to[key] === null) {
			throw new TypeError('Cannot convert undefined or null to object (' + key + ')');
		}
	}
	// 如果 to上面没有这个属性 或者 val不是个对象就直接更改值
	if (!hasOwnProperty.call(to, key) || !isObj(val)) {
		to[key] = val;
	} else {
		// 否则就递归调用
		// 这样就保证了 是deep-assign，而不是from 的val去覆盖了to的val
		// 这个递归思想还是很巧妙
		to[key] = assign(Object(to[key]), from[key]);
	}
}
```

总结 
* 递归思想很巧妙
* `Object`的`key`的循环与自身属性
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
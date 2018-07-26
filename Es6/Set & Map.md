
# Set  ----   没有重复的“数组”

**先插一个简洁的 es5 数组去重方法**
```js
arr.filter( (item, index, arr) => {
    return index === arr.indexOf(item)
})
```

### Set实例的属性和方法

Set 结构的实例有以下属性。

* `Set.prototype.constructor`：构造函数。
* `Set.prototype.size`：返回Set实例的成员总数。(注意不用length)

Set 实例的方法分为两大类：操作方法（用于操作数据）和遍历方法（用于遍历成员）。下面先介绍四个操作方法。

* add(value)：添加某个值，返回 Set 结构本身。
* delete(value)：删除某个值，返回一个布尔值，表示删除是否成功。
* has(value)：返回一个布尔值，表示该值是否为Set的成员。
* clear()：清除所有成员，没有返回值。

Set 结构的实例有四个遍历方法，可以用于遍历成员。和 `Object` 一样。但是由于 Set 结构没有键名，所以`keys`和`values`的返回值相同，以及和 `for...of` 相同 

* keys()：返回键名的遍历器
* values()：返回键值的遍历器
* entries()：返回键值对的遍历器
* forEach()：使用回调函数遍历每个成员


## WeakSet

WeakSet 和 Set 有两个区别

* WeakSet的成员只能是对象
* WeakSet的对象都是弱引用，即垃圾回收机制不会考虑 WeakSet 内成员的引用
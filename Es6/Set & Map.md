
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

WeakSet 结构有以下三个方法。

* WeakSet.prototype.add(value)：向 WeakSet 实例添加一个新成员。
* WeakSet.prototype.delete(value)：清除 WeakSet 实例的指定成员。
* WeakSet.prototype.has(value)：返回一个布尔值，表示某个值是否在 

WeakSet 和 Set 有两个区别

* WeakSet的成员只能是对象
* WeakSet的对象都是弱引用，即垃圾回收机制不会考虑 WeakSet 内成员的引用

> 这是因为垃圾回收机制依赖引用计数，如果一个值的引用次数不为0，垃圾回收机制就不会释放这块内存。结束使用该值之后，有时会忘记取消引用，导致内存无法释放，进而可能会引发内存泄漏。WeakSet 里面的引用，都不计入垃圾回收机制，所以就不存在这个问题。因此，WeakSet 适合临时存放一组对象，以及存放跟对象绑定的信息。只要这些对象在外部消失，它在 WeakSet 里面的引用就会自动消失。

> 由于上面这个特点，WeakSet 的成员是不适合引用的，因为它会随时消失。另外，由于 WeakSet 内部有多少个成员，取决于垃圾回收机制有没有运行，运行前后很可能成员个数是不一样的，而垃圾回收机制何时运行是不可预测的，*因此 ES6 规定 WeakSet 不可遍历*。

构造函数 : 可以接收一个有 Iterable 接口的对象

*成员必须是对象，如下面的a；b则会报错*

```js
const w = new WeakSet()
const a = [[1, 2], [3, 4]];
const ws = new WeakSet(a);
// WeakSet {[1, 2], [3, 4]}
const b = [3, 4];
const ws = new WeakSet(b);
// Uncaught TypeError: Invalid value used in weak set(…)
```

**利用WeakSet可以用来存储DOM节点或者类的实例，这种时候进行DOM删除或者删除实例的时候，就不需要考虑WeakSet里存的引用，而不会造成内存的泄漏**
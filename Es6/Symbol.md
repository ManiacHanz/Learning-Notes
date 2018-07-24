

# Symbol ---- 独一无二


```js
let a = Symbol()
let b = Symbol()
a === b // false

// 转换字符串
let c = Symbol('abc')
c.toString() // 'Symbol(abc)'
// 转换布尔
Boolean(c)    // true

// 作为属性名
let obj = {}
let key = Symbol()
obj[key] = 'value'   // 不能用 . 访问
// 属性名遍历   取出Symbol属性名的唯二方法
const objKeys = Object.getOwnPropertySymbols(obj)  // [Symbol()]
// 还可以用Reflect
Reflect.ownKeys(obj) // [Symbol()]

// Symbol.for()
let a1 = Symbol.for('foo')
let a2 = Symbol.for('foo')
a1 === a2   // true  相等，且不会多次生成新的Symbol
// Symbol.keyFor()
Symbol.keyFor(a1)   //  'foo'

```


### 内置的一些 Symbol 值

> `Symbol.hasInstance` 指向 `instanceof`, 后者调用的时候实际调用的是前者

```js
class Even {
  static [Symbol.hasInstance](obj) {
    return Number(obj) % 2 === 0;
  }
}

// 等同于
const Even = {
  [Symbol.hasInstance](obj) {
    return Number(obj) % 2 === 0;
  }
};

1 instanceof Even // false
2 instanceof Even // true
12345 instanceof Even // false
```

> `Symbol.isConcatSpreadable` 指向的是 `Array.prototype.concat`使用是，对象是否可以展开。 返回的是`bool`

```js
let arr1 = ['c', 'd'];
['a', 'b'].concat(arr1, 'e') // ['a', 'b', 'c', 'd', 'e']
arr1[Symbol.isConcatSpreadable] // undefined

let arr2 = ['c', 'd'];
arr2[Symbol.isConcatSpreadable] = false;
['a', 'b'].concat(arr2, 'e') // ['a', 'b', ['c','d'], 'e']
```

> `Symbol.match` 指向 `String.prototype.match`

> `Symbol.replace`  作为  `String.prototype.replace` 调用时的返回值

```js
String.prototype.replace(searchValue, replaceValue)
// 等同于
searchValue[Symbol.replace](this, replaceValue)
```

> `Symbol.search`  作为 `String.prototype.search` 调用时的返回值

```js
String.prototype.search(regexp)
// 等同于
regexp[Symbol.search](this)
```

> `Symbol.split`  作为 `String.prototype.split` 调用时的返回值

```js
String.prototype.split(separator, limit)
// 等同于
separator[Symbol.split](this, limit)
```

> `Symbol.iterator`  作为  `Object` 的默认迭代器 `for...of...`

```js
class Collection {
  *[Symbol.iterator]() {
    let i = 0;
    while(this[i] !== undefined) {
      yield this[i];
      ++i;
    }
  }
}

let myCollection = new Collection();
myCollection[0] = 1;
myCollection[1] = 2;

for(let value of myCollection) {
  console.log(value);
}
// 1
// 2
```

> `Symbol.toPrimitive` 指向 对象被转换为原始类型值时候的方法, 接受一个字符串参数，表示当前运算的模式

* Number：该场合需要转成数值
* String：该场合需要转成字符串
* Default：该场合可以转成数值，也可以转成字符串

```js
let obj = {
  [Symbol.toPrimitive](hint) {
    switch (hint) {
      case 'number':
        return 123;
      case 'string':
        return 'str';
      case 'default':
        return 'default';
      default:
        throw new Error();
     }
   }
};

2 * obj // 246
3 + obj // '3default'
obj == 'default' // true
String(obj) // 'str'
```
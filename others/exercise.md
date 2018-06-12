
# 记录一些有趣的练习题之类的东西


#### 使用代码使下述成立

> ( a==1 && a==2 && a==3 ) == true

*网上抄袭大佬分享的答案*

```js
class A {
  constructor(){
    this.value = 0
  }
  valueOf(){
    return ++this.value
  }
  /*
  toString(){
    return this.valueOf()
  }*/
}
let a = new A()
console.log([a==1,a==2,a==3])       // true true true
```

原理分析，`==` 在对比两个不同类型的时候，会尝试把一个转换成另一个类型。这题里面，左边`a`是一个对象，右边是一个数字。所以会首先调用 `valueOf` 方法，如果有就直接返回，如上题，直接调用`valueOf`。所以上题不需要 `toString`函数
而如果对象没有 `valueOf` 方法的时候，会去调用 `toString` 方法 ，所以如下方法也是可以的

```js
const a = {
  o: 0,
  toString:function(){
    // 闭包
    return ++a.o
  }
}
console.log(a==1,a==2,a==3)   // true true true
```

除了上面两种对象的方法，还有一种巧妙的数组方法

```js
var a = [1,2,3];
a.join = a.shift;
console.log(a == 1 && a == 2 && a == 3);
```
这个答案还是比较巧妙的，我们知道 `array` 也属于对象，应该和对象的规则一样。关于 `array` 的原型链上的 `toString` 方法
对于数组对象，`toString` 方法返回一个字符串，该字符串由数组中的每个元素的 `toString()` 返回值经调用 `join()` 方法连接（由逗号隔开）组成。


另：附两种菜鸡（本人）的思路，~~但是没有完美的达成答案目标~~

* 使用访问器属性

```js
let base = 0
let obj = {}
Object.defineProperty(obj,'a',{
  get:function(){
    return ++base
  },
  set: function(newValue){
    a = newValue
  }
})
console.log([obj.a==1,obj.a==2,obj.a==3])    // true true true
```
~~这里问题在于不能把obj.value赋值给变量a，所以没法达到题目要求~~
把上面的`obj`换成 `window`就行了
```js
let base = 0
Object.defineProperty(window,'a',{
  get:function(){
    return ++base
  },
  set: function(newValue){
    a = newValue
  }
})
console.log([a==1,a==2,a==3])    // true true true
```

* 使用闭包

```js
function outer(){
  var tmp = 0
  return function(){
    console.log(++tmp)
  }
}
let c = outer()
c(); c(); c();           //  1 2 3
```
问题同样是不能赋值给变量 



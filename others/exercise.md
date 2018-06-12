
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
  toString(){
    return this.valueOf()
  }
}
let a = new A()
console.log([a==1,a==2,a==3])       // true true true
```

原理分析，变量使用 `==` 的时候会调用`toString`方法（不确定，有没有相关文献啊），使用类的`prototype`覆盖掉本来的`toString`方法，达成目标


另：付两种菜鸡的思路，但是没有完美的达成答案目标

* 使用访问器属性

```js
let base = 0
let obj = {}
Object.defineProperty(obj,'val',{
  get:function(){
    return ++base
  },
  set: function(newValue){
    val = newValue
  }
})
console.log([obj.value==1,obj.value==2,obj.value==3])    // true true true
```
这里问题在于不能把obj.value赋值给变量a，所以没法达到题目要求

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



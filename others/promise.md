
# Promise

> 三个状态很重要 pending -> fullfilled || pending -> rejected
> 状态只可变一次，不可感知 pending 的程度，是刚开始还是快改变

```js
new Promise( (resolve, reject) => {
    if(){
        resolve(data)
    }else{
        reject(error)
    }
})
```

**then方法返回的是一个新的Promise实例，不是以前那个，所以才可以使用链式写法。同时因为这个是实例调用，所以注定then是定义在 Promise.prototype.then上**

##### Promise.resolve()

`resolve` 作用就是把现有对象转化成一个 `Promise` 对象

* 1) 参数是一个Promise实例
    resolve不做任何修改，原封不动的返回这个实例
* 2) 参数是一个thenable对象
    ```js
    let thenable = {
        then: function(resolve, reject) {
            resolve(42);
        }
    };
    ```
    resolve会把这个对象转成Promise对象，然后立即执行他的then方法
* 3) 参数不是具有then方法的对象，或者根本不是对象
    resolve会新创建一个Promise实例，并改状态为resolve，参数为这个参数
* 4) 不带任何参数
    resolve直接返回一个resolve状态的Promise实例


##### Promise.reject()

`reject` 作用和 `resolve` 差不多，也是将现有对象转换成 `Promise` 对象，但是返回的状态是 `rejected` , 且不会对参数做处理，而是原封不动的返回参数作为 `rejected` 的理由

* 1) thenable参数不会执行then方法，而是直接返回该对象


### 模仿

##### 1、 先仿形
```js
var _Promise = function(fn){

    fn(resolve, reject)

    function resolve(data){

    }

    function reject(error){
        
    }
}

// promise.then( resolvefn, rejectfn )

_Promise.prototype.then = function(onResolve, onRejected){

}
```


# 函数防抖和节流

> 作为常用的工具函数，这里借用一下underscore里的轮子，加深两者的印象


### 函数防抖

*防抖的思想是多少时间内只能执行一次*

```js
/**
 *  @param   {function}  func 回调函数
 *  @param   {number}    wait 表示时间窗口的间隔
 *  @param   {boolean}   immediate 表示是否立即执行
 *  @return  {function}       返回客户调用函数的结果
 */


_.debounce = function(func, wait, immediate){
    var timeout, context, args, result, timestamp
    var later = function(){
        // 比较时间戳
        var last = _.now() - timestamp
        
        if (last < wait && last >= 0) {
            timeout = setTimeout(later, wait - last)
        } else {
            timeout = null
            if(!immediate) {
                // 传入了以后只会执行一次 不会再次执行
                result = func.apply(context, args)
                if(!timeout) context = args = null  
            }
        }
    }

    return function(){
        context = this
        args =  arguments    // 这是里面这个函数的参数
        timestamp = _.now()
        // 开关 立即执行为true，定时器为null时
        var callNow = immediate && !timeout
        // 创建一个定时器
        if(!timeout) timeout = setTimeout(later, wait)
        // 如果传入了immediate 在一开始会立即执行，并且在wait时间内不会再次执行
        // 比如防止按钮的连续点击
        // 而比如窗口的大小变化等连续变化后再执行，则不需出传这个参数
        if(callNow) {
            result = func.apply(context, args)
            contest = args = null   // 释放闭包的不必要变量
        }
        return result
    }
}

function test(){
    console.log('done')
}
window.onresize = debounce(test, 300)
```


### 节流



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
            // 重新设置时间间隔，并且时间间隔缩小
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
            context = args = null   // 释放闭包的不必要变量
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

*节流的思想是每隔多少秒必执行一次*

```js
/**
 * @param {function}   func    执行的回调
 * @param {number}     wait    每个多少秒执行一次
 * @param {object}     options underscore提供的两个配置选项
 *                             options.leading 为false时可以忽略第一次调用
 *                             options.trailing 为false时可以忽略最后一次调用
 * @return {function}          返回客户调用函数
*/

var throttle = function(func, wait, options){
    var result, context, args
    var timeout = null
    // 节流的意思是每隔多少秒必会执行一次，所以previous可以理解成每一次的起点时间
    var previous = 0

    if(!options) options = {}

    // 定义回调函数
    var later = function(){
        // 如果忽略开头 同时不忽略结尾 设置上次的起点为0
        // 这样在下次的时候会进入if判断 把previous改成now
        previous = options.leading === false ? 0 : _.now()
        // 执行函数 释放缓存
        timeout = null
        result = func.apply(context, args)
        if(!timeout) context = args = null
    }

    return function(){
        context = this
        args = arguments

        var now = _.now()
        // 第一次进入 !previous 肯定为true
        // 但是options里有一个配置 leading 可以决定第一次执不执行
        // 当false 不执行时，把起点时间戳设置成当前时间，才能满足下面的remaining的计算
        if(!previous && options.leading === false) previous = now
        // 时间间隔 - （当前时间-起点时间） 
        // 这个值为0 或者小于0时才应该执行
        var remaining = wait - (now - previous)
        
        if(remaining <= 0 || remaining > wait){
            if(timeout){
                clearTimeout(timeout)
                timeout = null          // 释放闭包变量
            }
            previous = now
            result = func.apply(context, args)
            if(!timeout) context = args = null
        }
        //当间隔不够时，并且没有定时器，进入这个方法
        else if(!timeout && options.trailing !== false) {
            // 开启一个定时器，所以这里不能同时设定options的leading和trailing
            timeout = setTimeout(later, remaining)
        }
        return result
    }
}
```

### axios能分别运行在浏览器环境和node环境是因为有下面一段代码

```js
function getDefaultAdapter() {
  var adapter;
  // Only Node.JS has a process variable that is of [[Class]] process
  if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = require('./adapters/http');
  } else if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('./adapters/xhr');
  }
  return adapter;
}

// 而在default config 里有一个初始化接口 配置默认执行了这段代码
var defaults = {
    adapter: getDefaultAdapter()
    /// ...
}
```


### timeout配置 

在node环境下，由于使用的是node的 `http`模块。 这里面有一个 `ClientRequest` 类，上面有 `abort` 方法可以终止链接，也可以有 `onabort`事件

在browser环境下，使用的是浏览器`XMLHttpRequest`，里面同样有 `abort`方法，以及`ontimeout` `onabort`事件监听
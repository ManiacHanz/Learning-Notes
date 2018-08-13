
### 这里只是一个入口文件

可以看到一共分为了6个部分，我们从`core.js`开始分析

```js
'use strict';

module.exports = require('./core.js');
require('./done.js');
require('./finally.js');
require('./es6-extensions.js');
require('./node-extensions.js');
require('./synchronous.js');
```


### Vue3.0的编译优化
vue对于模板的解析分为`静态节点`和`动态节点`

3.0中对于静态节点的处理会在初始化时赋值给一个变量，并提升到`render`函数外部。此后在`patch`以后，就不用重复创建静态节点

对于动态节点的提升是会通过一个数字（patch flag），标记动态绑定的范围（内容）。比如是绑定的{{模板}}，或者是:class绑定的属性。之后在diff过程中只会比较这个范围的内容，而不像2.0时会全部比较。相当于react中对需要进行的dom操作提前进行标识的思想类似

另外增加了`Fragment`节点，以及对事件函数进行了缓存处理


### 浏览器原生支持的模块化

语法：`<script type="module"></script>`
顺序： DOM创建完毕后 -> module加载 -> `DOMContentLoaded`事件执行

### Vite

按需编译模块
拦截浏览器对.vue等无法识别的文件的请求，通过content-type=application/javascript转成js模块返回给客户端


### toRefs

toRefs会把响应式对象的所有属性，创建成一个带有`value`属性的响应式对象。所以返回的每一个属性，都是单独的响应式的。这个才composition里面，可以更自由的控制是否赋值响应式对象
同理，ref是用作单个响应式的值，toRefs是用作对象

### reactive vs ref

* ref可以把基本数据类型，转成响应式对象。带有标志`__v_isRef`
* ref返回的对象，重新赋值成对象也是响应式的。通过在setter内部再次处理成响应式
* reactive返回的对象，重新赋值会丢失响应式，因为他是通过`Proxy`处理。在`Proxy`的setter中没有再次处理
* reactive返回的对象不可以解构。如果需要解构，需要使用`toRefs(reactiveObj)`包裹

### Proxy

注意被Proxy包裹的对象，解构出来相当于被重新赋值，是不会触发Proxy的响应式的，这也是Vue3中toRefs产生的动机
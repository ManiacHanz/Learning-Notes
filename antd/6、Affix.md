
# Affix 固钉  

### [官方文档](http://ant-design.gitee.io/components/affix-cn/)

 > 水平有限，参考了这篇[博客](https://juejin.im/post/59e8d66f518825619b4e0d9a)

### 知识点

* 先是2个Api。getBoundingClientRect 和 requestAnimationFrame 熟悉的朋友可以跳过
  
  * object.getBoundingClientRect()    [MDN地址](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect)
    返回值是一个 [DOMRect](https://developer.mozilla.org/zh-CN/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIDOMClientRect) 对象，这个对象是由该元素的 `getClientRects()` 方法返回的一组矩形的集合, 即：是与该元素相关的CSS 边框集合
    
    Attribute | Type | Description
    bottom | float | Y 轴，相对于视口原点（viewport origin）矩形盒子的底部。只读。 
    height | float | 矩形盒子的高度（等同于 bottom 减 top）。只读。
    left | float | X 轴，相对于视口原点（viewport origin）矩形盒子的左侧。只读。 
    right | float | X 轴，相对于视口原点（viewport origin）矩形盒子的右侧。只读。 
    top | float | Y 轴，相对于视口原点（viewport origin）矩形盒子的顶部。只读。
    width | float |	矩形盒子的宽度（等同于 right 减 left）。只读。 
    x |	float |	X轴横坐标，矩形盒子左边相对于视口原点（viewport origin）的距离。只读。 
    y	| float |	Y轴纵坐标，矩形盒子顶部相对于视口原点（viewport origin）的距离。只读。

    在Affix里面有两个函数用到了这个api。都在`index.tsx`里，分别是`getTargetRect`和`getOffset`。前者是获取`target`元素的对象集合，后者是用于`Affix`这个节点与`target`进行的计算

  * requestAnimationFrame() 
    理解成用于动画的`setTimeout`的强化版。它会随显示器的重绘频率来定义重绘频率。同时当页签运行这个动画并且这个标签在浏览器中不可见时，浏览器会暂停它。会减少cpu , 内存的压力。
    
    在`Affix`里面主要用于装饰器里面使用，并且在`_util/getRequestAnimationFrame`里做了兼容


* 装饰器
  完全不知道可以看看阮一峰大神的[博客](http://es6.ruanyifeng.com/#docs/decorator#%E6%96%B9%E6%B3%95%E7%9A%84%E4%BF%AE%E9%A5%B0)
  这里是用于类的属性/ 方法的修饰

  栗子

  ```js
  function readonly(target, name, descriptor){
    // target就是被修饰的类
    // name就是被修饰的属性
    // descriptor对象原来的值如下
    // {
    //   value: specifiedFunction,
    //   enumerable: false,
    //   configurable: true,
    //   writable: true
    // };
    descriptor.writable = false;
    return descriptor;
  }

  readonly(Person.prototype, 'name', descriptor);
  // 类似于
  Object.defineProperty(Person.prototype, 'name', descriptor);
  ```

  在Affix里面的使用如下
  ```js
  @throttleByAnimationFrameDecorator()
  updatePosition(e: any) {
    //....
  }
  ```

  来看看装饰器的代码 
  ```tsx

  import getRequestAnimationFrame, { cancelRequestAnimationFrame } from '../_util/getRequestAnimationFrame';
  // 这和个reqAnimFrame其实就是 window.requestAnimationFrame 的api
  const reqAnimFrame = getRequestAnimationFrame();
  // 这个fn 其实就是被装饰的类的方法
  export default function throttleByAnimationFrame(fn: (...args: any[]) => void) {
    let requestId: number | null;

    const later = (args: any[]) => () => {
      requestId = null;
      fn(...args);
    };

    const throttled = (...args: any[]) => {
      if (requestId == null) {
        // requestAnimationFrame( () => {} )   和setTimeout用法一样，传入一个回调
        requestId = reqAnimFrame(later(args));
      }
    };
    // 用于取消定时器 挂在他的一个属性上
    (throttled as any).cancel = () => cancelRequestAnimationFrame(requestId!);

    return throttled;
  }
  // 这个地方看的不够细，水平还不够，以后再进来仔细看
  export function throttleByAnimationFrameDecorator() {
    // 三个参数 看上面的知识点。
    return function(target: any, key: string, descriptor: any) {
      // 这里等于 updatePosition 的函数
      let fn = descriptor.value;
      let definingProperty = false;
      return {
        configurable: true,
        // 装饰他的 get 方法
        get() {
          if (definingProperty || this === target.prototype || this.hasOwnProperty(key)) {
            return fn;
          }
          // 也就是用动画 throttleByAnimationFrame 来装饰 fn
          let boundFn = throttleByAnimationFrame(fn.bind(this));
          definingProperty = true;
          Object.defineProperty(this, key, {
            value: boundFn,
            configurable: true,
            writable: true,
          });
          definingProperty = false;
          return boundFn;
        },
      };
    };
  }
  ```
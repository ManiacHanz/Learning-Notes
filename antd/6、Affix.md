
# Affix 固钉  

### [官方文档](http://ant-design.gitee.io/components/affix-cn/)

 > 水平有限，参考了这篇[博客](https://juejin.im/post/59e8d66f518825619b4e0d9a)

### 知识点

* style.cssText [MDN](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration/cssText)
  返回或设置一个行内元素的文本样式

* 先是2个Api。getBoundingClientRect 和 requestAnimationFrame 熟悉的朋友可以跳过
  
  * object.getBoundingClientRect()    [MDN地址](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect)
    返回值是一个 [DOMRect](https://developer.mozilla.org/zh-CN/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIDOMClientRect) 对象，这个对象是由该元素的 `getClientRects()` 方法返回的一组矩形的集合, 即：是与该元素相关的CSS 边框集合
    
    | Attribute | Type | Description |
    | --- | --- | --- | --- |
    | bottom | float | Y 轴，相对于视口原点（viewport origin）矩形盒子的底部。只读。|
    | height | float | 矩形盒子的高度（等同于 bottom 减 top）。只读。|
    | left | float | X 轴，相对于视口原点（viewport origin）矩形盒子的左侧。只读。|
    | right | float | X 轴，相对于视口原点（viewport origin）矩形盒子的右侧。只读。|
    | top | float | Y 轴，相对于视口原点（viewport origin）矩形盒子的顶部。只读。|
    | width | float |	矩形盒子的宽度（等同于 right 减 left）。只读。|
    | x |	float |	X轴横坐标，矩形盒子左边相对于视口原点（viewport origin）的距离。只读。| 
    | y	| float |	Y轴纵坐标，矩形盒子顶部相对于视口原点（viewport origin）的距离。只读。|

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


接下来就开始源码了。源码看着很长，但是功能被划分的很好，所以我们分几块来看就会清晰很多。

先看接口和`render`

```tsx
// Affix 所有的参数都是可选的
export interface AffixProps {
  /**
   * 距离窗口顶部达到指定偏移量后触发
   */
  offsetTop?: number;
  offset?: number;
  /** 距离窗口底部达到指定偏移量后触发 */
  offsetBottom?: number;
  style?: React.CSSProperties;
  /** 固定状态改变时触发的回调函数 */
  onChange?: (affixed?: boolean) => void;
  /** 设置 Affix 需要监听其滚动事件的元素，值为一个返回对应 DOM 元素的函数 */
  // 不设置的时候ant 默认为window
  target?: () => Window | HTMLElement | null;
  prefixCls?: string;
}
  // ref的两个简单函数  把fixedNode挂在固钉上，把placeholderNode挂在占据的东西上
  saveFixedNode = (node: HTMLDivElement) => {
    this.fixedNode = node;
  }

  savePlaceholderNode = (node: HTMLDivElement) => {
    this.placeholderNode = node;
  }
  
  render() {
    const className = classNames({
      [this.props.prefixCls || 'ant-affix']: this.state.affixStyle,
    });

    const props = omit(this.props, ['prefixCls', 'offsetTop', 'offsetBottom', 'target', 'onChange']);
    const placeholderStyle = { ...this.state.placeholderStyle, ...this.props.style };
    return (
      {/* 
        这里包了两层div，同时两层拥有两个不同的样式，原因如下
        当固钉移动的时候会脱离文本流，此时原有容器可能会因为这个元素的改变而改变
        此时 外层 带着 placeholderStyle的这个元素会去占据原有元素的位置
      */}
      <div {...props} style={placeholderStyle} ref={this.savePlaceholderNode}>
        <div className={className} ref={this.saveFixedNode} style={this.state.affixStyle}>
          {this.props.children}
        </div>
      </div>
    );
  }

```

那么接下来来看，设置这两个style的配置函数

```tsx
  state: AffixState = {
    affixStyle: undefined,
    placeholderStyle: undefined,
  };
  // 设置 固钉 本身的样式
  setAffixStyle(e: any, affixStyle: React.CSSProperties | null) {
    // noop 是个空函数 () => {} , getDefaultTarget 是 默认返回 window 作为 target的函数
    const { onChange = noop, target = getDefaultTarget } = this.props;
    // prevState 
    const originalAffixStyle = this.state.affixStyle;
    const isWindow = target() === window;
    // e.type 事件类型 滚动的时候 
    // originalAffixStyle    affixStyle 都有值 也就是滚动过程中不重复setState？
    if (e.type === 'scroll' && originalAffixStyle && affixStyle && isWindow) {
      return;
    }
    // 浅比较
    if (shallowequal(affixStyle, originalAffixStyle)) {
      return;
    }
    this.setState({ affixStyle: affixStyle as React.CSSProperties }, () => {
      // setState回调  有一个地方会传一个null进来 
      const affixed = !!this.state.affixStyle;
      if ((affixStyle && !originalAffixStyle) ||
          (!affixStyle && originalAffixStyle)) {
        // 有两种情况造成这样 ，第一种是第一次把state变成fixed的时候 这个满足 || 之前的情况
        // 第二种情况是 传入的null 也就是original为true 而affix变成 flase的时候
        // 也就是说 这两个情况正好代表着移动和固定 调用这个onChange
        // 所以文档上写的是 固定状态改变时触发的回调函数    
        onChange(affixed);
      }
    });
  }
  // 设置 占据位置 样式
  setPlaceholderStyle(placeholderStyle: React.CSSProperties | null) {
    const originalPlaceholderStyle = this.state.placeholderStyle;
    // 浅比较 避免重复设置
    if (shallowequal(placeholderStyle, originalPlaceholderStyle)) {
      return;
    }
    // 改变placeholderStyle
    this.setState({ placeholderStyle: placeholderStyle as React.CSSProperties });
  }

  /*
  * 这个函数唯一的调用是在 resize的时候调用
  * e是 事件，e.type是事件类型 比如onClick e.type就会等于 click
  * if (e.type === 'resize') {
  *   this.syncPlaceholderStyle(e);
  * }
  */
  syncPlaceholderStyle(e: any) {
    const { affixStyle } = this.state;
    if (!affixStyle) {
      return;
    }
    this.placeholderNode.style.cssText = '';
    // 调用的时候会重新计算
    this.setAffixStyle(e, {
      ...affixStyle,
      // offsetWidth 带着 border 的宽度 
      width: this.placeholderNode.offsetWidth,
    });
    this.setPlaceholderStyle({
      width: this.placeholderNode.offsetWidth,
    });
  }

```


上面改变状态的函数看完 我们来看最长的那个被装饰的函数 `updatePosition`
这个函数有三处调用 `componentWillReceiveProps` 时更新；`componentWillUnmount` 时用装饰的`cancel` 方法，取消掉定时器 `cancelRequestAnimationFrame` ；还有个就是在 `componentDidMount` 里面去注册监听。

先看两个会用到的工具函数

`getScroll`主要是用来兼容，还有一个是获取纵向的滚动或者横向的滚动

```tsx
export default function getScroll(target: any, top: boolean): number {
  if (typeof window === 'undefined') {
    return 0;
  }

  const prop = top ? 'pageYOffset' : 'pageXOffset';
  const method = top ? 'scrollTop' : 'scrollLeft';
  const isWindow = target === window;

  let ret = isWindow ? target[prop] : target[method];
  // ie6,7,8 standard mode
  if (isWindow && typeof ret !== 'number') {
    ret = window.document.documentElement[method];
  }

  return ret;
}

```

`getOffset`主要是用来进行一些计算

```tsx
function getTargetRect(target: HTMLElement | Window | null): ClientRect {
  return target !== window ?
    (target as HTMLElement).getBoundingClientRect() :
    { top: 0, left: 0, bottom: 0 } as ClientRect;
}

// element是 affix  target是相对滚动的容器
function getOffset(element: HTMLElement, target: HTMLElement | Window | null) {
  const elemRect = element.getBoundingClientRect();
  const targetRect = getTargetRect(target);

  const scrollTop = getScroll(target, true);
  const scrollLeft = getScroll(target, false);

  const docElem = window.document.body;
  const clientTop = docElem.clientTop || 0;
  const clientLeft = docElem.clientLeft || 0;

  return {
    top: elemRect.top - targetRect.top +
      scrollTop - clientTop,
    left: elemRect.left - targetRect.left +
      scrollLeft - clientLeft,
    width: elemRect.width,
    height: elemRect.height,
  };
}
```


接下来就是正餐

```tsx

  @throttleByAnimationFrameDecorator()
  updatePosition(e: any) {
    // 固钉并没有直接的offset的接口，如下注释是为了修复offsetTop传0的时候的问题
    let { offsetTop, offsetBottom, offset, target = getDefaultTarget } = this.props;
    const targetNode = target();

    // Backwards support
    // Fix: if offsetTop === 0, it will get undefined,
    //   if offsetBottom is type of number, offsetMode will be { top: false, ... }
    offsetTop = typeof offsetTop === 'undefined' ? offset : offsetTop;
    // getScroll函数  传true是表示上下滚动 ，传false是左右的滚动
    const scrollTop = getScroll(targetNode, true);
    // 找到这个节点
    const affixNode = ReactDOM.findDOMNode(this) as HTMLElement;
    const elemOffset = getOffset(affixNode, targetNode);
    // 这里获取固钉元素的大小
    const elemSize = {
      width: this.fixedNode.offsetWidth,
      height: this.fixedNode.offsetHeight,
    };
    // 定义 是 上固定还是下固定
    const offsetMode = {
      top: false,
      bottom: false,
    };
    // Default to `offsetTop=0`.默认offsetTop=0的时候
    if (typeof offsetTop !== 'number' && typeof offsetBottom !== 'number') {
      offsetMode.top = true;
      offsetTop = 0;
    } else {
      offsetMode.top = typeof offsetTop === 'number';
      offsetMode.bottom = typeof offsetBottom === 'number';
    }
    // target.getBoundingClientRect()
    const targetRect = getTargetRect(targetNode);
    // 固定节点高度的兼容
    const targetInnerHeight =
      (targetNode as Window).innerHeight || (targetNode as HTMLElement).clientHeight;
    // 如果滚动条的距离大于 组件位置高度减去传入参数的高度，并且偏移模式为向上的时候，这时候就是固定在顶部
    if (scrollTop > elemOffset.top - (offsetTop as number) && offsetMode.top) {
      // Fixed Top
      const width = elemOffset.width;
      const top = targetRect.top + (offsetTop as number);
      this.setAffixStyle(e, {
        position: 'fixed',
        top,
        left: targetRect.left + elemOffset.left,
        width,
      });
      this.setPlaceholderStyle({
        width,
        height: elemSize.height,
      });
    } 
    // 如果滚动距离小于组件位置高度减去组件高度和传入参数的高度并且偏移模式为向下的时候，为固定在底部
    else if (
      scrollTop < elemOffset.top + elemSize.height + (offsetBottom as number) - targetInnerHeight &&
        offsetMode.bottom
    ) {
      // Fixed Bottom
      const targetBottomOffet = targetNode === window ? 0 : (window.innerHeight - targetRect.bottom);
      const width = elemOffset.width;
      this.setAffixStyle(e, {
        position: 'fixed',
        bottom: targetBottomOffet + (offsetBottom as number),
        left: targetRect.left + elemOffset.left,
        width,
      });
      this.setPlaceholderStyle({
        width,
        height: elemOffset.height,
      });
    } 
    // 如果窗口变化，就重新计算状态
    else {
      const { affixStyle } = this.state;
      // 在 fixed状态下的窗口变化
      if (e.type === 'resize' && affixStyle && affixStyle.position === 'fixed' && affixNode.offsetWidth) {
        this.setAffixStyle(e, { ...affixStyle, width: affixNode.offsetWidth });
      } 
      // 没有fixed状态下
      else {
        this.setAffixStyle(e, null);
      }
      this.setPlaceholderStyle(null);
    }

    if (e.type === 'resize') {
      this.syncPlaceholderStyle(e);
    }
  }

```

核心部分 算是完了，但是具体的计算这一块，涉及到很多的高度和距离的api，还需仔细品味
剩下的看看生命周期中的事件监听和取消


```tsx
  // 
  componentDidMount() {
    const target = this.props.target || getDefaultTarget;
    // Wait for parent component ref has its value
    // 异步 确认父元素ref已经被绑定，应该等于nextTick的感觉
    this.timeout = setTimeout(() => {
      this.setTargetEventListeners(target);
    });
  }

  componentWillReceiveProps(nextProps: AffixProps) {
    if (this.props.target !== nextProps.target) {
      this.clearEventListeners();
      this.setTargetEventListeners(nextProps.target!);

      // Mock Event object.
      this.updatePosition({});
    }
  }
  // 卸载时注销监听
  componentWillUnmount() {
    this.clearEventListeners();
    clearTimeout(this.timeout);
    (this.updatePosition as any).cancel();
  }

  // 绑定监听
  setTargetEventListeners(getTarget: () => HTMLElement | Window | null) {
    const target = getTarget();
    if (!target) {
      return;
    }
    this.clearEventListeners();

    /*
      events = [
        'resize',
        'scroll',
        'touchstart',
        'touchmove',
        'touchend',
        'pageshow',
        'load',
      ];

      eventHandlers: {
        [key: string]: any;
      } = {};

    */
    // 把这几个事件巡皇绑定
    this.events.forEach(eventName => {
      this.eventHandlers[eventName] = addEventListener(target, eventName, this.updatePosition);
    });
  }

  // 注销监听
  clearEventListeners() {
    this.events.forEach(eventName => {
      const handler = this.eventHandlers[eventName];
      if (handler && handler.remove) {
        handler.remove();
      }
    });
  }
```


至此，Affix的函数基本解析结束，主要的在于兼容性下，计算滚动高度和容器高度等，以及在什么地方调用onChange回调
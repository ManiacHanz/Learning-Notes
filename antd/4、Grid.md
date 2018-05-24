# 栅格系统Grid  

### Row 和 Col


### Row

### 知识点

* `enquire.js` [源码](https://github.com/WickyNilliams/enquire.js) 在javascript中使用媒体查询，虽然有 `matchMedia()` Api，但是兼容性是个问题([caniuse](https://caniuse.com/#feat=matchmedia))。所以就使用enquire.js和pollyfile实现这个功能。antd Row里面是用了这个实现自适应

* React的顶层Api `cloneElement` [官网](http://www.css88.com/react/docs/react-api.html#cloneelement)
  ```js
  React.cloneElement(
    element,
    [props],
    [...children]
  )
  ```
  使用 element 作为起点，克隆并返回一个新的 React 元素。 所产生的元素将具有原始元素的 props ，新的 props 为浅层合并。 新的子元素将取代现有的子元素， key 和 ref 将被保留。
  几乎等效于以下
  ```js
  <element.type {...element.props} {...props}>{children}</element.type>
  ```
  然而，它也会保留 ref 。这意味着，如果你通过它上面的 ref 获取自己的子节点，你将**不会**有机会从你的祖先获取它。你只会获得绑定在你的**新元素**上的相同ref 。


```tsx
// 功能性代码，在浏览器环境下引入enquire.js
let enquire: any;
if (typeof window !== 'undefined') {
  const matchMediaPolyfill = (mediaQuery: string): MediaQueryList => {
    return {
      media: mediaQuery,
      matches: false,
      addListener() {
      },
      removeListener() {
      },
    };
  };
  window.matchMedia = window.matchMedia || matchMediaPolyfill;
  enquire = require('enquire.js');
}
```

使用一个数组一个对象，就把响应式的概要定义完毕
```tsx
const responsiveArray: Breakpoint[] = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'];

const responsiveMap: BreakpointMap = {
  // 这里的value这么定义是因为enquire.js里面需要有这个格式，和css里面的媒体查询格式类似
  xs: '(max-width: 575px)',
  sm: '(min-width: 576px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 992px)',
  xl: '(min-width: 1200px)',
  xxl: '(min-width: 1600px)',
};
```

```tsx
export default class Row extends React.Component<RowProps, RowState> {
  // .......
  // 用组件的state保存 响应式的大小，当进入范围以后，当前的key就为true，其他为false
  state: RowState = {
    screens: {},
  };
  componentDidMount() {
    Object.keys(responsiveMap)
      // 看exquire的api    注册一个媒体查询
      .map((screen: Breakpoint) => enquire.register(responsiveMap[screen], {
          // 匹配时
          match: () => {
            if (typeof this.props.gutter !== 'object') {
              return;
            }
            this.setState((prevState) => ({
              screens: {
                ...prevState.screens,
                [screen]: true,
              },
            }));
          },
          // 不匹配时
          unmatch: () => {
            if (typeof this.props.gutter !== 'object') {
              return;
            }
            this.setState((prevState) => ({
              screens: {
                ...prevState.screens,
                [screen]: false,
              },
            }));
          },
          // Keep a empty destory to avoid triggering unmatch when unregister
          // 空的destory，避免在unregister注销时触发unmatch
          destroy() {},
        },
      ));
  }
  componentWillUnmount() {
    Object.keys(responsiveMap)
      // 注销
      .map((screen: Breakpoint) => enquire.unregister(responsiveMap[screen]));
  }

  //....
}  
```

```tsx
  // 
  getGutter() {
    // gutter的结构 { xs: 8, sm: 16, md: 24} 如果直接写数字就是像素值，会直接return回去
    const { gutter } = this.props;
    if (typeof gutter === 'object') {
      for (let i = 0; i <= responsiveArray.length; i++) {
        const breakpoint: Breakpoint = responsiveArray[i];
        if (this.state.screens[breakpoint] && gutter[breakpoint] !== undefined) {
          return gutter[breakpoint];
        }
      }
    }
    return gutter;
  }
  render() {
    const {
      type, justify, align, className, style, children,
      prefixCls = 'ant-row', ...others,
    } = this.props;
    const gutter = this.getGutter();
    const classes = classNames({
      [prefixCls]: !type,
      [`${prefixCls}-${type}`]: type,
      [`${prefixCls}-${type}-${justify}`]: type && justify,
      [`${prefixCls}-${type}-${align}`]: type && align,
    }, className);
    // gutter表示间距，实现原理是外层div左右两端包的padding
    // 这样有个问题就是第一个Col 会多出一个padding-left 最后一个Col会多出一个padding-right
    // 这里是解决办法 就是让Row 左右两边加2个负的margin
    // 这里参考了 markzzw的博客(https://juejin.im/post/59e4cdeef265da43070254f9)
    const rowStyle = (gutter as number) > 0 ? {
      marginLeft: (gutter as number) / -2,
      marginRight: (gutter as number) / -2,
      ...style,
    } : style;
    // React.Children用来处理children这个不透明数据结构，也就是map children
    const cols = Children.map(children, (col: React.ReactElement<HTMLDivElement>) => {
      if (!col) {
        return null;
      }
      // as number类型断言  编译阶段起作用
      if (col.props && (gutter as number) > 0) {
        return cloneElement(col, {
          style: {
            paddingLeft: (gutter as number) / 2,
            paddingRight: (gutter as number) / 2,
            ...col.props.style,
          },
        });
      }
      return col;
    });
    const otherProps = { ...others };
    // 删除gutter属性
    delete otherProps.gutter;
    return <div {...otherProps} className={classes} style={rowStyle}>{cols}</div>;
  }
```



### Col

和Row 基本类似 ，通过一系列的props计算以后最后返回children
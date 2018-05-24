# Layout布局组件

> 很多细节还是没看到...

### Layout

####核心代码
`generator`生成HOC

```tsx
export interface BasicProps extends React.HTMLAttributes<HTMLDivElement> {
  prefixCls?: string;
  hasSider?: boolean;
}

// 核心函数 HOC 目的是把prefixCls这个属性放进 Basic里，这个属性就是用来区分位置的className
function generator(props: BasicProps) {
  return (BasicComponent: React.ComponentClass<BasicProps>): any => {
    return class Adapter extends React.Component<BasicProps, any> {
      static Header: any;
      static Footer: any;
      static Content: any;
      static Sider: any;
      render() {
        const { prefixCls } = props;
        return <BasicComponent prefixCls={prefixCls} {...this.props} />;
      }
    };
  };
}
// .......

const Layout: React.ComponentClass<BasicProps> & {
  Header: React.ComponentClass<BasicProps>;
  Footer: React.ComponentClass<BasicProps>;
  Content: React.ComponentClass<BasicProps>;
  Sider: React.ComponentClass<SiderProps>;
} = generator({
  prefixCls: 'ant-layout',
})(BasicLayout);

const Header = generator({
  prefixCls: 'ant-layout-header',
})(Basic);

const Footer = generator({
  prefixCls: 'ant-layout-footer',
})(Basic);

const Content = generator({
  prefixCls: 'ant-layout-content',
})(Basic);

Layout.Header = Header;
Layout.Footer = Footer;
Layout.Content = Content;

export default Layout;
```


接下来看两个Basic组件
```tsx
class Basic extends React.Component<BasicProps, any> {
  // 只了拼了一个 prefixCls上去
  render() {
    const { prefixCls, className, children, ...others } = this.props;
    const divCls = classNames(className, prefixCls);
    return (
      <div className={divCls} {...others}>{children}</div>
    );
  }
}

class BasicLayout extends React.Component<BasicProps, any> {
  static childContextTypes = {
    siderHook: PropTypes.object,
  };
  state = { siders: [] };

  // 通过context传给子孙后代
  getChildContext() {
    return {
      siderHook: {
        addSider: (id: string) => {
          this.setState({
            siders: [...this.state.siders, id],
          });
        },
        removeSider: (id: string) => {
          this.setState({
            siders: this.state.siders.filter(currentId => currentId !== id),
          });
        },
      },
    };
  }

  render() {
    const { prefixCls, className, children, hasSider, ...others } = this.props;
    const divCls = classNames(className, prefixCls, {
      [`${prefixCls}-has-sider`]: hasSider || this.state.siders.length > 0,
    });
    return (
      <div className={divCls} {...others}>{children}</div>
    );
  }
}
```


### Sider

##### 知识点

* 闭包的用法
  用来记录一个i，可以保证每次生成唯一id
  ```tsx
  const generateId = (() => {
    // 闭包 i被引用，不会被回收
    let i = 0;
    return (prefix: string = '') => {
      i += 1;
      return `${prefix}${i}`;
    };
  })();
  // .....
  this.uniqueId = generateId('ant-sider-');
  ```

响应式同`Grid`的`responsiveMap` 用一个对象来定义响应范围
```tsx
const dimensionMap = {
  xs: '480px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1600px',
};
```

接下来看看暴露的组件
```tsx
export default class Sider extends React.Component<SiderProps, SiderState> {
  // ....
  static defaultProps = {
    prefixCls: 'ant-layout-sider',
    collapsible: false,           // 是否可以收起的配置
    defaultCollapsed: false,      // 这里默认就收起 下面用的就是这个false
    reverseArrow: false,
    width: 200,
    collapsedWidth: 80,
    style: {},
  };

  static childContextTypes = {
    siderCollapsed: PropTypes.bool,
    collapsedWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  };

  // 从context里面取出的属性  BasicLayout组件
  static contextTypes = {
    siderHook: PropTypes.object,
  };

  private mql: MediaQueryList;
  private uniqueId: string;

  constructor(props: SiderProps) {
    super(props);
    this.uniqueId = generateId('ant-sider-');
    let matchMedia;
    if (typeof window !== 'undefined') {
      matchMedia = window.matchMedia;
    }
    if (matchMedia && props.breakpoint && props.breakpoint in dimensionMap) {
      this.mql = matchMedia(`(max-width: ${dimensionMap[props.breakpoint]})`);
    }
    // 判断是否配置了可收起
    let collapsed;
    if ('collapsed' in props) {
      collapsed = props.collapsed;
    } else {
      collapsed = props.defaultCollapsed;
    }
    this.state = {
      collapsed,
      below: false,
    };
  }

  // 把是否可收起 和 收起后宽度 继续往下传
  getChildContext() {
    return {
      siderCollapsed: this.state.collapsed,
      collapsedWidth: this.props.collapsedWidth,
    };
  }

  // 如果更新了是否可收起的配置 就更新state
  componentWillReceiveProps(nextProps: SiderProps) {
    if ('collapsed' in nextProps) {
      this.setState({
        collapsed: nextProps.collapsed,
      });
    }
  }

  // 这两个addSider和 removeSider是 上面context传进来了，但是不知道有什么用
  componentDidMount() {
    if (this.mql) {
      this.mql.addListener(this.responsiveHandler);
      this.responsiveHandler(this.mql);
    }

    if (this.context.siderHook) {
      this.context.siderHook.addSider(this.uniqueId);
    }
  }

  componentWillUnmount() {
    if (this.mql) {
      this.mql.removeListener(this.responsiveHandler);
    }

    if (this.context.siderHook) {
      this.context.siderHook.removeSider(this.uniqueId);
    }
  }
  // 监听响应式的展开收起
  responsiveHandler = (mql: MediaQueryList) => {
    this.setState({ below: mql.matches });
    if (this.state.collapsed !== mql.matches) {
      this.setCollapsed(mql.matches, 'responsive');
    }
  }
  // 这里第二个参数 只是可以表示 是通过 按钮触发 或者是 响应式触发 的收起，可以在回调的时候进行判断 
  setCollapsed = (collapsed: boolean, type: CollapseType) => {
    if (!('collapsed' in this.props)) {
      this.setState({
        collapsed,
      });
    }
    const { onCollapse } = this.props;
    if (onCollapse) {
      // 收起展开的回调
      onCollapse(collapsed, type);
    }
  }

  toggle = () => {
    const collapsed = !this.state.collapsed;
    this.setCollapsed(collapsed, 'clickTrigger');
  }

  belowShowChange = () => {
    this.setState({ belowShow: !this.state.belowShow });
  }

  render() {
    const { prefixCls, className,
      collapsible, reverseArrow, trigger, style, width, collapsedWidth,
      ...others,
    } = this.props;
    // 外层的属性
    const divProps = omit(others, ['collapsed',
      'defaultCollapsed', 'onCollapse', 'breakpoint']);
    const rawWidth = this.state.collapsed ? collapsedWidth : width;
    // use "px" as fallback unit for width
    const siderWidth = typeof rawWidth === 'number' ? `${rawWidth}px` : String(rawWidth || 0);
    // special trigger when collapsedWidth == 0
    const zeroWidthTrigger = parseFloat(String(collapsedWidth || 0)) === 0 ? (
      <span onClick={this.toggle} className={`${prefixCls}-zero-width-trigger`}>
        <Icon type="bars" />
      </span>
    ) : null;
    // 图标的变化
    const iconObj = {
      'expanded': reverseArrow ? <Icon type="right" /> : <Icon type="left" />,
      'collapsed': reverseArrow ? <Icon type="left" /> : <Icon type="right" />,
    };
    // 当前是否收起的状态
    const status = this.state.collapsed ? 'collapsed' : 'expanded';
    const defaultTrigger = iconObj[status];
    const triggerDom = (
      trigger !== null ?
      zeroWidthTrigger || (
        <div className={`${prefixCls}-trigger`} onClick={this.toggle} style={{ width: siderWidth }}>
          {trigger || defaultTrigger}
        </div>
      ) : null
    );
    const divStyle = {
      ...style,
      flex: `0 0 ${siderWidth}`,
      maxWidth: siderWidth, // Fix width transition bug in IE11
      minWidth: siderWidth, // https://github.com/ant-design/ant-design/issues/6349
      width: siderWidth,
    };
    const siderCls = classNames(className, prefixCls, {
      [`${prefixCls}-collapsed`]: !!this.state.collapsed,
      [`${prefixCls}-has-trigger`]: collapsible && trigger !== null && !zeroWidthTrigger,
      [`${prefixCls}-below`]: !!this.state.below,
      [`${prefixCls}-zero-width`]: parseFloat(siderWidth) === 0,
    });
    return (
      <div className={siderCls} {...divProps} style={divStyle}>
        <div className={`${prefixCls}-children`}>{this.props.children}</div>
        {collapsible || (this.state.below && zeroWidthTrigger) ? triggerDom : null}
      </div>
    );
  }
}
```
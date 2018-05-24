

## Button 组件

#### index.tsx
把Group挂在Button上作为属性调用
```js
Button.Group = ButtonGroup
```

#### [button.tsx](https://github.com/ant-design/ant-design/blob/master/components/button/button.tsx)

首先两个功能函数
```js
function isString(str: any) {
  return typeof str === 'string';
}

// 给汉字中间插入一个空格
const rxTwoCNChar = /^[\u4e00-\u9fa5]{2}$/;
const isTwoCNChar = rxTwoCNChar.test.bind(rxTwoCNChar);
function insertSpace(child: React.ReactChild, needInserted: boolean) {
  // <Button>中没有就返回
  if (child == null) {
    return;
  }
  const SPACE = needInserted ? ' ' : '';
  // strictNullChecks oops.
  if (typeof child !== 'string' && typeof child !== 'number' &&
    // 这个是 vdom里面会有的type属性
    isString(child.type) && isTwoCNChar(child.props.children)) {
    return React.cloneElement(child, {},
      child.props.children.split('').join(SPACE));
  }
  if (typeof child === 'string') {
    if (isTwoCNChar(child)) {
      child = child.split('').join(SPACE);
    }
    return <span>{child}</span>;
  }
  return child;
}
```


```tsx
// 一些接口的定义
export default class Button extends React.Component<ButtonProps, any> {
  static Group: typeof Group;
  static __ANT_BUTTON = true;

  static defaultProps = {
    prefixCls: 'ant-btn',
    loading: false,
    ghost: false,
  };

  static propTypes = {
    //
  };

  timeout: number;
  delayTimeout: number;

  constructor(props: ButtonProps) {
    super(props);
    this.state = {
      loading: props.loading,
      clicked: false,
      hasTwoCNChar: false,    //两个中文insertSpace
    };
  }

  componentDidMount() {
    this.fixTwoCNChar();
  }

  componentWillReceiveProps(nextProps: ButtonProps) {
    const currentLoading = this.props.loading;
    const loading = nextProps.loading;
    // loading的时候更新组件要清空定时器
    if (currentLoading) {
      clearTimeout(this.delayTimeout);
    }

    if (typeof loading !== 'boolean' && loading && loading.delay) {
      this.delayTimeout = window.setTimeout(() => this.setState({ loading }), loading.delay);
    } else {
      this.setState({ loading });
    }
  }

  componentDidUpdate() {
    this.fixTwoCNChar();
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    if (this.delayTimeout) {
      clearTimeout(this.delayTimeout);
    }
  }

  fixTwoCNChar() {
    // Fix for HOC usage like <FormatMessage />
    // 
    const node = (findDOMNode(this) as HTMLElement);
    const buttonText = node.textContent || node.innerText;
    // 只有一个子元素并且不是icon && 是两个汉字
    if (this.isNeedInserted() && isTwoCNChar(buttonText)) {
      if (!this.state.hasTwoCNChar) {
        this.setState({
          hasTwoCNChar: true,
        });
      }
    } else if (this.state.hasTwoCNChar) {
      this.setState({
        hasTwoCNChar: false,
      });
    }
  }

  isNeedInserted() {
    const { icon, children } = this.props;
    return React.Children.count(children) === 1 && !icon;
  }

  handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    // Add click effect
    // 防抖?
    this.setState({ clicked: true });
    clearTimeout(this.timeout);
    this.timeout = window.setTimeout(() => this.setState({ clicked: false }), 500);

    const onClick = this.props.onClick;
    if (onClick) {
      (onClick as (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void)(e);
    }
  }
  

  render() {
    const {
      type, shape, size, className, htmlType, children, icon, prefixCls, ghost, ...others,
    } = this.props;

    const { loading, clicked, hasTwoCNChar } = this.state;

    // large => lg
    // small => sm
    let sizeCls = '';
    switch (size) {
      case 'large':
        sizeCls = 'lg';
        break;
      case 'small':
        sizeCls = 'sm';
      default:
        break;
    }

    // 如果button带一个href属性 就会返回a标签，其他返回button
    const ComponentProp = (others as AnchorButtonProps).href ? 'a' : 'button';

    // 整合classname
    const classes = classNames(prefixCls, className, {
      [`${prefixCls}-${type}`]: type,
      [`${prefixCls}-${shape}`]: shape,
      [`${prefixCls}-${sizeCls}`]: sizeCls,
      [`${prefixCls}-icon-only`]: !children && icon,
      [`${prefixCls}-loading`]: loading,
      [`${prefixCls}-clicked`]: clicked,
      [`${prefixCls}-background-ghost`]: ghost,
      [`${prefixCls}-two-chinese-chars`]: hasTwoCNChar,
    });

    const iconType = loading ? 'loading' : icon;
    const iconNode = iconType ? <Icon type={iconType} /> : null;
    // kids 处理
    const kids = (children || children === 0)
      // 这里的map 遍历子元素  但是这个map写法看不懂
      ? React.Children.map(children, child => insertSpace(child, this.isNeedInserted())) : null;

    return (
      <ComponentProp
        {...omit(others, ['loading'])}
        type={(others as AnchorButtonProps).href ? undefined : (htmlType || 'button')}
        className={classes}
        onClick={this.handleClick}
      >
        {iconNode}{kids}  
      </ComponentProp>
    );
  }
}

```


剩下的 `Group` 就很简单
```tsx
const ButtonGroup: React.SFC<ButtonGroupProps> = (props) => {
  // Group最外层的div都有ant-btn-group
  const { prefixCls = 'ant-btn-group', size, className, ...others } = props;

  // large => lg
  // small => sm
  let sizeCls = '';
  switch (size) {
    case 'large':
      sizeCls = 'lg';
      break;
    case 'small':
      sizeCls = 'sm';
    default:
      break;
  }

  const classes = classNames(prefixCls, {
    [`${prefixCls}-${sizeCls}`]: sizeCls,
  }, className);

  // 这里 应该把children也放在这个others里面了 （学习这个写法）
  return <div {...others} className={classes} />;
};
```

根据上面的写法 有两种方法可以
```js
// 一、这个可以直接渲染里面的子组件
<div>{this.props.children}</div>

// 二、这里放others也可以渲染出子组件。但是不能直接放 this.props.children
render(){
  const { propsA, propsB, ...others } = this.props
  return (
    <div {...others} />
  )
}
```
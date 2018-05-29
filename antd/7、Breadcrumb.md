
# Breadcrumb 面包屑

  [官网](http://ant-design.gitee.io/components/breadcrumb-cn/)

### 知识点 

  比较简单，没什么难点。
  *可以学习一下，封装组件的时候传入`render`这种函数，以及配合`react-router`的渲染封装*

* PropTypes.element  约束为一个React元素



### Breadcrumb 

    主要是根据是否配置了`routes`来做一个分流`render`，那先看下可配置项说明吧

itemRender	自定义链接函数，和 react-router 配置使用	(route, params, routes, paths) => ReactNode	
params	路由的参数	object
routes	router 的路由栈信息	object[]
separator	分隔符自定义	string|ReactNode


直接上源码了


```tsx

function getBreadcrumbName(route: Route, params: any) {
  if (!route.breadcrumbName) {
    return null;
  }
  const paramsKeys = Object.keys(params).join('|');
  const name = route.breadcrumbName.replace(
    new RegExp(`:(${paramsKeys})`, 'g'),
    (replacement, key) => params[key] || replacement,
  );
  return name;
}
// 传了routes不传itemRender时的默认渲染一个 a标签或者span标签
function defaultItemRender(route: Route, params: any, routes: Route[], paths: string[]) {
  const isLastItem = routes.indexOf(route) === routes.length - 1;
  const name = getBreadcrumbName(route, params);
  return isLastItem
    ? <span>{name}</span>
    : <a href={`#/${paths.join('/')}`}>{name}</a>;
}

export default class Breadcrumb extends React.Component<BreadcrumbProps, any> {
  static Item: typeof BreadcrumbItem;

  static defaultProps = {
    prefixCls: 'ant-breadcrumb',
    separator: '/',
  };

  static propTypes = {
    prefixCls: PropTypes.string,
    separator: PropTypes.node,
    routes: PropTypes.array,
    params: PropTypes.object,
    linkRender: PropTypes.func,
    nameRender: PropTypes.func,
  };

  componentDidMount() {
    const props = this.props;
    warning(
      !('linkRender' in props || 'nameRender' in props),
      '`linkRender` and `nameRender` are removed, please use `itemRender` instead, ' +
      'see: https://u.ant.design/item-render.',
    );
  }

  render() {
    let crumbs;
    const {
      separator, prefixCls, style, className, routes, params = {},
      children, itemRender = defaultItemRender,
    } = this.props;
    if (routes && routes.length > 0) {
      const paths: string[] = [];
      crumbs = routes.map((route) => {
        route.path = route.path || '';
        let path: string = route.path.replace(/^\//, '');
        Object.keys(params).forEach(key => {
          path = path.replace(`:${key}`, params[key]);
        });
        if (path) {
          paths.push(path);
        }
        return (
          <BreadcrumbItem separator={separator} key={route.breadcrumbName || path}>
            {itemRender(route, params, routes, paths)}
          </BreadcrumbItem>
        );
      });
    } 
    // 没有routes但是有children的情况
    else if (children) {
      crumbs = React.Children.map(children, (element: any, index) => {
        if (!element) {
          return element;
        }
        // 只能用Breadcrumb.Item. 这个__ANT_BREADCRUMB_ITEM 是在 item里面定义的
        warning(
          element.type && element.type.__ANT_BREADCRUMB_ITEM,
          'Breadcrumb only accepts Breadcrumb.Item as it\'s children',
        );
        return cloneElement(element, {
          separator,
          key: index,
        });
      });
    }
    return (
      <div className={classNames(className, prefixCls)} style={style}>
        {crumbs}
      </div>
    );
  }
}


```
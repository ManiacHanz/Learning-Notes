# Provider


### 知识点
* `getChildContext()`  除了官方文档还可以看[这里](https://github.com/brunoyang/blog/issues/9)
  **context**就是一组属性的集合，并被 **隐式** 的传递给后代
  _使用方法_ 使用 `getChildContext` 方法将属性传递给子组件，并使用`childContextTypes`声明传递数据类型，子组件中需要显示的使用 `contextTypes`声明需要用到的属性的数据类型。同时，需要在子组件里的`constructor`的参数里传进`context`，并使用`super`继承

* `return Children.only()`  [官网](http://www.css88.com/react/docs/react-api.html)
  返回**唯一**子集，否则抛出异常。所以`Provider`下只能有唯一的元素


``` javascript {.line-numbers}
import { Component, Children } from 'react'
import PropTypes from 'prop-types'
import { storeShape, subscriptionShape } from '../utils/PropTypes'
import warning from '../utils/warning'

let didWarnAboutReceivingStore = false
function warnAboutReceivingStore() {
  if (didWarnAboutReceivingStore) {
    return
  }
  didWarnAboutReceivingStore = true

  warning(
    '<Provider> does not support changing `store` on the fly. ' +
    'It is most likely that you see this error because you updated to ' +
    'Redux 2.x and React Redux 2.x which no longer hot reload reducers ' +
    'automatically. See https://github.com/reduxjs/react-redux/releases/' +
    'tag/v2.0.0 for the migration instructions.'
  )
}

export function createProvider(storeKey = 'store', subKey) {
    // 第一个参数就是store，第二个参数暂时不知道什么用
    const subscriptionKey = subKey || `${storeKey}Subscription`

    class Provider extends Component {
        // 将store传给后代
        getChildContext() {
          return { [storeKey]: this[storeKey], [subscriptionKey]: null }
        }
        // context里的store挂在props上
        constructor(props, context) {
          super(props, context)
          this[storeKey] = props.store;
        }
        
        render() {
          return Children.only(this.props.children)
        }
    }

    if (process.env.NODE_ENV !== 'production') {
      Provider.prototype.componentWillReceiveProps = function (nextProps) {
        // store变更会报警告
        if (this[storeKey] !== nextProps.store) {
          warnAboutReceivingStore()
        }
      }
    }

    Provider.propTypes = {
        store: storeShape.isRequired,
        children: PropTypes.element.isRequired,
    }
    Provider.childContextTypes = {
        [storeKey]: storeShape.isRequired,
        [subscriptionKey]: subscriptionShape,
    }

    return Provider
}

export default createProvider()
```

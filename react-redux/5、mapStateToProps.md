
# connect里的第一个参数 

### mapStateToProps


源码
```js
import { wrapMapToPropsConstant, wrapMapToPropsFunc } from './wrapMapToProps'

// 字面理解    传入了一个func
export function whenMapStateToPropsIsFunction(mapStateToProps) {
  return (typeof mapStateToProps === 'function')
    ? wrapMapToPropsFunc(mapStateToProps, 'mapStateToProps')
    : undefined
}

// 字面理解     没有传入  也就是做给 connect()(WrapperComponent)
export function whenMapStateToPropsIsMissing(mapStateToProps) {
  return (!mapStateToProps)
    // 这里不传 等于其实只给返回的东西 加了一个 dependsOnOwnProps的属性并赋值false
    // 然后在selectorFactory里面进行了判断
    ? wrapMapToPropsConstant(() => ({}))
    : undefined
}


// wrapMapToProps.js
export function wrapMapToPropsConstant(getConstant) {
  return function initConstantSelector(dispatch, options) {
    // 把dispatch 和 options 通过传入的函数给被包裹的组件。
    // 如果如上面的 传入的是个空函数 wrapMapToPropsConstant(()=>{}) 那是不会给被包裹的组件传递任何的属性
    // 这里的constant会是undefined
    const constant = getConstant(dispatch, options)
    function constantSelector() { return constant }
    // 这里添加了一个属性，代表不依赖本身的props，在selectorFactory里面进行判断是否更新组件
    constantSelector.dependsOnOwnProps = false 
    return constantSelector
  }
}


//  这里有一段注释 dependsOnOwnProps两个作用
//  1、createMapToPropsProxy通过dependsOnOwnProps决定是否把props传给被wrapped的mapToProps function ； 2、makePurePropsSelector通过dependsOnOwnProps决定props改变了以后mapToProps是否该被调用
//  这里回看mapStateToProps的参数 (state,ownState)
//  下面是源码的一段注释  不太明白 
// A length of one signals that mapToProps does not depend on props from the parent component.
// A length of zero is assumed to mean mapToProps is getting args via arguments or ...args and
// therefore not reporting its length accurately..
export function getDependsOnOwnProps(mapToProps) {
  return (mapToProps.dependsOnOwnProps !== null && mapToProps.dependsOnOwnProps !== undefined)
    ? Boolean(mapToProps.dependsOnOwnProps)
    : mapToProps.length !== 1
}

// 用于whenMapStateToPropsIsFunction and whenMapDispatchToPropsIsFunction，理解成一个包裹了mapToProps的代理函数，有下面几个功能
// 1、在selectorFactory里面决定当props改变的时候是否要被重复调用，检测mapToProps的调用是否依赖于props
// 2、第一次调用时 处理mapToProps是否返回另一个函数，并且在subsequent 调用的时候把新函数当做mapToProps处理
// 3、第一次调用时，验证第一个结果是否是一个普通的对象， 来警告 mapToProps没有返回一个可靠的结果

export function wrapMapToPropsFunc(mapToProps, methodName) {
  return function initProxySelector(dispatch, { displayName }) {
    const proxy = function mapToPropsProxy(stateOrDispatch, ownProps) {
      return proxy.dependsOnOwnProps
        ? proxy.mapToProps(stateOrDispatch, ownProps)
        : proxy.mapToProps(stateOrDispatch)
    }

    // allow detectFactoryAndVerify to get ownProps
    proxy.dependsOnOwnProps = true

    proxy.mapToProps = function detectFactoryAndVerify(stateOrDispatch, ownProps) {
      proxy.mapToProps = mapToProps
      proxy.dependsOnOwnProps = getDependsOnOwnProps(mapToProps)
      let props = proxy(stateOrDispatch, ownProps)

      if (typeof props === 'function') {
        proxy.mapToProps = props
        proxy.dependsOnOwnProps = getDependsOnOwnProps(props)
        props = proxy(stateOrDispatch, ownProps)
      }

      if (process.env.NODE_ENV !== 'production') 
        verifyPlainObject(props, displayName, methodName)

      return props
    }

    return proxy
  }
}



// 暴露一个数组 在connect的match方法里面去重组
export default [
  whenMapStateToPropsIsFunction,
  whenMapStateToPropsIsMissing
]

```

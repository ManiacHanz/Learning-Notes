
let _Vue

class MyRouter {
  //见下方注释1 Vue关于use的一部分源码
  static install(Vue) {
    console.log('install counts...')
    if(MyRouter.install.isInstalled && _Vue === Vue) return
    // 避免重复安装插件 
    MyRouter.install.isInstalled = true
    _Vue = Vue
    console.log(12, Vue)
    // 使用Vue的全局混入
    // 相当于修改全局vue实例
    // 所有组件和实例上都会执行这个生命周期
    Vue.mixin({
      beforeCreate(){
        // 实例上面能拿到再挂载，组件上面没有 不需要挂载
        if(this.$options.$router) {
          Vue.prototype.$router = this.$options.router   // 注意，这里的this.$options是Vue 实例的初始化选项 代表的是new Vue({router})这里的参数
        }
      }
    })
  
    // 挂载$router和$route属性
    // Object.defineProperty(Vue.prototype, '$router')
  
    
  }

  // 这里的构造函数不完整，缺少做到能够new VueRouter({})返回router的能力
  constructor(options){
    this.options = options
    this.routerMap = {}
    console.log(_Vue)
    // 这里的data，先将就记录下当前路由地址
    this.data = _Vue.observable({       // 源码这里是使用defineReactive定义响应式到组件实例this.history上面
      current: '/'
    })
    this.initComponent()
  }
  // 源码是个更复杂的记录路由信息的处理函数
  // 道理还是一样的
  createRouteMap(){
    this.options.routes.forEach(route => {
      this.routerMap[route.path] = route.component
    })
  }

  initComponent(){
    const self = this
    // install方法还需要挂载组件
    _Vue.component('router-link', {
      props: {
        to: String        // 简单模拟<router-link>的属性
      },
      // methods: {
      //   click(e) {
      //     e.preventDefault()
      //   }
      // },
      // render函数参考Vue文档的组件部分
      // 注意这里不能用箭头函数，因为this指向
      render(h){ 
        return h('a', {
          attrs: {
            href: this.to
          },
          // on: {
          //   click: this.click
          // }
        }, [this.$slots.default]) 
      }  // 第三个参数是子节点，所以记住是数组
    })

    _Vue.component('router-view', {
      props: {
        
      },
      render(h){
        const component = self.routerMap[self.data.current]
        return h(component)
      }
    })
  }
}



export default MyRouter


/**
 * 注释1 Vue.use 的参数如果是函数会直接调用，如果有.install方法就调用.install方法
  // if (typeof plugin.install === 'function') {
  //   plugin.install.apply(plugin, args)
  // } else if (typeof plugin === 'function') {
  //   plugin.apply(null, args)
  // }
*/
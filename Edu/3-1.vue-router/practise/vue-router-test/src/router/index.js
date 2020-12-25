import VueRouter from 'vue-router'
import Foo from '@/components/Foo'
import HelloWorld from '@/components/HelloWorld'
import Bar from '@/components/Bar'
// import MyRouter from '../../myRoute'

const routes = [
  { path: '/hello', component: HelloWorld },
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar }
]

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})

// const router = new MyRouter({
//   routes
// })

export default router
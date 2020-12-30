一、简答题
1、当我们点击按钮的时候动态给 data 增加的成员是否是响应式数据，如果不是的话，如何把新增成员设置成响应式数据，它的内部原理是什么。
let vm = new Vue({
 el: '#el'
 data: {
  o: 'object',
  dog: {}
 },
 method: {
  clickHandler () {
   // 该 name 属性是否是响应式的
   this.dog.name = 'Trump'
  }
 }
})
 

答： 不是。因为直接去对象里赋值，没有改变对象的引用地址，vue的响应式没法检测到。[文档](https://cn.vuejs.org/v2/guide/reactivity.html)。可以使用`vm.$set(this.dog, name, 'Trump')`方法，或者改变复杂对象的引用地址`this.dog = {...this.dog, name: 'Trump'}`。前者是主动唤起Vue使用`Object.defineProperty`去把`name`属性变为响应式，后者是利用`Vue`对this.dog的响应式去修改

2、请简述 Diff 算法的执行过程
 
答： 所谓的diff，就是对新老vnode的差异对比，主要有几下几点

1. 为了提高效率，只对比vdom tree上同级的vnode
2. 判断是否可复用的标准主要是`key`以及`sel` -- `${tag}${#id}${.classname}`
3. 整个diff过程存在两个步骤。第一步是根据双指针进行遍历，
4. 会在新老列表中分别建立双指针`startIdx`及`endIdx`，起点指针负责递增，终点指针负责递减。遍历出口是`startIdx`大于`endIdx`
5. 对比的方式主要有4个分支，新旧起点，新旧终点，以及终点起点的交叉对比。这里面主要是找出所有可复用的dom，通过patchVNode函数修改老节点之后，根据情况的不同复用
6. 上一步里交叉对比使用的insertNode里的`reference`参数代表交换的位置，这个很重要，避免重用后的顺序出错
7. while循环结束后，找到新老节点中的剩余节点，老节点有剩余则代表需要删除的节点，新节点有剩余则代表需要增加的节点

二、编程题
1、模拟 VueRouter 的 hash 模式的实现，实现思路和 History 模式类似，把 URL 中的 # 后面的内容作为路由的地址，可以通过 hashchange 事件监听路由地址的变化。

[作业](./practise/vue-router-test)

2、在模拟 Vue.js 响应式源码的基础上实现 v-html 指令，以及 v-on 指令。
 
[作业](./practise/vue/compiler)

3、参考 Snabbdom 提供的电影列表的示例，利用Snabbdom 实现类似的效果，如图：
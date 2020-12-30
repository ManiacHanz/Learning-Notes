

### vue-router

vue-router使用`history`模式时，需要服务器支持。具体来说是，当页面在`https://xx.com/xxx`的时候刷新时，客户端会向服务器请求这个完整地址的路径，此时单页面是不存在这个页面的，只有`index.html`。所以这里需要配置，把找不到的情况都重定向到`index.html`。在开发模式下，`vue-cli`已经做了相关处理，而在`prod`环境下，需要服务端或者nginx做处理。
*尝试找当前路径的文件或者是当前路径下的index.html。如果找不到就直接返回根目录下的Index.html*。(返回后浏览器会根据路径去调用history state api访问应该渲染的组件)
```
server {
  location / {
    root html;
    index index.html index.htm;
    try_files $uri $uri/ /index.html;
  }
}

```

`runtime`文件不支持template语法，需要修改[vue-cli配置](https://cli.vuejs.org/zh/config/#runtimecompiler), 或者手动写成`render`函数。（标签名，props, 子元素）


### snabbdom

* snabbdom对比两个vdom是否相同时采用的是key===key && tag === tag的形式。但是这个和之后的react对比稍有不同，就是snabbdom的tag是采用`${tag}${#id}${classname}`的拼凑的方式。而react里的vdom里使用的element.type，属于react的自定义常量。这样看的话，react的vdom复用的节点应该比snabbdom更广泛

* createComment 创建注释节点 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/createComment)。 createElementNS 创建带有命名空间的元素 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/createElementNS)

* diff。这里的diff过程可以认为是*双指针？*, 因为会给新老节点数组各两个指针，一个是`从起点开始的下标`，此下标依次递增，到节点不同结束；另一个是`从终点返回的下标`, 此下标一次递减，到节点不同结束。跳出while的条件是，两个数组有一个`startIdx > endIdx`。和react有些许不同

* diff中有两个判断分类，`oldStartIdx === newEndIdx`和`oldEndIdx === newStartIdx`里面，需要移动dom位置。这里用的api是[parent.insertBefore](https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore)。此api第三个参数`reference`代表在哪个元素之前。这两个地方的这个是关键，可以仔细思考一下这个的调换顺序
```js
// ex.1
// 1 2 3 4 -> 3 4 2 1
// 总是往老队列最后一位的下一位的之前插
// 过程是  1 2 3 4 -> 2 3 4 1 -> 3 4 2 1
parentNode.insertBefore(newNode, oldNodes.nextSibling()) 

// ex.2
// 1 2 3 4 5 -> 5 4 1 2 3
// 总是往老队列的第一位之前的一位插
// 过程是 1 2 3 4 5 -> 5 1 2 3 4 -> 5 4 1 2 3
parentNode.insertBefore(newNode, oldNodes)

```

* diff同react一样是两遍循环，第一次是找所有可以复用的节点，不过多了两次交叉下标比对的过程，第二次是比对剩余的来处理新增或删除的节点
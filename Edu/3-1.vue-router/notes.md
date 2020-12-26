

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
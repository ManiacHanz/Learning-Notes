vue-ssr[文档](https://ssr.vuejs.org/)

chokidar[仓库](https://github.com/paulmillr/chokidar)

webpack node接口[文档](https://webpack.docschina.org/api/node/#webpack)
  直接调用webpack() 返回的一个compiler实例
  
webpack-hot-middleware [仓库](https://github.com/webpack-contrib/webpack-hot-middleware)

第三方头部处理vue-meta  [仓库](https://github.com/nuxt/vue-meta)

Gridsome需要处理sharp包，这个包里的libuv处理成国内镜像

gridsome[原理](https://gridsome.org/docs/how-it-works/)

* gridsome 项目安装依赖注意事项：
> 这里主要是主要下之前sharp包，sharp里包含的处理图片的libvip
>
> - 配置 node-gyp 编译环境
>   - https://github.com/nodejs/node-gyp
>
> - 配置环境变量：`npm_config_sharp_libvips_binary_host` 为 `https://npm.taobao.org/mirrors/sharp-libvips/`
>   - https://github.com/lovell/sharp-libvips
>   - https://developer.aliyun.com/mirror/NPM
>   - https://npm.taobao.org/mirrors
>   - https://sharp.pixelplumbing.com/install
>     - `npm config set sharp_binary_host "https://npm.taobao.org/mirrors/sharp"`
>     - `npm config set sharp_libvips_binary_host "https://npm.taobao.org/mirrors/sharp-libvips"`
> - 配置 hosts：`199.232.68.133  raw.githubusercontent.com`
>   - https://www.ipaddress.com/

* 嵌入标签等不需要处理的变量，模板语法需要是用{{{}}}格式

* webpack打包后的文件IO，可以把硬盘读写改成内存读写
    - 可以使用官方的`memfs`模块来处理 [文档](https://webpack.docschina.org/api/node/#custom-file-systems)
    - 也可以使用`webpack-dev-server`依赖的`webpack-dev-middleware`中间件处理. 改变配置项`writeToDisk` [仓库](https://github.com/webpack/webpack-dev-middleware#writetodisk)

* 双端预数据同步，是通过`window.__INITIAL_STATE__`这个值传递的。也就是服务端的`service store -> window.__INITIAL_STATE__ -> client store`。这里要把这两部分分开想，相当于服务端是取的数据，并且合并到视图模板中返回给客户端。而客户端并没有直接拿这一块视图渲染到浏览器，而是通过传回来的数据部分重新存储（相当于单页面应用的逻辑）渲染出来。当然此时因为保证了数据的同步性，所以说seo是没有问题的

开发组件库需要用到的几个技术栈
 * monorepo 用来进行多包管理
 * yarn workspace用来方便管理工作区依赖
 * storybook用来方便开发和预览组件，形成一个简单的组件目录
 * lerna用来多包管理和发布
 * jest 进行单元测试。测试组件需要配合插件
 * plop 小脚手架工具生成模板基本结构
 * rollup 用来打包

* yarn workspace 配合monorepo管理依赖
  配置package.json。相当于解决npm的peerDependences。把公用依赖提到跟项目中
  ```json
  {
    "private": true,  // 防止被意外发布到npm上
    "workspaces": [
      "packages/*"
    ]
  }
  ```


解答题：

* 说说 application/json 和 application/x-www-form-urlencoded 二者之间的区别。
  二者都是`content-type`请求头格式
  前者代表需要的通讯格式为json格式，后者代表的是formData格式。
  前者只需要传递对象，后者需要使用FormData实例


* 说一说在前端这块，角色管理你是如何设计的。
  角色管理主要是涉及到权限分配。一般增删改查中，删的优先级最高，增删改稍低。对用户的管理最高，对内容的管理更低。以课程中的管理系统为例
  最高级权限--管理员。拥有对所有权限进行增删改查处理的能力
  第二 -- 内容管理及审核。对除了用户及角色以外的所有内容进行增删改查的能力
  第三 -- 内容编辑。负责对内容进行添加，修改，但是没有删除权限
  第四 -- 游客。只有浏览的权限

* @vue/cli 跟 vue-cli 相比，@vue/cli 的优势在哪？
  @vue/cli拥有图形化界面
  提供交互式的脚手架选项
  减少webpack配置

* 详细讲一讲生产环境下前端项目的自动化部署的流程。
  通过Jenkins或其他类似工具，选择对应环境、参数、脚本等等手动确定后，服务器从配置仓库拉取代码，然后执行打包脚本，最后由之前配置好的服务把页面展示出来
  这一步之前可以通过webhook来配置成自动构建。比如在发起merge request请求之后（event可以自定义选择），由有权限的管理员进行代码合并，此时会触发webhook，向构建服务发起一个请求，通知构建服务器需要进行构建了。然后会进行上面第一步，完成自动构建

* 你在开发过程中，遇到过哪些问题，又是怎样解决的？请讲出两点。
  新东西的学习。解决主要分查阅官方文档。比如使用gatsby开发项目，或者nextjs开发项目，主要就是要短时间内大量阅读源码及例子。然后在git上找一些相关项目的仓库，查看对应的使用方法

  难点或包的bug。查阅文档或调试源码。主要是一些疑难杂成，包括第三方的包的bug，一般文档上找不到，只能通过查源码的方式。或者一些疑难杂症，不知道哪出来的，只有慢慢调试。尤其是node --inspect比较实用

* 针对新技术，你是如何过渡到项目中？
  首先需要对文档的阅读和熟悉。
  之后在编写小demo，在编写过程中去体验新技术的优势及学习成本。
  如果需要放入已有项目中，需要评估可靠性以及加入成本。
  如果是组内项目还得评估同事间的学习成本

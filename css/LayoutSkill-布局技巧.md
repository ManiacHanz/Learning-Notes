
#### write-mode

可以修改元素的纵横规则，把横向的东西纵向排列。

使用场景： 1、诗一类的纵向排列的文字；2、实现水平和纵向两项的居中。（可以说是个简化版的`flex-direction:column`）

张鑫旭大大的[博客](https://www.zhangxinxu.com/wordpress/2016/04/css-writing-mode/)


#### text-align-last

描述的是一段文本中最后一行在被强制换行之前的对齐规则

和`text-align`类似，但是可以单独修改最后一行。[MDN地址](https://developer.mozilla.org/zh-CN/docs/Web/CSS/text-align-last)


#### object-fit/ object-position

简单的理解，这两个属性可以达到小程序`image`组件中的mode属性的作用

> 关于 `object`，在css里指的*替换元素*，大致包含img,video,iframe,textarea等等。举例来说，img标签这个盒子，通常展现的是内部的src属性中的图。而img的css只是控制这个盒子，`object-fit/position`就可以控制这个图片的展示方式

`object-fit`的属性分别有:`cover`,`contain`,`fill`,`scale-down`,`none` 是不是感觉很熟悉，对，就是熟悉的那个模样
`object-position`大概相当于`backgroud-position`，调整图片的位置

如果想看图，请转战张鑫旭大大的[博客](https://www.zhangxinxu.com/wordpress/2015/03/css3-object-position-object-fit/)


#### margin结合flex

在flex的布局下，某元素单独使用`margin: auto`的属性可以达到逆向于flex盒子的justify-content的效果

[demo](https://codepen.io/JowayYoung/pen/PoYpROw)
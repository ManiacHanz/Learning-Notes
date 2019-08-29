

#### transform

在动画元素上增加一个`transform`,避免动画执行卡顿，可以使用`transform`达到硬件加速的效果

```css
.elem {
    transform: translate3d(0, 0, 0); /* translateZ(0)亦可 */
}
```

#### attr()抓取data-*

相当于在css中可以使用元素上`data-*`保存的属性

目前的使用场景： 伪元素中可以使用`content: ''`，里面可以动态的取属性
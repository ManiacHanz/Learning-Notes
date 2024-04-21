# Readme

学习[100dayscss](https://100dayscss.com/)的总结

### Day 1

1. 可以用 `border-radius`和较宽的 `border-width`来画一个比较圆的 0

```css
.zero-two {
  box-sizing: border-box;
  height: 100px;
  width: 100px;
  border-radius: 50%;
  border: 24px solid #fff;
  box-shadow: 0 0 13px 0 rgba(0, 0, 0, 0.2);
}
```

2. 可以用 `text-transform`把节点内的文本转换大小写

```css
text-transform: uppercase;
```

### Day 3

1. [clip-path](https://developer.mozilla.org/en-US/docs/Web/CSS/clip-path) 可以理解成一个蒙版，决定一个元素按照什么形状来展示。

### Day 4

1. [animation-fill-mode](https://segmentfault.com/q/1010000003867335) 决定动画开始之前/结束之后维持的状态

### Day 5

1. 记录一种泛类名选择器

```html
<div class="points">
  <div class="point-1">
    <div class="tooltip">458</div>
  </div>
  <div class="point-2">
    <div class="tooltip">812</div>
  </div>
  <div class="point-3">
    <div class="tooltip">746</div>
  </div>
  <div class="point-4">
    <div class="tooltip">877</div>
  </div>
  <div class="point-5">
    <div class="tooltip">517</div>
  </div>
  <div class="point-6">
    <div class="tooltip">434</div>
  </div>
  <div class="point-7">
    <div class="tooltip">458</div>
  </div>
</div>
```

```scss
[class^="point-"] {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 3px;
  cursor: pointer;
  z-index: 10;

  &:hover .tooltip {
    visibility: visible;
    opacity: 1;
    transform: translate3d(-50%, 0, 0);
  }
}
```

### Day 6

1. 通过 `border-color` 分开设置达到透明 3/4 圆的效果

```css
.circle-1 {
  position: absolute;
  box-sizing: border-box;
  width: 76px;
  height: 76px;
  top: -3px;
  left: -3px;
  border-width: 1px;
  border-style: solid;
  border-color: $brown $brown $brown transparent; /* here */
  border-radius: 50%;
  transition: all 1.5s ease-in-out;
}
```

### Day 7

1. 通过 `pointer-events` 来隐藏一些样式的默认鼠标样式， MDN，比如 Input 框鼠标会变成输入光标的形状

```scss
input {
  opacity: 0;
  pointer-events: none;
  &.active {
    opacity: 1;
    pointer-events: all;
  }
}
```

2. `box-shadow`不仅可以理解成阴影，也可以理解成`border`外的另一层 border 来使用

### Day 8

1. `filter: blur(Xpx)` 滤镜属性

2. scss 循环语法 [sass doc](https://sass-lang.com/documentation/at-rules/control/for)

```scss
@for $i from 1 through 10 {
  .blubb-#{$i} {
    position: absolute;
    top: 20px;
    left: 20px;
    width: 50px;
    height: 50px;
    transform: rotate((random(300)) + deg);

    &:after {
      position: absolute;
      display: block;
      content: "";
      width: 50px;
      height: 50px;
      background: #fff;
      border-radius: 50%;
      transform-origin: (40 - $i * 3) + px (40 - $i * 3) + px;
      animation: rotate (2.5 + $i / 5) + s ease-in-out ($i / 5) + s infinite;
      filter: blur(5px);
    }
  }
}
```

### Day 9

1. scss 继承 `@extend` [scss doc extend](https://sass-lang.com/documentation/at-rules/extend)

```scss
.crater-1 {
  position: absolute;
  width: 11px;
  height: 11px;
  top: 9px;
  left: 28px;
  border-radius: 10px;
  background: #ece1a8;
}

.crater-2 {
  @extend .crater-1;
  top: 12px;
  left: 0;
}
```

2. `random` 随机数方法

3. 挺有意思的雨滴动画. 兼具位置和形变

```scss
@keyframes drop {
  0% {
    transform: translate3d(40px, -320px, 0) scaleX(1) scaleY(1) rotate(17deg);
  }
  85% {
    transform: translate3d(0, 0, 0) scaleX(1) scaleY(1) rotate(17deg);
  }
  100% {
    transform: translate3d(0, 0, 0) scaleX(3) scaleY(0) rotate(0deg);
  }
}
```

### Day 10

1. 利用 15 个正方形画一个钟的 60 个刻度。即 15 个正方形每个逐渐 rotate 360/60 \* index 的角度。然后用四个边的中点（或者四个角，宽度不同）来作为刻度，组成一个时钟的 60 个刻度

2. 时钟圈的 svg `<circle>` 线条

```html
<svg class="spinner" viewbox="0 0 202 202" xlmns="https://www.w3.org/2000/svg">
  <circle cx="101" cy="101" r="99.5"></circle>
</svg>
```

3. 时钟圈的动画。 注意`50.001%`这个翻转，让动画显得流畅. `stroke-dashoffset`属性，svg 线段相对于起点的偏移量

```scss
$speed: 5s; // 60s for realtime
.spinner {
  position: absolute;
  width: 202px;
  height: 202px;
  border-radius: 50%;
  top: 5px;
  left: 5px;

  circle {
    stroke: #f85b5b;
    stroke-width: 3;
    fill: none;
    stroke-dasharray: 625;
    animation: spinner $speed linear infinite;
    transform-origin: center center;
    transform: rotate(-90deg);
  }
}

@keyframes spinner {
  from {
    stroke-dashoffset: 625;
    transform: rotate(-90deg) scaleY(1);
  }
  50% {
    stroke-dashoffset: 0;
    transform: rotate(-90deg) scaleY(1);
  }
  50.001% {
    transform: rotate(-90deg) scaleY(-1);
  }
  to {
    stroke-dashoffset: 625;
    transform: rotate(-90deg) scaleY(-1);
  }
}
```

### Day 11

1. 利用两种动画重叠来模拟鞋子走路等复杂动画

```scss
.right {
  animation: leg-swing 2s ease-in-out 1s infinite;

  .shoe {
    animation: shoe-turn 2s ease-in-out 1s infinite;
  }
}

@keyframes leg-swing {
  0%,
  100% {
    transform: rotate(-22deg);
  }
  50% {
    transform: rotate(40deg);
  }
}
@keyframes shoe-turn {
  0%,
  100% {
    transform: rotate(-10deg) translateY(-5px) translateX(10px);
  }
  25% {
    transform: rotate(0deg) translateY(0px) translateX(0);
  }
  50% {
    transform: rotate(10deg) translateY(-10px) translateX(10px);
  }
  75% {
    transform: rotate(0deg) translateY(-30px) translateX(0);
  }
}
```

### Day 12

1. `backface-visibility` 关于透视背面的显示与否

### Day 13

1. 通过 `before`和`after`两个伪元素构建横平竖直，来凑齐一个十字

```scss
&:before {
  position: absolute;
  content: "";
  width: 14px;
  height: 2px;
  top: 24px;
  left: 18px;
  background: #fff;
}

&:after {
  position: absolute;
  content: "";
  width: 2px;
  height: 14px;
  top: 18px;
  left: 24px;
  background: #fff;
}
```

### Day 15

1. 通过`dragover`增加拖拽的样式名

2. `box-shadow`可以多层使用 [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow)

```scss
.hover {
  box-shadow: 0 2px 0 0 #498c25, 0 2px 10px 0 #6ece3b;
}
```

3. 通过`transform`来改变进度条长度

### Day 16

1. 多个`@keyframes`的组合。顺序可以用两种方式来决定
   1. 通过 animation 里面的`delay`属性，计算延迟。但是这种情况实现洋葱圈动画可能需要有多个 animation 的值用`','`链接
   2. 通过所有动画使用相同的`duration`值，然后在 `@keyframe`里通过`'%'`来控制

### Day 17

### Day 18

1. `transform-style: preserve-3d` 设置子元素位于 3D 空间中 [mdn](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform-style)

2. 利用一个原型的 3d 翻转，来达到橡皮筋回弹的效果

### Day 19

1. 通过 css 属性控制 input 被选中时的样式. 同时隐藏 input 元素，就可以处理 label 的问题

```scss
#check-1:checked ~ .active {
}
```

2. 仅用 css 就实现了一个 Radio 的效果，或者说是轮播下标的效果

### Day 20

1. 使用 svg 的线条动画来做好看的线条变换，同时一个 svg 图案可以使用多个线条拼凑起来，在处理动画的时候就会有多个点同时移动

### Day 21

1. svg 的几个属性

   - `stroke-dasharray`可以控制实现和虚线的长度
   - `stroke-width`配合高度可以变成正圆或者椭圆
   - `stroke-linecap` 控制路径两端的形状

2. 强大的 svg 配合帧动画，实现的吃动人张嘴的动画

3. 原型的使用 `stroke-dasharray` 切割，属性值可以使用 `n*3.14`来处理。比如 `stroke-dasharray: 5 * 3.14`

### Day 22

> 一个环形进度条的实现

```html
<svg>
  <!-- 这个是控制环形背景的circle -->
  <circle class="bg" cx="57" cy="57" r="52" />
  <!-- 这个是控制上层图案的进度条，也就是指示多少进度的 -->
  <circle class="progress" cx="57" cy="57" r="52" />
</svg>
```

几个重要的属性

- circle 元素 `fill:none`就可实现环
- `stroke-dasharray`实现环虚线，这里有圆的周长求解公式 `2 * Pi * 半径`
- 由于在环中 `stroke-dasharray`的起始是在右边，所以需要 transform 旋转 90°
- 这里的环形控制进度条是通过设置 `storke-dasharray`满圆，然后通过`stroke-offset`偏移，把虚线偏移过来实现的。其实也可以直接计算`stroke-dasharray`不过这样就要设置第二个虚线值为满圆，才避免漏
- `stroke-linecap`记住设置成`round`保证圆头

svg 如何实现渐变 [参考](http://www.htmleaf.com/ziliaoku/qianduanjiaocheng/201504141680.html)

### Day 23

1. animation 中的 `steps`属性。 见[张鑫旭的 blog](https://www.zhangxinxu.com/wordpress/2018/06/css3-animation-steps-step-start-end/)。执行动画中的某一段。需要深入理解

2. `transform-origin`用于直线也可以指示一个线段从哪端伸缩

3. 注意延迟动画有时候一开始的效果不如意，一定记得用 `animation-fill-mode`来处理

### Day 24

1. 再次复习，不适用 js 的情况下如何通过点击更换元素状态 -- 使用隐藏的 radio/checkbox 配合显示的 label 标签做动画

2. 复习，使用 svg 的`stroke-dashoffset`和`stroke-dasharray`配合完成动画

### Day 25

1. `transform: perspective()` 这个属性。控制的是离镜头的远近，这里配合 Y 轴旋转让旋转看起来更加明显
2. `transform: scale(1) translate3d(0,0,0)` 即使只有尺寸的变化，也可以加上`translate3d`来提升性能

### Day 26

1. `$('.card:nth-child(' + active + ')').removeClass('active').addClass('inactive');` jq 也可以这样类似于 css 的选择去选择元素
2. `animation` 的值是 `fadeOut`的时候，可以配合 `animate-fill-mode`来保持元素淡出之后/淡出之前的状态

### Day 27

1. svg 的 `stroke-dashoffset` 用来画 svg 的路径动画

### Day 28

1. 用 `transform: rotate`来实现铃铛摇晃的效果
2. 弧线的声浪效果其实就是简单的缩放和淡出的效果

### Day 29

### Day 30

1. 仍然是通过 `stroke-dasharray` 和 `stroke-dashoffset` 绘制的 svg 路径动画。

### Day 31

1. 一列的小点只通过 `transform3D` 在 x 轴进行不同距离的移动，就能创造出 3d 圆柱转圈的效果，妙
2. 需要 scss 写循环的时候可以来参考下语法

### Day 32

1. 一个简单但是看起来很不错的数字变化效果。其实是分别领用了两个数字，就是有时候看起来应该用一个元素但是达不到动画效果的时候，可以把思路放开，试试两个或多个元素效果叠加

### Day 33

1. `animation-direction` 可以使用 `alternate` 在每一次结束以后，改变动画的方向

2. https://codepen.io/Luiz-Henrique-Menosso/pen/vYvbONm 这个大神的这个效果有点酷

### Day 34

1. `stroke-dashoffset` 的 svg 路径动画

### Day 35

1. 依旧是利用 svg 的路径动画做出的 loading 效果
2. 一个是可以学习 svg 下直接用两个 circle 来表示底圆和 loading 的圆，第二个是学习利用 svg 路径动画配合 transform rotate 达到一个 1+1 > 2 的效果。一个不错的 Loading，可以用在平时

### Day 36 - 40

### Day 41

1. 一个简单的 bump 效果，scale 先大再小

### Day 43

1. 灯泡效果。这里有一个是 svg 的 fill 过渡，一个是定位的元素通过背景和阴影变成的一个发光的效果

### Day 44

1. `animation-play-state: paused` 可以用来暂停动画
2. 通过循环变量设置 `animation-delay` 造成动画延迟的效果形成视差

### Day 45

1. 边框的动画不是使用 border，而是使用 svg 和文字定位处理的
2. svg 的背景动画用 `svg` 的 `fill`填充色变化来处理，这里也会经过 `transition` 过渡来变化
3. 边框的变化是通过 `stroke-dasharray` (或者 `stroke-offset`)来完成

### Day 46

1. 这个动效没什么特别的，不过可以学习的是，他如何快速是用`scss`和`html(slim)`，使用循环来快速渲染和计算位置和角度，达到动画效果

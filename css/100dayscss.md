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

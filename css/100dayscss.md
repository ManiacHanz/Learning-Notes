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

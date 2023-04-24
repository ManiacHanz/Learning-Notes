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

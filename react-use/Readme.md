# Read me

react-use 源码浅读感悟记录

1. 关于 navigator api 的一些使用
   a. battery -> useBattery
   b. geolocation -> useGeolocation

2. 感觉`useHoverDirty`传入`ref`的使用方式会比`useHover`使用`cloneElement`的使用方式更灵活。不过两者注册的事件是不同的，一个是使用 react events，一个是使用原生的 events

```ts
// useHover
const el = React.cloneElement(element, {
  onMouseEnter: onMouseEnter(element.props.onMouseEnter),
  onMouseLeave: onMouseLeave(element.props.onMouseLeave),
});

// useHoverDirty
if (enabled && ref && ref.current) {
  on(ref.current, "mouseover", onMouseOver);
  on(ref.current, "mouseout", onMouseOut);
}
```

3. `useIdle`注册的`defaultEvents`包括
   `['mousemove', 'mousedown', 'resize', 'keydown', 'touchstart', 'wheel']`

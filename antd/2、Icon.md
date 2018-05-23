
##   最简单的图标组件 Icon


### 知识点

* omit [npm地址](https://www.npmjs.com/package/object.omit)
  指定去掉obj里面的一些属性，实现一个浅拷贝

* className  [npm地址](https://www.npmjs.com/package/classname)
  用于动态的给元素设置classname


文档里只有3个接口，但是源码里有6个配置
```js
export interface IconProps {
  type: string;
  className?: string;
  title?: string;
  onClick?: React.MouseEventHandler<any>;
  spin?: boolean;
  style?: React.CSSProperties;
}
```

因为返回的是个 i 标签，只能继承原生的一些属性，而 `spin` 和 `type` 不能直接放上去，所以用来拼接了className以后就使用 `omit.js` 舍弃了
```js
const Icon = (props: IconProps) => {
  const { type, className = '', spin } = props;
  const classString = classNames({
    anticon: true,
    'anticon-spin': !!spin || type === 'loading',
    [`anticon-${type}`]: true,
  }, className);
  return <i {...omit(props, ['type', 'spin'])} className={classString} />;
};
```
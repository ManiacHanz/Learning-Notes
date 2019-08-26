

### Slider 


通过检查元素可以看出，整个`Slider`组件由`Slider`包裹盒子、`Rail`未拖动的部分（或理解成整个条）、`Track`拖动的条、`Handle`滑块本身、以及可以配置的显示的`Step`部分


先从`index.js`入手，找到暴露的默认组件`Slider.jsx`，就从这个文件开始吧~

这个组件最终没有直接返回一个渲染的组件，而是返回一个高阶组件`createSlider(Slider)`

```jsx
Class Slider extends Component {
    render() {
        return { tracks: track, handles: handle }
    }
}
export default createSlider(Slider);
```

而在`createSlider`是一个反向代理的`HOC`，才是主要渲染的各个东西。[react官方文档](https://zh-hans.reactjs.org/docs/higher-order-components.html)

```jsx
export default function createSlider(Component) {
    return class ComponentEnhancer extends Component {
        render(){
            return (
                <div
                    ref={this.saveSlider}
                    className='am-slider'
                    style={style}
                    // ...
                >
                <div
                    // rail  轨道部分，也就是整个背景条
                    className={`${prefixCls}-rail`}
                    style={{
                    ...maximumTrackStyle,
                    ...railStyle,
                    }}
                />
                { /* 拖动后的部分，长度随拖动变化 */ }
                {tracks}   
                <Steps
                    prefixCls={prefixCls}
                />

                {handles}
                <Marks
                    // 刻度部分
                    className={`${prefixCls}-mark`}
                />
                {children}
                </div>
            );
        }
    }
}
```


`Slider`的主要作用除了提供`Track`和`handle`两个组件外，还处理了一些基本的钩子事件，比如`onTouchStart`,`onTouchEnd`等等，同时有键盘监听后的事件，`componentWillRecieveProp`的事件，同时给外面的`onChange`,`onBeforeChange`(文档里没给),`onAfterChange`三个钩子也在这个组件里给


代码

```jsx
class Slider extends React.Component {
    static propTypes = {};

    constructor(props) {
        super(props);
        // 对defaultValue和value的出界处理
        const defaultValue = props.defaultValue !== undefined ?
        props.defaultValue : props.min;
        const value = props.value !== undefined ?
        props.value : defaultValue;

        // dragging 是用来判断是否正在拖动
        // trimAlignValue在这里面是一个很常用的数据整理函数
        // 主要是用来判断： 
        // 1、 是否在min 和max之间
        // 2、 根据step步长获取应该去的点，而不是每个位置都到
        this.state = {
            value: this.trimAlignValue(value),
            dragging: false,
        };
        
    }

    componentWillReceiveProps(nextProps) {
        // 
        if (!('value' in nextProps || 'min' in nextProps || 'max' in nextProps)) return;

        // 这边是对nextProps.value的一个合法性判断
        // 1 value要存在
        // 2 value要符合范围，且范围可能是nextProps里的max和min
        // 3 value有变动
        const prevValue = this.state.value;
        const value = nextProps.value !== undefined ?
        nextProps.value : prevValue;
        const nextValue = this.trimAlignValue(value, nextProps);
        if (nextValue === prevValue) return;
        // 符合要求后改变视图
        this.setState({ value: nextValue });
        // 如果value在nextProps范围外。就把处理过的合法的nextValue返回去
        if (utils.isValueOutOfRange(value, nextProps)) {
            this.props.onChange(nextValue);
        }
    }

    // 下面有个点，以下所有声明的监听函数，其实并没有在Slider组件本身调用，而是在createSlider里调用
    // 所以在这里面通过this调用了一些在createSlider高阶组件中才声明的函数而不报错
    // 原因是因为在调用的时候this指针已经指向了createSlider的实例，而不是Slider的实例
    onChange(state) {
        const props = this.props;
        // 没有从外部传入value的话就由state本身控制
        const isNotControlled = !('value' in props);
        const nextState = state.value > this.props.max ? {...state, value: this.props.max} : state;
        if (isNotControlled) {
            this.setState(nextState);
        }
        // 这里重置了 可以达到按step前进的效果
        const changedValue = nextState.value;
        // onChange钩子
        props.onChange(changedValue);
    }

    onStart(position) {
        // 控制拖拽的开关
        this.setState({ dragging: true });
        const props = this.props;
        // this.state.value
        const prevValue = this.getValue();
        // 变化之前的钩子函数，会把当前的值返回去
        props.onBeforeChange(prevValue);
        // calcValueByPos是 在HOC里声明的函数，这里能调用的原因看上面
        // 根据位置，计算一个value值 算法就在这个地方了
        const value = this.calcValueByPos(position);
        this.startValue = value;
        this.startPosition = position;
        // 点击滑块本省就会retrun 
        // 如果是点的进度条的位置，相当于移动了slider
        if (value === prevValue) return;
        // 这里是为了后面通过ref选中数组的第一项
        this.prevMovedHandleIndex = 0;

        this.onChange({ value });
    }
    // 参数用来控制是否需要出发钩子函数，在直接点击mark标记的时候没法经过dragging这个开关
    // 所以这里用了一个参数来表示应该出发onAfterChange钩子
    onEnd = (force) => {
        const { dragging } = this.state;
        this.removeDocumentEvents();
        if (dragging || force) {
            // 结束时的钩子
            this.props.onAfterChange(this.getValue());
        }
        this.setState({ dragging: false });
    }

    onMove(e, position) {
        // e.stopPropagation();
        // e.preventDefault();
        utils.pauseEvent(e);
        const { value: oldValue } = this.state;
        const value = this.calcValueByPos(position);
        if (value === oldValue) return;

        this.onChange({ value });
    }
    // 有一些键盘监听事件
    onKeyboard(e) {
        const valueMutator = utils.getKeyboardValueMutator(e);

        if (valueMutator) {
        utils.pauseEvent(e);
        const state = this.state;
        const oldValue = state.value;
        const mutatedValue = valueMutator(oldValue, this.props);
        const value = this.trimAlignValue(mutatedValue);
        if (value === oldValue) return;

        this.onChange({ value });
        this.props.onAfterChange(value);
        this.onEnd();
        }
    }

    getValue() {
        return this.state.value;
    }

    getLowerBound() {
        return this.props.min;
    }

    getUpperBound() {
        return this.state.value;
    }
    // 确保value值在范围内，且符合步长的函数
    trimAlignValue(v, nextProps = {}) {
        if (v === null) {
        return null;
        }

        const mergedProps = { ...this.props, ...nextProps };
        const val = utils.ensureValueInRange(v, mergedProps);
        return utils.ensureValuePrecision(val, mergedProps);
    }

    render() {
        const {
        prefixCls,
        vertical,
        included,
        disabled,
        minimumTrackStyle,
        trackStyle,
        handleStyle,
        tabIndex,
        min,
        max,
        handle: handleGenerator,
        } = this.props;
        const { value, dragging } = this.state;
        const offset = this.calcOffset(value);
        // 这里没找到handleGenerator的方法定义在何处
        // saveHandle在hoc里
        const handle = handleGenerator({
            className: `${prefixCls}-handle`,
            prefixCls,
            vertical,
            offset,
            value,
            dragging,
            disabled,
            min,
            max,
            index: 0,
            tabIndex,
            style: handleStyle[0] || handleStyle,
            ref: h => this.saveHandle(0, h),
        });

        const _trackStyle = trackStyle[0] || trackStyle;
        const track = (
        <Track
            className={`${prefixCls}-track`}
            vertical={vertical}
            included={included}
            offset={0}
            length={offset}
            style={{
            ...minimumTrackStyle,
            ..._trackStyle,
            }}
        />
        );

        return { tracks: track, handles: handle };
    }
}
```

总分来说，`Slider`里主要声明的函数都是在事件监听时绑定的函数，或者是处理对外界的钩子函数。但是组件内并没有调用这些函数

接下来`createSlider`，也就是真正暴露的`Slider`

```js
export default function createSlider(Component) {
  return class ComponentEnhancer extends Component {
    static displayName = `ComponentEnhancer(${Component.displayName})`;

    static defaultProps = {
      ...Component.defaultProps,
      prefixCls: 'rc-slider',
      min: 0,
      max: 100,
      step: 1,
      marks: {},
      handle({ index, ...restProps }) {
        delete restProps.dragging;
        if (restProps.value === null) {
          return null;
        }

        return <Handle {...restProps} key={index} />;
      },
        // rest...
    };

    constructor(props) {
      super(props);

      this.handlesRefs = {};
    }

    componentDidMount() {
      // Snapshot testing cannot handle refs, so be sure to null-check this.
      // ownerDocument 会找到html里的document
      this.document = this.sliderRef && this.sliderRef.ownerDocument;

        // ant mobile里没有autoFocus  这里不看
    }

    componentWillUnmount() {
        // 先执行父组件的钩子，再执行自己的逻辑
      if (super.componentWillUnmount) super.componentWillUnmount();
      this.removeDocumentEvents();
    }

    // onMouseDown和onTouchStart逻辑类似，只是一个是给pc端一个是移动端
    // 都是触发onStart,并且增加监听
    onMouseDown = (e) => {
      if (e.button !== 0) { return; }

      const isVertical = this.props.vertical;
      let position = utils.getMousePosition(isVertical, e);
      // handlesRefs 是handle 组件的refs
      // 也就是说 如果e.target不是handle组件的话 
      // 是点到slider条上的某个位置，就是把拖动距离设置成0
      // 如果是点到handle上面的话，就要去获取e.target的位置
      // 然后再算出this.dragOffset
      if (!utils.isEventFromHandle(e, this.handlesRefs)) {
        this.dragOffset = 0;
      } else {
          // getHandleCenterPosition 是根据props.vertical做的兼容位置处理
        const handlePosition = utils.getHandleCenterPosition(isVertical, e.target);
        this.dragOffset = position - handlePosition;
        position = handlePosition;
      }
      // 鼠标端需要先remove mouseMove和mouseUp的监听？？？
      this.removeDocumentEvents();
      // onStart事件 是在Slider里定义的 可以在上面看解析
      // 主要作用 触发了回调，同时根绝position改变位置（setState）
      this.onStart(position);
      // 添加鼠标事件监听
      this.addDocumentMouseEvents();
    }

    onTouchStart = (e) => {
      if (utils.isNotTouchEvent(e)) return;

      const isVertical = this.props.vertical;
      let position = utils.getTouchPosition(isVertical, e);
      if (!utils.isEventFromHandle(e, this.handlesRefs)) {
        this.dragOffset = 0;
      } else {
        const handlePosition = utils.getHandleCenterPosition(isVertical, e.target);
        this.dragOffset = position - handlePosition;
        position = handlePosition;
      }
      // 但是这里没有removeDocumentEvents
      this.onStart(position);
      this.addDocumentTouchEvents();
      // 触摸事件不同的是需要阻止默认事件已经事件冒泡
      utils.pauseEvent(e);
    }
    // onFocus没有这个接口 ，先不看了，大体
    onFocus = (e) => {
      const { onFocus, vertical } = this.props;
      if (utils.isEventFromHandle(e, this.handlesRefs)) {
        const handlePosition = utils.getHandleCenterPosition(vertical, e.target);
        this.dragOffset = 0;
        this.onStart(handlePosition);
        utils.pauseEvent(e);
        if (onFocus) {
          onFocus(e);
        }
      }
    }

    onBlur = (e) => {
      const { onBlur } = this.props;
      this.onEnd();
      if (onBlur) {
        onBlur(e);
      }
    };

    onMouseUp = () => {
        // 在onStart中 this.prevMovedHandleIndex被重置成0
        // 所以是选refs里的第一个
      if (this.handlesRefs[this.prevMovedHandleIndex]) {
        this.handlesRefs[this.prevMovedHandleIndex].clickFocus();
      }
    }

    onMouseMove = (e) => {
        // 这里不知道是为了兼容什么情况
      if (!this.sliderRef) {
        this.onEnd();
        return;
      }
        // onMove触发setState
      const position = utils.getMousePosition(this.props.vertical, e);
      this.onMove(e, position - this.dragOffset);
    }

    onTouchMove = (e) => {
      if (utils.isNotTouchEvent(e) || !this.sliderRef) {
        this.onEnd();
        return;
      }

      const position = utils.getTouchPosition(this.props.vertical, e);
      this.onMove(e, position - this.dragOffset);
    }

    onKeyDown = (e) => {
      if (this.sliderRef && utils.isEventFromHandle(e, this.handlesRefs)) {
        this.onKeyboard(e);
      }
    }
    // 根据mark标记来移动，就不需要计算位置了
    onClickMarkLabel = (e, value) => {
      e.stopPropagation();
      this.onChange({ value });
      this.setState({ value }, () => this.onEnd(true));
    }
    // 获取slider开始的位置
    getSliderStart() {
      const slider = this.sliderRef;
      const rect = slider.getBoundingClientRect();

      return this.props.vertical ? rect.top : (rect.left + window.pageXOffset);
    }
    // 根据vertical兼容获取slider整体的长度
    getSliderLength() {
      const slider = this.sliderRef;
      if (!slider) {
        return 0;
      }

      const coords = slider.getBoundingClientRect();
      return this.props.vertical ? coords.height : coords.width;
    }

    addDocumentTouchEvents() {
      // just work for Chrome iOS Safari and Android Browser
      this.onTouchMoveListener = addEventListener(this.document, 'touchmove', this.onTouchMove);
      this.onTouchUpListener = addEventListener(this.document, 'touchend', this.onEnd);
    }

    addDocumentMouseEvents() {
      this.onMouseMoveListener = addEventListener(this.document, 'mousemove', this.onMouseMove);
      this.onMouseUpListener = addEventListener(this.document, 'mouseup', this.onEnd);
    }

    removeDocumentEvents() {
      /* eslint-disable no-unused-expressions */
      this.onTouchMoveListener && this.onTouchMoveListener.remove();
      this.onTouchUpListener && this.onTouchUpListener.remove();

      this.onMouseMoveListener && this.onMouseMoveListener.remove();
      this.onMouseUpListener && this.onMouseUpListener.remove();
      /* eslint-enable no-unused-expressions */
    }

    focus() {
      if (!this.props.disabled) {
        this.handlesRefs[0].focus();
      }
    }

    blur() {
      if (!this.props.disabled) {
        Object.keys(this.handlesRefs).forEach((key) => {
          if (this.handlesRefs[key] && this.handlesRefs[key].blur) {
            this.handlesRefs[key].blur();
          }
        });
      }
    }
    // 算法
    calcValue(offset) {
      const { vertical, min, max } = this.props;
      // 保证不是负数 算出百分比
      const ratio = Math.abs(Math.max(offset, 0) / this.getSliderLength());
      // 计算出应该的位置的算法
      const value = vertical ? (1 - ratio) * (max - min) + min : ratio * (max - min) + min;
      return value;
    }
    // 根据position得到一个合理的值，用来setState等
    calcValueByPos(position) {
        // position - 起始位置 = 相对偏移量
      const pixelOffset = position - this.getSliderStart();
      const nextValue = this.trimAlignValue(this.calcValue(pixelOffset));
      return nextValue;
    }

    // 通过value反过去算offset
    calcOffset(value) {
      const { min, max } = this.props;
      const ratio = (value - min) / (max - min);
      return ratio * 100;
    }

    saveSlider = (slider) => {
      this.sliderRef = slider;
    }

    saveHandle(index, handle) {
      this.handlesRefs[index] = handle;
    }

    render() {
      const {
        prefixCls,
        className,
        marks,
        dots,
        step,
        included,
        disabled,
        vertical,
        min,
        max,
        children,
        maximumTrackStyle,
        style,
        railStyle,
        dotStyle,
        activeDotStyle,
      } = this.props;
      const { tracks, handles } = super.render();

      const sliderClassName = classNames(prefixCls, {
        [`${prefixCls}-with-marks`]: Object.keys(marks).length,
        [`${prefixCls}-disabled`]: disabled,
        [`${prefixCls}-vertical`]: vertical,
        [className]: className,
      });
      return (
        <div
          ref={this.saveSlider}
          className={sliderClassName}
          onTouchStart={disabled ? noop : this.onTouchStart}
          onMouseDown={disabled ? noop : this.onMouseDown}
          onMouseUp={disabled ? noop : this.onMouseUp}
          onKeyDown={disabled ? noop : this.onKeyDown}
          onFocus={disabled ? noop : this.onFocus}
          onBlur={disabled ? noop : this.onBlur}
          style={style}
        >
          <div
            className={`${prefixCls}-rail`}
            style={{
              ...maximumTrackStyle,
              ...railStyle,
            }}
          />
          {tracks}
          <Steps
            prefixCls={prefixCls}
            vertical={vertical}
            marks={marks}
            dots={dots}
            step={step}
            included={included}
            lowerBound={this.getLowerBound()}
            upperBound={this.getUpperBound()}
            max={max}
            min={min}
            dotStyle={dotStyle}
            activeDotStyle={activeDotStyle}
          />
          {handles}
          <Marks
            className={`${prefixCls}-mark`}
            onClickLabel={disabled ? noop : this.onClickMarkLabel}
            vertical={vertical}
            marks={marks}
            included={included}
            lowerBound={this.getLowerBound()}
            upperBound={this.getUpperBound()}
            max={max}
            min={min}
          />
          {children}
        </div>
      );
    }
  };
}


```



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


* useState可以接收一个函数，这个函数的返回值就是作为值。同时这个函数的参数就是当时的状态
  ```js
  function App(props) {
    const [count, setCount] = useState(() => {
      return props.count || 0
    })
  }
  ```

* useEffect配合async
  第二种情况不可以的原因是, useEffect内部是需要返回普通函数进行清理之前的函数的，如果第一个函数改成了async，返回的相当于是promise。所以不行。解决方法是在内部增加一个自执行的async函数
  ```js
  function App(props) {
    // 可以
    useEffect(() => {
      getData().then()
    })
    // 不可以
    useEffect(async () => {
      await getData()
      return () => {}
    })
    // 可以
    useEffect(() => {
      (
        async () => {
          await getData()
        }
      )()
    })
  }
  ```

* useRef
  useRef 不仅可以用来保存ref元素，也可以保存数据，且此数据不会随着组件的重新渲染而重新赋值。注：约定使用返回值里的current属性去保存
  ```js
  function App() {
    // let timer = null  普通方法会在每一次组件重新渲染后重置
    let timer = useRef()
    const [count, setCount] = useState(0)
    useEffect(() => {
      timer.current = setInterval(() => {
        setCount(count => count + 1)
      }, 1000)
    }, [])
    const stopTimer = () => {
      // 这样才能获取到这个保存的timer定时器
      clearInterval(timer.current)
    }
  }
  ```

* formik表单hook
  [地址](https://formik.org/docs/overview)

* css-in-js
  - 代码捆绑，以组件为模板，不用导致js和css分离，方便移动代码
  - 解决css局限。比如缺乏动态功能，和作用域

* emotion库
  可以替换React.createElement来编译Jsx，达到使用css-in-js的目的。可以解析以下模板
  ```jsx
  // 1
  <App css={{width: 200}} />

  // 2
  import {css} from '@emotion/core'
  const style = css`
    width: 100px;
    height: 100;
  `

  <Foo css={style}>
  ```

  prop属性中的样式优先级高于组件内部的样式。所以可以在外部调用时覆盖内部样式

  灵活的组件样式库写法

  ```js
  import {styled} from '@emotion/styled'
  const Container = styled.button`
    width: 100px;
    height: 20px;
    backgroud: ${props => props.bgColor || 'blue'}
  `
  ```

* chakra-ui
  [文档地址](https://chakra-ui.com/docs/layout/flex)
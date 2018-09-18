import { call, apply, cps, put } from 'redux-saga/effects'


function* fetchProducts() {
    // yield Api.fetch('/products')
    // 比上面写法更便于控制返回结果，写单元测试
  const products = yield call(Api.fetch, '/products')
  // ...

  // 带上下文环境的 call 和 apply 使用方法

    yield call([obj, obj.method], arg1, arg2) // 如同 obj.method(arg1, arg2 ...)

    yield apply(obj, obj.method, [arg1, arg2])
}

// 单元测试
const iterator = fetchProducts()

// expects a call instruction
assert.deepEqual(
  iterator.next().value,
  call(Api.fetch, '/products'),
  "fetchProducts should yield an Effect call(Api.fetch, './products')"
)


// cps常用于函数做参数的，node风格的函数
// 如 fn(...arg, (err, result)=>callback() )


const content = yield cps(readFile, '/path/to/file')

// 上面函数的测试
const iterator = fetchSaga()
assert.deepEqual(iterator.next().value, cps(readFile, '/path/to/file') )


// put 等同于 dispatch
// 也是一个声明式指令，好处往上同call
function* fetchProducts() {
  const products = yield call(Api.fetch, '/products')
  // 创建并 yield 一个 dispatch Effect
  yield put({ type: 'PRODUCTS_RECEIVED', products })
}

// 单测
// 创建一个假的响应对象
const products = {}

// 期望一个 dispatch 指令
assert.deepEqual(
  iterator.next(products).value,
  put({ type: 'PRODUCTS_RECEIVED', products }),
  "fetchProducts should yield an Effect put({ type: 'PRODUCTS_RECEIVED', products })"
)
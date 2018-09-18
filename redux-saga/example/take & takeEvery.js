import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'

export function* fetchData(action) {
   try {
      const data = yield call(Api.fetchUser, action.payload.url);
      yield put({type: "FETCH_SUCCEEDED", data});
   } catch (error) {
      yield put({type: "FETCH_FAILED", error});
   }
}

// 可以同时启动多个
export function* watchFetchData() {
    yield* takeEvery('FETCH_REQUESTED', fetchData)
}

// 同时启动多个的时候只得到最新请求的响应
// 之前的任务会被自动取消
export function* watchLastFetchData() {
    yield* takeLatest('FETCH_REQUESTED', fetchData)
}

// 同时启动多个
export default function* rootSaga() {
    yield takeEvery('FETCH_USERS', fetchUsers)
    yield takeEvery('CREATE_USER', createUser)
}


/**
 * 文档上更进阶的使用是可以使用take和takeEvery 做成一个监听器。或是使用take替代takeEvery，来实现控制流
 */

 // 一个简单的日志监听
 // * 会监听所有action, select() 会获取state
import { select, takeEvery } from 'redux-saga/effects'

function* watchAndLog() {
  yield takeEvery('*', function* logger(action) {
    const state = yield select()

    console.log('action', action)
    console.log('state after', state)
  })
}

// 上面代码可以用下述方法完成
// 虽然这里有while(true)，但是并不会一次无限循环，Generator的特性会阻塞调，以等待下一次的监听

function* watchAndLog() {
    while (true) {
      const action = yield take('*')
      const state = yield select()
  
      console.log('action', action)
      console.log('state after', state)
    }
  }

// 使用take的好处是，这里的while可以使用for等循环来控制一个条件内的监听
// 比如说控制在 n 次内执行一个动作，后面执行其他动作
// 下面的例子是执行3次todoCreate，然后给用户发送一个showCongratulation,并且不在todoCreate
import { take, put } from 'redux-saga/effects'

function* watchFirstThreeTodosCreation() {
  for (let i = 0; i < 3; i++) {
    const action = yield take('TODO_CREATED')
  }
  yield put({type: 'SHOW_CONGRATULATION'})
}


// 这种写法 Generator 带来的阻塞效果，可以让我们实现一个控制流，而不需要在所有地方写
// 比如登入后登出，一个完整的saga可以先监听login的action，然后等待loginout的action
// 使整个redux更加顺畅
function* loginFlow() {
    while (true) {
      yield take('LOGIN')
      // ... perform the login logic
      yield take('LOGOUT')
      // ... perform the logout logic
    }
  }
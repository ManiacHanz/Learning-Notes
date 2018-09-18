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
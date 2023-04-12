const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

class MyPromise {
  status = PENDING;
  // 成功值和失败值， 状态不可逆，用同一个值保存
  value = undefined;
  // 保存回调用于异步
  // 同一个实例多次调用then
  successCb = [];
  failCb = [];
  constructor(fn) {
    // 防止promise内部执行错误，直接调用reject
    try {
      fn(this.resolve, this.reject);
    } catch (e) {
      this.reject(e);
    }
  }
  // 箭头函数及属性赋值：保证 resolve()调用时的this指向
  resolve = value => {
    if (this.status !== PENDING) return;
    // 修改状态
    this.status = FULFILLED;
    this.value = value;
    // 异步模式，相当于执行了后面.then的部分功能
    // 注1
    while (this.successCb.length) this.successCb.shift()();
  };
  reject = error => {
    if (this.status !== PENDING) return;

    this.status = REJECTED;
    this.value = error;

    while (this.failCb.length) this.failCb.shift()();
  };
  // then方法通过状态判断来执行不同的函数
  then(successCb, failCb) {
    // then方法的参数为函数或可选
    successCb = typeof successCb === "function" ? successCb : value => value;
    failCb =
      typeof failCb === "function"
        ? failCb
        : reason => {
            throw reason;
          };
    // 链式调用
    // 注2
    let promise2 = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        // 这里使用setTimeout讲下面改为异步(应该是微任务)
        // 1是为了微任务队列
        // 2是为了resolutionProcedure里面传入了promise2
        //  而这个变量只有在new MyPromise执行完毕后才会返回
        //  所以采用异步
        setTimeout(() => {
          // 防止then里面的函数抛错 改成try..catch
          try {
            let x = successCb(this.value);
            resolutionProcedure(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      } else if (this.status === REJECTED) {
        setTimeout(() => {
          // 防止then里面的函数抛错 改成try..catch
          try {
            let x = failCb(this.value);
            resolutionProcedure(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      } else {
        // 异步模式 pending
        // 直接把上面then处理的fulfilled的状态的函数push到队列里保存起来
        // 注意这里如果不用箭头函数需要保存 this，才访问的到this.value
        this.successCb.push(() => {
          setTimeout(() => {
            try {
              let x = successCb(this.value);
              resolutionProcedure(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
        this.failCb.push(() => {
          setTimeout(() => {
            // 防止then里面的函数抛错 改成try..catch
            try {
              let x = failCb(this.value);
              resolutionProcedure(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      }
    });
    return promise2;
  }

  // finally的特殊情况
  // https://es6.ruanyifeng.com/#docs/promise#Promise-prototype-finally
  // 1 finally的cb不接受参数，意味着无法拿到前面传递过来的值
  // 2 finally总是返回原来的值
  finally(callback) {
    return this.then(
      value => {
        // finally函数中如果有异步，需要等待
        // 也就是说当此时callback返回的是普通值就没啥影响
        // 如果是promise实例，就可以通过static resolve方法去等待执行完毕后再继续
        return MyPromise.resolve(callback()).then(() => value);
      },
      reason => {
        return MyPromise.resolve(callback()).then(() => {
          throw reason;
        });
      }
    );
  }

  catch(failCallback) {
    return this.then(undefined, failCallback);
  }
  static all(array) {
    // 记录结果
    let result = [];
    // 这里需要记录promise改变状态的次数
    // 避免异步函数未完成
    let index = 0;

    return new MyPromise((resolve, reject) => {
      function addResult(key, value) {
        result[key] = value;
        index++;
        if (index === array.length) {
          resolve(result);
        }
      }
      for (let i = 0; i < array.length; i++) {
        let curr = array[i];
        if (curr instanceof MyPromise) {
          // curr是Promise实例，直接调用then方法
          curr.then(value => addResult(i, value), reason => reject(reason));
        } else {
          // 普通值
          addResult(i, curr);
        }
      }
    });
  }

  static race(array) {
    return new MyPromise((resolve, reject) => {
      for(let i = 0; i < array.length; i++) {
        let curr = array[i];
        if(curr instanceof MyPromise) {
          curr.then(value => resolve(value), reason => reject(reason));
        }else {
          resolve(curr)
        }
      }
    })
  }

  static resolve(x) {
    return x instanceof MyPromise ? x : new MyPromise(res => res(x));
  }
}

/**
 * @description 用来处理resolve的返回值
 * @description 1. 需要判断x的三类promise实例，普通值，then对象
 * @description 2.
 * @param {*} x
 * @param {*} resolve
 * @param {*} reject
 */
const resolutionProcedure = (promise2, x, resolve, reject) => {
  if (promise2 === x) return reject(new TypeError("不能返回同一个promise实例"));

  if (x instanceof MyPromise) {
    x.then(resolve, reject);
  } else {
    // 普通值或者then对象
    if (x !== null && (typeof x === "object" || typeof x === "function")) {
    } else {
      resolve(x);
    }
  }
};

module.exports = MyPromise;

/**
 * 注1
 * 在new Promise((resolve, reject) => {
 *   const res = await asyncFn()
 *   resolve(res)
 * }).then(() => {}, () => {
 *
 * })
 * 的情况下，
 * 由于宏任务执行队列会先执行.then方法,
 * 所以此时为了保证异步的执行，只能把then的方法内容寄托在resolve里面
 * 而then方法本身只用来根据状态执行resolve或者reject而已
 * 同一个promise实例可能被调用多次then方法，此时就需要多次存储then里的回调函数
 * 就用数组来保存
 */

/**
 * 注2
 * then方法里返回新的Promise对象，方便后面一个then调用
 * 可以理解成函子的思想
 * 而本来then的功能 -- 根据状态调用resolve和reject的功能 -- 由于在constructor里会立即执行，
 * 同原本then里面的立即执行时机相同，所以可以直接放在新的实例构造函数去执行
 * 这里不需要纠结为什么放在里面，只需要理解放在里面是没有问题的即可
 */

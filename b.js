// const SIZE = 4
// function Foo(arr, cb){
//   this.promises = arr.map( (fn,index) => () => fn().then(res => this.notify(index, res)))
//    this.pool = Array.from({length: SIZE}, () => null)
//    this.notify = (index, res) => {
//     this.p.splice(index, 1)
//     this.result[index] = res
//    }
//   const result = []

//   this.p = new Proxy(this.pool, {
//     get:
//   },set:{

//   })

// }

const SIZE = 10
class Pool {
  constructor(promises, size, successCallback){
    this.tasks = promises
    this.size = size
    this.result = []
    this.successCallback = successCallback
    this.pool = new Proxy([], {
      get: (target, propName) => {
        return target[propName]
      },
      set: async (target, propName, value) => {
        target[propName] = value
        if(typeof value === 'function'){
          const {id, res} = await value()
          this.result[id] = res
          this.remove(id)
          this.add(id)
        }
      }
    })
  }

  start() {
    const firsts = this.tasks.slice(0, this.size)
    this.pool.push(...firsts)
  }

  remove(id) {
    this.pool.splice(id, 1, null)
  }

  add(id) {
    if(this.tasks.length === 0){
      if(this.pool.filter(fn => fn).length === 0) {
        this.complete()
      }
      return
    }
    this.pool[id] = this.tasks.shift()
  }

  complete() {
    this.cb(this.result)
  }
}

const promises = Array.from({length: 20}, (v, i) => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      // 这里要拆分给id和结果
      res({id: i, res: i})
    }, i * 1000);
  })
})

const handleTasks = (promises, size, successCb) => {
  const pool = new Pool(promises, size, successCb)
  pool.start()
}

const successCallback = res => console.log(res)

handleTasks(promises, SIZE, successCallback)



// 数组 [7,6,4,3,1] [7,1,5,3,6,0,4]
// arr1
const arr = [7,1,5,3,6,0,4]
function foo(arr) {
  var result = -1
  var min = max = 0
  for(var i = 0; i < arr.length; i++) {
    if(arr[i] < arr[min] ) {
      min = i
      if(max < i) max = i
    }
    if(arr[i] > arr[max]) {
      max = i
      result = Math.max(result, arr[i] - arr[min])
    }
  }
  return result
}
console.log(foo(arr))


// foo.call(bar, args)

Function.prototype.call = function () {
  var args = [...arguments]
  var context = args.shift()
  context.fn = this
  var res = context.fn(...args)
  delete context.fn

  return res
}

// var f= foo.bind(bar, arg1)
// f(arg2)

Function.prototype.bind = function () {
  var args = [...arguments]
  var context = args.shift()
  var self = this

  var resFn = function () {
    var innerArgs = [...arguments]
    return self.apply(context,args.concat(innerArgs))
  }
  resFn.prototype = Object.create(this.prototype)
  resFn.prototype.constructor = resFn
  return resFn
}
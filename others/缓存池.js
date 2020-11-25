
const SIZE = 10

class MakePool {
  constructor(parts, size, cb) {
    this.parts = parts
    this.size = size
    this.result = []
    this.cb = cb
    // 构造缓存池
    this.pool = new Proxy([], {
      get: (target, propName) => {
        return propName in target ? target[propName] : undefined
      },
      set: async (target, propName, value) => {
        target[propName] = value
        if (typeof value === 'function') {
          const p = value()
          const r = await p
          console.log('done', propName, r, this.start)
          this.result.push({ r })
          this.remove(propName)
          this.add(propName)
        }
        return true
      }
    })
  }

  start(number = this.size) {
    const oriWork = this.parts.splice(0, number)
    this.pool.push(...oriWork)
  }

  remove(index) {
    this.pool[index] = null
  }

  add(index) {
    if (this.parts.length === 0) {
      if (this.pool.filter(f => f).length === 0) {
        this.complete()
      }
      return
    }
    this.pool[index] = this.parts.shift()
  }

  complete() {
    console.log('complete: ', this.result)
    this.cb(this.result)
    return this.result
  }
}


const parts = Array.from({ length: 100 }, (v, i) => () => {
  return new Promise((res) => {
    setTimeout(() => res(i + ':async'), i * 10)
  })
})

async function handleParts(parts) {
  const pool = new MakePool(parts, SIZE, (res) => { doSth(res) })
  await pool.start()
}

function doSth(res) { console.log('doSth:', res) }

handleParts(parts)

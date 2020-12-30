class Vue {
  constructor(options) {
    this.$options = options
    this.$data = options.data
    this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el

    this._proxyData(this.$data)
  }
  
  _proxyData(data) {
    Object.keys(data).forEach(key => {
      Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get() {
          return data[key]
        },
        set(newValue) {
          if(newValue === data[key]) return
          data[key] = newValue
        }
      })
    })
  }
}
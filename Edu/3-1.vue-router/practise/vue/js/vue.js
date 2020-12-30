class Vue {
	constructor(options) {
		this.$options = options
		this.$data = options.data
		this.$el =
			typeof options.el === 'string'
				? document.querySelector(options.el)
				: options.el
		// 代理this
		this._proxyData(this.$data)
		// 代理this.data
		this.initMethod(options.method)
		this.$observer = new Observer(this.$data)
		// 编译模板
		new Compiler(this)
		// 初始化方法
	}

	_proxyData(data) {
		Object.keys(data).forEach(key => {
			Object.defineProperty(this, key, {
				enumerable: true,
				configurable: true,
				get() {
					// 调用data里的响应式
					return data[key]
				},
				set(newValue) {
					if (newValue === data[key]) return
					data[key] = newValue
				},
			})
		})
	}

	initMethod(method) {
		Object.keys(method).forEach(key => {
			this[key] = method[key]
		})
	}
}

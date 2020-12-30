/**
 * Observer类
 * 用来给this.$data增加数据代理
 * walk defineReactive
 */

const OBJECT = '[object Object]'
const isObject = obj => Object.prototype.toString.call(obj) === OBJECT

class Observer {
	constructor(data) {
		this.walk(data)
	}
	walk(data) {
		if (!data || !isObject(data)) return

		Object.keys(data).forEach(key => {
			this.defineReactive(data, key, data[key])
		})
	}
	defineReactive(data, key, value) {
		const self = this
		const dep = new Dep()
		// 这里  是否是复杂类型的判断放在了walk函数中
		this.walk(value)
		Object.defineProperty(data, key, {
			configurable: true,
			enumerable: true,
			get() {
				// get的时候添加
				// 这里给Dep类挂一个静态属性是为了防止重复挂载，也可以用模块内的局部变量之类的东西
				// 因为通过this.vm[key]获取值的途径很多
				// 修改这里保证只有Watcher里有这段逻辑，所以只会在添加Watcher
				Dep.target && dep.addSub(Dep.target)

				// 这里不返回data[key]是避免死循环
				// 因为data已经是响应式了，再一次又会走get
				return value
			},
			set(newValue) {
				if (newValue === value) return
				value = newValue

				//设置完成后如果是复杂类型需要重新改成响应式的
				// 这里this是data对象
				self.walk(value)
				// set改变了要通知视图
				dep.notify()
			},
		})
	}
}

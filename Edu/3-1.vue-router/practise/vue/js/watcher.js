/**
  Watcher类
  实现update方法，调用传过来的callback

  把watcher添加到dep中
 */

class Watcher {
	constructor(vm, key, cb) {
		this.vm = vm
		// 这个是指观察的那个key值
		this.key = key
		// 具体更新视图的函数
		this.cb = cb

		// 把watcher添加到dep中
		Dep.target = this
		// 这里在获取 vm[key]的时候就会走到get拦截里
		// 自动添加进去了
		this.oldValue = vm[key]
		Dep.target = null
	}

	update() {
		// 调用update的时候重新去获取下值，然后判断下是否相同
		const newValue = this.vm[this.key]
		if (this.oldValue === newValue) return
		this.cb(newValue)
	}
}

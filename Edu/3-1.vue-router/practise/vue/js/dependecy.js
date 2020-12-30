/**
  Dep类
  一个被绑定的数据会实例化一个dep, 所以应该在处理data的observer里处理
  负责收集watcher, 并分发给watcher通知
 */

class Dep {
	constructor() {
		// 存储观察者
		this.subs = []
	}

	addSub(watcher) {
		// 这里要比较特殊的是watcher必须要有一个update方法来改变视图
		if (watcher && watcher.update) {
			this.subs.push(watcher)
		}
	}

	notify() {
		if (this.subs.length === 0) return
		this.subs.forEach(watcher => {
			watcher.update()
		})
	}
}

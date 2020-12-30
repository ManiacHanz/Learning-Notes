/**
  Compiler
  用来模板编译，主要是把差值表达式 {{}}  以及v-text v-model的使用dom api翻译过来
  负责首次渲染 
  数据变化后渲染视图
  
  属性  el 元素 vm  vue实例
  方法  compile(el) 编译元素   compileElement(node) 
 */

class Compiler {
	constructor(vm) {
		this.el = vm.$el
		this.vm = vm
		// 这里是在new Vue的时候调用，也就是首次编译
		this.compile(this.el)
	}

	// 负责对节点类型判断并分发
	compile(el) {
		// 注意这里处理的是el的子节点
		Array.from(el.childNodes).forEach(child => {
			if (this.isTextNode(child)) this.compileText(child)
			else if (this.isElementNode(child)) this.compileElement(child)

			if (child.childNodes && child.childNodes.length) {
				this.compile(child)
			}
		})
	}
	compileElement(node) {
		// console.dir(node)
		// 其他节点通过attributes获取属性列表

		Array.from(node.attributes).forEach(attr => {
			// 注，这里的attr.name没有考虑处理a.b的情况
			//   能直接取，否则需要按照.分割字符串然后依次取值
			if (this.isDirective(attr.name)) {
				let direct = attr.name.replace('v-', '')
				let fn = function () {}
				// 处理v-on:绑定
				if (direct.startsWith('on')) {
					fn = this['onUpdater']
				} else {
					fn = this[`${direct}Updater`]
				}
				fn.call(this, node, attr)
			}
		})
	}

	textUpdater(node, attr) {
		const key = attr.nodeValue
		node.textContent = this.vm[key]

		// 给通过指令绑定的视图添加watcher
		new Watcher(this.vm, key, newValue => {
			node.textContent = newValue
		})
	}

	modelUpdater(node, attr) {
		const key = attr.nodeValue
		node.value = this.vm[key]

		new Watcher(this.vm, key, newValue => {
			node.value = newValue
		})

		// 这里举个例子 比如说通常使用v-model绑定的都是表单
		node.addEventListener('input', e => {
			this.vm[key] = e.target.value
		})
	}

	// v-html
	htmlUpdater(node, attr) {
		const key = attr.nodeValue
		node.innerHTML = this.vm[key]

		new Watcher(this.vm, key, newValue => {
			node.innerHTML = newValue
		})
	}

	onUpdater(node, attr) {
		console.dir(attr)
		const { name, nodeValue } = attr

		if (this.vm[nodeValue] && typeof this.vm[nodeValue] === 'function') {
			const hanlder = name.split(':')[1]
			node.addEventListener(hanlder, this.vm[nodeValue].bind(this.vm)) // 这里的应该把上下文绑定到vm上面
		}
	}

	// 处理差值表达式
	compileText(node) {
		// console.dir(node)
		// 文本节点使用textContent获取内容
		const reg = /\{\{(.+?)\}\}/
		const content = node.textContent
		// 利用正则表达式获取差值表达式中间的key
		const result = reg.exec(content)
		if (result) {
			const key = result[1].trim()
			node.textContent = content.replace(reg, this.vm[key]) // 去掉差值表达式

			// 这里要创建watcher对象
			// 因为这里是判断数据和视图是否有依赖的地方
			new Watcher(this.vm, key, newValue => {
				node.textContent = newValue
			})
		}
	}

	isDirective(attrName) {
		return attrName.startsWith('v-')
	}

	isTextNode(node) {
		return node.nodeType === 3
	}

	isElementNode(node) {
		return node.nodeType === 1
	}
}

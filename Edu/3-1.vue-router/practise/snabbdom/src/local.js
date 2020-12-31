import { init } from 'snabbdom/build/package/init'
import { h } from 'snabbdom/build/package/h'
import { classModule } from 'snabbdom/build/package/modules/class.js'
import { propsModule } from 'snabbdom/build/package/modules/props.js'
import { styleModule } from 'snabbdom/build/package/modules/style.js'
import { eventListenersModule } from 'snabbdom/build/package/modules/eventlisteners.js'
import data from './constant'

const originData = [...data]

let vnode
let count = 0

const patch = init([
	classModule,
	propsModule,
	styleModule,
	eventListenersModule,
])

const sorthandler = () => {
	const sorted = originData.sort(
		(a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0)
	)
	vnode = patch(vnode, view(sorted))
}

const mapView = list => {
	return list.map(item => {
		return h(
			'li',
			{
				key: item.title,
			},
			item.title
		)
	})
}

const add = () => {
	originData.push({ title: `增加的第${++count}个电影` })
	vnode = patch(vnode, view(originData))
}

const view = data => {
	return h('div', [
		h('h1', '电影列表'),
		h('ul.list', mapView(data)),
		h(
			'button',
			{
				on: { click: sorthandler },
			},
			'按名称排序'
		),
		h(
			'button',
			{
				on: { click: add },
			},
			'添加一部电影'
		),
	])
}

window.addEventListener('DOMContentLoaded', () => {
	var container = document.getElementById('app')
	vnode = patch(container, view(originData))
})

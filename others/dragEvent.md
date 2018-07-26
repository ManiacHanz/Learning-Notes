
## DragEvent


原生提供的拖拽接口[MDN地址](https://developer.mozilla.org/zh-CN/docs/Web/API/DragEvent)

**主要API**

*分为拖拽对象，和拖拽到指定容器的*

拖拽对象的API

```js
//拖动元素或选择文本时触发此事件。
target.ondrag = function(){}

//当用户开始拖动元素或选择文本时触发此事件。
target.ondragstart = function(){}

//当拖动操作结束时（释放鼠标按钮或按下退出键），会触发此事件。
target.ondragend = function(){}
```

指定容器的API
```js
// 下面两个要阻止浏览器默认事件
// 当拖动的元素或选择文本输入有效的放置目标时，会触发此事件。
container.ondragenter = function(e){e.preventDefault()}

// 当将元素或文本选择拖动到有效放置目标（每几百毫秒）上时，会触发此事件。
container.ondragover = function(e){e.preventDefault()}

// 当拖动的元素或文本选择离开有效的放置目标时，会触发此事件。
container.ondragleave = function(){}
```

#### DataEvent.dataTransfer 属性保存着拖拽操作中的数据

有两个属性需要知道

**dropEffect**

获取 / 设置实际的放置效果，它应该始终设置成 effectAllowed  的可能值之一 

对于 dragenter 和 dragover 事件，dropEffect 将基于用户要求的动作被初始化设置。这如何确定是平台特定的但用户通常可以修改键值来调整为理想动作。在 dragenter 和 dragover 事件的事件处理程序中，如果这个效果不是用户要求的动作，那就应该修改dropEffect 的值。

对于 dragstart, drag和dragleave事件，dropEffect会被初始化为 “none”。任何有效的值都可以用来设置 dropEffect，这是这些设置的值不会做任何事情[译者注：也就是说任何有效值都不会报错，但是在这些事件中设置没有任何效果]。

对于drop和dragend事件，dropEffect将被初始化成期望的动作，这个动作的值是最近的执行dragenter或者dragover事件后的dropEffect的值。

可能的值:

* copy: 复制到新的位置
* move: 移动到新的位置.
* link: 建立一个源位置到新位置的链接.
* none: 禁止放置（禁止任何操作）.

**effectAllowed**

用来指定拖动时被允许的效果。你可以在dragstart事件中设置拖动源数据时期望的动作效果，同时在dragenter和dragover事件中为目标设置期望的效果[译者注：effectAllowed设置允许的效果，在dragenter和dragover中通过设置上面的那个属性dropEffect来确定具体的动作效果]。这些值在其他的事件中没有任何作用。

可能的值:

* copy: 复制到新的位置.
* move:移动到新的位置 .
* link:建立一个源位置到新位置的链接.
* copyLink: 允许复制或者链接.
* copyMove: 允许复制或者移动.
* linkMove: 允许链接或者移动.
* all: 允许所有的操作.
* none: 禁止所有操作.
* uninitialized: 缺省值（默认值）, 相当于 all.

分配任何其他值时不会有任何影响并且保留旧值
/**
 * 从堆中取出元素
 * 从堆中取出元素只能取出根节点的元素
 * 然后此时用最后一个元素去站住根节点元素的位置，形成一个完整的堆
 * 
 * 之后就是排序的过程
 * 找到新的根节点的这个元素的两个子节点，比较大小
 * 和较大的元素交换位置
 * 然后递归这个操作
 * 
 */


 /**
 * 堆插入新元素的排序
 * 算法复杂度是O(nlogn)
 */

const utils = require('../utils/index.js')

const {swap} = utils


class MaxHeap {
  constructor(arr = []) {
    this.value = [null].concat(arr)
    this.rootIndex = 1
  }

  // 找父节点
  getParent(index) {
    return Math.floor(index / 2)
  }
  // 找子节点
  getChild(index) {
    return index * 2
  }

  shiftUp(index) {
    const last = this.value[index]
    const parentIndex = this.getParent(index)

    if(this.value[parentIndex] > last) {
      this.value.shift()
      return this.value
    }
    
    swap(parentIndex, index, this.value)
    // 交换以后 继续以Index为基准向上查找
    return this.shiftUp(index)
  }
  insert(item) {
    this.value.push(item)
    return this.shiftUp(this.value.length - 1)
  }


  shiftDown(index) {
    const i = this.getChild(index)
    const childIndex = this.value[i] > this.value[i+1] ? i : i + 1
    console.log(index)
    if(this.value[childIndex] > this.value[index]) {
      swap(childIndex, index, this.value)
      return this.shiftDown(childIndex)
    }
    this.value.shift()
    return this.value
    
  }

  extract() {
    // 提取出顶层元素
    const root = this.value[this.rootIndex]
    // 把最后一个节点赋值给顶层元素
    this.value[this.rootIndex] = this.value[this.value.length - 1]

    return {
      root,
      arr: this.shiftDown(this.rootIndex)
    } 
  }
}

const arr = [62,41,30,28,16,22,13,19,17,15]

const heap = new MaxHeap(arr)
console.log(heap.extract())
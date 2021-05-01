/**
 * 堆插入新元素的排序
 * 算法复杂度是O(nlogn)
 */

const utils = require('../utils/index.js')

const {swap} = utils


class MaxHeap {
  constructor(arr = []) {
    this.value = [null].concat(arr)
  }

  // 找父节点
  getParent(index) {
    return Math.floor(index / 2)
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
}

const arr = [62,41,30,28,16,22,13,19,17,15]

const heap = new MaxHeap(arr)
console.log(heap.insert(52))
/**
 * 将任意数组构造成堆
 * 找到最后一个非叶子节点
 * 对它及它前面的节点进行shiftDown操作
 * 算法复杂度是O(n)
 */



const utils = require('../utils/index.js')

const {swap} = utils


class MaxHeap {
  constructor(arr = []) { 
    this.value = [null]
    this.rootIndex = 1
    this.init(arr)
  }
  init(arr) {
    for(let i = 0; i<arr.length; i++) {
      console.log('item', this.value, arr[i])
      this.insert(arr[i])
    }
    
    // const len = this.value.length
    // let last = Math.floor(len / 2)
    // while(last > this.rootIndex) {
    //   this.shiftDown(last)
    //   last--
    // }
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
    

    if(parentIndex === 0 || this.value[parentIndex] > last) {
      // this.value.shift()
      return this.value
    }
    
    swap(parentIndex, index, this.value)
    // 交换以后 继续以Index为基准向上查找
    return this.shiftUp(parentIndex)
  }
  insert(item) {
    this.value.push(item)
    if(this.value.length <= 2) return
    console.log(58, this.value)
    const result = this.shiftUp(this.value.length - 1)
    return result
  }


  shiftDown(index) {
    const i = this.getChild(index)
    const childIndex = this.value[i] > this.value[i+1] ? i : i + 1
    
    if(this.value[childIndex] > this.value[index]) {
      swap(childIndex, index, this.value)
      return this.shiftDown(childIndex)
    }
    // this.value.shift()
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
// const arr = [62,41,30,28,16,22,13,19,17,15]
const arr = [41,15,28,22,62,13,30,19,16,17] 

// const arr = [41,15, 28,22,62] 
const heap = new MaxHeap(arr)
heap.extract()
console.log('end', heap)
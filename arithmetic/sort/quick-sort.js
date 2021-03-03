/**
 * 分治算法
 *   归并 1刀切 二分法。 合起来时考虑排序。 不可以原地排序，在归并的时候需要额外的空间
 *   快速 找合理的点来分  合起来更简单。 可以原地排序
 * 快速排序的优化点，概念，和归并排序的不同点
 * 
 * 双路快排的方案，存在理由
 * 三路快排的方案，存在理由
 */

const utils = require('../utils/index')
const { swap } = utils

const arr = [8,5,10,9,4,7,6,3,2,1]

function quickSort(arr) {
  // 注意，这里传的参数代表数组的左边后右边元素的下标
  return _quickSort(arr, 0, arr.length - 1)
}

// 直接在原有的数组上修改，所以需要左右的范围
// 也就是for循环的起点和重点
function _quickSort(arr, l, r) {
  // 递归出口
  if(l >= r) return 

  const p = _partition(arr, l, r)
  _quickSort(arr, l, p - 1)
  _quickSort(arr, p+1, r)
}

/**
 * 找到特定拆分点并返回所在的下标
 * 利用快排的特点，原地排序，并且是不稳定排序
 * @param {*} arr 
 * @param {*} l 
 * @param {*} r 
 */
function _partition(arr, l, r) {
  const standard = arr[l]  // 基准值
  var i = p = l + 1     // p值代表基准值应该所处的位置，也代表大于基准值部分的第一个元素所处的下标
  for(; i <= r; i++) {
    if(arr[i] < standard) {
      swap(i, p, arr)
      p++
    }
  }
  // 由于p还是大于基准值的第一个值
  // 所以 p-1才是 小于基准值部分的最后一位
  // 所以交换的应该是p-1
  // 返回的也应该是p-1
  swap(l, p - 1, arr)
  return p - 1
}

quickSort(arr)
console.log(arr)
// 优化1

function _quickSort2(arr, l, r) {
  //把递归出口的方法改了
  // 在一定长度范围内的数组排序用插入排序是优于快速排序的
  if(r - l <= 16) {
    return insertSort(arr)
  }

  const p = _partition(arr, l, r)
  _quickSort(arr, l, p - 1)
  _quickSort(arr, p+1, r)
}

// 优化2
function getRandom(start, end) {
  return Math.random()*(end - start) + start
}

function getInt(num) {
  return Math.floor(num)
}

function getIndex(start, end) {
  return getInt(getRandom(start, end))
}

function _partition2(arr, l, r) {
  let randomIndex = getIndex(l, r)

  swap(randomIndex, l, arr)   // 基准值改为随机值，尽可能减少分治算法不均导致的nlogn退化

  // 注意这里是先交换一下顺序，然后再改使用前面的逻辑
  // 而不是取了随机数就以那个位置的下标为基准来分，那样就不好处理
  // 还是以 l 开始
  const standard = arr[l]  
  var i = p = l + 1     // p值代表基准值应该所处的位置，也代表大于基准值部分的第一个元素所处的下标
  for(; i <= r; i++) {
    if(arr[i] < standard) {
      swap(i, p, arr)
      p++
    }
  }
  // 由于p还是大于基准值的第一个值
  // 所以 p-1才是 小于基准值部分的最后一位
  // 所以交换的应该是p-1
  // 返回的也应该是p-1
  swap(l, p - 1, arr)
  return p - 1
}

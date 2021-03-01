/**
 * 归并排序
 */


const arr = [1,8,5,10,9,4,7,6,3,2,1]

// 递出去拆分
function mergeSort(arr) {
  // 优化点 1 见下
  // 归回来的条件，一直拆到只有一个元素
  if(arr.length === 1) return arr

  const middle = Math.floor(arr.length / 2)
  const left = arr.slice(0,middle)
  const right = arr.slice(middle)

  const newLeft = mergeSort(left)
  const newRight = mergeSort(right)

  const result = _mergeSort(newLeft, newRight)
  
  return result
}

// 合并
// 左右两边都被递出去的过程中组成了有序数组
function _mergeSort(left, right) {
  // 优化点 2.
  // 由于两边都是有序数组，如果右边第一位都大于左边最后一位，那不需要遍历了直接拼接就可以
  if(left[left.length - 1] < right[0]) return left.concat(right)

  const newArr = []
  let j = k = 0
  
  while(j < left.length & k < right.length) {
    if(left[j] <= right[k]) {
      newArr.push(left[j])
      j++;
    }else {
      newArr.push(right[k])
      k++
    }
  }

  if(j < left.length) {
    newArr.push(...left.slice(j))
  }else if(k < right.length) {
    newArr.push(...right.slice(k))
  }
  return newArr
}

console.log(mergeSort(arr))

/** 
优化点1：这里是把最小单位变成了1个元素，但实际上可以小到n个元素以后用插入排序（或其他排序），减少时间复杂度

优化点2：由于左右两边都是有序数组，所以只需要比较最大和最小的极端情况，可以直接拼接上去
*/
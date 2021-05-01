/**
 * 冒泡排序
 * 从第一个元素开始，把当前元素和下一个元素相比较，如果当前元素大就交换位置
 */

const { swap } = require("../utils")

const arr = [1,8,5,10,9,4,7,6,3,2,1]
function bubbleSort(arr) {
  if(arr.length === 1) return arr
  // 注意这里是倒叙，
  // 最大值会先被放到最后 
  for(let i = arr.length; i > 0 ; i--) {
    for(let j = 0; j < i; j++) {
      if(arr[j] > arr[j+1]){
        swap(j, j+1, arr)
      }
    }
  }

  return arr
}


console.log(bubbleSort(arr))
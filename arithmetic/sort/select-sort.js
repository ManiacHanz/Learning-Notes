const arr = [1,8,5,10,9,4,7,6,3,2,1]


const ss = (arr) => {
  let minIndex
  for(let i = 0; i < arr.length; i++) {
    minIndex = i
    // 在剩余元素中找到最小的那个，然后和未排序的第一个交换位置
    for(let j = i+1; j < arr.length; j++) {
      if(arr[j]<arr[minIndex]) minIndex = j
    }
    swap(i, minIndex, arr)
  }
  console.log(arr)
}

function swap(target, min, arr) {
  if(target === min) return

  let temp = arr[target]
  arr[target] = arr[min]
  arr[min] = temp
}

ss(arr)


console.log(Array.prototype.sort.call(arr, (a, b) => a - b < 0))
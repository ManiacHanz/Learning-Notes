function binarySeach(arr, target) {
  const len = arr.length
  let start = 0, end = len - 1
  while(start <= end) {
    let mid = Math.floor((start + end) / 2)
    if(arr[mid] === target) {
      return mid
    }

    if(arr[mid] > target) {
      end = mid - 1
    }else {
      start = mid + 1
    }
  }
  return -1
}

const arr = [
  1, 1, 2, 2, 3, 
  3, 3, 4, 4, 4,
  4, 5, 5, 5, 6
]

console.log(binarySeach(arr, 3))
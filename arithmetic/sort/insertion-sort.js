const arr = [1,8,5,10,9,4,7,6,3,2,1]

function swap(index , arr) {
  let temp = arr[index]
  arr[index] = arr[index-1]
  arr[index-1] = temp
}

function insertionSort(arr) {
  for(let i = 1; i < arr.length; i ++) {
    for (let j = i; j > 0; j--) {
      if(arr[j] < arr[j - 1]) {
        swap(j, arr)
      }else break // 提前结束
    }
  }
}

// 上面代码改良后的代码， 把条件判断直接放到for循环语句中
function insertionSort(arr) {
  for(let i = 1; i < arr.length; i ++) {
    for (let j = i; j > 0 & arr[j] < arr[j - 1]; j--) {
      swap(j, arr)
    }
  }
}

insertionSort(arr)

console.log(arr)

/**
 * 错误插入排序，新开了内存空间，思想不对

function insert(arr, item){
  for(let i = 0, len = arr.length; i < len; i ++) {
    if(arr[i] >item) {
      return arr.splice(i,0,item)
    }
  }
  arr.push(item)
  
}

function insertionSort(arr){
  let result = []
  let len = arr.length
  for(let i = 0; i < len; i++) {
    if(result.length === 0) {
      result.push(arr[i])
      continue
    }

    insert(result, arr[i])
  }
  return result
}

console.log(insertionSort(arr))

 */
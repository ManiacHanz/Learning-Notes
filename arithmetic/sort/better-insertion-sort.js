
/**
 * 改良的插入排序算法
 * 减少swap()实际排序的次数，而是改为直接赋值
 * 在近乎有序的数组情况下(比如[1,2,3,2,4,5]这种)，效率远高于选择排序
 * 比如日志，基本都以时间为序，偶尔可能有错乱，用插入排序可以效率很高
 */

const arr = [1,8,5,10,9,4,7,6,3,2,1]

function betterInsertSore(arr) {
  // 从第一个开始，第0个默认为已经排好了
  for(let i = 1, len = arr.length ; i < len; i++) {
    let element = arr[i] // 保存元素
    let j;      // 这里放外面是因为后面要访问，放for循环里就访问不到了
    for (j = i; j > 0 ; j-- ) {
      // 每比较一次就直接赋值，同理这里可以直接放到for条件里面
      if(element < arr[j-1]) {
        arr[j] = arr[j-1]
      }else break
    }
    // 不符合条件的j
    // 也就是arr[j] > arr[j-1] 这个时候，由于之前的赋值， arr[j] === arr[j+1]
    // 所以直接赋值arr[j]就可以了
    arr[j] = element
  }
}

betterInsertSore(arr)

console.log(arr)
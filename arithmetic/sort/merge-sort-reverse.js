/**
 * 倒转过来的归并排序算法
 * 也就是通过数学直接将一个长度的数组拆分成最小单位为1
 * 然后依次合并 合并的长度也就是 1 2 4 8 16这样的拼
 * @param {*} arr 
 */

function mergeSortRe(arr) {
  const length = arr.length
  // 第一层循环，以拆分个数为例
  for(let size = 1; size < length; size += size) {
    // i是表示下标，比如说
    // size为1时 拆分情况是 01 23 45 67   i的跳跃是0 2 4 6
    // size为2时 拆分情况是 0123 4567     i的跳跃是0 4 8
    // size为3时 拆分情况是 01234567 89abcde   i的跳跃是 0 8 
    // 0 - 2*size   0 size-1 size 2size-1
    for(let i = 0; i < length; i += size) {

    }
  }
}
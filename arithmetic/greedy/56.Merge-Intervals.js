var merge = function (intervals) {
  const sorted = intervals.sort((a, b) => a[0] - b[0]);
  let curr = [-1, -1]; // intervals[i]的两个值都在0和10的4次方之间
  const result = [];

  for (let i = 0; i < sorted.length; i++) {
    const item = sorted[i];
    const [left, right] = item;

    // 因为排过序，所以如果当前元素的左区间都已经更大，那就没有重叠
    // 直接推进结果
    if (left > curr[1]) {
      result.push([...curr]);
      curr = [left, right];
      continue;
    }

    // 有重叠. 代表left在curr的左右之间, 更新右边
    curr[1] = Math.max(curr[1], right);
  }

  // 推入最后一个区间，并且去掉[-1, -1]的初始值
  return [...result, curr].slice(1);
};

var intervals = [
  [1, 3],
  [2, 6],
  [8, 10],
  [15, 18],
];
console.log(merge(intervals));

var intervals = [
  [1, 4],
  [4, 5],
];
console.log(merge(intervals));

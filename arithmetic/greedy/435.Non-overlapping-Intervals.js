var eraseOverlapIntervals = function (intervals) {
  if (intervals.length === 1) return 0;

  let count = 0;
  let currentMax = Number.MIN_SAFE_INTEGER;

  const sortedIntervals = intervals.sort((a, b) => {
    if (a[0] - b[0] !== 0) return a[0] - b[0];
    return a[1] - b[1];
  });
  for (let i = 0; i < sortedIntervals.length; i++) {
    if (sortedIntervals[i][0] >= currentMax) {
      currentMax = sortedIntervals[i][1];
      continue;
    }
    count++;
    // 需要更新，缩小右区间的范围
    currentMax = Math.min(currentMax, sortedIntervals[i][1]);
  }

  return count;
};

var intervals = [
  [1, 2],
  [2, 3],
  [3, 4],
  [1, 3],
];
console.log(eraseOverlapIntervals(intervals));

var findMinArrowShots = function (points) {
  const sortedPoints = points.sort((a, b) => {
    if (a[0] - b[0] !== 0) return a[0] - b[0];
    return b[1] - a[1];
  });
  let count = 0;
  let currentMax = Number.MIN_SAFE_INTEGER;

  for (let i = 0; i < sortedPoints.length; i++) {
    if (sortedPoints[i][0] <= currentMax) {
      currentMax = Math.min(currentMax, sortedPoints[i][1]); // 这里需要更新右边界
      continue;
    }
    currentMax = sortedPoints[i][1];
    count++;
  }

  return count;
};

// var points = [
//   [10, 16],
//   [2, 8],
//   [1, 6],
//   [7, 12],
// ];

// console.log(findMinArrowShots(points));

// var points = [
//   [1, 2],
//   [3, 4],
//   [5, 6],
//   [7, 8],
// ];
// console.log(findMinArrowShots(points));

// var points = [
//   [1, 2],
//   [2, 3],
//   [3, 4],
//   [4, 5],
// ];
// console.log(findMinArrowShots(points));

// var points = [[-2147483648, 2147483647]];
// console.log(findMinArrowShots(points));

// var points = [
//   [3, 9],
//   [7, 12],
//   [3, 8],
//   [6, 8],
//   [9, 10],
//   [2, 9],
//   [0, 9],
//   [3, 9],
//   [0, 6],
//   [2, 8],
// ];
// console.log(findMinArrowShots(points));

var points = [
  [1, 2],
  [4, 5],
  [1, 5],
];
console.log(findMinArrowShots(points));

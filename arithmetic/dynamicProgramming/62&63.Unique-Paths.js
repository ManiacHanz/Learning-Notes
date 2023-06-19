// 1 <= m, n <= 100

var uniquePaths = function (m, n) {
  // dp[m, n] 代表走到这一格需要多少方法，
  // 递推公式 dp[m, n] = dp[m - 1, n] + dp[m, n - 1]
  // 初始化;  m =0 或者n = 0 都只有1 种或者n种 即 dp[0,n] = n, dp[m,0] = m
  // 遍历，从前往后，可以横向可以竖向

  const dp = [];
  for (let i = 0; i < m; i++) {
    dp[i] = [1];
  }
  for (let i = 1; i < n; i++) {
    dp[0][i] = 1;
  }
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
    }
  }
  return dp[m - 1][n - 1];
};

// var m = 3,
//   n = 3;
// console.log(uniquePaths(m, n));

var uniquePathsWithObstacles = function (obstacleGrid) {
  const m = obstacleGrid.length,
    n = obstacleGrid[0].length;

  if (obstacleGrid[0][0] === 1 || obstacleGrid[m - 1][n.length - 1] === 1)
    return 0;

  const dp = [];
  for (let i = 0, hasObs = false; i < m; i++) {
    if (obstacleGrid[i][0] === 1) {
      hasObs = true;
    }
    dp[i] = hasObs ? [0] : [1];
  }
  for (let i = 1, hasObs = false; i < n; i++) {
    if (obstacleGrid[0][i] === 1) {
      hasObs = true;
    }
    dp[0][i] = hasObs ? 0 : 1;
  }

  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (obstacleGrid[i][j] === 1) {
        dp[i][j] = 0;
        continue;
      }
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
    }
  }

  return dp[m - 1][n - 1];
};

// var obstacleGrid = [
//   [0, 0, 0],
//   [0, 1, 0],
//   [0, 0, 0],
// ];
// console.log(uniquePathsWithObstacles(obstacleGrid)); // 2

// var obstacleGrid = [
//   [0, 1],
//   [0, 0],
// ];
// console.log(uniquePathsWithObstacles(obstacleGrid)); // 1

// var obstacleGrid = [[1, 0]];
// console.log(uniquePathsWithObstacles(obstacleGrid));

// var obstacleGrid = [
//   [1, 0],
//   [0, 0],
// ];
// console.log(uniquePathsWithObstacles(obstacleGrid)); //0

// var obstacleGrid = [[0]];
// console.log(uniquePathsWithObstacles(obstacleGrid)); //1

// var obstacleGrid = [
//   [0, 0, 0],
//   [0, 0, 0],
//   [0, 0, 1],
// ];
// console.log(uniquePathsWithObstacles(obstacleGrid)); // 1

var obstacleGrid = [
  [0, 0],
  [1, 1],
  [0, 0],
];
console.log(uniquePathsWithObstacles(obstacleGrid)); // 1

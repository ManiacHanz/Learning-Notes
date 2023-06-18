/**
 * cost.length >=2
 */

var minCostClimbingStairs = function (cost) {
  // dp数组代表cost
  // 递推公式，每到达一次的花费为前一个或者前两个的较小值
  // 初始化：花费和为0
  // 从后往前遍历，
  const dp = [];
  dp[0] = 0;
  dp[1] = 0;

  for (let i = 2; i <= cost.length; i++) {
    dp[i] = Math.min(dp[i - 1] + cost[i - 1], dp[i - 2] + cost[i - 2]);
  }
  return dp[cost.length];
};

var cost = [1, 100, 1, 1, 1, 100, 1, 1, 100, 1, 1];
console.log(minCostClimbingStairs(cost));

var cost = [10, 15, 20];
console.log(minCostClimbingStairs(cost));

var cost = [0, 2, 2, 1];
console.log(minCostClimbingStairs(cost));

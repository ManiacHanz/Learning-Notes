// 2 <= n <= 58
var intergerBreak = function (n) {
  // dp[i] 代表下标为i得到的最大乘积
  // 我们固定为两个数的和，因为递归的原理，每一个x又会被拆成他之前的求得的最大乘积
  // 递推公式： 下标i = x + (i - x), dp[i] = x * (i - x), 但是这样有个问题是不一定是最大的，因为还可以拆多个，所以我们可以继续拆一边
  // 此时因为x 从2开始遍历，那我们可以直接拆 (i - x)，也就是也许dp[i-x]这个值比它本身更大
  // 所以最终的递推公式就是 dp[i] = max(x * (i - x), x * dp[i-x])
  // 当然这里需要注意的是，有一个值去保存循环的时候的最大值
  // 初始化是 dp[0] = 0, dp[1] = 1 dp[2] = 1
  // 遍历顺序是从左往右，但是每次求n的时候因为x和y不确定，所以这里还需要循环一次
  let dp = [];
  dp[1] = 1;
  dp[2] = 1;
  let sum = 0;

  for (let i = 3; i <= n; i++) {
    // 这里从-1开始，如果从-2开始的话3不符合j>=k不能走进去
    for (let j = i - 1, k = i - j; j >= k; j--, k++) {
      // 一定要注意这里的 的max比较的 要包括j*k，以及为什么要继续拆j
      sum = Math.max(sum, j * k, dp[j] * k);
    }
    dp[i] = sum;
    sum = 0;
  }

  return dp[n];
};

console.log(intergerBreak(2));
console.log(intergerBreak(3));
console.log(intergerBreak(4));
console.log(intergerBreak(5));
console.log(intergerBreak(6));
console.log(intergerBreak(7));
console.log(intergerBreak(8));
console.log(intergerBreak(9));
console.log(intergerBreak(10)); //36

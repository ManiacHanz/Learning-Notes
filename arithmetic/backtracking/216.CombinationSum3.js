// 2 <= k <= 9
// 1 <= n <= 60
// 1<= number <=9

var combinationSum3 = function (k, n) {
  const array = Array.from({ length: 9 }, (x, i) => i + 1);

  const result = [];
  const temp = [];

  function sum(arr) {
    return arr.reduce((pre, curr) => pre + curr);
  }

  const backtracking = (startIdx) => {
    // 终止条件
    if (temp.length === k && sum(temp) === n) {
      result.push([...temp]);
      return;
    }

    // 单层递归逻辑
    // 这里有剪枝的优化空间
    // 1. 数量不够时剪枝，
    // 2. 和大于target时也可以剪枝
    for (let i = startIdx; i < array.length; i++) {
      temp.push(array[i]);
      backtracking(i + 1);
      temp.pop();
    }
  };

  backtracking(0);
  return result;
};

const k = 3,
  n = 7;
console.log(combinationSum3(k, n));

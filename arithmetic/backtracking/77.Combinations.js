var combine = function (n, k) {
  const result = [];
  const temp = [];
  const array = Array.from({ length: n }, (x, index) => index + 1);
  function backtracking(idx) {
    // 终止条件
    if (temp.length === k) {
      result.push([...temp]);
      return;
    }

    // 单层搜索逻辑
    // 剪枝，剩余单层数量不足够的情况下，不需要再循环了
    // 如果不优化直接用array.length即可
    for (let i = idx; i < array.length - (k - temp.length) + 1; i++) {
      temp.push(array[i]);
      backtracking(i + 1);
      temp.pop();
    }
  }

  backtracking(0);
  return result;
};

const n = 4,
  k = 3;
console.log(combine(n, k));

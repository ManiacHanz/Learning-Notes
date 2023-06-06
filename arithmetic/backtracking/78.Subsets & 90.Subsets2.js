var subsets = function (nums) {
  const result = [];
  const temp = [];

  function backtracking(startIdx) {
    result.push([...temp]);

    for (let i = startIdx; i < nums.length; i++) {
      temp.push(nums[i]);
      backtracking(i + 1);
      temp.pop();
    }
  }

  backtracking(0);
  return result;
};

// const nums = [1, 2, 3];

// console.log(subsets(nums));

var subsetsWithDup = function (nums) {
  const sorted = nums.sort((a, b) => a - b);
  const used = Array.from({ length: sorted.length }, () => 0);

  const result = [];
  const temp = [];

  const backtracking = function (startIdx) {
    result.push([...temp]);
    if (startIdx >= sorted.length) return;

    for (let i = startIdx; i < sorted.length; i++) {
      const value = sorted[i];
      if (value === sorted[i - 1] && used[i - 1] === 0) {
        continue;
      }
      temp.push(value);
      used[i] = 1;
      backtracking(i + 1);
      used[i] = 0;
      temp.pop();
    }
  };

  backtracking(0);

  return result;
};

const nums = [1, 2, 2];

console.log(subsetsWithDup(nums));

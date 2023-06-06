var findSubsequences = function (nums) {
  const result = [];
  const temp = [];

  const backtracking = (startIdx = 0) => {
    if (temp.length >= 2) {
      result.push([...temp]);
    }
    if (startIdx >= nums.length) return;
    const used = new Set();

    for (let i = startIdx; i < nums.length; i++) {
      const value = nums[i];
      if (used.has(value) || value < temp[temp.length - 1]) {
        continue;
      }
      temp.push(value);
      used.add(value);
      backtracking(i + 1);
      temp.pop();
    }
  };

  backtracking(0);
  return result;
};

const nums = [4, 6, 7, 7];

console.log(findSubsequences(nums));

var maxSubArray = function (nums) {
  let max = Number.MIN_SAFE_INTEGER;
  let temp = 0;

  for (let i = 0; i < nums.length; i++) {
    for (let j = i; j < nums.length; j++) {
      temp += nums[j];
      if (temp <= 0) {
        max = Math.max(max, temp);
        temp = 0;
        break;
      }
      max = Math.max(max, temp);
    }
    temp = 0;
  }
  return max;
};

nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
console.log(maxSubArray(nums));

nums = [1];
console.log(maxSubArray(nums));

nums = [5, 4, -1, 7, 8];
console.log(maxSubArray(nums));

nums = [-1];
console.log(maxSubArray(nums));

nums = [-1000, -1000, -1000, -1000, -1000, -1000, -1000];
console.log(maxSubArray(nums));

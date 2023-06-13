var canJump = function (nums) {
  const covered = Array.from({ length: nums.length }, (x, idx) =>
    idx === 0 ? 1 : 0
  );
  for (let i = 0; i < covered.findIndex((item) => item === 0); i++) {
    const val = nums[i];
    for (
      let j = 0, startIndex = i + 1;
      j < val && startIndex < nums.length;
      j++
    ) {
      covered[startIndex++] = 1;
    }
  }
  return covered[nums.length - 1] === 1;
};

nums = [2, 3, 1, 1, 4];
console.log(canJump(nums)); // true

nums = [3, 2, 1, 0, 4];
console.log(canJump(nums)); // false

nums = [0];
console.log(canJump(nums));

nums = [0, 2, 3];
console.log(canJump(nums));

nums = [2, 0, 0];
console.log(canJump(nums));

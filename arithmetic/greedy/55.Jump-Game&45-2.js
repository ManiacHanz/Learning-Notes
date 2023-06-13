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

// nums = [2, 3, 1, 1, 4];
// console.log(canJump(nums)); // true

// nums = [3, 2, 1, 0, 4];
// console.log(canJump(nums)); // false

// nums = [0];
// console.log(canJump(nums));

// nums = [0, 2, 3];
// console.log(canJump(nums));

// nums = [2, 0, 0];
// console.log(canJump(nums));

var canJump2 = function (nums) {
  let curIndex = 0;
  let nextIndex = 0;
  let steps = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    // 计算当前能跳到的最大范围
    nextIndex = Math.max(nums[i] + i, nextIndex);
    // 这个范围和下面的赋值很关键
    // 说明了在当前所有能覆盖的范围都循环完毕了再加了一步
    if (i === curIndex) {
      curIndex = nextIndex;
      steps++;
    }
  }

  return steps;
};

nums = [2, 3, 1, 1, 4];
console.log(canJump2(nums));

nums = [2, 3, 0, 1, 4];
console.log(canJump2(nums));

nums = [1, 2];
console.log(canJump2(nums));

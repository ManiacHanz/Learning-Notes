/**
 * 
 * 1 <= nums.length <= 1000
   0 <= nums[i] <= 1000
 */
var wiggleMaxLength = function (nums) {
  if (nums.length <= 1) return nums.length;
  let result = 1;
  let preDiff = 0; // 记录前一个diff, 因为默认为0，且preDiff === curDiff === 0的时候代表平坡，所以即时是2-2-2的结构，此时都不会导致result增加
  let curDiff = 0; // 记录后一个diff
  for (let i = 0; i < nums.length - 1; i++) {
    curDiff = nums[i + 1] - nums[i];
    if ((curDiff > 0 && preDiff <= 0) || (curDiff < 0 && preDiff >= 0)) {
      result++;
      preDiff = curDiff; // 只有摆动的时候才是有效变化，才去修改pre和cur的问题
    }
  }
  return result;
};

const nums = [1, 3, 2, 2, 2, 1];
console.log("should be 3:", wiggleMaxLength(nums)); // 3

const n2 = [0, 0];
console.log("should be 1: ", wiggleMaxLength(n2));

const n3 = [2, 2, 2];
console.log("should be 1", wiggleMaxLength(n3));

const n4 = [1, 7, 4, 9, 2, 5, 5];
console.log("should be 6", wiggleMaxLength(n4));

const n5 = [1, 7, 4, 9, 2, 2];
console.log("should be 5", wiggleMaxLength(n5));

const n6 = [3, 3, 3, 2, 5];
console.log("should be 3", wiggleMaxLength(n6));
// [0, 0] -> 1
// [2,2,2] -> 1
// [1, 7, 4, 9, 2, 5, 5] -> 6
// [1, 7, 4, 9, 2, 2] -> 5
// [3, 3, 3, 2, 5]; -> 3

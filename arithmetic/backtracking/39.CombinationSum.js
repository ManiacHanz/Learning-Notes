/**
 * 
    1 <= candidates.length <= 30
    2 <= candidates[i] <= 40
    All elements of candidates are distinct.
    1 <= target <= 40

    来源：力扣（LeetCode）
    链接：https://leetcode.cn/problems/combination-sum
    著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
 */

var combinationSum = function (candidates, target) {
  if (target < 2) return [];

  const result = [];
  const temp = [];
  let sum = 0;

  function backtracking(array, startIdx) {
    if (sum > target) return;
    if (sum === target) {
      result.push([...temp]);
      return;
    }

    for (let i = startIdx; i < array.length; i++) {
      const value = array[i];
      temp.push(value);
      sum += value;
      backtracking(array, i);
      sum -= value;
      temp.pop();
    }
  }

  backtracking(candidates, 0);
  return result;
};

const candidates = [2, 3, 6, 7],
  target = 7;
console.log(combinationSum(candidates, target));

const candidates2 = [2, 3, 5],
  target2 = 8;
console.log(combinationSum(candidates2, target2));

const candidates3 = [2],
  target3 = 1;
console.log(combinationSum(candidates3, target3));

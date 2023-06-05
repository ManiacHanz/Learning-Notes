// 使用used: 0|1[] 来标记元素是否被使用过
// 如果前一个为1，然后碰到相同元素，则属于深度上的使用同一元素，可以使用当前值
// 如果前一个为0，然后碰到相同元素，则属于横向维度的使用同一元素，不可以再使用，否则会出现重复组合
var combinationSum2 = function (candidates, target) {
  const sortedArray = candidates.sort((a, b) => a - b);

  if (target < sortedArray[0]) return [];
  const used = Array.from({ length: sortedArray.length }, () => 0);
  const result = [];
  const temp = [];
  let sum = 0;

  function backtracking(startIdx) {
    if (sum > target) return;
    if (sum === target) {
      result.push([...temp]);
      return;
    }

    for (let i = startIdx; i < sortedArray.length; i++) {
      const value = sortedArray[i];
      if (i > 0 && value === sortedArray[i - 1] && used[i - 1] === 0) {
        continue;
      }

      temp.push(value);
      sum += value;
      used[i] = 1;
      backtracking(i + 1);
      sum -= value;
      temp.pop();
      used[i] = 0;
    }
  }

  backtracking(0);

  return result;
};

const candidates = [10, 1, 2, 7, 6, 1, 5],
  target = 8;
console.log(combinationSum2(candidates, target));

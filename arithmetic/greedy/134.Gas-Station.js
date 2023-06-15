var canCompleteCircuit = function (gas, cost) {
  let totalSum = gas.reduce((pre, curr, index) => {
    return pre + curr - cost[index];
  }, 0);

  if (totalSum < 0) return -1;

  let currentSum = 0;
  let startIdx = 0;
  let length = gas.length;
  let i = startIdx;

  while (true) {
    const diff = gas[i] - cost[i];
    currentSum += diff;

    if (currentSum < 0) {
      startIdx = i + 1;
      i = startIdx;
      currentSum = 0;
      continue;
    }
    i = i === length - 1 ? 0 : i + 1;

    if (i === startIdx) return i;
  }
};

var gas = [1, 2, 3, 4, 5],
  cost = [3, 4, 5, 1, 2];
console.log(canCompleteCircuit(gas, cost)); // 3

var gas = [2, 3, 4],
  cost = [3, 4, 3];
console.log(canCompleteCircuit(gas, cost)); // -1

var gas = [4],
  cost = [5];
console.log(canCompleteCircuit(gas, cost)); // -1

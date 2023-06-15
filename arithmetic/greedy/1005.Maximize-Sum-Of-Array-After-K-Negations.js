var largestSumAfterKNegations = function (nums, k) {
  const sorted = nums.sort((a, b) => a - b);

  let i = 0;
  let fixing = false;
  while (k > 0) {
    if (fixing) {
      sorted[i] = -sorted[i];
      k--;
      continue;
    }

    if (sorted[i] === 0) {
      fixing = true;
    } else if (sorted[i] > 0) {
      if (sorted[i] > sorted[i - 1]) {
        i -= 1;
      }
      fixing = true;
      sorted[i] = -sorted[i];
    } else {
      sorted[i] = -sorted[i];
      if (i < sorted.length - 1) {
        i++;
      }
    }
    k--;
  }
  return sorted.reduce((pre, curr) => pre + curr);
};

// var nums = [4, 2, 3],
//   k = 1;
// console.log(largestSumAfterKNegations(nums, k));

// var nums = [3, -1, 0, 2],
//   k = 3;
// console.log(largestSumAfterKNegations(nums, k));

// var nums = [2, -3, -1, 5, -4],
//   k = 2;
// console.log(largestSumAfterKNegations(nums, k));

// var nums = [1, 3, 2, 6, 7, 9],
//   k = 3;
// console.log(largestSumAfterKNegations(nums, k));

// var nums = [-8, 3, -5, -3, -5, -2, 4],
//   k = 8;
// console.log(largestSumAfterKNegations(nums, k));

var nums = [-4, -2, -3],
  k = 4;
console.log(largestSumAfterKNegations(nums, k));

const { sortedArrayToBST: sortedArrayToBSTHelper } = require("./common");

// height-balanced BST
var sortedArrayToBST = function (nums) {
  return sortedArrayToBSTHelper(nums);
};

const nums = [-10, -3, 0, 5, 9];
const result = sortedArrayToBST(nums);
console.log(result);

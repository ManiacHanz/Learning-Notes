const { arrToTree, inorderTreeToArray } = require("./common");

var getMinimumDifference = function (root) {
  let diff = Number.MAX_VALUE;

  const array = inorderTreeToArray(root);

  let slow = 0,
    fast = 1;
  for (; fast < array.length; fast++) {
    diff = Math.min(diff, array[fast] - array[slow]);
    slow++;
  }

  return diff;
};

const arr = [236, 104, 701, null, 227, null, 911];
const root = arrToTree(arr);
// console.log(getMinimumDifference(root));

// double pointers
var getMinimumDifference2 = function (root) {
  let diff = Number.MAX_VALUE;
  let pre = null;

  function traversal(node) {
    if (!node) return;
    node.left && traversal(node.left);

    if (pre) {
      diff = Math.min(diff, node.val - pre.val);
    }
    pre = node;

    node.right && traversal(node.right);
  }

  traversal(root);

  return diff;
};

console.log(getMinimumDifference2(root));

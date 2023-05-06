const { arrToTree } = require("./common");

function hasPathSum(root, targetSum) {
  let result = false;
  let start = 0;

  function traverse(node, sum) {
    if (result || !node) return;

    const res = sum + node.val;
    if (res === targetSum && !node.left && !node.right) {
      result = true;
      return;
    } else {
      traverse(node.left, res);
      traverse(node.right, res);
    }
  }

  traverse(root, start);
  return result;
}

const arr = [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, null, null, 1],
  targetSum = 22;
const root = arrToTree(arr);
console.log(hasPathSum(root, targetSum));

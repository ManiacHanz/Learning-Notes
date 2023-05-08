const { arrToTree } = require("./common");

// inorder traversal is the key to
// the array obtained by traversaling a binary search tree should be sorted
var isValidBST = function (root) {
  if (!root) return true;

  let result = true;
  let pre = -Number.MAX_VALUE;

  function traversal(node) {
    if (!result) return result;

    node.left && traversal(node.left);

    const val = node.val;
    if (val <= pre) result = false;
    else pre = val;

    node.right && traversal(node.right);
  }

  traversal(root);
  return result;
};

const arr = [2, 2, 2];
const root = arrToTree(arr);
console.log(isValidBST(root));

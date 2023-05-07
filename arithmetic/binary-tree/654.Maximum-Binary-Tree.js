const { TreeNode } = require("./common");

const findMax = (array) => {
  return array.reduce((pre, curr) => (curr > pre ? curr : pre));
};

const sliceArray = (array, value) => {
  const idx = array.findIndex((i) => i === value);
  const left = array.slice(0, idx);
  const right = array.slice(idx + 1, array.length);
  return [left, right];
};

var constructMaximumBinaryTree = function (nums) {
  function traverse(array) {
    const item = findMax(array);
    const node = new TreeNode(item);
    const [left, right] = sliceArray(array, item);

    node.left = left.length ? traverse(left) : null;
    node.right = right.length ? traverse(right) : null;
    return node;
  }

  return traverse(nums);
};

const nums = [3, 2, 1, 6, 0, 5];
const result = constructMaximumBinaryTree([3, 2, 1]);
// const result = constructMaximumBinaryTree(nums);
console.log(result);

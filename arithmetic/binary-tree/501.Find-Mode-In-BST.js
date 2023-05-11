const { arrToTree } = require("./common");

var findMode = function (root) {
  let count = 0;
  let pre = null;
  const max = [];

  function traversal(node) {
    if (!node) return;

    traversal(node.left);

    if (!pre) count = 1;
    else if (pre.val === node.val) {
      count++;
    } else {
      count = 1;
    }
    pre = node;
    if (count >= max.length) {
      max[count - 1] = max[count - 1]
        ? [...max[count - 1], node.val]
        : [node.val];
    }

    traversal(node.right);
  }

  traversal(root);
  console.log(max);
  return max[max.length - 1];
};

const arr = [0];
const root = arrToTree(arr);
console.log(findMode(root));

const { arrToTree } = require("./common");

var lowestCommonAncestor = function (root, p, q) {
  const min = Math.min(p, q),
    max = Math.max(p, q);

  function traversal(node, p, q) {
    if (!node) return null;
    if (node.val === p || node.val === q) return node;

    if (max < node.val) {
      const left = traversal(node.left, p, q);
      if (left) return left;
    } else if (min > node.val) {
      const right = traversal(node.right, p, q);
      if (right) return right;
    } else {
      return node;
    }
  }

  return traversal(root, p, q);
};

const arr = [5, 3, 6, 2, 4, null, null, 1],
  p = 1,
  q = 4;
const root = arrToTree(arr);
console.log(lowestCommonAncestor(root, p, q));

const { TreeNode, arrToTree } = require("./common");

var mergeTrees = function (root1, root2) {
  function merge(node1, node2) {
    if (!node1 && !node2) return null;
    if (!node1) node1 = new TreeNode(0);
    if (!node2) node2 = new TreeNode(0);

    const node = new TreeNode(node1.val + node2.val);

    node.left = merge(node1.left, node2.left);
    node.right = merge(node1.right, node2.right);

    return node;
  }

  return merge(root1, root2);
};

const root1 = arrToTree([1, 3, 2, 5]),
  root2 = arrToTree([2, 1, 3, null, 4, null, 7]);

const result = mergeTrees(root1, root2);
console.log(result);

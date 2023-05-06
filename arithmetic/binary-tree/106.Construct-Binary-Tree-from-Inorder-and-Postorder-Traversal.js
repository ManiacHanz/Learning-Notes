const { TreeNode } = require("./common");

var buildTree = function (inorder, postorder) {
  function traverse(inorder, postorder) {
    // leaf nodes
    if (!inorder.length) return null;
    const item = postorder[postorder.length - 1];
    const node = new TreeNode(item);

    // don't need to traverse anymore when there is only one node
    if (inorder.length > 1) {
      const idx = inorder.findIndex((i) => i === item);
      const leftInorder = inorder.slice(0, idx);
      const rightInorder = inorder.slice(idx + 1, inorder.length);

      const leftPostorder = postorder.slice(0, idx);
      const rightPostorder = postorder.slice(idx, rightInorder.length + idx);

      console.log(leftInorder, rightInorder, leftPostorder, rightPostorder);

      node.left = traverse(leftInorder, leftPostorder);
      node.right = traverse(rightInorder, rightPostorder);
    }

    return node;
  }

  return traverse(inorder, postorder);
};

const inorder = [9, 3, 15, 20, 7],
  postorder = [9, 15, 7, 20, 3];

const result = buildTree(inorder, postorder);
// const result = buildTree([2, 1], [2, 1]);
console.log(result);

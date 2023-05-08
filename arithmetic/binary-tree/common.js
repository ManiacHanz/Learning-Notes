function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

//[1,2,3,4,null,5,6,null,null,7]
function arrToTree(arr) {
  let map = [];
  let head;
  for (let i = 0; i < arr.length; i++) {
    if (!arr[i]) continue;
    const node = map[i] ? map[i] : new TreeNode(arr[i]);
    if (i === 0) head = node;
    const leftInx = 2 * i + 1;
    if (leftInx < arr.length && arr[leftInx]) {
      const left = new TreeNode(arr[2 * i + 1]);
      map[2 * i + 1] = left;
      node.left = left;
    }
    const rightInx = 2 * i + 2;
    if (rightInx < arr.length && arr[rightInx]) {
      const right = new TreeNode(arr[2 * i + 2]);
      map[2 * i + 2] = right;
      node.right = right;
    }
  }
  return head;
}

function inorderTreeToArray(root) {
  if (!root) return [];
  const array = [];

  function traversal(node) {
    if (!node) return;

    traversal(node.left);
    array.push(node.val);
    traversal(node.right);
  }

  traversal(root);
  return array;
}

module.exports = {
  TreeNode,
  arrToTree,
  inorderTreeToArray,
};

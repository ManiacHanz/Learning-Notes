const { arrToTree } = require("./common");

var findBottomLeftValue = function (root) {
  const queue = [];
  let leftmost = 0;
  let len = 0;
  if (!root) return leftmost;
  queue.push(root);
  while (queue.length) {
    len = queue.length;
    for (let i = 0; i < len; i++) {
      const node = queue.shift();
      if (i === 0) {
        leftmost = node.val;
      }
      node.left && queue.push(node.left);
      node.right && queue.push(node.right);
    }
  }
  return leftmost;
};

var arr = [1, 2, 3, 4, null, 5, 6, null, null, null, null, 7];
const root = arrToTree(arr);
// console.log(root);
console.log(findBottomLeftValue(root));

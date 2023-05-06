const { arrToTree } = require("./common");

var arr = [3, 9, 20, null, null, 15, 7];
// console.log(arrToTree(arr))

var maxDepth = (root) => {
  let level = 0;
  let queue = [];
  if (!root) return 0;
  queue.push(root);
  while (queue.length) {
    let size = queue.length;

    while (size) {
      const node = queue.shift();
      size--;
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    level++;
  }
  return level;
};

// console.log(maxDepth(arrToTree(arr)));

var maxDepth2 = (root) => {
  let level = (maxLevel = 0);
  function dfs(node) {
    if (!node) return;
    level++;
    maxLevel = Math.max(level, maxLevel);
    dfs(node.left);
    dfs(node.right);
    level--;
  }
  dfs(root);
  return maxLevel;
};
// console.log(maxDepth2(arrToTree(arr)));

var minDepth = (root) => {
  let level = (minLevel = 0);
  function dfs(node) {
    if (!node) return;
    level++;
    if (!node.left && !node.right) {
      console.log(76, node, level);
      minLevel = minLevel === 0 ? level : Math.min(level, minLevel);
    }
    dfs(node.left);
    dfs(node.right);
    level--;
  }
  dfs(root);
  return minLevel;
};

// console.log(minDepth(arrToTree(arr)));

var isBalanced = function (root) {
  function getHeight(node) {
    if (!node) return 0;
    // 求高度 后序遍历，左右中
    const leftHeight = getHeight(node.left);
    const rightHeight = getHeight(node.right);
    if (leftHeight === -1) return -1;
    if (rightHeight === -1) return -1;
    if (Math.abs(leftHeight - rightHeight) > 1) return -1;
    return Math.max(leftHeight, rightHeight) + 1;
  }
  return getHeight(root) >= 0;
};

// console.log(isBalanced(arrToTree(arr)));

var binaryTreePaths = function (root) {
  let result = [];
  let temp = [];
  function dfs(node, temp) {
    if (!node) return;
    temp.push(node.val);
    if (!node.left && !node.right) {
      result.push(temp.join("->"));
    } else {
      dfs(node.left, temp);
      dfs(node.right, temp);
    }
    temp.pop();
  }
  dfs(root, temp);
  return result;
};

var arr = [1, 2, 3, null, 5];
// console.log(binaryTreePaths(arrToTree(arr)))

var sumOfLeftLeaves = function (root) {
  const arr = [];
  const temp = [root.val];
  function getPath(node) {
    if (!node.left && !node.right) {
      arr.push([...temp]);
    }
    if (node.left) {
      temp.push(node.left.val);
      getPath(node.left);
    }
    if (node.right) {
      temp.push(undefined);
      getPath(node.right);
    }
    temp.pop();
  }
  getPath(root);
  const filtes = arr.filter((item) => item[item.length - 1]);
  const sum = filtes.reduce((sum, curr) => sum + curr[curr.length - 1], 0);
  return sum;
};

var arr = [3, 4, 5, -7, -6, null, null, -7, null, -5, null, null, null, -4];
console.log(sumOfLeftLeaves(arrToTree(arr)));

const { arrToTree } = require("./common");

// 删除，难点在于删除后需要调整二叉搜索树的结构
// 仍然是采用递归，然后向上返回合法节点的思路。注意：此题（及解法）没有考虑树的高度需要一致
// 难点：需要梳理删除节点的不同情况
// 1. 没有找到需要删除的节点。node.val !== key
// 2. 节点为叶子节点  !node.left && !node.right. 直接删除即可
// 3. 节点单边没有  !node.left || !node.right. 此时删除后把有的那一边直接连接上来即可，类似于链表删除节点
// 4. 节点两边都有后代 node.left && node.right
//    此时需要把这种情况转成第三种情况
//    核心思想是，node右边子树的最左节点一定是和node本身差距最小的子节点，同理node左边子树的最右节点一定是node本身差距最小的子节点
//    所以可以以右边为根（左边同理），找到右边子树的最左节点，然后把整颗左子树移到这个节点的左边后代上
var deleteNode = function (root, key) {
  function _deleteNode(node, key) {
    if (!node) return null;

    if (node.val === key) {
      if (!node.left && !node.right) return null;
      else if (node.left && !node.right) return node.left;
      else if (node.right && !node.left) return node.right;
      else {
        // 第四种情况
        let current = node.right;
        while (current.left) {
          current = current.left;
        }
        current.left = node.left;
        node.left = null;
        return node.right;
      }
    }

    if (node.val < key) {
      node.right = _deleteNode(node.right, key);
      return node;
    } else if (node.val > key) {
      node.left = _deleteNode(node.left, key);
      return node;
    }
  }

  return _deleteNode(root, key);
};

const arr = [5, 3, 6, 2, 4, null, 7],
  key = 3;
const root = arrToTree(arr);
const result = deleteNode(root, key);
console.log(result);

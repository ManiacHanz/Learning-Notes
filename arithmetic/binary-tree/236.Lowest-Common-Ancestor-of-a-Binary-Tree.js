const { arrToTree } = require("./common");

// p/q in leecode is the node itself, not its value
var lowestCommonAncestor = function (root, p, q) {
  const pPath = [],
    qPath = [];
  let pFinded = (qFinded = false);

  function traversal(node, p, q) {
    if (!node) return;

    !pFinded && pPath.push(node);
    !qFinded && qPath.push(node);
    if (node.val === p) pFinded = true;
    if (node.val === q) qFinded = true;

    if (!pFinded || !qFinded) {
      traversal(node.left, p, q);
      traversal(node.right, p, q);
    }

    !pFinded && pPath.pop();
    !qFinded && qPath.pop();
  }

  traversal(root, p, q);

  function findSameNode(path1, path2) {
    const valArray2 = path2.map((item) => item.val);
    return path1.reverse().find((item) => valArray2.includes(item.val)); // could use `findLast` here if no compatibility considered
  }

  return findSameNode(pPath, qPath);
};

const arr = [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4],
  p = 5,
  q = 4;
const root = arrToTree(arr);
console.log(lowestCommonAncestor(root, p, q));

const { arrToTree } = require("./common");

// 暴力解法
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

// 递归-回溯的思想处理公共节点
// 也可以说是后序的顺序，也就是先处理子节点，后处理当前节点的顺序
function lowestCommonAncestor2(root, p, q) {
  function traversal(node, p, q) {
    if (!node) return null;
    // 注意这里是前序，也就是找到了这个对应的唯一值，就把这个节点本身返回，不需要再往下了
    // 这里如果说其中一个属于另一个的后代节点，那正好这个节点返回正确
    // 如果另一个节点在另一个分支上，则由下面的回溯过程，在真正的公共父节点中交汇
    if (node.val === p || node.val === q) return node;

    const left = traversal(node.left, p, q);
    const right = traversal(node.right, p, q);

    // 1. 如果左右两个分支都返回了非空节点，那说明当前节点一定是最近的公共父节点
    if (left !== null && right !== null) return node;
    // 2. 如果左右只有一边非空，那说明又一边至少（有可能是是两个节点直属关系）有一个节点，返回非空那边
    else if (left === null && right !== null) return right;
    else if (left !== null && right === null) return left;
    // 3. 两边都没有，返回空
    else return null;
  }

  return traversal(root, p, q);
}

console.log(lowestCommonAncestor2(root, p, q));

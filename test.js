/*
 实现一个flatten方法，要求
输入[[1,2,2], [3,4,'5',5],[6,7,8,9,[11,12,[12,13,14]]],10]
输出[1,2,2, 3,4,'5',5,6,7,8,9,11,12,12,13,14,10]
*/

function flatten(input) {
  const array = input.reduce((pre, curr) => {
    if (Object.prototype.toString.call(curr) === "[object Array]") {
      curr = flatten(curr);
    }
    return pre.concat(curr);
  }, []);
  return array;
}

const input = [
  [1, 2, 2],
  [3, 4, "5", 5],
  [6, 7, 8, 9, [11, 12, [12, 13, 14]]],
  10
];

console.log(flatten(input));



/* 
  实现一个好桉树，判断两个变量的值是否相等
  注意：数据类型不限于示例，尽可能考虑边界

 
*/

const foo1 = {
  a: 1,
  b: '1',
  c: NaN,
  d: [{
    a:1,
    b:2
  }],
  f: {
    a:1
  }
}


const foo2 = {
  a: 1,
  b: '1',
  c: NaN,
  d: [{
    a:1,
  }],
  f: {
    a:1
  }
}

function isEqual(target1, target2) {}

console.log(isEqual(target1, target2))
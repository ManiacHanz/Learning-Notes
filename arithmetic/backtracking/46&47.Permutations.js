var permute = function (nums) {
  const result = [];
  const temp = [];

  const backtracking = (arr) => {
    if (temp.length === nums.length) {
      result.push([...temp]);
      return;
    }

    for (let i = 0; i < arr.length; i++) {
      const clone = [...arr];
      const value = clone.splice(i, 1);
      temp.push(value[0]);
      backtracking(clone);
      temp.pop();
    }
  };

  backtracking(nums);
  return result;
};

// const nums = [1, 2, 3];

// console.log(permute(nums));

var permute2 = function (nums) {
  const result = [];
  const temp = [];

  const backtracking = (arr) => {
    if (temp.length === nums.length) {
      result.push([...temp]);
      return;
    }

    // 进入当前树层，但还没有开始循环是实例化一个set
    // 这样在循环当前层的时候，都使用的同样一个set
    const used = new Set();
    for (let i = 0; i < arr.length; i++) {
      /**
       * 如果是在这里实例化set
       * 代表的是循环每个元素的时候都实例化了一个set
       * 那同层的情况下就无法判断时候使用过相同的重复元素了
       */

      const clone = [...arr];
      const value = clone.splice(i, 1);
      if (used.has(value[0])) {
        continue;
      }

      temp.push(value[0]);
      used.add(value[0]);
      backtracking(clone);
      temp.pop();
    }
  };

  backtracking(nums);
  return result;
};

nums = [1, 1, 2, 2];

console.log(permute2(nums));

var partition = function (s) {
  const result = [];
  const temp = [];

  const isPalindrome = (s) => {
    if (!temp) return false;
    let start = 0;
    end = s.length - 1;
    for (; start < end; start++, end--) {
      if (s[start] !== s[end]) {
        return false;
      }
    }
    return true;
  };

  const backtracking = (str, startIdx) => {
    if (startIdx > str.length) {
      // if (temp.every(isPalindrome)) {
      result.push([...temp]);
      // }
      return;
    }

    for (let i = startIdx; i <= str.length; i++) {
      const newStr = str.slice(0, i);
      // 剪枝
      if (!isPalindrome(newStr)) {
        continue;
      }
      const left = str.slice(i);
      temp.push(newStr);
      backtracking(left, 1);
      temp.pop();
    }
  };

  backtracking(s, 1);

  return result;
};

const s = "aadddddfsgdsfdsfdsfccccbb";

console.time("timer");
console.log(partition(s));
console.timeEnd("timer");

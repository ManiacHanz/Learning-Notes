// 0 <= digits.length <= 4
// digits[i] is a digit in the range ['2', '9']
var letterCombinations = function (digits) {
  if (!digits.length) return [];
  const digitsToLettersMap = {
    2: ["a", "b", "c"],
    3: ["d", "e", "f"],
    4: ["g", "h", "i"],
    5: ["j", "k", "l"],
    6: ["m", "n", "o"],
    7: ["p", "q", "r", "s"],
    8: ["t", "u", "v"],
    9: ["w", "x", "y", "z"],
  };

  const digitsArray = digits.split("");
  const len = digitsArray.length;
  const result = [];
  const temp = [];
  function backtracking(level) {
    if (temp.length === len) {
      result.push(temp.join(""));
      return;
    }

    const letters = digitsToLettersMap[digitsArray[level]];
    for (let i = 0; i < letters.length; i++) {
      const element = letters[i];
      temp.push(element);
      backtracking(level + 1);
      temp.pop();
    }
  }
  backtracking(0);
  return result;
};

const digits = "234";
console.log(letterCombinations(digits));

const digits2 = "";
console.log(letterCombinations(digits2));

const digits3 = "2";
console.log(letterCombinations(digits3));

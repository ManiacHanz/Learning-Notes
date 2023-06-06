var restoreIpAddresses = function (s) {
  if (s.length < 4) return [];
  if (s.length === 4) return [s.split("").join(".")];

  const result = [];
  const temp = [];
  let sliced = 0;

  const isValidAddress = (string) => {
    if ((string.startsWith("0") && string.length > 1) || Number(string) > 255) {
      return false;
    }
    return true;
  };

  const backtracking = (str, startIdx) => {
    if (sliced === 4) {
      if (!str.length) {
        result.push([...temp]);
      }
      return;
    }
    for (let i = startIdx; i <= str.length; i++) {
      const slicedString = str.slice(0, i);
      const leftString = str.slice(i);
      if (!isValidAddress(slicedString)) {
        continue;
      }
      temp.push(slicedString);
      sliced++;
      backtracking(leftString, 1);
      temp.pop();
      sliced--;
    }
  };

  backtracking(s, 1);
  return result.map((item) => item.join("."));
};

const s = "25525511135";
console.log(restoreIpAddresses(s));

var partitionLabels = function (s) {
  // 记录数字的下标
  // 格式为 {a:0,b:1}
  let map = {};
  // 记录当前应该使用的数字, 从0开始，使用的时候先用后++
  let current = 0;
  // 记录归并的值
  let array = [];

  for (let i = 0; i < s.length; i++) {
    const letter = s[i];
    if (map[letter] === undefined) {
      map[letter] = current;
      array[i] = [letter, current];
      current++;
    } else {
      array[i] = [letter, map[letter]];
      current = map[letter] + 1;
      // 这里要从i-1开始，而不是从i开始，否则i指向自己，直接break掉
      for (let j = i - 1; j > 0; j--) {
        if (array[j][1] <= current - 1) {
          break;
        }
        array[j] = [array[j][0], current - 1];
        map[array[j][0]] = current - 1;
      }
    }
  }

  map = {};
  array.forEach((item) => {
    const [letter, num] = item;
    map[num] = map[num] ? map[num] + 1 : 1;
  });

  return Object.values(map);
};

var s = "ababcbacadefegdehijhklij";
console.log(partitionLabels(s));

var s = "eccbbbbdec";
console.log(partitionLabels(s));

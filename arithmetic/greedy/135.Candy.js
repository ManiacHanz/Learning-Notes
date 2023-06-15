var candy = function (ratings) {
  const result = Array.from({ length: ratings.length }, () => 1);

  for (let i = 1; i < ratings.length; i++) {
    if (ratings[i] > ratings[i - 1]) {
      result[i] = result[i - 1] + 1;
    } else if (ratings[i] < ratings[i - 1]) {
      // 需要顾及前面的结果
      for (let j = i; j > 0; j--) {
        if (result[j - 1] <= result[j] && ratings[j - 1] > ratings[j]) {
          result[j - 1] = result[j] + 1;
        } else {
          break;
        }
      }
    }
  }

  return result.reduce((acc, cur) => acc + cur);
};

var candy2 = function (ratings) {
  const result = Array.from({ length: ratings.length }, () => 1);

  // 从左往右
  for (let i = 1; i < ratings.length; i++) {
    if (ratings[i] > ratings[i - 1]) {
      result[i] = result[i - 1] + 1;
    }
  }

  // 从右往左
  for (let i = ratings.length - 1; i > 0; i--) {
    if (ratings[i] < ratings[i - 1]) {
      // 第二次遍历需要顾及到第一次的结果。有可能之前是3，这次是1，所以需要取较大值处理
      result[i - 1] = Math.max(result[i - 1], result[i] + 1);
    }
  }

  return result.reduce((acc, cur) => acc + cur);
};

var ratings = [1, 0, 2];
console.log(candy(ratings));
console.log(candy2(ratings));

var ratings = [1, 2, 2];
console.log(candy(ratings));
console.log(candy2(ratings));

var ratings = [1, 0, 2, 1, 3, 2];
console.log(candy(ratings));
console.log(candy2(ratings));

var ratings = [1, 0, 3, 1, 3, 2];
console.log(candy(ratings));
console.log(candy2(ratings));

var ratings = [1, 3, 2, 2, 1];
console.log(candy(ratings)); //7
console.log(candy2(ratings));

var ratings = [1, 4, 3, 2, 1];
console.log(candy(ratings)); // 11
console.log(candy2(ratings));

var ratings = [1, 2, 87, 87, 87, 2, 1];
console.log(candy(ratings)); // 13
console.log(candy2(ratings)); // 13

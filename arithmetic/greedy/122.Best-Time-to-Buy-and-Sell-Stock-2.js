/**
 * 1 <= prices.length <= 3 * 104
  0 <= prices[i] <= 104
 */

var maxProfit = function (prices) {
  if (prices.length === 1) return 0;

  const profit = prices.map((item, index) => {
    return prices[index + 1] - item;
  });

  return profit.reduce((acc, item) => {
    return item > 0 ? acc + item : acc;
  }, 0);
};

prices = [7, 1, 5, 3, 6, 4];
console.log(maxProfit(prices));

prices = [1, 2, 3, 4, 5];
console.log(maxProfit(prices));

prices = [7, 6, 4, 3, 1];
console.log(maxProfit(prices));

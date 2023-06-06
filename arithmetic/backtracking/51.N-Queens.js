var solveNQueens = function (n) {
  const result = [];
  const checkboard = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => ".")
  );

  const isValid = (col, row, checkboard) => {
    // 此验证只往上验证，因为是每次放入时做的验证
    // 不用做水平方向的验证，因为一行只能放一个

    // 垂直向上的验证, 注意0也要加入区间进行验证
    for (let i = row - 1; i >= 0; i--) {
      if (checkboard[i][col] == "Q") {
        return false;
      }
    }

    // 往左斜向上45°的验证
    // i代表列（y坐标），j代表行（x坐标）
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
      if (checkboard[i][j] == "Q") {
        return false;
      }
    }

    // 往右斜向上135°的验证
    for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
      if (checkboard[i][j] == "Q") {
        return false;
      }
    }

    return true;
  };

  const backtracking = (row) => {
    if (row >= n) {
      result.push(checkboard.map((item) => item.join("")));
      return;
    }
    for (let i = 0; i < n; i++) {
      if (!isValid(i, row, checkboard)) {
        continue;
      }
      checkboard[row][i] = "Q";
      backtracking(row + 1);
      checkboard[row][i] = ".";
    }
  };

  backtracking(0);
  return result;
};

const n = 4;
console.log(solveNQueens(n));

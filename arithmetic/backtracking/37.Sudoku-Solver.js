/**
 * 
 * board.length == 9
  board[i].length == 9
  board[i][j] is a digit or '.'.
  It is guaranteed that the input board has only one solution.

  来源：力扣（LeetCode）
  链接：https://leetcode.cn/problems/sudoku-solver
  著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
 */
var solveSudoku = function (board) {
  const isValid = (row, col, value, board) => {
    // 竖向上的判断
    // 这里不能只判断前面的，因为数独有些已经设定好的数字也要被判断
    for (let y = 0; y < board.length; y++) {
      if (board[y][col] === value) {
        return false;
      }
    }

    // 横向上的判断
    for (let x = 0; x < board[0].length; x++) {
      if (board[row][x] === value) {
        return false;
      }
    }

    // 这个规则是 九宫格里不能有重复
    // 分别是 1-3行 1-3列代表一个九宫格  4-6行 1-3列代表第二个九宫格
    let startRow = Math.floor(row / 3) * 3;
    let startCol = Math.floor(col / 3) * 3;

    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (board[i][j] === value) {
          return false;
        }
      }
    }

    return true;
  };

  const backtracking = () => {
    // 纵向的遍历， 在外面因为是先横向的填满
    for (let i = 0; i < board.length; i++) {
      // 横向的遍历, 相当于先横向一行一行的填满
      for (let j = 0; j < board[0].length; j++) {
        // 这个格子必须是.才尝试填入数字
        if (board[i][j] === ".") {
          // 在每一个格子去尝试1-9， 这个过程用递归实现
          for (let value = 1; value <= 9; value++) {
            // 这个格子必须是.才填，
            // 如果不满足这个条件，则尝试下一个数字
            if (!isValid(i, j, value + "", board)) {
              continue;
            }
            // 填入数字
            board[i][j] = value + "";
            // 递归
            const result = backtracking();
            // 这里是终止条件
            // 在填满棋盘以后的最后一个递归返回的值为false, 我们就没有必要去回溯之前填的结果
            // 只需要把board返回到外面就可以了
            if (result) {
              return true;
            }
            // 回溯
            // 当前数字失败，回溯填入的数字，方便下个循环尝试另外一个数字
            board[i][j] = ".";
          }
          // 9个数字都尝试完没有进入下一层递归才会走到这里，
          // 说明9个数字都不合法，说明前面的填入有问题，返回false，进入回溯
          return false;
        }
      }
    }
    // 纵向和横向的循环都走完了。才会走到这里
    // 说明每个格子都填满了数字并且符合要求
    // 返回true让递归逻辑直接返回结果
    return true;
  };

  backtracking();
  return board;
};

const board = [
  ["5", "3", ".", ".", "7", ".", ".", ".", "."],
  ["6", ".", ".", "1", "9", "5", ".", ".", "."],
  [".", "9", "8", ".", ".", ".", ".", "6", "."],
  ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
  ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
  ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
  [".", "6", ".", ".", ".", ".", "2", "8", "."],
  [".", ".", ".", "4", "1", "9", ".", ".", "5"],
  [".", ".", ".", ".", "8", ".", ".", "7", "9"],
];

console.log(solveSudoku(board));

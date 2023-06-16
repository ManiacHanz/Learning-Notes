var lemonadeChange = function (bills) {
  // 20不需要了因为不需要找零
  let five = 0,
    ten = 0;
  let result = true;

  function getReturned(value) {
    if (value === 5) return true;

    let returned = value - 5;

    while (returned) {
      if (returned >= 10 && ten > 0) {
        returned -= 10;
        ten--;
      } else if (five > 0) {
        returned -= 5;
        five--;
      } else {
        return false;
      }
    }

    return true;
  }

  function addChange(value) {
    switch (value) {
      case 5:
        five++;
        return;
      case 10:
        ten++;
        return;
      default:
        return;
    }
  }

  for (let i = 0; i < bills.length; i++) {
    const value = bills[i];
    addChange(value);
    result = getReturned(value);
    if (!result) return false;
  }

  return result;
};

var bills = [5, 5, 5, 10, 20];
console.log(lemonadeChange(bills));

var bills = [5, 5, 10, 10, 20];
console.log(lemonadeChange(bills));

var bills = [5, 5, 10];
console.log(lemonadeChange(bills));

var bills = [10, 10];
console.log(lemonadeChange(bills));

var bills = [5, 5, 10, 10, 20];
console.log(lemonadeChange(bills));

var bills = [
  5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10,
  5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20,
  5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10,
  5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20,
  5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10,
  5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20,
  5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10,
  5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20,
  5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10,
  5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20,
  5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10,
  5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20,
  5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10,
  5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20,
  5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10,
  5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20,
  5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10,
  5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20, 5, 10, 5, 20,
  5, 10, 5, 20,
];
console.log(lemonadeChange(bills));

var reconstructQueue = function (people) {
  const sortedPeopleByHeight = people.sort((a, b) => {
    if (b[0] - a[0] !== 0) return b[0] - a[0];
    return a[1] - b[1];
  });

  for (let i = 0; i < sortedPeopleByHeight.length; i++) {
    const [height, order] = sortedPeopleByHeight[i];
    if (order < i) {
      const item = sortedPeopleByHeight.splice(i, 1);
      sortedPeopleByHeight.splice(order, 0, ...item);
    }
  }

  return sortedPeopleByHeight;
};

var people = [
  [9, 0],
  [7, 0],
  [1, 9],
  [3, 0],
  [2, 7],
  [5, 3],
  [6, 0],
  [3, 4],
  [6, 2],
  [5, 2],
];
console.log(reconstructQueue(people));

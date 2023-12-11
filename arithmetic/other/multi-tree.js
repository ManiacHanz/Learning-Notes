// 过滤隐藏的项
// 子项全为false的时候父项也需要隐藏
function filterTree(tree) {
  const DUMMY = { children: [...tree] };

  DUMMY.children = deepFilter([...tree]);
  function deepFilter(line) {
    const arr = [];
    for (let i = 0; i < line.length; i++) {
      const item = line[i];
      if (!item.show) continue;
      if (!item?.children?.length) {
        arr.push({ ...item });
        continue;
      }
      if (item?.children?.length > 0) {
        const filtered = deepFilter(item?.children);
        if (!filtered?.length) continue;
        item.children = filtered;
        item.show = filtered.length > 0;

        arr.push({ ...item });
      }
    }
    return arr;
  }

  return DUMMY.children;
}

const tree = [
  {
    name: "level-1",
    show: true,
    children: [
      {
        name: "level-2-a",
        show: true,
        children: [
          {
            name: "level-3-a-1",
            show: false,
          },
          {
            name: "level-3-a-2",
            show: true,
          },
        ],
      },
      {
        name: "level-2-b",
        show: false,
        children: [
          {
            name: "level-3-b-1",
            show: false,
          },
          {
            name: "level-3-b-2",
            show: true,
          },
        ],
      },
      {
        name: "level-2-c",
        show: true,
        children: [
          {
            name: "level-3-c-1",
            show: false,
          },
          {
            name: "level-3-c-2",
            show: false,
          },
        ],
      },
    ],
  },
];

console.table(filterTree(tree));

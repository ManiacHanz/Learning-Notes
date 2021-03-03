function swap(target, min, arr) {
  if(target === min) return

  let temp = arr[target]
  arr[target] = arr[min]
  arr[min] = temp
}

module.exports = {
  swap
}
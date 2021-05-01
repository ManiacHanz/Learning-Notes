var permute = function(nums) {
  if(nums.length === 0) return []

  // 用来记录答案
  var res = []
  var temp = []
  var used = []
  dfs(nums, res, temp, used)

  function dfs(nums, res, temp) {
    // 最终目的，得到一个和Nums一样长度的数组，就是它的一种排列
    if(temp.length === nums.length) {
      res.push([...temp])
      return
    }

    // 遍历nums里面去取节点
    for(var i =0; i < nums.length; i++) {
      // 如果有重复判断，就跳过主逻辑
      if(used[i]) continue
      used[i] = true
      // 直接的逻辑，但是不用used会包括重复结构
      temp.push(nums[i])
      dfs(nums, res, temp)
      temp.pop()

      used[i] = false
    }
    return 
  }

  return res
};

console.log(permute([1,2,3]))

// [ [1,2,3], [1,3,2] ....  ]
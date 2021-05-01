// let list = [
//   { id: 1, name: '部门 A', parentId: 0 },
//   { id: 2, name: '部门 B', parentId: 0 },
//   { id: 3, name: '部门 C', parentId: 1 },
//   { id: 4, name: '部门 D', parentId: 1 },
//   { id: 5, name: '部门 E', parentId: 2 },
//   { id: 6, name: '部门 F', parentId: 3 },
//   { id: 7, name: '部门 G', parentId: 2 },
//   { id: 8, name: '部门 H', parentId: 4 },
// ]

// const convert = list => {
//   const result = list.reduce((pre, curr) => {
//     if(pre[curr.parentId]) {
//       pre[curr.parentId].children 
//         ? pre[curr.parentId].children.push(curr)
//         : pre[curr.parentId].children = [curr]
//     }
//     pre[curr.id] = curr
    
//     return pre
//   }, {})
//   const res = Object.values(result).filter(item => item.parentId === 0)
//   return res
// }

// console.log(convert(list))


// function curry(fn){
//   var args = []
//   var context = this
//   return function inner(...numbers) {
//     if(numbers.length === 0) {
//       return fn.apply(context, [100,100,100])   
//     }
//     args.push(...numbers)
//     return inner
//   }
// }


// function cost(...price) {
//   const sum = price.reduce((pre, curr) => pre + curr)
//   return sum
// }

// const c = curry(cost)
// c(100)
// c(100)
// c(100)
// console.log(c())



const sum = (a,b,c,d) => a+b+c+d

const curry = fn => {
  return function curried(...args) {
    if(args.length < fn.length) {
      return function (...innerArgs) {
        return curried(...args.concat(innerArgs))
      }
    }
    return fn.apply(this, args)
  }
}

console.log(curry(sum)(1)(2,3,4))
console.log(curry(sum)(1)(2)(3,4))

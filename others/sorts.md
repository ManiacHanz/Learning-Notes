

# 几种常见排序算法

先给一个数组交换位置的通用方法

```js
/**
 @param arr 数组本身
 @param a 前一个数的下标
 @param b 后一个数的下标
*/
function swap (arr, a, b){
    var temp = arr[b]
    arr[b] = arr[a]
    arr[a] = temp
}

```

### 冒泡排序

- 思想：在遍历过程中交换位置，交换这个和下一个，也就是说在一次遍历中会把一个位置的元素一直遍历到符合位置的地方
- 特点：效率低

```js
let arr = [3,9,5,4,10]

// 5个长度的数组 ，只需要有4个位置判断，所以次数总是length-1
// 在这里面 i 都是确定数组的遍历次数，而j才是具体元素的下标

// 这个是挨着交换 同一个元素一直交换到最右边 
// 记忆下面两种 这种应该是更正规的
function bubble2(arr){
    for(let i = 0, len = arr.length; i< len-1;i++){
        for(let j = i; j<arr.length; j++){
            if(arr[j] > arr[j+1]) swap(arr, j, j+1)
        }
    }
    return arr
}

function bubble3(arr){
    for(let i = arr.length - 1; i > 0; i--){
        for(let j = 0; j < arr.length; j++){
            if(arr[j] > arr[j + 1]) swap(arr, j, j + 1)
        }
    }
    return arr
}

```


### 插入排序

- 思想： 相对于冒泡来记。冒泡是把起点位置的元素在一次循环过后移动到应该在的位置；而插入的思想是在一次循环过后把当前起点变成应该成为的元素，而不管其他位置的顺序，也就是说每次都是交换的起点位置的元素，这个元素是相对不固定的。

```js
// 这个方式是 把i位置的确定换成最小的数字，
// 这个插入有很多冗余的循环 多了很多次 不正确
function _insert(arr){
    for(var i = 0, length = arr.length; i < length - 1; i++){
        for(let j = i + 1; j < arr.length ; j++){
            if(arr[i] > arr[j]) swap(arr, i, j)
        }
    }
    return arr
}

```

下面的是正确的插入排序

```js
// 记这个
function insertion(array) {
    for (let i = 1; i < array.length; i++) {
        for (let j = i - 1; j >= 0 && array[j] > array[j + 1]; j--)
        swap(array, j, j + 1);
    }
    return array;
}

// for循环里面的 && 应该是等于下面的continue，才能减少循环
function insertion(array) {
    label:for (let i = 1; i < array.length; i++) {
      for (let j = i - 1; j >= 0 ; j--)
        if( array[j] > array[j + 1]){
            swap(array, j, j + 1);
        } else {
            continue label
        }
    }
    return array;
}
```



### 选择排序

- 思想：选择排序就是在一次遍历过程中，先假设当前值是最小值，记录当前的minIndex。然后在过程中不断和后面的值相比较，一旦有值比这个值小，就把这个minIndex替换掉，最后在一次遍历结束的时候，把起点和最小值交换。这样保证每次起始位置在循环后都是最小值
- 

```js
function selection(arr){
    let minIndex = 0
    for(let i = 0, length = arr.length; i < length; i++){
        minIndex = i
        for(let j = i + 1; j < arr.length; j++){
            if( arr[minIndex] > arr[j]){
                minIndex = j
            }
        }
        if(minIndex !== i) {
            swap(arr, i, minIndex)
        }
    }
    return arr
}
```
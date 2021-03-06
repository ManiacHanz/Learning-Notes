/**
 * 求一个数组中的逆序对的数量
 * 使用归并排序的时候，在二分合并时，因为左右两边都是有序数组
 * 所以此时使用两个指针来比较
 * left[i] < right[j]的大小
 * 如果右边的比左边的小
 * 那边右边的和左边的所有数字比都更小，
 * 此时逆序对的数量就是左边这个下标到左边终点的下标
 * 
 */

 

/**
 * 求一个数组中第n大的数
 * 使用快排思想 复杂度降低到O(n)级别
 * 即在快排partition过程后，比较p值和n的大小
 * 之后只需要在某一边进行递归的快排，直到p值=n值
 * 此时p值就是第n大的数
 */
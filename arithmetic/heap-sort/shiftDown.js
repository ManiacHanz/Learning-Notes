/**
 * 从堆中取出元素
 * 从堆中取出元素只能取出根节点的元素
 * 然后此时用最后一个元素去站住根节点元素的位置，形成一个完整的堆
 * 
 * 之后就是排序的过程
 * 找到新的根节点的这个元素的两个子节点，比较大小
 * 和较大的元素交换位置
 * 然后递归这个操作
 * 
 */
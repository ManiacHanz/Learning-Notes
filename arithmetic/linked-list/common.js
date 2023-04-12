 class ListNode {
  val;
  next; 
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

 function generateLinkedList(arr) {
  let head = prev = null
  arr.forEach((val, index) => {
    const node = new ListNode(val);
    if(index === 0) {
      head = node
      prev = node
    }else {
      prev.next = node
      prev = node
    }
  })
  return head
}

 function logLinkedList(node){
  const arr = [];
  while(node){
    arr.push(node.val);
    node = node.next;
  }
  console.log(arr);
  return arr;
} 

module.exports = {
  ListNode,
  generateLinkedList,
  logLinkedList
}
const {ListNode,generateLinkedList,logLinkedList} = require('./common');

const arr = [1,2,6,3,4,5,6];
const val = 6;

const head = generateLinkedList(arr);
logLinkedList(head)

var removeElements = function(head, val) {
  let dummy = new ListNode(0);
  dummy.next = head;
  let current = dummy;
  while(current.next !== null) {
      if(current.next.val === val) {
          current.next = current.next.next
          continue;
      }
      current = current.next
  }
  return dummy.next
};

const newH = removeElements(head, val)
logLinkedList(newH)
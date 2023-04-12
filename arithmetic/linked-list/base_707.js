const {ListNode,generateLinkedList,logLinkedList} = require('./common');

var MyLinkedList = function() {
  this.size = 0;
  this.head = new ListNode(0);
};

/** 
* @param {number} index
* @return {number}
*/
MyLinkedList.prototype.get = function(index) {
  if(index < 0 || index > this.size) {
      return -1
  }

  let current = this.head;
  let count = 0;
  while(count < index) {
      current = current.next;
      count++
  }
  return current
};

/** 
* @param {number} val
* @return {void}
*/
MyLinkedList.prototype.addAtHead = function(val) {
  let node = new ListNode(val);
  node.next = this.head;
  return node
};

/** 
* @param {number} val
* @return {void}
*/
MyLinkedList.prototype.addAtTail = function(val) {
  let node = new ListNode(val);
  let current = this.head;
  while(current.next) {
      current = current.next;
  }
  current.next = node;
  return this.head
};

/** 
* @param {number} index 
* @param {number} val
* @return {void}
*/
MyLinkedList.prototype.addAtIndex = function(index, val) {
  if(index < 0) this.addAtHead(val);
  let dummy = new ListNode(0)
  dummy.next = this.head;
  let count = 0;
  let current = dummy;
  while(count < index && current) {
      current = current.next;
      count++
  };
  if(count < index) {
      return dummy.next
  }
  const node = new ListNode(val);
  const temp = current.next;
  node.next=temp;
  current.next= node;
  return dummy.next;
};

/** 
* @param {number} index
* @return {void}
*/
MyLinkedList.prototype.deleteAtIndex = function(index) {
  if(index<0 || index>this.size) return this.head;
  let dummy = new ListNode(0);
  dummy.next = this.head;
  let count = 0;
  let current = dummy;
  while(count < index) {
      count ++;
      current = current.next
  }
  current.next = current.next.next
  return dummy.next
};


const link = new MyLinkedList();
link.addAtHead(1);
// link.addAtTail(3)
const head = link.get(0);
logLinkedList(head)

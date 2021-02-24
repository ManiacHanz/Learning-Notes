* isPlainObject
  ```js
  function isPlainObject(obj) {
    if(typeof obj !== 'object' || obj === null) return false
    let proto = Object.getPrototypeOf(obj)
    while(Object.getPrototypeOf(proto)){
      proto = Object.getPrototypeOf(proto)
    }
    return Object.getPrototypeOf(obj) === proto
  }
  ```
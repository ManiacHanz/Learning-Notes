

function quick (start ,end){
  var mid = start , temp = arr[start];
  for(var i = start+1 ; i if(arr[i] arr[mid]=arr[i];// >> mid+1 i-1
    var j = i ;
    mid++;
    while(j!=mid){arr[j]=arr[j-1];j--}
    }
  }
  arr[mid]= temp ;
  return mid;
  }
  
  function sort (start , end ){
  if(end>start){
  var mid = quick(start ,end);console.log(mid)
  sort(start,mid-1);sort(mid+1,end);
  }
  }
  
  sort(0,arr.length)
  console.log(arr);
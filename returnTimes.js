function returnTimes(array){
  var returnArray = [];
  if(array.length < 2){
    console.log("Please put in an array bigger than length 2");
  }

  else{
    for(var i = 0; i < array.length-1; i++){
      returnArray.push(array[i] + " - " + array[i+1]);
    }
  }

  return returnArray;
}
module.exports.returnTimes = returnTimes;

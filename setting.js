var days = require('./days.js');
/*
Number of rows: corresponds to length of timesArray from function
Number of heads: corresponds to length of days array

*/
module.exports =  settings = {
  "times":["12:45","1:15","1:45","2:15","2:45"],
  "days":[days.MONDAY,days.TUESDAY,days.WEDNESDAY,days.THURSDAY,days.FRIDAY],
  "weeksAhead": 4,
};


//prints the times. e.g 12:45 - 1:15, 1:15 - 1:45
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

settings.days.forEach(function(day){
  console.log(day);
});

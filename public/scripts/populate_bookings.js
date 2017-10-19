/* We are trying to look through our bookings, and see if
their day and time correspond to any of the values in the table.
If yes, we will print their name in the corresponding cell.

day and time of the booking object

search through tds
  search through booking objects
    if its header corresponds to the day
      if the first td of its row corresponds to the time
        print the name
*/

//getting the array of response, the bookings array
//FOR THE BELOW TO WORK THE BOOKINGS ARRAY NEEDS TO LOOK LIKE THIS:
/* var bookings = [
  {
    name:'Jeff',
    time: '12:45-1:15',
    day:'Wednesday'
  },
  {
    name:'Carl',
    time: '2:15-2:45',
    day:'Tuesday'
  }
];
*/
$(document).ready(function(){
  //storing weekNumber and year in the bookingsTable thing so we can use it
  //later to make bookings
  $("#bookings-table").data("weekNumber", moment().isoWeek());
  $("#bookings-table").data("year", moment().year());

  //$('<div id = "schedule" class = "text-center">Schedule: June 12 to June 16</div>').insertBefore("#bookings-table");

  $.ajax({
    type:'GET',
    async:false,
    url:'/bookings',
    //success function : receives a response string consisting of an array
    //of booking objects. We will have to convert the JSOn string into
    //valid JSON first
    success:function(response){
      var responseArr = JSON.parse(response);

      //Loop through all the table cells(td)
      $('td').each(function(){
        var dayFromTable = $(this).closest('table').find('th').eq(this.cellIndex).text(); //finds the td's header(day)
        dayFromTable = dayFromTable.replace(/\s+/g, ''); //takes out any spaces

        var timeFromTable = $(this).parent().find("td").first().text(); //finds the td's time(first td of its row)
        timeFromTable = timeFromTable.replace(/\s+/g, ''); //takes out any spaces

        //loop through the bookings array sent as response
        for(var i = 0; i < responseArr.length; i++){
          var dayFromBooking = responseArr[i].day;
          dayFromBooking = dayFromBooking.replace(/\s+/g, '');

          var timeFromBooking = responseArr[i].time;
          timeFromBooking = timeFromBooking.replace(/\s+/g, '');

          var name = responseArr[i].name.split(" ")[0];
          name = name.replace(/\s+/g, '');

          //if day and time of the object match day and time of the cell, print the name in the cell
          if(dayFromTable == dayFromBooking && timeFromBooking == timeFromTable){
            $(this).text(name);
            //$(this).css({'background-color':'#B6282D', 'color':'white'});
            //fills the html with an attribute we can look at later to determine if its booked
            $(this).addClass('booked');
          }
        }
      });
    }
  });

});
